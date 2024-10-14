import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Trophy, Share2, Scroll } from 'lucide-react';
import BadgeList from '@/components/achievements/BadgeList';
import Leaderboard from '@/components/achievements/Leaderboard';
import CertificateList from '@/components/achievements/CertificateList';
import { useQuery } from '@tanstack/react-query';
import { fetchUserAchievements, fetchLeaderboard } from '@/lib/api';

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

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Achievements & Badges</h2>
      <Tabs defaultValue="badges" className="w-full">
        <TabsList>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
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
              <BadgeList badges={userAchievements?.badges || []} />
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
      </Tabs>
    </div>
  );
};

export default Achievements;