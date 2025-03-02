
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Trophy, Share2, Scroll, Star, Zap, Book, Target } from 'lucide-react';
import BadgeList from '@/components/achievements/BadgeList';
import Leaderboard from '@/components/achievements/Leaderboard';
import CertificateList from '@/components/achievements/CertificateList';
import { useQuery } from '@tanstack/react-query';
import { fetchUserAchievements, fetchLeaderboard } from '@/lib/api';
import { Badge, UserAchievements, LeaderboardEntry, Certificate } from '@/types/achievements';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Interface for MilestoneCard props
interface MilestoneCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

const Achievements: React.FC = () => {
  const achievementsQuery = useQuery({
    queryKey: ['userAchievements'],
    queryFn: fetchUserAchievements,
  });
  
  const userAchievements = achievementsQuery.data as UserAchievements | undefined;
  const achievementsLoading = achievementsQuery.isLoading;
  const refetchAchievements = achievementsQuery.refetch;

  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
  });
  
  const leaderboardData = leaderboardQuery.data as LeaderboardEntry[] | undefined;
  const leaderboardLoading = leaderboardQuery.isLoading;

  // Helper functions for type casting
  const getTier = (tier: string): Badge['tier'] => 
    ['bronze', 'silver', 'gold'].includes(tier) ? tier as Badge['tier'] : 'bronze';

  const getCategory = (category: string): Badge['category'] =>
    ['course', 'achievement', 'streak', 'milestone'].includes(category) 
      ? category as Badge['category'] 
      : 'achievement';

  useEffect(() => {
    const checkForNewBadges = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: completedCourses } = await supabase
          .from('course_progress')
          .select('course_id, progress_percentage')
          .eq('user_id', user.id)
          .gte('progress_percentage', 100);
          
        if (!completedCourses || completedCourses.length === 0) return;
        
        for (const course of completedCourses) {
          const { data: existingBadge } = await supabase
            .from('user_badges')
            .select('id')
            .eq('user_id', user.id)
            .eq('source_id', course.course_id)
            .eq('source_type', 'course')
            .single();
            
          if (!existingBadge) {
            const { data: courseData } = await supabase
              .from('courses')
              .select('title, field, level')
              .eq('id', course.course_id)
              .single();
              
            if (courseData) {
              await supabase.from('user_badges').insert({
                user_id: user.id,
                name: `${courseData.title} Completion`,
                description: `Completed the ${courseData.title} course`,
                image_url: `https://api.dicebear.com/6.x/shapes/svg?seed=${courseData.title}`,
                source_type: 'course',
                source_id: course.course_id,
                earned_at: new Date().toISOString(),
                tier: 'gold',
                category: 'course'
              });
              
              await supabase.from('certificates').insert({
                user_id: user.id,
                course_id: course.course_id,
                name: courseData.title,
                description: `Successfully completed ${courseData.title} with a score of 100%`,
                earned_date: new Date().toISOString(),
                download_url: `/certificates/${course.course_id}.pdf`
              });
              
              toast.success(`You've earned a new badge for completing ${courseData.title}!`);
              refetchAchievements();
            }
          }
        }
      } catch (error) {
        console.error('Error checking for new badges:', error);
      }
    };
    
    checkForNewBadges();
  }, [refetchAchievements]);

  if (achievementsLoading || leaderboardLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-16 w-16"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded col-span-2"></div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>;
  }

  const typedBadges: Badge[] = [];
  
  if (userAchievements?.badges) {
    userAchievements.badges.forEach(badgeData => {
      const badge: Badge = {
        id: badgeData.id,
        name: badgeData.name,
        description: badgeData.description,
        imageUrl: badgeData.imageUrl,
        tier: getTier(badgeData.tier),
        category: getCategory(badgeData.category)
      };
      typedBadges.push(badge);
    });
  }

  const typedCertificates: Certificate[] = userAchievements?.certificates || [];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Achievements & Badges</h2>
      <Tabs defaultValue="badges" className="w-full">
        <TabsList className="neumorphic-convex">
          <TabsTrigger value="badges" className="neumorphic-convex">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard" className="neumorphic-convex">Leaderboard</TabsTrigger>
          <TabsTrigger value="certificates" className="neumorphic-convex">Certificates</TabsTrigger>
          <TabsTrigger value="milestones" className="neumorphic-convex">Milestones</TabsTrigger>
        </TabsList>
        <TabsContent value="badges">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-6 w-6" />
                Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BadgeList badges={typedBadges} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="leaderboard">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-6 w-6" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Leaderboard data={leaderboardData || []} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="certificates">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scroll className="mr-2 h-6 w-6" />
                Your Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CertificateList certificates={typedCertificates} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="milestones">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-6 w-6" />
                Learning Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MilestoneCard icon={<Book className="h-8 w-8" />} title="Courses Completed" value={userAchievements?.coursesCompleted || 0} />
                <MilestoneCard icon={<Zap className="h-8 w-8" />} title="Streak Days" value={userAchievements?.streakDays || 0} />
                <MilestoneCard icon={<Star className="h-8 w-8" />} title="Total Points" value={userAchievements?.totalPoints || 0} />
                <MilestoneCard icon={<Share2 className="h-8 w-8" />} title="Contributions" value={userAchievements?.contributions || 0} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MilestoneCard: React.FC<MilestoneCardProps> = ({ icon, title, value }) => (
  <Card className="neumorphic-card neumorphic-convex">
    <CardContent className="flex items-center p-4">
      <div className="mr-4">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default Achievements;
