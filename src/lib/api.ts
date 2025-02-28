import { supabase } from '@/integrations/supabase/client';
import { Badge, Certificate, LeaderboardEntry, UserAchievements } from '@/types/achievements';

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

export const fetchCourses = async () => {
  try {
    console.log("Fetching courses...");
    const { data, error } = await supabase
      .from('courses')
      .select('*');
    
    if (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
    
    console.log("Fetched courses:", data);
    return data || [];
  } catch (e) {
    console.error("Exception in fetchCourses:", e);
    throw e;
  }
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

export const fetchDiscussionTopics = async () => {
  const { data: discussions } = await supabase
    .from('forum_discussions')
    .select(`
      *,
      profiles:user_id(username, avatar_url),
      replies:forum_replies(count)
    `)
    .order('created_at', { ascending: false });

  return discussions || [];
};

export const fetchUpcomingEvents = async () => {
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('start_date', new Date().toISOString())
    .order('start_date');

  return events || [];
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

export const createForumPost = async (title: string, content: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { data, error } = await supabase
    .from('forum_discussions')
    .insert([
      { title, content, user_id: user.id }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const joinEvent = async (eventId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No user found');

  const { error } = await supabase
    .from('event_participants')
    .insert([
      { event_id: eventId, user_id: user.id }
    ]);

  if (error) throw error;
};

export const updateCourseProgress = async (courseId: string, progress: number) => {
  try {
    console.log("Starting updateCourseProgress for course:", courseId);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No authenticated user found");
      throw new Error('No user found');
    }
    
    console.log("User authenticated:", user.id);

    const { data: existingProgress, error: selectError } = await supabase
      .from('course_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle();
    
    if (selectError) {
      console.error("Error checking existing progress:", selectError);
    }
    
    console.log("Existing progress:", existingProgress);

    const progressData = {
      user_id: user.id,
      course_id: courseId,
      progress_percentage: progress,
      completed: progress === 100,
      last_accessed: new Date().toISOString()
    };
    
    console.log("Upserting progress data:", progressData);

    const { data, error } = await supabase
      .from('course_progress')
      .upsert([progressData], {
        onConflict: 'user_id,course_id'
      })
      .select();

    if (error) {
      console.error("Error upserting course progress:", error);
      throw error;
    }
    
    console.log("Successfully updated course progress:", data);

    if (progress === 100) {
      await generateCertificate(courseId);
      await awardCourseBadge(courseId);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in updateCourseProgress:', error);
    throw error;
  }
};

export const generateCertificate = async (courseId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      console.error("Error finding course:", courseError);
      throw new Error('Course not found');
    }

    const { data: existingCert, error: checkError } = await supabase
      .from('certificates')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking for existing certificate:", checkError);
    }
    
    if (!existingCert) {
      console.log("Creating new certificate for course:", course.title);
      const { data, error } = await supabase
        .from('certificates')
        .insert([
          {
            user_id: user.id,
            course_id: courseId,
            name: `${course.title} Certificate`,
            description: `Certificate of completion for ${course.title}`,
            download_url: `/certificates/${courseId}.pdf`, // This would be generated by a backend service
            earned_date: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error("Error generating certificate:", error);
        throw error;
      }
      
      console.log("Certificate created successfully:", data);
      return data;
    } else {
      console.log("Certificate already exists, skipping creation");
      return existingCert;
    }
  } catch (e) {
    console.error("Exception in generateCertificate:", e);
    throw e;
  }
};

export const awardCourseBadge = async (courseId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      console.error("Error finding course:", courseError);
      throw new Error('Course not found');
    }

    const { data: badges, error: badgesError } = await supabase
      .from('badges')
      .select('*')
      .eq('category', 'course')
      .limit(1);
    
    if (badgesError) {
      console.error("Error finding badges:", badgesError);
      return;
    }
    
    if (!badges || badges.length === 0) {
      console.log("No badges found, creating a default badge");
      const { data: newBadge, error: createError } = await supabase
        .from('badges')
        .insert([
          {
            name: 'Course Completion',
            description: 'Awarded for completing a course',
            tier: 'bronze',
            category: 'course',
            image_url: '/badges/course-completion.png'
          }
        ])
        .select();
        
      if (createError || !newBadge || newBadge.length === 0) {
        console.error("Error creating badge:", createError);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_badges')
        .insert([
          {
            user_id: user.id,
            badge_id: newBadge[0].id,
            earned_date: new Date().toISOString()
          }
        ])
        .select();
        
      if (error) {
        console.error("Error awarding badge:", error);
      }
      
      return data;
    }

    const { data, error } = await supabase
      .from('user_badges')
      .insert([
        {
          user_id: user.id,
          badge_id: badges[0].id,
          earned_date: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error("Error awarding badge:", error);
      throw error;
    }
    
    return data;
  } catch (e) {
    console.error("Exception in awardCourseBadge:", e);
    return null;
  }
};

export const fetchCourseById = async (courseId: string) => {
  try {
    console.log("Fetching course details for:", courseId);
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (error) {
      console.error("Error fetching course details:", error);
      throw error;
    }
    
    console.log("Fetched course details:", data);
    return data;
  } catch (e) {
    console.error("Exception in fetchCourseById:", e);
    throw e;
  }
};

export const generateAssessment = async (courseId: string, difficulty: string, subject: string) => {
  try {
    console.log(`Generating ${difficulty} assessment for course ${courseId}`);
    
    // In a production app, this would call an AI service or backend API
    // For now, we're generating mock data
    
    const questionCount = difficulty === 'beginner' ? 5 : difficulty === 'intermediate' ? 8 : 10;
    
    const mockQuestions = [...Array(questionCount)].map((_, index) => ({
      id: index + 1,
      text: `Sample question ${index + 1} about ${subject} (${difficulty} level)`,
      options: [
        `Option A for question ${index + 1}`,
        `Option B for question ${index + 1}`,
        `Option C for question ${index + 1}`,
        `Option D for question ${index + 1}`
      ],
      correctAnswer: Math.floor(Math.random() * 4) // Random correct answer
    }));
    
    const assessment = {
      id: `assessment-${courseId}-${difficulty}`,
      title: `${subject} Assessment`,
      description: `Test your knowledge of ${subject} concepts at the ${difficulty} level.`,
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
      questions: mockQuestions
    };
    
    console.log("Generated assessment:", assessment);
    return assessment;
  } catch (e) {
    console.error("Exception in generateAssessment:", e);
    throw e;
  }
};

supabase
  .channel('public:forum_discussions')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_discussions' }, payload => {
    console.log('Forum discussion change received!', payload);
  })
  .subscribe();

supabase
  .channel('public:events')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, payload => {
    console.log('Event change received!', payload);
  })
  .subscribe();
