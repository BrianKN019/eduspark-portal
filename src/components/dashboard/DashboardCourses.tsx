
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fetchCourses } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardCourses: React.FC = () => {
  const navigate = useNavigate();
  
  // Fetch all courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  // Fetch user course progress
  const { data: courseProgress, isLoading: progressLoading } = useQuery({
    queryKey: ['userCourseProgress'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];
        
        const { data, error } = await supabase
          .from('course_progress')
          .select('*, courses(*)')
          .eq('user_id', user.id);
          
        if (error) {
          console.error("Error fetching course progress:", error);
          return [];
        }
        
        return data || [];
      } catch (e) {
        console.error("Exception in course progress query:", e);
        return [];
      }
    }
  });

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const isLoading = coursesLoading || progressLoading;

  if (isLoading) {
    return <div className="p-4 text-center">Loading courses...</div>;
  }

  // Filter for enrolled courses (those with progress)
  const enrolledCourses = courseProgress || [];

  if (enrolledCourses.length === 0) {
    return (
      <Card className="overflow-hidden shadow-lg">
        <CardHeader>
          <CardTitle>In Progress Courses</CardTitle>
        </CardHeader>
        <CardContent className="text-center p-6">
          <p className="mb-4">You haven't enrolled in any courses yet.</p>
          <Button onClick={() => navigate('/courses')} variant="default">
            Browse Courses
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-lg">
      <CardHeader>
        <CardTitle>In Progress Courses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {enrolledCourses.map(progress => (
          <div 
            key={progress.course_id} 
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
            onClick={() => handleCourseClick(progress.course_id)}
          >
            <div className="flex items-center gap-4 mb-3">
              {progress.courses?.thumbnail_url ? (
                <img 
                  src={progress.courses.thumbnail_url} 
                  alt={progress.courses.title} 
                  className="h-14 w-14 rounded-md object-cover" 
                />
              ) : (
                <div className="h-14 w-14 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
              )}
              
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{progress.courses?.title}</h4>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="mr-1 h-3 w-3" />
                  Last accessed: {new Date(progress.last_accessed).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span className="font-medium">{progress.progress_percentage}%</span>
              </div>
              <Progress value={progress.progress_percentage} className="h-2" />
              
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{progress.completed ? "Completed" : "In Progress"}</span>
                <span>{progress.courses?.level}</span>
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          onClick={() => navigate('/courses')} 
          variant="outline" 
          className="w-full mt-2"
        >
          View All Courses
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardCourses;
