import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, CheckCircle, Award, ArrowLeft, FileText, AlignLeft, PenTool, Star, BrainCircuit } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { fetchCourseById, updateCourseProgress } from '@/lib/api';
import CourseMaterial from '@/components/course/CourseMaterial';
import CourseNotes from '@/components/course/CourseNotes';
import CourseAssessment from '@/components/course/CourseAssessment';
import Certificate from '@/components/course/Certificate';

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
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            console.error("Error fetching course progress:", error);
          }
          return null;
        }
        
        return data;
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
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            console.error("Error fetching certificate:", error);
          }
          return null;
        }
        
        return data;
      } catch (e) {
        console.error("Exception in certificate query:", e);
        return null;
      }
    },
    enabled: !!courseId,
  });

  useEffect(() => {
    if (progress) {
      setUserProgress(progress.progress_percentage);
      setIsEnrolled(true);
      setHasCompletedCourse(progress.completed);
      if (progress.current_lesson_index !== undefined) {
        setCurrentLessonIndex(progress.current_lesson_index);
      }
    }

    if (certificate) {
      setHasCertificate(true);
    }
  }, [progress, certificate]);

  const handleEnroll = async () => {
    try {
      if (!courseId) return;
      
      const result = await updateCourseProgress(courseId, 0);
      console.log("Enrollment result:", result);
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
      const newProgress = Math.min(Math.round(((lessonIndex + 1) / totalLessons) * 100), 100);
      
      await updateCourseProgress(courseId, newProgress, lessonIndex);
      setUserProgress(newProgress);
      
      if (newProgress === 100) {
        setHasCompletedCourse(true);
        toast.success("Congratulations! You've completed the course!");
      } else {
        toast.success("Lesson completed!");
      }
      refetchProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error("Failed to update progress. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-lg">Loading course...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <p className="text-lg text-red-500">Error loading course. Please try again later.</p>
        <Button 
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/courses')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>
      </div>
    );
  }

  const lessons = [
    { title: "Introduction to the Course", duration: "10 min" },
    { title: "Core Concepts and Principles", duration: "25 min" },
    { title: "Practical Applications", duration: "30 min" },
    { title: "Advanced Techniques", duration: "40 min" },
    { title: "Real-world Case Studies", duration: "35 min" },
    { title: "Final Project Overview", duration: "15 min" }
  ];

  return (
    <div className="container mx-auto py-6 px-4 space-y-8">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline"
          onClick={() => navigate('/courses')}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{course.description}</p>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <span className="inline-flex items-center text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 py-1 rounded-full">
              <BookOpen className="mr-1 h-4 w-4" />
              {course.field}
            </span>
            <span className="inline-flex items-center text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-3 py-1 rounded-full">
              <Users className="mr-1 h-4 w-4" />
              {course.level}
            </span>
            <span className="inline-flex items-center text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-800 px-3 py-1 rounded-full">
              <Clock className="mr-1 h-4 w-4" />
              {course.lessons_count} Lessons
            </span>
            <span className="inline-flex items-center text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 px-3 py-1 rounded-full">
              <Star className="mr-1 h-4 w-4" />
              {course.rating.toFixed(1)} ({course.reviews_count} reviews)
            </span>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {isEnrolled ? (
                <>
                  <Progress value={userProgress} className="h-2" />
                  <p className="text-sm mt-2">{userProgress}% completed</p>
                  {hasCompletedCourse && (
                    <div className="mt-4 flex items-center text-green-600">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Course completed
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm">Enroll to track your progress</p>
              )}
            </CardContent>
            <CardFooter>
              {!isEnrolled ? (
                <Button onClick={handleEnroll} className="w-full">
                  Enroll Now
                </Button>
              ) : hasCompletedCourse ? (
                <Button 
                  onClick={() => setActiveTab('certificate')} 
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                >
                  <Award className="mr-2 h-4 w-4" /> View Certificate
                </Button>
              ) : (
                <Button 
                  onClick={() => setActiveTab('materials')} 
                  className="w-full"
                >
                  Continue Learning
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="materials" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" /> Materials
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" /> Notes
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center">
            <BrainCircuit className="mr-2 h-4 w-4" /> Assessments
          </TabsTrigger>
          <TabsTrigger value="certificate" className="flex items-center" disabled={!hasCompletedCourse}>
            <Award className="mr-2 h-4 w-4" /> Certificate
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="materials">
          <CourseMaterial 
            courseId={courseId || ''}
            lessons={lessons}
            currentLessonIndex={currentLessonIndex}
            setCurrentLessonIndex={setCurrentLessonIndex}
            onLessonComplete={handleLessonComplete}
            userProgress={userProgress}
            courseName={course.title}
          />
        </TabsContent>
        
        <TabsContent value="notes">
          <CourseNotes courseId={courseId || ''} />
        </TabsContent>
        
        <TabsContent value="assessments">
          <CourseAssessment 
            courseId={courseId || ''} 
            courseName={course.title}
            field={course.field}
            level={course.level}
          />
        </TabsContent>
        
        <TabsContent value="certificate">
          <Certificate 
            courseId={courseId || ''} 
            courseName={course.title} 
            completionDate={certificate?.earned_date || new Date().toISOString()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetail;
