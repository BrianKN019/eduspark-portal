
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardChartsProps {
  weeklyProgressData: any[]; // Replace 'any' with a proper type if available
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ weeklyProgressData }) => {
  // Fetch accurate progress data
  const { data: progressData } = useQuery({
    queryKey: ['chartProgress'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        
        // Get course progress
        const { data: courseProgress } = await supabase
          .from('course_progress')
          .select('*, courses(*)')
          .eq('user_id', user.id);
          
        // Process data for charts
        const weeklyData = generateWeeklyProgress(courseProgress || []);
        const categoryData = generateCategoryDistribution(courseProgress || []);
        
        return {
          weeklyData,
          categoryData,
          courseProgress: courseProgress || []
        };
      } catch (e) {
        console.error("Exception in progress chart query:", e);
        return null;
      }
    }
  });
  
  // Generate weekly progress from course data
  const generateWeeklyProgress = (progress: any[]) => {
    const today = new Date();
    const lastSixDays = Array.from({length: 7}, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });
    
    return lastSixDays.map((date, index) => {
      const dateProgress = progress.filter(p => {
        const accessDate = new Date(p.last_accessed).toISOString().split('T')[0];
        return accessDate === date;
      });
      
      const avgProgress = dateProgress.length 
        ? dateProgress.reduce((sum, p) => sum + p.progress_percentage, 0) / dateProgress.length 
        : 0;
      
      return {
        name: index === 6 ? 'Today' : index === 5 ? 'Yesterday' : `Day ${index + 1}`,
        progress: Math.round(avgProgress)
      };
    });
  };
  
  // Generate category distribution
  const generateCategoryDistribution = (progress: any[]) => {
    // Group courses by field/category
    const categories: Record<string, number> = {};
    
    progress.forEach(p => {
      const field = p.courses?.field || 'Other';
      if (!categories[field]) {
        categories[field] = 0;
      }
      categories[field]++;
    });
    
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Use fetched data or fallback to props
  const chartData = progressData || { 
    weeklyData: weeklyProgressData,
    categoryData: [],
    courseProgress: []
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader>
          <CardTitle>Weekly Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
              <Line 
                type="monotone" 
                dataKey="progress" 
                stroke="#8884d8" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {chartData.courseProgress.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden shadow-lg">
            <CardHeader>
              <CardTitle>Course Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData.courseProgress.map(p => ({
                    name: p.courses?.title?.substring(0, 20) || 'Course',
                    progress: p.progress_percentage
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Completion']} />
                  <Bar dataKey="progress" fill="#82ca9d" name="Progress" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {chartData.categoryData.length > 0 && (
            <Card className="overflow-hidden shadow-lg">
              <CardHeader>
                <CardTitle>Learning Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Courses']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardCharts;
