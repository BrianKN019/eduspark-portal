import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { fetchUserData, fetchWeeklyProgress } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, Zap, Target, Trophy, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from "@/components/ui/switch";

const OverviewTab = lazy(() => import('@/components/dashboard/OverviewTab'));
const ProgressTab = lazy(() => import('@/components/dashboard/ProgressTab'));
const NotificationsTab = lazy(() => import('@/components/dashboard/NotificationsTab'));
const StudentDashboard = lazy(() => import('@/components/dashboard/StudentDashboard'));
const InstructorDashboard = lazy(() => import('@/components/dashboard/InstructorDashboard'));
const AdminDashboard = lazy(() => import('@/components/dashboard/AdminDashboard'));
const LearningPathFooter = lazy(() => import('@/components/dashboard/LearningPathFooter'));

const Dashboard: React.FC = () => {
  const [theme, setTheme] = useState('light');
  const [particles, setParticles] = useState([]);
  const [inProgressCourses, setInProgressCourses] = useState([]);

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: () => fetchUserData('Brian K'), // Pass the name here
  });

  const { data: weeklyProgressData, isLoading: progressLoading } = useQuery({
    queryKey: ['weeklyProgress'],
    queryFn: fetchWeeklyProgress,
  });

  useEffect(() => {
    const generateParticles = () => {
      return Array.from({ length: 50 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 - 1.5,
      }));
    };

    setParticles(generateParticles());

    const interval = setInterval(() => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
        }))
      );
    }, 50);

    // Simulated API call for in-progress courses
    setInProgressCourses([
      { id: 1, name: 'React Fundamentals', progress: 60 },
      { id: 2, name: 'Advanced JavaScript', progress: 30 },
      { id: 3, name: 'Node.js Basics', progress: 45 },
    ]);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  if (userLoading || progressLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`space-y-6 p-6 min-h-screen relative overflow-hidden transition-colors duration-500 ${theme === 'light' ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : 'bg-gradient-to-r from-gray-900 to-indigo-900 text-white'}`}>
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-blue-500 opacity-20"
          style={{
            x: particle.x,
            y: particle.y,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            x: [particle.x, (particle.x + particle.speedX * 100 + window.innerWidth) % window.innerWidth],
            y: [particle.y, (particle.y + particle.speedY * 100 + window.innerHeight) % window.innerHeight],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      <div className="flex justify-between items-center relative z-10">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Welcome back, Brian K!
        </h2>
        <div className="flex items-center space-x-4">
          <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          {theme === 'light' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          <Avatar className="h-12 w-12 ring-2 ring-purple-500 ring-offset-2">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=BK`} alt="Brian K" />
            <AvatarFallback>BK</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="neumorphic-card bg-gradient-to-br from-blue-400 to-blue-600 text-white">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Sparkles className="h-8 w-8 mb-2" />
            <h3 className="text-xl font-semibold">Learning Streak</h3>
            <p className="text-3xl font-bold">{userData?.learningStreak} days</p>
          </CardContent>
        </Card>
        <Card className="neumorphic-card bg-gradient-to-br from-green-400 to-green-600 text-white">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Zap className="h-8 w-8 mb-2" />
            <h3 className="text-xl font-semibold">XP Gained</h3>
            <p className="text-3xl font-bold">{userData?.xpGained} XP</p>
          </CardContent>
        </Card>
        <Card className="neumorphic-card bg-gradient-to-br from-yellow-400 to-yellow-600 text-white">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Target className="h-8 w-8 mb-2" />
            <h3 className="text-xl font-semibold">Goals Completed</h3>
            <p className="text-3xl font-bold">{userData?.goalsCompleted}</p>
          </CardContent>
        </Card>
        <Card className="neumorphic-card bg-gradient-to-br from-purple-400 to-purple-600 text-white">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Trophy className="h-8 w-8 mb-2" />
            <h3 className="text-xl font-semibold">Achievements</h3>
            <p className="text-3xl font-bold">{userData?.achievements}</p>
          </CardContent>
        </Card>
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
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="progress" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-lg">
        <CardHeader>
          <CardTitle>In Progress Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {inProgressCourses.map(course => (
            <div key={course.id} className="mb-4">
              <h4 className="font-semibold">{course.name}</h4>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{course.progress}% complete</p>
            </div>
          ))}
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
    </div>
  );
};

export default Dashboard;
