
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, BookOpen, Video, FileText, Code, PenTool, ChevronLeft, ChevronRight } from 'lucide-react';
import { updateCourseProgress } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Sample course content structure - in a real app, this would come from an API
const courseMaterials = [
  {
    title: 'Introduction',
    type: 'video',
    icon: <Video className="h-5 w-5 text-blue-500" />,
    content: <div className="prose dark:prose-invert max-w-none">
      <p>Welcome to this course! In this introduction, we'll cover the basic concepts and what you can expect to learn.</p>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 flex items-center justify-center">
        <Video className="h-10 w-10 text-blue-500 mr-2" />
        <span className="text-gray-600 dark:text-gray-300">Video content would load here</span>
      </div>
      <p>Make sure to complete all modules to get the most out of this course experience.</p>
    </div>
  },
  {
    title: 'Core Concepts',
    type: 'text',
    icon: <FileText className="h-5 w-5 text-green-500" />,
    content: <div className="prose dark:prose-invert max-w-none">
      <h3>Important Fundamentals</h3>
      <p>Let's dive into the core concepts that form the foundation of this subject. These concepts are essential for understanding the more advanced topics we'll cover later.</p>
      <ul>
        <li>Concept 1: Basic structures and patterns</li>
        <li>Concept 2: Key methodologies and approaches</li>
        <li>Concept 3: Standard practices in the industry</li>
      </ul>
      <p>Understanding these fundamentals will help you build a strong mental model of how everything fits together.</p>
    </div>
  },
  {
    title: 'Practical Examples',
    type: 'code',
    icon: <Code className="h-5 w-5 text-purple-500" />,
    content: <div className="prose dark:prose-invert max-w-none">
      <h3>Code Examples</h3>
      <p>Let's look at some practical examples to reinforce the concepts we've learned.</p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">
          {`// Example implementation
function calculateResult(data) {
  let result = 0;
  
  // Process the data
  for (const item of data) {
    result += item.value * item.weight;
  }
  
  return result;
}`}
        </code>
      </pre>
      <p>Try running this code with different inputs to see how it behaves.</p>
    </div>
  },
  {
    title: 'Practice Exercise',
    type: 'exercise',
    icon: <PenTool className="h-5 w-5 text-orange-500" />,
    content: <div className="prose dark:prose-invert max-w-none">
      <h3>Interactive Exercise</h3>
      <p>Now it's time to apply what you've learned with a hands-on exercise.</p>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
        <h4 className="font-medium text-lg">Your Task:</h4>
        <p>Modify the code example from the previous section to handle negative values differently. Specifically:</p>
        <ul>
          <li>If an item has a negative value, it should be treated as zero.</li>
          <li>Keep track of how many negative values were encountered.</li>
          <li>Return both the result and the count of negative values.</li>
        </ul>
        <div className="mt-4">
          <p className="font-medium">Submit your solution:</p>
          <textarea 
            className="w-full h-32 p-2 border rounded-md bg-white dark:bg-gray-700 mt-2 font-mono text-sm"
            placeholder="Write your solution here..."
          ></textarea>
        </div>
      </div>
    </div>
  },
  {
    title: 'Conclusion',
    type: 'text',
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    content: <div className="prose dark:prose-invert max-w-none">
      <h3>Summary of What We've Learned</h3>
      <p>Congratulations on completing this module! Let's summarize what we've covered:</p>
      <ul>
        <li>The fundamental concepts and their importance</li>
        <li>Practical implementation details through code examples</li>
        <li>Hands-on experience through interactive exercises</li>
      </ul>
      <p>In the next module, we'll build on these foundations to explore more advanced topics. Make sure you feel comfortable with the material here before moving on.</p>
      <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg my-4 border-l-4 border-green-500">
        <p className="font-medium text-green-700 dark:text-green-400">You've completed this section! Mark it as complete to track your progress.</p>
      </div>
    </div>
  }
];

interface CourseMaterialProps {
  courseId: string;
  currentLessonIndex: number;
  setCurrentLessonIndex: React.Dispatch<React.SetStateAction<number>>;
  onLessonComplete?: (lessonIndex: number) => Promise<void>;
  userProgress?: number;
  courseName?: string;
  initialProgress?: number;
  onProgressUpdate?: (progress: number) => void;
}

