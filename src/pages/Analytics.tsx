import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, BookOpen, Clock } from 'lucide-react';

const Analytics: React.FC = () => {
  const platformGrowthData = [
    { name: 'Sep', users: 4000, courses: 2400, amt: 2400 },
    { name: 'Oct', users: 3000, courses: 1398, amt: 2210 },
    { name: 'Nov', users: 2000, courses: 9800, amt: 2290 },
    { name: 'Dec', users: 2780, courses: 3908, amt: 2000 },
    { name: 'Jan', users: 1890, courses: 4800, amt: 2181 },
    { name: 'Feb', users: 2390, courses: 3800, amt: 2500 },
    { name: 'Mar', users: 3490, courses: 4300, amt: 2100 },
  ];

  const courseCompletionData = [
    { name: 'Web Dev', completed: 85 },
    { name: 'Mobile Dev', completed: 65 },
    { name: 'Data Science', completed: 78 },
    { name: 'UI/UX', completed: 92 },
    { name: 'DevOps', completed: 70 },
  ];

  const userEngagementData = [
    { name: 'Active', value: 70 },
    { name: 'Inactive', value: 30 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Analytics</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value="15,234" icon={<Users />} />
        <StatCard title="Active Courses" value="87" icon={<BookOpen />} />
        <StatCard title="Avg. Completion Rate" value="76%" icon={<TrendingUp />} />
        <StatCard title="Avg. Time Spent" value="4.5 hrs/week" icon={<Clock />} />
      </div>
      <Card className="neumorphic-card neumorphic-convex">
        <CardHeader>
          <CardTitle>Platform Growth</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={platformGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="courses" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="neumorphic-card neumorphic-convex">
          <CardHeader>
            <CardTitle>Course Completion Rates</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="neumorphic-card neumorphic-convex">
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userEngagementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userEngagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <Card className="neumorphic-card neumorphic-convex">
    <CardContent className="flex items-center p-4">
      <div className="mr-4 text-blue-500">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

export default Analytics;
