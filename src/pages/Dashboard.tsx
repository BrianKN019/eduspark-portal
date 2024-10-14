import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { Bell, Calendar, BookOpen, Award, Zap, Target, Users, Briefcase } from 'lucide-react';
import AnnouncementsNotifications from '@/components/AnnouncementsNotifications';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [activeTab, setActiveTab] = useState('overview');
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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Welcome back, {userData?.name}!</h2>
        <Avatar className="h-12 w-12">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${userData?.name}`} alt={userData?.name} />
          <AvatarFallback>{userData?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" onClick={() => setActiveTab('overview')}>Overview</TabsTrigger>
          <TabsTrigger value="progress" onClick={() => setActiveTab('progress')}>Progress</TabsTrigger>
          <TabsTrigger value="notifications" onClick={() => setActiveTab('notifications')}>Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
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
                <p className="text-sm text-right mt-1">{userData?.overallProgress}%</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="progress">
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
        </TabsContent>
        <TabsContent value="notifications">
          <AnnouncementsNotifications />
        </TabsContent>
      </Tabs>

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
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Your Learning Path</h3>
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-4 w-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button className="w-full">Continue Last Course</Button>
            <Button className="w-full" variant="outline">Take a Quiz</Button>
            <Button className="w-full" variant="outline">Join Study Group</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-4 w-4" />
            Learning Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Complete JavaScript Basics
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Submit React Project
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Attend AI Workshop
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
);

const InstructorDashboard: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Instructor Overview</h3>
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Student Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Active Students: 120</p>
            <p>Average Course Completion: 78%</p>
            <p>Discussion Posts This Week: 45</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            Course Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button className="w-full">Create New Course</Button>
            <Button className="w-full" variant="outline">Update Existing Course</Button>
            <Button className="w-full" variant="outline">View Student Submissions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const AdminDashboard: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Admin Control Panel</h3>
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Total Users: 5,000</p>
            <p>Active Courses: 50</p>
            <p>Revenue This Month: $25,000</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button className="w-full">Add New User</Button>
            <Button className="w-full" variant="outline">Manage Roles</Button>
            <Button className="w-full" variant="outline">View User Reports</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Server Status: Operational</p>
            <p>Database Load: 35%</p>
            <p>Last Backup: 2 hours ago</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Dashboard;
