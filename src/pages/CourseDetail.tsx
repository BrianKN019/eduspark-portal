
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { fetchCourseById, updateCourseProgress } from '@/lib/api';
import CourseHeader from '@/components/course/CourseHeader';
import CourseProgress from '@/components/course/CourseProgress';
import CourseTabs from '@/components/course/CourseTabs';
import { Loader2 } from 'lucide-react';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('materials');
  const [userProgress, setUserProgress] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [hasCompletedCourse, setHasCompletedCourse] = useState(false);
  const [hasCertificate, setHasCertificate] = useState(false);

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseById(courseId || ''),
    enabled: !!courseId,
    retry: 3,
    retryDelay: 1000,
    meta: {
      onError: (err: any) => {
        console.error("Error fetching course details:", err);
        toast.error("Failed to load course details. Please try again.");
      }
    }
  });

  const { data: progress, refetch: refetchProgress } = useQuery({
    queryKey: ['courseProgress', courseId],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !courseId) return null;
        
        const { data, error } = await supabase
          .from('course_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching course progress:", error);
          throw error;
        }
        
        return data || null;
      } catch (e) {
        console.error("Exception in course progress query:", e);
        return null;
      }
    },
    enabled: !!courseId,
  });

  const { data: certificate } = useQuery({
    queryKey: ['certificate', courseId],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !courseId) return null;
        
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle();
          
        return error?.code === 'PGRST116' ? null : data;
      } catch (e) {
        console.error("Exception in certificate query:", e);
        return null;
      }
    },
    enabled: !!courseId && hasCompletedCourse,
  });

  useEffect(() => {
    if (progress) {
      setUserProgress(progress.progress_percentage);
      setIsEnrolled(true);
      setHasCompletedCourse(progress.completed);
      setCurrentLessonIndex(progress.current_lesson_index !== undefined ? progress.current_lesson_index + 1 : 0);
    }
  }, [progress]);

  useEffect(() => {
    setHasCertificate(!!certificate);
  }, [certificate]);

  useEffect(() => {
    console.log("CourseDetail mounted, courseId:", courseId);
    // Check if we're on the correct page
    if (!courseId) {
      console.error("No courseId found in URL");
      toast.error("Course not found");
      navigate('/dashboard/courses');
    }
  }, [courseId, navigate]);

  const handleEnroll = async () => {
    try {
      if (!courseId) return;
      
      await updateCourseProgress(courseId, 0, 0);
      toast.success("Successfully enrolled in the course!");
      setIsEnrolled(true);
      refetchProgress();
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error("Failed to enroll in the course. Please try again.");
    }
  };

  const handleLessonComplete = async (lessonIndex: number) => {
    try {
      if (!courseId || !course) return;
      
      const totalLessons = course.lessons_count;
      const newIndex = Math.min(lessonIndex + 1, totalLessons - 1);
      const newProgress = Math.min(Math.round(((newIndex + 1) / totalLessons) * 100), 100);
      
      await updateCourseProgress(courseId, newProgress, newIndex);
      
      setUserProgress(newProgress);
      setCurrentLessonIndex(newIndex + 1); // Add 1 because currentLessonIndex is 1-based
      
      if (newProgress === 100) {
        setHasCompletedCourse(true);
        toast.success("Congratulations! You've completed the course!");
      } else {
        toast.success("Progress saved successfully!");
      }
      
      refetchProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error("Failed to update progress. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] w-full">
        <div className="text-center">
          <div className="relative flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">Loading course content...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col justify-center items-center h-96 p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-xl text-red-600 dark:text-red-400 font-semibold mb-4">Error loading course content</p>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">We couldn't retrieve the course details. Please try again later.</p>
        <button 
          onClick={() => navigate('/dashboard/courses')}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 shadow-lg transition-all duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Return to Courses
        </button>
      </div>
    );
  }

  // Calculate certificate date from certificate data if available
  const certificateDate = certificate?.earned_date || '';

  return (
    <div className="container mx-auto py-6 px-4 space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 p-6 rounded-xl shadow-md">
        <CourseHeader course={course} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 order-2 lg:order-1">
          <Card className="border-none overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <CourseTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                courseId={courseId || ''}
                courseName={course.title}
                field={course.field}
                level={course.level}
                hasCompletedCourse={hasCompletedCourse}
                currentLessonIndex={currentLessonIndex}
                setCurrentLessonIndex={setCurrentLessonIndex}
                onLessonComplete={handleLessonComplete}
                userProgress={userProgress}
                certificateDate={certificateDate}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-4 order-1 lg:order-2">
          <div className="sticky top-24">
            <CourseProgress
              isEnrolled={isEnrolled}
              userProgress={userProgress}
              hasCompletedCourse={hasCompletedCourse}
              hasCertificate={hasCertificate}
              onEnroll={handleEnroll}
              onViewCertificate={() => setActiveTab('certificate')}
              onContinueLearning={() => setActiveTab('materials')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
