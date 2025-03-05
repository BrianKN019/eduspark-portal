
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BookOpen, Video, FileText, Code, PenTool, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { updateCourseProgress } from '@/lib/api';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface LessonContent {
  title: string;
  type: 'video' | 'text' | 'code' | 'exercise' | 'conclusion';
  icon: React.ReactNode;
  content: React.ReactNode | string;
  isLoading?: boolean;
}

interface CourseMaterialProps {
  courseId: string;
  currentLessonIndex: number;
  setCurrentLessonIndex: React.Dispatch<React.SetStateAction<number>>;
  onLessonComplete?: (lessonIndex: number) => Promise<void>;
  userProgress?: number;
  courseName?: string;
  initialProgress?: number;
  onProgressUpdate?: (progress: number) => void;
  field?: string;
  level?: string;
}

const CourseMaterial: React.FC<CourseMaterialProps> = ({ 
  courseId,
  currentLessonIndex,
  setCurrentLessonIndex,
  onLessonComplete,
  userProgress = 0,
  courseName = "Course Material",
  initialProgress = 0,
  onProgressUpdate,
  field = "General",
  level = "Beginner"
}) => {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [displayedLessonIndex, setDisplayedLessonIndex] = useState<number>(0);
  const [courseMaterials, setCourseMaterials] = useState<LessonContent[]>([
    {
      title: 'Introduction',
      type: 'video',
      icon: <Video className="h-5 w-5 text-blue-500" />,
      content: 'Loading course content...',
      isLoading: true
    },
    {
      title: 'Core Concepts',
      type: 'text',
      icon: <FileText className="h-5 w-5 text-green-500" />,
      content: 'Loading course content...',
      isLoading: true
    },
    {
      title: 'Practical Examples',
      type: 'code',
      icon: <Code className="h-5 w-5 text-purple-500" />,
      content: 'Loading course content...',
      isLoading: true
    },
    {
      title: 'Practice Exercise',
      type: 'exercise',
      icon: <PenTool className="h-5 w-5 text-orange-500" />,
      content: 'Loading course content...',
      isLoading: true
    },
    {
      title: 'Conclusion',
      type: 'conclusion',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      content: 'Loading course content...',
      isLoading: true
    }
  ]);
  
  const totalSteps = courseMaterials.length;
  
  useEffect(() => {
    // Ensure we're showing the correct lesson based on currentLessonIndex
    // currentLessonIndex is 1-based, but displayedLessonIndex needs to be 0-based for array indexing
    if (currentLessonIndex > 0) {
      setDisplayedLessonIndex(currentLessonIndex - 1);
    }
  }, [currentLessonIndex]);
  
  useEffect(() => {
    fetchCompletedLessons();
    generateCourseMaterial();
  }, [courseId]);
  
  const fetchCompletedLessons = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('course_progress')
        .select('completed_lessons, assessment_score, current_lesson_index')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
      
      if (error) {
        console.error('Error fetching completed lessons:', error);
        return;
      }
      
      if (data?.completed_lessons) {
        setCompletedLessons(data.completed_lessons);
        
        // If user has a saved current lesson index, use it
        if (data.current_lesson_index !== null && data.current_lesson_index !== undefined) {
          setDisplayedLessonIndex(data.current_lesson_index);
          // Set the current lesson index to match the database
          setCurrentLessonIndex(data.current_lesson_index + 1); // +1 because currentLessonIndex is 1-based
        }
      }
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
    }
  };

  // Generate Python Automation custom prompts based on lesson type
  const getPythonAutomationPrompt = (lessonType: string, title: string, level: string): string => {
    const steps = [
      "Knowledge Assessment",
      "Learning Path Design",
      "Resource Curation",
      "Practice Framework",
      "Progress Tracking System",
      "Study Schedule Generation"
    ];
    
    // Get the appropriate step for this lesson
    const stepIndex = displayedLessonIndex < steps.length ? displayedLessonIndex : steps.length - 1;
    const currentStep = `Step ${stepIndex + 1}: ${steps[stepIndex]}`;
    
    // Common context for all prompts
    const context = `
You are creating materials for a Python Automation course at the ${level} level.
The course is designed for students who can dedicate 15 weekly hours to learning.
Students will use a combination of visual, hands-on, and reading materials.
Their goal is to learn beginner and intermediate Python automation skills.

Create content for "${currentStep}" related to "${title}".
Format your response in markdown with clear sections, code examples where appropriate.
`;
    
    if (lessonType === 'video') {
      return `${context}
      
Create a comprehensive video script introducing Python Automation fundamentals. 
Focus on the following aspects:
1. What this step covers and why it's important for Python Automation
2. Key concepts that will be introduced
3. How this fits into the overall learning journey
4. What students will be able to do after mastering these concepts

Make this engaging and motivational for visual learners.`;
    }
    
    if (lessonType === 'text') {
      return `${context}
      
Create detailed educational text content covering:
1. Detailed breakdown of ${currentStep}
2. Explanation of core concepts and terminology
3. How this applies specifically to Python Automation
4. Common pitfalls and how to avoid them
5. Real-world relevance and applications

Include bullet points for key concepts and make complex ideas accessible.`;
    }
    
    if (lessonType === 'code') {
      return `${context}
      
Provide practical Python code examples demonstrating:
1. Key automation techniques related to ${currentStep}
2. Common automation patterns and best practices
3. Step-by-step explanation of each code sample
4. How to modify the code for different scenarios

Include well-commented code blocks with explanations before and after each example.`;
    }
    
    if (lessonType === 'exercise') {
      return `${context}
      
Design 3-5 practical exercises for Python Automation related to ${currentStep}:
1. Create progressive challenges from basic to advanced
2. Provide clear instructions for each exercise
3. Include expected outcomes and success criteria
4. Offer hints for students who get stuck
5. Show sample solutions with explanations

Make exercises practical and relevant to real-world automation tasks.`;
    }
    
    // Conclusion
    return `${context}
    
Create a comprehensive summary of ${title} focusing on:
1. Key takeaways from ${currentStep}
2. How this connects to other parts of Python Automation
3. Next steps in the learning journey
4. Practical applications of what was learned
5. Resources for further exploration

Reinforce the most important concepts and provide a clear path forward.`;
  };

  const generateCourseMaterial = async () => {
    try {
      const { data: course } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (!course) {
        toast.error("Failed to find course data");
        return;
      }

      const lessonTypes = ['video', 'text', 'code', 'exercise', 'conclusion'];
      
      // Generate content for each lesson
      const updatedMaterials = [...courseMaterials];
      
      for (let i = 0; i < lessonTypes.length; i++) {
        try {
          // Mark this lesson as loading
          updatedMaterials[i] = {
            ...updatedMaterials[i],
            isLoading: true
          };
          setCourseMaterials([...updatedMaterials]);
          
          // Check if this is a Python Automation course to use custom prompts
          const isPythonAutomation = course.title.toLowerCase().includes('python') && 
                                    course.title.toLowerCase().includes('automation');
          
          // Generate custom prompt for Python Automation
          const customPrompt = isPythonAutomation 
            ? getPythonAutomationPrompt(lessonTypes[i], course.title, course.level || level)
            : undefined;
          
          // Generate content using OpenAI
          const response = await supabase.functions.invoke('generate-course-material', {
            body: {
              courseId,
              title: course.title,
              field: course.field || field,
              level: course.level || level,
              lessonIndex: i,
              lessonType: lessonTypes[i],
              customPrompt
            }
          });
          
          if (response.error) {
            throw new Error(response.error);
          }
          
          // Update with generated content
          updatedMaterials[i] = {
            ...updatedMaterials[i],
            content: response.data.content,
            isLoading: false
          };
          
          setCourseMaterials([...updatedMaterials]);
        } catch (error) {
          console.error(`Error generating material for lesson ${i}:`, error);
          updatedMaterials[i] = {
            ...updatedMaterials[i],
            content: `Failed to load content. Please try again later. Error: ${error.message}`,
            isLoading: false
          };
          setCourseMaterials([...updatedMaterials]);
        }
      }
    } catch (error) {
      console.error('Error generating course materials:', error);
      toast.error("Failed to generate course materials");
    }
  };
  
  const markLessonComplete = async (lessonIndex: number) => {
    try {
      // Prevent duplicate marking of completed lessons
      if (completedLessons.includes(lessonIndex)) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to track progress');
        return;
      }
      
      // Add the current lesson to completed lessons
      const updatedCompletedLessons = [...new Set([...completedLessons, lessonIndex])];
      setCompletedLessons(updatedCompletedLessons);
      
      // Get the user's assessment score for this course
      const { data: progressData } = await supabase
        .from('course_progress')
        .select('assessment_score')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
      
      const assessmentScore = progressData?.assessment_score || 0;
      
      // Calculate material progress (30% of total)
      const materialProgressPercentage = Math.round((updatedCompletedLessons.length / totalSteps) * 100);
      const materialContribution = (materialProgressPercentage / 100) * 30;
      
      // Calculate assessment contribution (70% of total if score is >= 70%, otherwise proportional)
      const assessmentContribution = assessmentScore >= 70 
        ? 70 // Full contribution if passed with 70% or higher
        : (assessmentScore / 100) * 70; // Proportional contribution
      
      // Calculate total progress
      const totalProgress = Math.round(materialContribution + assessmentContribution);
      
      // Update progress in the database including the current lesson index
      await updateCourseProgress(courseId, totalProgress, displayedLessonIndex);
      
      // Notify parent component
      if (onProgressUpdate) {
        onProgressUpdate(totalProgress);
      }
      
      toast.success('Progress saved successfully!');
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      toast.error('Failed to save progress');
    }
  };
  
  const handleNext = async () => {
    if (displayedLessonIndex < totalSteps - 1) {
      // First mark the current lesson as complete if not already completed
      if (!completedLessons.includes(displayedLessonIndex)) {
        if (onLessonComplete) {
          try {
            await onLessonComplete(displayedLessonIndex);
            // Move to next lesson after completion is confirmed
            const nextIndex = displayedLessonIndex + 1;
            setDisplayedLessonIndex(nextIndex);
            setCurrentLessonIndex(nextIndex + 1); // +1 because currentLessonIndex is 1-based
          } catch (error) {
            console.error('Error completing lesson:', error);
            toast.error('Failed to complete lesson');
          }
        } else {
          await markLessonComplete(displayedLessonIndex);
          // Move to next lesson after marking complete
          const nextIndex = displayedLessonIndex + 1;
          setDisplayedLessonIndex(nextIndex);
          setCurrentLessonIndex(nextIndex + 1); // +1 because currentLessonIndex is 1-based
        }
      } else {
        // If already completed, just move to next
        const nextIndex = displayedLessonIndex + 1;
        setDisplayedLessonIndex(nextIndex);
        setCurrentLessonIndex(nextIndex + 1); // +1 because currentLessonIndex is 1-based
      }
    }
  };
  
  const handlePrevious = () => {
    if (displayedLessonIndex > 0) {
      const prevIndex = displayedLessonIndex - 1;
      setDisplayedLessonIndex(prevIndex);
      setCurrentLessonIndex(prevIndex + 1); // +1 because currentLessonIndex is 1-based
    }
  };
  
  const handleStepClick = (step: number) => {
    // Only allow clicking on completed steps or the next available step
    const stepIndex = step - 1; // Convert 1-based step to 0-based index
    
    if (completedLessons.includes(stepIndex) || stepIndex <= Math.max(...completedLessons, -1) + 1) {
      setDisplayedLessonIndex(stepIndex);
      setCurrentLessonIndex(step); // Keep currentLessonIndex as 1-based
    } else {
      toast.info('Complete previous lessons first');
    }
  };
  
  // Safely access the current material using displayedLessonIndex
  const currentMaterial = courseMaterials[displayedLessonIndex] || courseMaterials[0];

  // Calculate material progress percentage (just for the stepper display)
  const materialProgressPercentage = completedLessons.length > 0
    ? Math.round((completedLessons.length / totalSteps) * 100)
    : 0;

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-900 transition-all duration-300">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950 rounded-t-lg">
        <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <span className="mr-2">{courseName}</span>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm py-1 px-2 rounded-md">
            Lesson {displayedLessonIndex + 1} of {totalSteps}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="border-r border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800 md:max-h-screen md:overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">Course Content</h3>
            
            {/* Improved Stepper Component */}
            <div className="space-y-4">
              {courseMaterials.map((material, index) => {
                const stepNumber = index + 1;
                const isActive = index === displayedLessonIndex;
                const isCompleted = completedLessons.includes(index);
                const isClickable = isCompleted || index <= Math.max(...completedLessons, -1) + 1;
                
                return (
                  <div key={index} className="relative">
                    {/* Progress connector */}
                    {index > 0 && (
                      <div className="absolute top-0 left-5 -translate-x-1/2 h-full w-0.5 -mt-3">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            completedLessons.includes(index-1) && (isCompleted || isActive) 
                              ? 'bg-gradient-to-b from-blue-500 to-purple-600' 
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        ></div>
                      </div>
                    )}
                    
                    {/* Step item */}
                    <div 
                      className={`relative flex items-start group transition-all duration-300 rounded-lg
                        ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 p-3' : 'p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30'}
                        ${!isClickable ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                      onClick={() => isClickable && handleStepClick(stepNumber)}
                    >
                      {/* Step circle */}
                      <div className="flex-shrink-0 relative z-10">
                        <div 
                          className={`flex items-center justify-center h-10 w-10 rounded-full transition-all duration-500 ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-md shadow-blue-500/20' 
                              : isActive 
                                ? 'bg-white dark:bg-gray-800 border-2 border-blue-500 shadow-md' 
                                : isClickable
                                  ? 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 group-hover:border-blue-300'
                                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-white animate-check" />
                          ) : (
                            <span className={`font-bold text-sm ${isActive ? 'text-blue-500' : isClickable ? 'text-gray-500 dark:text-gray-400 group-hover:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                              {stepNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="ml-4 flex-1">
                        <div className="flex items-center">
                          {material.icon}
                          <h4 className={`ml-2 font-medium ${
                            isActive 
                              ? 'text-blue-700 dark:text-blue-300' 
                              : isCompleted 
                                ? 'text-gray-700 dark:text-gray-300' 
                                : isClickable
                                  ? 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                  : 'text-gray-500 dark:text-gray-500'
                          }`}>
                            {material.title}
                          </h4>
                          {material.isLoading && (
                            <Loader2 className="ml-2 h-3 w-3 animate-spin text-blue-500" />
                          )}
                        </div>
                        
                        {isActive && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {material.type === 'video' && 'Watch the introduction video'}
                            {material.type === 'text' && 'Read through the learning materials'}
                            {material.type === 'code' && 'Explore the code examples'}
                            {material.type === 'exercise' && 'Complete the practice exercise'}
                            {material.type === 'conclusion' && 'Review what you\'ve learned'}
                          </p>
                        )}
                      </div>
                      
                      {/* Status indicator */}
                      {isCompleted && !isActive && (
                        <div className="ml-2 flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Progress bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Material Progress</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{materialProgressPercentage}%</span>
              </div>
              <Progress 
                value={materialProgressPercentage} 
                className="h-2 bg-gray-200 dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {completedLessons.length} of {totalSteps} lessons completed
              </p>
              
              <div className="flex justify-between text-sm mt-4">
                <span className="text-gray-600 dark:text-gray-400">Overall Course Progress</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{userProgress}%</span>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
                      30% Materials
                    </span>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-100 ml-3 dark:bg-purple-900 dark:text-purple-300">
                      70% Assessment
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                  <div style={{ width: `${Math.min((materialProgressPercentage / 100) * 30, 30)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
                  <div style={{ width: `${Math.min(userProgress - ((materialProgressPercentage / 100) * 30), 70)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:col-span-3 max-h-screen overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                {currentMaterial.icon}
                {currentMaterial.title}
              </h3>
              
              {currentMaterial.isLoading ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Generating course content...</p>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {typeof currentMaterial.content === 'string' 
                      ? currentMaterial.content 
                      : 'Content is not available in text format.'}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrevious}
                disabled={displayedLessonIndex === 0}
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {displayedLessonIndex < totalSteps - 1 ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={async () => {
                    if (onLessonComplete) {
                      await onLessonComplete(displayedLessonIndex);
                    } else {
                      await markLessonComplete(displayedLessonIndex);
                    }
                  }}
                  disabled={completedLessons.includes(displayedLessonIndex)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {completedLessons.includes(displayedLessonIndex) ? 
                    'Completed' : 
                    'Mark as Complete'}
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseMaterial;
