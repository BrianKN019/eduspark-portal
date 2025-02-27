
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Play, Clock, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

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
  const maxAccessibleLesson = Math.ceil((userProgress / 100) * lessons.length);
  
  const handlePrevious = () => {
    setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1));
  };
  
  const handleNext = () => {
    const nextIndex = Math.min(lessons.length - 1, currentLessonIndex + 1);
    setCurrentLessonIndex(nextIndex);
  };
  
  const handleComplete = () => {
    onLessonComplete(currentLessonIndex);
  };
  
  const isCompletable = (currentLessonIndex + 1) <= maxAccessibleLesson;
  
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
        {/* Lesson Navigator */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Lessons</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              <div className="space-y-2">
                {lessons.map((lesson, index) => {
                  const isAccessible = index <= maxAccessibleLesson;
                  const isActive = index === currentLessonIndex;
                  const isCompleted = index < maxAccessibleLesson;
                  
                  return (
                    <div 
                      key={index}
                      className={`p-3 rounded-md flex items-center transition-colors cursor-pointer ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : isAccessible 
                          ? 'hover:bg-gray-100 dark:hover:bg-gray-800' 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => isAccessible && setCurrentLessonIndex(index)}
                    >
                      <div className="w-6 h-6 mr-2 flex items-center justify-center">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{lesson.title}</p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="mr-1 h-3 w-3" /> 
                          {lesson.duration}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                {isCompletable && (
                  <Button 
                    onClick={handleComplete}
                    variant="default"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
                  </Button>
                )}
                <Button 
                  onClick={handleNext}
                  disabled={currentLessonIndex === lessons.length - 1}
                  variant={isCompletable ? "outline" : "default"}
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
