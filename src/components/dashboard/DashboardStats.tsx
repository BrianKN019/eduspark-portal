
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Target, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStatsProps {
  userData: any; // Replace 'any' with a proper type if available
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ userData }) => {
  // Fetch accurate user progress data
  const { data: statsData } = useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        
        // Get course progress
        const { data: courseProgress } = await supabase
          .from('course_progress')
          .select('*')
          .eq('user_id', user.id);
          
        // Get user badges
        const { data: userBadges } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', user.id);
          
        // Calculate stats
        const learningStreak = calculateStreak(courseProgress || []);
        const xpGained = calculateXP(courseProgress || []);
        const goalsCompleted = courseProgress?.filter(p => p.completed)?.length || 0;
        const achievements = userBadges?.length || 0;
        
        return {
          learningStreak,
          xpGained,
          goalsCompleted,
          achievements
        };
      } catch (e) {
        console.error("Exception in stats query:", e);
        return null;
      }
    }
  });

  // Calculate streak from activity
  const calculateStreak = (progress: any[]) => {
    if (!progress.length) return 0;
    
    // Sort by access date
    const sortedDates = progress
      .map(p => new Date(p.last_accessed).toISOString().split('T')[0])
      .sort();
    
    if (!sortedDates.length) return 0;
    
    // Count unique dates as a simple streak
    const uniqueDates = new Set(sortedDates);
    return Math.min(uniqueDates.size, 30); // Cap at 30 days for display purposes
  };

  // Calculate XP from progress
  const calculateXP = (progress: any[]) => {
    return progress.reduce((sum, p) => sum + (p.progress_percentage || 0), 0);
  };

  const stats = statsData || {
    learningStreak: userData?.learningStreak || 0,
    xpGained: userData?.xpGained || 0,
    goalsCompleted: userData?.goalsCompleted || 0,
    achievements: userData?.achievements || 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={<Sparkles className="h-8 w-8 mb-2" />} title="Learning Streak" value={`${stats.learningStreak} days`} />
      <StatCard icon={<Zap className="h-8 w-8 mb-2" />} title="XP Gained" value={`${stats.xpGained} XP`} />
      <StatCard icon={<Target className="h-8 w-8 mb-2" />} title="Goals Completed" value={stats.goalsCompleted} />
      <StatCard icon={<Trophy className="h-8 w-8 mb-2" />} title="Achievements" value={stats.achievements} />
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number }> = ({ icon, title, value }) => (
  <Card className="neumorphic-card bg-gradient-to-br from-blue-400 to-blue-600 text-white">
    <CardContent className="flex flex-col items-center justify-center p-6">
      {icon}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default DashboardStats;
