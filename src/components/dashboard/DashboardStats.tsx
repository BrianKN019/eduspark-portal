import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Target, Trophy } from 'lucide-react';

interface DashboardStatsProps {
  userData: any; // Replace 'any' with a proper type if available
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ userData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={<Sparkles className="h-8 w-8 mb-2" />} title="Learning Streak" value={`${userData?.learningStreak} days`} />
      <StatCard icon={<Zap className="h-8 w-8 mb-2" />} title="XP Gained" value={`${userData?.xpGained} XP`} />
      <StatCard icon={<Target className="h-8 w-8 mb-2" />} title="Goals Completed" value={userData?.goalsCompleted} />
      <StatCard icon={<Trophy className="h-8 w-8 mb-2" />} title="Achievements" value={userData?.achievements} />
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