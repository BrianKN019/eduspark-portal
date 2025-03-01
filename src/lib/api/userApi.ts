
import { supabase } from '@/integrations/supabase/client';
import { UserAchievements, Badge, Certificate, LeaderboardEntry } from '@/types/achievements';

export const fetchUserData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: courseProgress } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', user.id);

  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('*, badges(*)')
    .eq('user_id', user.id);

  const userRole = user.user_metadata?.role || 'student';

  return {
    name: profile?.full_name || user.email?.split('@')[0] || 'User',
    role: userRole as 'student' | 'instructor' | 'admin',
    learningStreak: calculateStreak(courseProgress || []),
    xpGained: calculateXP(courseProgress || []),
    goalsCompleted: (courseProgress || []).filter(p => p.completed).length,
    achievements: (userBadges || []).length,
  };
};

const calculateStreak = (progress: any[]) => {
  return progress.length > 0 ? Math.min(progress.length, 30) : 0;
};

const calculateXP = (progress: any[]) => {
  return progress.reduce((sum, p) => sum + (p.progress_percentage || 0), 0);
};

export const fetchWeeklyProgress = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { data: progress } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', user.id);

  return Array.from({ length: 7 }, (_, i) => ({
    week: `Week ${i + 1}`,
    progress: progress ? 
      progress.filter(p => isWithinLastWeek(p.last_accessed, i))
        .reduce((sum, p) => sum + (p.progress_percentage || 0), 0) / progress.length : 0
  }));
};

const isWithinLastWeek = (date: string, weekIndex: number) => {
  const now = new Date();
  const then = new Date(date);
  const weekInMs = 7 * 24 * 60 * 60 * 1000;
  return now.getTime() - then.getTime() <= weekInMs * (weekIndex + 1);
};

export const fetchUserAchievements = async (): Promise<UserAchievements> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  console.log("Fetching user achievements for user:", user.id);

  const { data: userBadges, error: badgesError } = await supabase
    .from('user_badges')
    .select('*, badges(*)')
    .eq('user_id', user.id);
    
  if (badgesError) {
    console.error("Error fetching user badges:", badgesError);
  }

  const { data: certificates, error: certError } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', user.id);
    
  if (certError) {
    console.error("Error fetching certificates:", certError);
  }
  
  console.log("Fetched certificates:", certificates);

  const { data: progress } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', user.id);

  const badges: Badge[] = (userBadges || []).map(ub => {
    const tier = ub.badges.tier.toLowerCase();
    const validTier = ['bronze', 'silver', 'gold'].includes(tier) ? tier as 'bronze' | 'silver' | 'gold' : 'bronze';

    const category = ub.badges.category.toLowerCase();
    const validCategory = ['course', 'achievement', 'streak', 'milestone'].includes(category) 
      ? category as 'course' | 'achievement' | 'streak' | 'milestone'
      : 'achievement';

    return {
      id: ub.badges.id,
      name: ub.badges.name,
      description: ub.badges.description || '',
      imageUrl: ub.badges.image_url || '',
      tier: validTier,
      category: validCategory
    };
  });

  const formattedCertificates: Certificate[] = (certificates || []).map(cert => ({
    id: cert.id,
    name: cert.name,
    description: cert.description || '',
    earnedDate: cert.earned_date,
    downloadUrl: cert.download_url || ''
  }));

  return {
    badges,
    certificates: formattedCertificates,
    coursesCompleted: (progress || []).filter(p => p.completed).length,
    streakDays: calculateStreak(progress || []),
    totalPoints: calculateXP(progress || []),
    contributions: 0
  };
};

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const { data: leaderboard } = await supabase
    .from('profiles')
    .select(`
      id,
      username,
      user_badges(count),
      course_progress(progress_percentage)
    `)
    .limit(10);

  return (leaderboard || []).map(user => ({
    userId: user.id,
    username: user.username || 'Anonymous',
    badgeCount: user.user_badges?.[0]?.count || 0,
    points: user.course_progress?.reduce((sum: number, p: any) => sum + (p.progress_percentage || 0), 0) || 0
  }));
};
