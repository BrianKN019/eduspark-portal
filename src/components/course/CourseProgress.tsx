
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, CheckCircle, Clock, Download, Sparkles, TrendingUp } from 'lucide-react';

interface CourseProgressProps {
  isEnrolled: boolean;
  userProgress: number;
  hasCompletedCourse: boolean;
  hasCertificate: boolean;
  onEnroll: () => void;
  onViewCertificate: () => void;
  onContinueLearning: () => void;
}

const CourseProgress: React.FC<CourseProgressProps> = ({
  isEnrolled,
  userProgress,
  hasCompletedCourse,
  hasCertificate,
  onEnroll,
  onViewCertificate,
  onContinueLearning
}) => {
  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (!isEnrolled) {
    return (
      <Card className="overflow-hidden border border-blue-100 dark:border-blue-900 bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-blue-900 dark:text-blue-100 font-bold flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Start Your Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6 text-center">
            <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-white dark:bg-gray-800 border-4 border-blue-100 dark:border-blue-900 mb-4">
              <Sparkles className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Unlock Course Content
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Enroll now to access all lessons, assessments, and earn a certificate upon completion.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">Structured learning path</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">AI-powered assessments</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">Course completion certificate</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">Progress tracking</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button 
            onClick={onEnroll} 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 shadow-lg transition-all"
          >
            Enroll Now
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (hasCompletedCourse) {
    return (
      <Card className="overflow-hidden border border-green-100 dark:border-green-900 bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-green-900 dark:text-green-100 font-bold flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-500" />
            Course Completed!
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto relative mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 animate-pulse opacity-30"></div>
              <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                <Award className="h-12 w-12 text-yellow-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Congratulations!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              You've successfully completed this course with {userProgress}% progress.
            </p>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm font-medium mb-1">
              <span className="text-gray-600 dark:text-gray-300">Progress</span>
              <span className="text-green-600 dark:text-green-400">{userProgress}%</span>
            </div>
            <Progress value={userProgress} className="h-2" />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-2 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-100">Achievement Unlocked</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Course Completion Badge Added</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-2">
          {hasCertificate ? (
            <Button 
              onClick={onViewCertificate} 
              variant="outline"
              className="w-full border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/30 flex items-center justify-center gap-2"
            >
              <Award className="h-4 w-4" />
              View Certificate
            </Button>
          ) : (
            <Button
              onClick={onContinueLearning}
              variant="outline"
              className="w-full border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              Review Materials
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border border-blue-100 dark:border-blue-900 bg-white dark:bg-gray-900 shadow-xl transition-all duration-300">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-100 dark:border-blue-900">
        <CardTitle className="text-xl text-blue-900 dark:text-blue-100 font-bold flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="py-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center">
            <div className="relative">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                <circle 
                  className="text-gray-200 dark:text-gray-700" 
                  strokeWidth="8" 
                  stroke="currentColor" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                />
                <circle 
                  className={`${getProgressColor(userProgress)} transition-all duration-1000 ease-in-out`}
                  strokeWidth="8" 
                  strokeLinecap="round"
                  stroke="currentColor" 
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50"
                  strokeDasharray={`${userProgress * 2.51} 251`}
                  strokeDashoffset="0" 
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{userProgress}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Course Progress</span>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full">
              {userProgress}%
            </div>
          </div>
          
          <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500 dark:text-orange-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Estimated time left</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              {Math.ceil((100 - userProgress) / 10)} hours
            </div>
          </div>
          
          <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Certificate</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              {userProgress >= 100 ? 'Earned' : 'In progress'}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button 
          onClick={onContinueLearning}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-2.5"
        >
          Continue Learning
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseProgress;