const CourseMaterial: React.FC<CourseMaterialProps> = ({ 
  courseId,
  currentLessonIndex,
  setCurrentLessonIndex,
  onLessonComplete,
  userProgress = 0,
  courseName = "Course Material",
  initialProgress = 0,
  onProgressUpdate
}) => {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const totalSteps = courseMaterials.length;
  
  useEffect(() => {
    fetchCompletedLessons();
  }, [courseId]);
  
  const fetchCompletedLessons = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('course_progress')
        .select('completed_lessons, assessment_score')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
      
      if (error) {
        console.error('Error fetching completed lessons:', error);
        return;
      }
      
      if (data?.completed_lessons) {
        setCompletedLessons(data.completed_lessons);
        
        // If user has completed lessons, show the next uncompleted one
        if (data.completed_lessons.length > 0 && currentLessonIndex === 0) {
          // Find the first lesson that has not been completed
          let nextUncompleted = 0;
          for (let i = 0; i < totalSteps; i++) {
            if (!data.completed_lessons.includes(i)) {
              nextUncompleted = i;
              break;
            }
          }
          // Ensure we only set the current lesson index once during initialization
          setTimeout(() => {
            setCurrentLessonIndex(nextUncompleted + 1); // +1 because steps are 1-indexed
          }, 0);
        }
      }
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
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
      
      // Update progress in the database
      await updateCourseProgress(courseId, totalProgress, lessonIndex);
      
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
  
  const handleNext = () => {
    if (currentLessonIndex < totalSteps) {
      // First mark the current lesson as complete
      const currentIndex = currentLessonIndex - 1;
      if (!completedLessons.includes(currentIndex)) {
        if (onLessonComplete) {
          onLessonComplete(currentIndex).then(() => {
            // Only move to next lesson after completion is confirmed
            setCurrentLessonIndex(prevIndex => prevIndex + 1);
          }).catch(error => {
            console.error('Error completing lesson:', error);
            toast.error('Failed to complete lesson');
          });
        } else {
          markLessonComplete(currentIndex);
          // Move to next lesson after marking complete
          setCurrentLessonIndex(prevIndex => prevIndex + 1);
        }
      } else {
        // If already completed, just move to next
        setCurrentLessonIndex(prevIndex => prevIndex + 1);
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentLessonIndex > 1) {
      setCurrentLessonIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handleStepClick = (step: number) => {
    // Only allow clicking on completed steps or the next available step
    if (step <= completedLessons.length + 1 || completedLessons.includes(step - 1)) {
      setCurrentLessonIndex(step);
    } else {
      toast.info('Complete previous lessons first');
    }
  };
  
  // Add a safeguard to ensure currentLessonIndex is valid
  const safeCurrentIndex = Math.max(1, Math.min(currentLessonIndex, totalSteps));
  
  // Safely access the current material
  const currentMaterial = courseMaterials[safeCurrentIndex - 1] || courseMaterials[0];

  // Calculate material progress percentage (just for the stepper display)
  const materialProgressPercentage = completedLessons.length > 0
    ? Math.round((completedLessons.length / totalSteps) * 100)
    : 0;

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-900 transition-all duration-300">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950 rounded-t-lg">
        <CardTitle className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
          {courseName}
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
                const isActive = stepNumber === safeCurrentIndex;
                const isCompleted = completedLessons.includes(index);
                const isClickable = isCompleted || stepNumber <= completedLessons.length + 1;
                
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
                        </div>
                        
                        {isActive && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {material.type === 'video' && 'Watch the introduction video'}
                            {material.type === 'text' && 'Read through the learning materials'}
                            {material.type === 'code' && 'Explore the code examples'}
                            {material.type === 'exercise' && 'Complete the practice exercise'}
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
              <div className="prose dark:prose-invert max-w-none">
                {currentMaterial.content}
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrevious}
                disabled={safeCurrentIndex === 1}
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {safeCurrentIndex < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (onLessonComplete) {
                      onLessonComplete(safeCurrentIndex - 1);
                    } else {
                      markLessonComplete(safeCurrentIndex - 1);
                    }
                  }}
                  disabled={completedLessons.includes(safeCurrentIndex - 1)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {completedLessons.includes(safeCurrentIndex - 1) ? 
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
