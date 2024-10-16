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
import { BookOpen, Video, Users } from 'lucide-react';

const StudentDashboard = lazy(() => import('@/components/dashboard/StudentDashboard'));
const InstructorDashboard = lazy(() => import('@/components/dashboard/InstructorDashboard'));
const AdminDashboard = lazy(() => import('@/components/dashboard/AdminDashboard'));
const LearningPathFooter = lazy(() => import('@/components/dashboard/LearningPathFooter'));

const Dashboard: React.FC = () => {
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: () => fetchUserData('Brian K'),
  });

  const { data: weeklyProgressData, isLoading: progressLoading } = useQuery({
    queryKey: ['weeklyProgress'],
    queryFn: fetchWeeklyProgress,
  });

  if (userLoading || progressLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 min-h-screen relative overflow-hidden transition-colors duration-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 dark:text-white">
      <DashboardHeader userData={userData} />
      <DashboardStats userData={userData} />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted p-1">
          <TabsTrigger value="overview" className="rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 dark:text-blue-100">
            Overview
          </TabsTrigger>
          <TabsTrigger value="courses" className="rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 dark:text-blue-100">
            Courses
          </TabsTrigger>
          <TabsTrigger value="community" className="rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 dark:text-blue-100">
            Community
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
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
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Community Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Join Study Group
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2">
                  <Video className="h-4 w-4" />
                  Attend Webinar
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2">
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

      <Suspense fallback={<div>Loading learning path...</div>}>
        <LearningPathFooter />
      </Suspense>
    </div>
  );
};

export default Dashboard;