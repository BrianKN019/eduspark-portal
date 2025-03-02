
import React, { Suspense, lazy } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserData, fetchWeeklyProgress } from '@/lib/api';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import DashboardCourses from '@/components/dashboard/DashboardCourses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, Users, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const StudentDashboard = lazy(() => import('@/components/dashboard/StudentDashboard'));
const InstructorDashboard = lazy(() => import('@/components/dashboard/InstructorDashboard'));
const AdminDashboard = lazy(() => import('@/components/dashboard/AdminDashboard'));
// Removing duplicate LearningPathFooter that was causing duplication

const Dashboard: React.FC = () => {
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: fetchUserData,
  });

  // Add progress data fetch
  const { data: courseProgress } = useQuery({
    queryKey: ['courseProgress'],
    queryFn: async () => {
      const { data: progress } = await supabase
        .from('course_progress')
        .select('*, courses(*)')
        .order('last_accessed', { ascending: false })
        .limit(10);
      return progress;
    }
  });

  const { data: weeklyProgressData, isLoading: progressLoading } = useQuery({
    queryKey: ['weeklyProgress'],
    queryFn: fetchWeeklyProgress,
  });

  if (userLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-xl text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-spin-slow opacity-75 blur-sm"></div>
            <div className="absolute top-2 right-2 bottom-2 left-2 bg-white dark:bg-gray-800 rounded-full"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-purple-600" />
          </div>
          <p className="text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Loading your experience...
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Preparing your personalized dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6 p-4 md:p-6 min-h-screen relative overflow-hidden transition-colors duration-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DashboardHeader userData={userData} />
      <DashboardStats userData={userData} />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md">
          <TabsTrigger 
            value="overview" 
            className="rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 data-[state=active]:text-purple-700 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-purple-300 transition-all duration-200 shadow data-[state=active]:shadow-md"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="courses" 
            className="rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 data-[state=active]:text-purple-700 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-purple-300 transition-all duration-200 shadow data-[state=active]:shadow-md"
          >
            Courses
          </TabsTrigger>
          <TabsTrigger 
            value="community" 
            className="rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 data-[state=active]:text-purple-700 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-purple-300 transition-all duration-200 shadow data-[state=active]:shadow-md"
          >
            Community
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className="mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-400">Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardCharts weeklyProgressData={weeklyProgressData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="courses">
          <DashboardCourses />
        </TabsContent>
        <TabsContent value="community">
          <Card className="mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-400">Community Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <BookOpen className="h-4 w-4" />
                  Join Study Group
                </Button>
                <Button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <Video className="h-4 w-4" />
                  Attend Webinar
                </Button>
                <Button className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <Users className="h-4 w-4" />
                  Forum Discussions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Suspense fallback={<div>Loading dashboard content...</div>}>
        {userData?.role === 'student' && <StudentDashboard />}
        {userData?.role === 'instructor' && <InstructorDashboard />}
        {userData?.role === 'admin' && <AdminDashboard />}
      </Suspense>
    </motion.div>
  );
};

export default Dashboard;
