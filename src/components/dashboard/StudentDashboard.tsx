
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Target, ArrowRight, CheckCircle, Clock, Award, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

interface LearningGoal {
  id: string;
  text: string;
  completed: boolean;
  type: 'course' | 'project' | 'event';
  link?: string;
}

interface CourseProgress {
  id: string;
  course_id: string;
  progress_percentage: number;
  last_accessed: string;
  courses: {
    id: string;
    title: string;
    thumbnail_url: string;
    field: string;
  }
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([
    { id: '1', text: 'Complete JavaScript Basics', completed: false, type: 'course' },
    { id: '2', text: 'Submit React Project', completed: false, type: 'project' },
    { id: '3', text: 'Attend AI Workshop', completed: false, type: 'event' }
  ]);
  
  // Fetch user's course progress
  const { data: userCourses, isLoading } = useQuery({
    queryKey: ['userCourseProgress'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data } = await supabase
        .from('course_progress')
        .select('*, courses(*)')
        .eq('user_id', user.id)
        .order('last_accessed', { ascending: false });
        
      return data as CourseProgress[];
    }
  });
  
  const toggleGoalCompletion = (id: string) => {
    setLearningGoals(prev => 
      prev.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };
  
  const calculateRecommendedCourse = () => {
    if (!userCourses || userCourses.length === 0) {
      return null;
    }
    
    // Find the most recently accessed course that's not complete
    const inProgressCourses = userCourses.filter(course => 
      course.progress_percentage > 0 && course.progress_percentage < 100
    );
    
    return inProgressCourses.length > 0 ? inProgressCourses[0] : userCourses[0];
  };
  
  const recommendedCourse = calculateRecommendedCourse();
  
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">Your Learning Path</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none shadow-xl">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800 dark:text-purple-400">
                <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedCourse ? (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300">Continue Learning</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" /> Last accessed {new Date(recommendedCourse.last_accessed).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{recommendedCourse.courses.title}</h3>
                  <div className="flex items-center mb-3">
                    <span className="text-sm text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                      {recommendedCourse.courses.field}
                    </span>
                    <div className="ml-auto flex items-center">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                          style={{ width: `${recommendedCourse.progress_percentage}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">{recommendedCourse.progress_percentage}%</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                    onClick={() => navigate(`/courses/${recommendedCourse.course_id}`)}
                  >
                    Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <BookOpen className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">No courses in progress</p>
                  <Button 
                    className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => navigate('/courses')}
                  >
                    Browse Courses
                  </Button>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                  onClick={() => navigate('/courses')}
                >
                  All Courses
                </Button>
                <Button 
                  variant="outline"
                  className="border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  onClick={() => navigate('/achievements')}
                >
                  <Award className="mr-2 h-4 w-4" />
                  Certificates
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none shadow-xl">
            <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center text-green-800 dark:text-green-400">
                <Target className="mr-2 h-5 w-5 text-green-500" />
                Learning Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {learningGoals.map((goal) => (
                  <li key={goal.id} className="flex items-start">
                    <div 
                      className={`flex-shrink-0 w-5 h-5 mt-0.5 mr-3 rounded-full border cursor-pointer
                        ${goal.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 dark:border-gray-600'
                        }`}
                      onClick={() => toggleGoalCompletion(goal.id)}
                    >
                      {goal.completed && <CheckCircle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        goal.completed 
                          ? 'line-through text-gray-500 dark:text-gray-400' 
                          : goal.type === 'course' 
                            ? 'text-blue-600 dark:text-blue-400'
                            : goal.type === 'project'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-purple-600 dark:text-purple-400'
                      }`}>
                        {goal.text}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          goal.type === 'course' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : goal.type === 'project'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                        }`}>
                          {goal.type}
                        </span>
                        {!goal.completed && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto py-0 h-6 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            onClick={() => goal.link && navigate(goal.link)}
                          >
                            {goal.link ? 'View' : 'Add details'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transition-all duration-300"
                onClick={() => navigate('/learning-paths')}
              >
                View Complete Learning Path
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
