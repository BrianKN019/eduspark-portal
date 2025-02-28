
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Play, Clock, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { Stepper, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from "@/components/ui/stepper";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface CourseMaterialProps {
  course: any;
  lessons: { title: string; duration: string }[];
  currentLessonIndex: number;
  setCurrentLessonIndex: (index: number) => void;
  onLessonComplete: (index: number) => void;
  userProgress: number;
}

const CourseMaterial: React.FC<CourseMaterialProps> = ({
  course,
  lessons,
  currentLessonIndex,
  setCurrentLessonIndex,
  onLessonComplete,
  userProgress
}) => {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const maxAccessibleLesson = Math.ceil((userProgress / 100) * lessons.length);
  
  // Fetch completed lessons on component mount
  useEffect(() => {
    const fetchCompletedLessons = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data, error } = await supabase
          .from('course_progress')
          .select('completed_lessons')
          .eq('user_id', user.id)
          .eq('course_id', course?.id)
          .single();
          
        if (!error && data) {
          setCompletedLessons(Array.isArray(data.completed_lessons) ? data.completed_lessons : []);
        }
      } catch (e) {
        console.error("Error fetching completed lessons:", e);
      }
    };
    
    if (course?.id) {
      fetchCompletedLessons();
    }
  }, [course?.id]);
  
  const handlePrevious = () => {
    setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1));
  };
  
  const handleNext = () => {
    const nextIndex = Math.min(lessons.length - 1, currentLessonIndex + 1);
    setCurrentLessonIndex(nextIndex);
  };
  
  const handleComplete = async () => {
    // Only allow completing lessons up to the maxAccessibleLesson
    if ((currentLessonIndex + 1) <= maxAccessibleLesson) {
      // Check if this lesson is already completed
      if (!completedLessons.includes(currentLessonIndex)) {
        // Add the lesson to completed lessons
        const updatedCompletedLessons = [...completedLessons, currentLessonIndex];
        setCompletedLessons(updatedCompletedLessons);
        
        // Call the parent component's onLessonComplete function
        onLessonComplete(currentLessonIndex);
        
        // Calculate the new progress percentage
        // Each lesson contributes equally to 70% of the course
        // The assessment contributes the remaining 30%
        const lessonProgress = (updatedCompletedLessons.length / lessons.length) * 70;
        
        // Update the progress in the database
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          const { error } = await supabase
            .from('course_progress')
            .update({ 
              completed_lessons: updatedCompletedLessons,
              progress_percentage: Math.round(lessonProgress),
              last_accessed: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .eq('course_id', course?.id);
          
          if (error) {
            console.error("Error updating course progress:", error);
            toast.error("Failed to update progress");
          } else {
            toast.success("Lesson completed!");
            
            // Move to next lesson if available
            if (currentLessonIndex < lessons.length - 1) {
              handleNext();
            }
          }
        } catch (e) {
          console.error("Error in handleComplete:", e);
          toast.error("An error occurred");
        }
      } else {
        toast.info("You've already completed this lesson");
      }
    } else {
      toast.error("You need to progress further in the course to complete this lesson");
    }
  };
  
  // Get the stepper value (current step)
  const currentStep = currentLessonIndex + 1;
  
  // Check if current lesson is completable
  const isCompletable = (currentLessonIndex + 1) <= maxAccessibleLesson;
  
  // Check if current lesson is already completed
  const isLessonCompleted = (index: number) => Array.isArray(completedLessons) && completedLessons.includes(index);
  
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl">Course Materials</CardTitle>
          <CardDescription>
            Access your learning materials and track your progress through the course.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lesson Navigator with Stepper */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${userProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-right mt-1">{userProgress}% Complete</p>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              <Stepper value={currentStep} orientation="vertical">
                {lessons.map((lesson, index) => {
                  const isAccessible = index <= maxAccessibleLesson;
                  const isActive = index === currentLessonIndex;
                  const isCompleted = isLessonCompleted(index);
                  
                  return (
                    <StepperItem 
                      key={index} 
                      step={index + 1} 
                      completed={isCompleted}
                      className="relative items-start not-last:pb-4"
                    >
                      <StepperTrigger 
                        className={`items-start rounded pb-12 last:pb-0 w-full text-left ${
                          !isAccessible ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        onClick={() => isAccessible && setCurrentLessonIndex(index)}
                        disabled={!isAccessible}
                      >
                        <StepperIndicator>
                          {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                        </StepperIndicator>
                        <div className="ml-3 mt-0.5">
                          <StepperTitle>{lesson.title}</StepperTitle>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <Clock className="mr-1 h-3 w-3" /> 
                            {lesson.duration}
                          </div>
                        </div>
                      </StepperTrigger>
                      {index < lessons.length - 1 && (
                        <StepperSeparator className="absolute left-3 top-[calc(1.5rem+0.125rem)] -translate-x-1/2 h-[calc(100%-1.5rem-0.25rem)]" />
                      )}
                    </StepperItem>
                  );
                })}
              </Stepper>
            </CardContent>
          </Card>
        </div>
        
        {/* Lesson Content */}
        <div className="md:col-span-2">
          <Card className="min-h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle>
                Lesson {currentLessonIndex + 1}: {lessons[currentLessonIndex].title}
              </CardTitle>
              <CardDescription className="flex items-center">
                <Clock className="mr-1 h-4 w-4" /> 
                {lessons[currentLessonIndex].duration}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="prose dark:prose-invert max-w-none">
                <h3>Overview</h3>
                <p>
                  This lesson covers the key concepts and practical knowledge related to {lessons[currentLessonIndex].title.toLowerCase()}.
                  You'll learn about the fundamental principles and how to apply them in real-world scenarios.
                </p>
                
                <h3>Learning Objectives</h3>
                <ul>
                  <li>Understand the core concepts related to this topic</li>
                  <li>Learn how to apply these principles in practical situations</li>
                  <li>Gain hands-on experience through interactive examples</li>
                  <li>Develop problem-solving skills specific to this area</li>
                </ul>
                
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-4">
                  <h4 className="flex items-center text-lg font-medium mb-2">
                    <Play className="mr-2 h-4 w-4" /> Video Lecture
                  </h4>
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Video content for "{lessons[currentLessonIndex].title}"</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    This video lecture provides a comprehensive overview of the lesson material.
                  </p>
                </div>
                
                <h3>Key Takeaways</h3>
                <p>
                  After completing this lesson, you should be able to:
                </p>
                <ul>
                  <li>Explain the main concepts covered in the lesson</li>
                  <li>Apply the techniques in different scenarios</li>
                  <li>Analyze problems using the frameworks introduced</li>
                  <li>Evaluate solutions based on the lesson principles</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between mt-auto pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentLessonIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <div className="flex space-x-2">
                {isCompletable && !isLessonCompleted(currentLessonIndex) && (
                  <Button 
                    onClick={handleComplete}
                    variant="default"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
                  </Button>
                )}
                {isLessonCompleted(currentLessonIndex) && (
                  <Button variant="outline" disabled>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Completed
                  </Button>
                )}
                <Button 
                  onClick={handleNext}
                  disabled={currentLessonIndex === lessons.length - 1}
                  variant={isCompletable && !isLessonCompleted(currentLessonIndex) ? "outline" : "default"}
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseMaterial;
