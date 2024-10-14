import React, { Suspense, lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { fetchUserData, fetchWeeklyProgress } from '@/lib/api';
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, Zap, Target, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/theme-provider';
import { Switch } from "@/components/ui/switch";

const OverviewTab = lazy(() => import('@/components/dashboard/OverviewTab'));
const ProgressTab = lazy(() => import('@/components/dashboard/ProgressTab'));
const NotificationsTab = lazy(() => import('@/components/dashboard/NotificationsTab'));
const StudentDashboard = lazy(() => import('@/components/dashboard/StudentDashboard'));
const InstructorDashboard = lazy(() => import('@/components/dashboard/InstructorDashboard'));
const AdminDashboard = lazy(() => import('@/components/dashboard/AdminDashboard'));
const LearningPathFooter = lazy(() => import('@/components/dashboard/LearningPathFooter'));

const Dashboard: React.FC = () => {
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: fetchUserData,
  });

  const { data: weeklyProgressData, isLoading: progressLoading } = useQuery({
    queryKey: ['weeklyProgress'],
    queryFn: fetchWeeklyProgress,
  });

  const { theme, setTheme } = useTheme();

  const randomData = Array.from({ length: 7 }, () => ({
    name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][Math.floor(Math.random() * 7)],
    value: Math.floor(Math.random() * 100)
  }));

  if (userLoading || progressLoading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Welcome back, {userData?.name}!
        </h2>
        <div className="flex items-center space-x-4">
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
          <Avatar className="h-12 w-12 ring-2 ring-purple-500 ring-offset-2">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${userData?.name}`} alt={userData?.name} />
            <AvatarFallback>{userData?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Sparkles />} title="Learning Streak" value={`${userData?.learningStreak} days`} color="blue" />
        <StatCard icon={<Zap />} title="XP Gained" value={`${userData?.xpGained} XP`} color="green" />
        <StatCard icon={<Target />} title="Goals Completed" value={userData?.goalsCompleted} color="yellow" />
        <StatCard icon={<Trophy />} title="Achievements" value={userData?.achievements} color="purple" />
      </div>

      <Card className="overflow-hidden shadow-lg">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <CardContent>
            <Suspense fallback={<div>Loading tab content...</div>}>
              <TabsContent value="overview">
                <OverviewTab userData={userData} />
              </TabsContent>
              <TabsContent value="progress">
                <ProgressTab weeklyProgressData={weeklyProgressData} />
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationsTab />
              </TabsContent>
            </Suspense>
          </CardContent>
        </Tabs>
      </Card>

      <Card className="overflow-hidden shadow-lg">
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Interactive Progress Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={randomData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Suspense fallback={<div>Loading dashboard content...</div>}>
        {userData?.role === 'student' && <StudentDashboard />}
        {userData?.role === 'instructor' && <InstructorDashboard />}
        {userData?.role === 'admin' && <AdminDashboard />}
      </Suspense>

      <Suspense fallback={<div>Loading learning path...</div>}>
        <LearningPathFooter />
      </Suspense>
    </motion.div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`neumorphic-card bg-gradient-to-br from-${color}-400 to-${color}-600 text-white p-6 rounded-lg shadow-lg`}
  >
    <div className="flex flex-col items-center justify-center">
      {React.cloneElement(icon, { className: "h-8 w-8 mb-2" })}
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </motion.div>
);

export default Dashboard;