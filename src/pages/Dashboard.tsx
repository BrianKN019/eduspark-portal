import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { Bell, Calendar, BookOpen, Award } from 'lucide-react';
import AnnouncementsNotifications from '@/components/AnnouncementsNotifications';

// Mock data - replace with actual API calls
const fetchUserData = async () => {
  // Simulate API call
  return {
    role: 'student',
    name: 'John Doe',
    coursesInProgress: 4,
    completedCourses: 12,
    upcomingDeadlines: 3,
    overallProgress: 75,
  };
};

const fetchWeeklyProgress = async () => {
  // Simulate API call
  return [
    { name: 'Week 1', progress: 80 },
    { name: 'Week 2', progress: 65 },
    { name: 'Week 3', progress: 90 },
    { name: 'Week 4', progress: 75 },
  ];
};

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
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Welcome back, {userData?.name}!</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Courses in Progress" value={userData?.coursesInProgress} icon={<BookOpen className="h-4 w-4" />} />
        <DashboardCard title="Completed Courses" value={userData?.completedCourses} icon={<Award className="h-4 w-4" />} />
        <DashboardCard title="Upcoming Deadlines" value={userData?.upcomingDeadlines} icon={<Calendar className="h-4 w-4" />} />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={userData?.overallProgress} className="w-full" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <AnnouncementsNotifications />
      </div>

      {userData?.role === 'student' && <StudentDashboard />}
      {userData?.role === 'instructor' && <InstructorDashboard />}
      {userData?.role === 'admin' && <AdminDashboard />}
    </div>
  );
};

const DashboardCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const StudentDashboard: React.FC = () => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Your Learning Path</h3>
    {/* Add student-specific components here */}
  </div>
);

const InstructorDashboard: React.FC = () => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Instructor Overview</h3>
    {/* Add instructor-specific components here */}
  </div>
);

const AdminDashboard: React.FC = () => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Admin Control Panel</h3>
    {/* Add admin-specific components here */}
  </div>
);

export default Dashboard;
