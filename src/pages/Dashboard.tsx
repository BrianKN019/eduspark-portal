import React, { Suspense, lazy } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserData, fetchWeeklyProgress } from '@/lib/api';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import DashboardCourses from '@/components/dashboard/DashboardCourses';

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
      <DashboardTabs />
      <DashboardCharts weeklyProgressData={weeklyProgressData} />
      <DashboardCourses />

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