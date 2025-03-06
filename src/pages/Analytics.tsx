import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, Area, AreaChart, RadialBarChart, RadialBar } from 'recharts';
import { TrendingUp, Users, BookOpen, Clock, Award, BookOpenCheck, Calendar, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Analytics: React.FC = () => {
  const { data: analyticsData } = useQuery({
    queryKey: ['analytics-data'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        
        const { data: progressData } = await supabase
          .from('course_progress')
          .select('*, courses(*)')
          .eq('user_id', user.id);
          
        const { data: assessmentData } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('user_id', user.id);
          
        return {
          progressData: progressData || [],
          assessmentData: assessmentData || []
        };
      } catch (e) {
        console.error("Error fetching analytics data:", e);
        return null;
      }
    }
  });

  const platformGrowthData = [
    { name: 'Sep', users: 4000, courses: 2400, completions: 1800 },
    { name: 'Oct', users: 3000, courses: 1398, completions: 1500 },
    { name: 'Nov', users: 2000, courses: 9800, completions: 1200 },
    { name: 'Dec', users: 2780, courses: 3908, completions: 2300 },
    { name: 'Jan', users: 1890, courses: 4800, completions: 1750 },
    { name: 'Feb', users: 2390, courses: 3800, completions: 2100 },
    { name: 'Mar', users: 3490, courses: 4300, completions: 2800 },
  ];

  const courseCompletionData = [
    { name: 'Web Dev', completed: 85, pending: 15 },
    { name: 'Mobile Dev', completed: 65, pending: 35 },
    { name: 'Data Science', completed: 78, pending: 22 },
    { name: 'UI/UX', completed: 92, pending: 8 },
    { name: 'DevOps', completed: 70, pending: 30 },
  ];

  const userEngagementData = [
    { name: 'Active Daily', value: 50, fill: '#0088FE' },
    { name: 'Active Weekly', value: 20, fill: '#00C49F' },
    { name: 'Occasional', value: 15, fill: '#FFBB28' },
    { name: 'Inactive', value: 15, fill: '#FF8042' },
  ];

  const timeDistributionData = [
    { time: 'Morning', hours: 3.5, fill: '#8884d8' },
    { time: 'Afternoon', hours: 2.8, fill: '#83a6ed' },
    { time: 'Evening', hours: 4.2, fill: '#8dd1e1' },
    { time: 'Night', hours: 1.5, fill: '#82ca9d' },
  ];

  const engagementTrendData = [
    { month: 'Sep', engagement: 65, target: 70 },
    { month: 'Oct', engagement: 68, target: 72 },
    { month: 'Nov', engagement: 75, target: 75 },
    { month: 'Dec', engagement: 74, target: 78 },
    { month: 'Jan', engagement: 80, target: 80 },
    { month: 'Feb', engagement: 82, target: 82 },
    { month: 'Mar', engagement: 87, target: 85 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#43A19E', '#7B6FDC'];

  const completionRates = analyticsData?.progressData
    ? Math.round(analyticsData.progressData.reduce((sum, item) => sum + (item.progress_percentage || 0), 0) / 
      (analyticsData.progressData.length || 1))
    : 76;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-850 min-h-screen">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent pb-1">Dashboard Analytics</h2>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Year to date</option>
          </select>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm">
            <Calendar className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Users" 
          value="15,234" 
          icon={<Users className="h-5 w-5 text-blue-500" />} 
          change="+12.5%" 
          trend="up"
          description="Active learners this month" 
        />
        <StatCard 
          title="Active Courses" 
          value="87" 
          icon={<BookOpen className="h-5 w-5 text-emerald-500" />} 
          change="+4.2%" 
          trend="up"
          description="Courses in progress" 
        />
        <StatCard 
          title="Avg. Completion Rate" 
          value={`${completionRates}%`} 
          icon={<TrendingUp className="h-5 w-5 text-purple-500" />} 
          change="+2.3%" 
          trend="up"
          description="Courses completed" 
        />
        <StatCard 
          title="Avg. Time Spent" 
          value="4.7 hrs/week" 
          icon={<Clock className="h-5 w-5 text-amber-500" />} 
          change="+0.8%" 
          trend="up"
          description="Learning engagement" 
        />
      </div>

      <Card className="overflow-hidden shadow-xl border-0 bg-white dark:bg-gray-800 rounded-xl">
        <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <Activity className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                Platform Growth Trends
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400 text-sm">
                Monthly user acquisition and course completions
              </CardDescription>
            </div>
            <select className="px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
              <option>Last 7 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-4 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={platformGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                  border: 'none' 
                }} 
              />
              <Legend />
              <Area type="monotone" dataKey="users" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsers)" />
              <Area type="monotone" dataKey="courses" stroke="#82ca9d" fillOpacity={1} fill="url(#colorCourses)" />
              <Area type="monotone" dataKey="completions" stroke="#ffc658" fillOpacity={1} fill="url(#colorCompletions)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden shadow-xl border-0 bg-white dark:bg-gray-800 rounded-xl">
          <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-emerald-900/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Course Completion Rates
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400 text-sm">
                  Percentage of completed lessons by category
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                    border: 'none' 
                  }} 
                />
                <Legend />
                <Bar dataKey="completed" name="Completed %" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending %" fill="#d1d5db" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-xl border-0 bg-white dark:bg-gray-800 rounded-xl">
          <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <PieChartIcon className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" />
                  User Engagement Breakdown
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400 text-sm">
                  User activity classification
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userEngagementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {userEngagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                    border: 'none' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-xl border-0 bg-white dark:bg-gray-800 rounded-xl">
          <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-amber-900/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-amber-600 dark:text-amber-400" />
                  Learning Time Distribution
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400 text-sm">
                  Hours spent learning by time of day
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="20%" 
                outerRadius="80%" 
                barSize={20} 
                data={timeDistributionData}
              >
                <RadialBar
                  background
                  dataKey="hours"
                  cornerRadius={12}
                  label={{ position: "insideStart", fill: "#fff", fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                    border: 'none' 
                  }} 
                  formatter={(value, name, props) => [`${value} hours`, props.payload.time]}
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden shadow-xl border-0 bg-white dark:bg-gray-800 rounded-xl">
        <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-cyan-900/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <Award className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                Learning Performance Trends
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400 text-sm">
                Monthly engagement vs target metrics
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
                  border: 'none' 
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} name="Actual Engagement" />
              <Line type="monotone" dataKey="target" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" name="Target Engagement" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="overflow-hidden shadow-xl border-0 bg-white dark:bg-gray-800 rounded-xl col-span-1">
          <CardHeader className="pb-2 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-gray-800 dark:to-rose-900/20">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <BookOpenCheck className="mr-2 h-5 w-5 text-rose-600 dark:text-rose-400" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Course Completion</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">76%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Assignment Submission</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">84%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Quiz Performance</span>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Discussion Participation</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-xl border-0 bg-white dark:bg-gray-800 rounded-xl col-span-2">
          <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-gray-800 dark:to-violet-900/20">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
              <Award className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Top Performing Subjects
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[
                { subject: 'JavaScript Programming', score: 94, color: 'bg-blue-600' },
                { subject: 'UI/UX Design', score: 89, color: 'bg-purple-600' },
                { subject: 'Data Analysis', score: 86, color: 'bg-emerald-600' },
                { subject: 'Mobile Development', score: 82, color: 'bg-amber-600' },
                { subject: 'Cloud Computing', score: 77, color: 'bg-rose-600' },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-medium mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{item.subject}</span>
                      <span className="font-semibold">{item.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.score}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, trend, description }) => (
  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-0 bg-white dark:bg-gray-800 rounded-xl">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
        <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-900/30">
          {icon}
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center">
          <span className={`
            text-xs font-medium rounded-full px-2 py-0.5 flex items-center
            ${trend === 'up' ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' : 
              trend === 'down' ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30' : 
              'text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-700/30'}
          `}>
            {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
            {trend === 'down' && <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />}
            {change}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export default Analytics;
