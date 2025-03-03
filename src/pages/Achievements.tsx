
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Award, Star, Medal, Target } from 'lucide-react';
import BadgeList from '@/components/achievements/BadgeList';
import CertificateList from '@/components/achievements/CertificateList';
import { useQuery } from '@tanstack/react-query';
import { fetchUserAchievements, fetchLeaderboard } from '@/lib/api';
import { Badge, Certificate, UserAchievements, LeaderboardEntry } from '@/types/achievements';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const AchievementsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userProgress, setUserProgress] = useState({
    streak: 0,
    points: 0,
    completed: 0,
    achievements: 0
  });

  // Use type assertion to avoid excessive type instantiation
  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: fetchUserAchievements,
    staleTime: 300000, // 5 minutes
  }) as { data: UserAchievements | undefined };

  // Use type assertion to avoid excessive type instantiation
  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    staleTime: 300000, // 5 minutes
  }) as { data: LeaderboardEntry[] | undefined };

  useEffect(() => {
    if (achievements) {
      setUserProgress({
        streak: achievements.streakDays,
        points: achievements.totalPoints,
        completed: achievements.coursesCompleted,
        achievements: achievements.badges.length
      });
    }
  }, [achievements]);

  const getLeaderboardRank = (): number => {
    if (!leaderboard) return 0;
    
    const { data: { user } } = supabase.auth.getUser();
    if (!user) return 0;
    
    const userIndex = leaderboard.findIndex(entry => entry.userId === user.id);
    return userIndex !== -1 ? userIndex + 1 : leaderboard.length + 1;
  };

  // Calculate progress percentage for different achievement levels
  const getProgressToNextLevel = () => {
    const currentBadges = userProgress.achievements;
    
    if (currentBadges < 5) return { level: "Bronze", progress: (currentBadges / 5) * 100, target: 5 };
    if (currentBadges < 15) return { level: "Silver", progress: ((currentBadges - 5) / 10) * 100, target: 15 };
    if (currentBadges < 30) return { level: "Gold", progress: ((currentBadges - 15) / 15) * 100, target: 30 };
    return { level: "Platinum", progress: 100, target: currentBadges };
  };

  const level = getProgressToNextLevel();

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">Achievements & Badges</h1>
          <p className="text-muted-foreground">Track your learning journey and showcase your accomplishments</p>
        </div>
      </div>

      {/* Achievement Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Learning Streak" 
          value={userProgress.streak} 
          unit="days"
          icon={<Trophy className="h-10 w-10 text-amber-500" />}
          description="Keep learning daily to increase your streak"
          gradient="from-amber-400 to-orange-600"
        />
        <StatsCard 
          title="XP Earned" 
          value={userProgress.points} 
          unit="points"
          icon={<Star className="h-10 w-10 text-yellow-500" />}
          description="Total experience points gained"
          gradient="from-yellow-400 to-yellow-600"
        />
        <StatsCard 
          title="Courses Completed" 
          value={userProgress.completed} 
          unit="courses"
          icon={<Award className="h-10 w-10 text-emerald-500" />}
          description="Courses you've successfully finished"
          gradient="from-emerald-400 to-teal-600"
        />
        <StatsCard 
          title="Achievements Unlocked" 
          value={userProgress.achievements} 
          unit="badges"
          icon={<Medal className="h-10 w-10 text-blue-500" />}
          description="Badges and achievements earned"
          gradient="from-blue-400 to-indigo-600"
        />
      </div>

      {/* Progress to Next Level */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h3 className="text-xl font-bold">Progress to {level.level} Level</h3>
              <p className="text-muted-foreground">Collect {level.target - userProgress.achievements} more badges to advance</p>
            </div>
            <div className="mt-2 md:mt-0 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium">
              Level: {level.level}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>{userProgress.achievements} badges</span>
              <span>{level.target} badges</span>
            </div>
            <div className="relative">
              <Progress value={level.progress} className="h-3 bg-gray-200 dark:bg-gray-700" />
              <div 
                className="absolute top-0 left-0 h-3 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-1000"
                style={{ width: `${level.progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium">Current rank:</span> {getLeaderboardRank()} 
              {getLeaderboardRank() <= 10 ? 
                <span className="ml-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  (Top 10 🏆)
                </span> : 
                ''
              }
            </div>
            <div className="text-sm">
              <span className="font-medium">Next milestone:</span> {level.level} Achievement
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs Section */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="badges" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
            Badges
          </TabsTrigger>
          <TabsTrigger value="certificates" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
            Certificates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-full border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                    <span>Leaderboard</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {leaderboard && leaderboard.length > 0 ? (
                    <div className="space-y-4">
                      {leaderboard.slice(0, 5).map((entry, index) => (
                        <div 
                          key={entry.userId} 
                          className={`flex items-center p-3 rounded-lg transition-all
                            ${index === 0 ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 shadow-md' : 
                              'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}
                        >
                          <div className={`
                            flex items-center justify-center w-8 h-8 rounded-full mr-4 font-bold
                            ${index === 0 ? 'bg-yellow-500 text-white' : 
                              index === 1 ? 'bg-gray-300 text-gray-800' :
                                index === 2 ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
                          `}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{entry.username}</p>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Medal className="mr-1 h-3 w-3" />
                              {entry.badgeCount} badges
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{entry.points}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Leaderboard data is loading...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="h-full border-0 shadow-lg bg-gradient-to-r from-purple-50 to-violet-50 dark:from-gray-800 dark:to-violet-950">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-purple-500" />
                    <span>Achievement Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <GoalItem 
                      title="Daily Streak" 
                      current={userProgress.streak} 
                      target={30} 
                      color="bg-blue-500" 
                    />
                    <GoalItem 
                      title="Courses Completed" 
                      current={userProgress.completed} 
                      target={5} 
                      color="bg-green-500" 
                    />
                    <GoalItem 
                      title="Badges Collection" 
                      current={userProgress.achievements} 
                      target={10} 
                      color="bg-purple-500" 
                    />
                    <GoalItem 
                      title="XP Points" 
                      current={userProgress.points} 
                      target={1000} 
                      color="bg-amber-500" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <div className="space-y-6">
            {achievements?.badges && achievements.badges.length > 0 ? (
              <BadgeList badges={achievements.badges} />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Award className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Badges Yet</h3>
                <p className="text-gray-500 max-w-md">Complete courses and challenges to earn badges. They'll appear here as you progress through your learning journey.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="certificates">
          <div className="space-y-6">
            {achievements?.certificates && achievements.certificates.length > 0 ? (
              <CertificateList certificates={achievements.certificates} />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Award className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Certificates Yet</h3>
                <p className="text-gray-500 max-w-md">Complete courses to earn certificates. Your achievements will be displayed here as you progress.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  description: string;
  gradient: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, unit, icon, description, gradient }) => {
  return (
    <Card className="border-0 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className={`h-2 w-full bg-gradient-to-r ${gradient}`}></div>
      <CardContent className="pt-6">
        <div className="flex items-start">
          <div className="mr-4">{icon}</div>
          <div>
            <h3 className="font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{value}</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">{unit}</span>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface GoalItemProps {
  title: string;
  current: number;
  target: number;
  color: string;
}

const GoalItem: React.FC<GoalItemProps> = ({ title, current, target, color }) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">{title}</span>
        <span className="text-sm font-medium">{current}/{target}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-right text-xs text-gray-500 dark:text-gray-400">
        {percentage >= 100 ? 
          'Goal completed! 🎉' : 
          `${Math.round(percentage)}% of goal achieved`
        }
      </div>
    </div>
  );
};

export default AchievementsPage;
