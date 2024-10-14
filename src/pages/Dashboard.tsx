import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { fetchUserData, fetchWeeklyProgress } from '@/lib/api';
import OverviewTab from '@/components/dashboard/OverviewTab';
import ProgressTab from '@/components/dashboard/ProgressTab';
import NotificationsTab from '@/components/dashboard/NotificationsTab';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import InstructorDashboard from '@/components/dashboard/InstructorDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

const Dashboard: React.FC = () => {
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: fetchUserData,
  });

  const { data: weeklyProgressData, isLoading: progressLoading } = useQuery({
    queryKey: ['weeklyProgress'],
    queryFn: fetchWeeklyProgress,
  });

  if (userLoading || progressLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6 neumorphic-container">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Welcome back, {userData?.name}!</h2>
        <Avatar className="h-12 w-12 neumorphic-avatar">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${userData?.name}`} alt={userData?.name} />
          <AvatarFallback>{userData?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 neumorphic-tabs">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab userData={userData} />
        </TabsContent>
        <TabsContent value="progress">
          <ProgressTab weeklyProgressData={weeklyProgressData} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
      </Tabs>

      {userData?.role === 'student' && <StudentDashboard />}
      {userData?.role === 'instructor' && <InstructorDashboard />}
      {userData?.role === 'admin' && <AdminDashboard />}
    </div>
  );
};

export default Dashboard;