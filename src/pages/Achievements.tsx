import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Trophy, Share2, Scroll, Star, Zap, Book, Target } from 'lucide-react';
import BadgeList from '@/components/achievements/BadgeList';
import Leaderboard from '@/components/achievements/Leaderboard';
import CertificateList from '@/components/achievements/CertificateList';
import { useQuery } from '@tanstack/react-query';
import { fetchUserAchievements, fetchLeaderboard } from '@/lib/api';
import { Badge } from '@/types/achievements';

const Achievements: React.FC = () => {
  const { data: userAchievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['userAchievements'],
    queryFn: fetchUserAchievements,
  });

  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
  });

  if (achievementsLoading || leaderboardLoading) {
    return <div>Loading achievements...</div>;
  }

  // Ensure that the badges are of the correct type
  const typedBadges: Badge[] = userAchievements?.badges.map(badge => ({
    ...badge,
    tier: badge.tier as 'bronze' | 'silver' | 'gold'
  })) || [];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Achievements & Badges</h2>
      <Tabs defaultValue="badges" className="w-full">
        <TabsList>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
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
              <CertificateList certificates={userAchievements?.certificates || []} />
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

const MilestoneCard: React.FC<{ icon: React.ReactNode; title: string; value: number }> = ({ icon, title, value }) => (
  <Card className="neumorphic-card">
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