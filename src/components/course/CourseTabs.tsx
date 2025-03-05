
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, BrainCircuit, Award, CheckCircle, Sparkles } from 'lucide-react';
import CourseMaterial from './CourseMaterial';
import CourseNotes from './CourseNotes';
import CourseAssessment from './CourseAssessment';
import Certificate from './Certificate';

interface CourseTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  courseId: string;
  courseName: string;
  field: string;
  level: string;
  hasCompletedCourse: boolean;
  currentLessonIndex: number;
  setCurrentLessonIndex: React.Dispatch<React.SetStateAction<number>>;
  onLessonComplete: (lessonIndex: number) => Promise<void>;
  userProgress: number;
  certificateDate: string;
}

const CourseTabs: React.FC<CourseTabsProps> = ({
  activeTab,
  setActiveTab,
  courseId,
  courseName,
  field,
  level,
  hasCompletedCourse,
  currentLessonIndex,
  setCurrentLessonIndex,
  onLessonComplete,
  userProgress,
  certificateDate
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="flex w-full justify-between rounded-xl p-1 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-md border border-gray-200 dark:border-gray-700 mb-6">
        <TabsTrigger 
          value="materials" 
          className="flex-1 flex items-center justify-center gap-2 rounded-lg py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Course Materials</span>
          <span className="sm:hidden">Materials</span>
        </TabsTrigger>
        <TabsTrigger 
          value="notes" 
          className="flex-1 flex items-center justify-center gap-2 rounded-lg py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">My Notes</span>
          <span className="sm:hidden">Notes</span>
        </TabsTrigger>
        <TabsTrigger 
          value="assessments" 
          className="flex-1 flex items-center justify-center gap-2 rounded-lg py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
        >
          <BrainCircuit className="h-4 w-4" />
          <span className="hidden sm:inline">AI Assessments</span>
          <span className="sm:hidden">Tests</span>
        </TabsTrigger>
        <TabsTrigger 
          value="certificate" 
          disabled={!hasCompletedCourse}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 relative"
        >
          <Award className="h-4 w-4" />
          <span className="hidden sm:inline">Certificate</span>
          <span className="sm:hidden">Award</span>
          {hasCompletedCourse && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500">
                <CheckCircle className="h-3 w-3 text-white" />
              </span>
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="materials" className="focus:outline-none mt-0">
        <CourseMaterial 
          courseId={courseId}
          currentLessonIndex={currentLessonIndex}
          setCurrentLessonIndex={setCurrentLessonIndex}
          onLessonComplete={onLessonComplete}
          userProgress={userProgress}
          courseName={courseName}
          field={field}
          level={level}
        />
      </TabsContent>
      
      <TabsContent value="notes" className="focus:outline-none mt-0">
        <CourseNotes courseId={courseId} />
      </TabsContent>
      
      <TabsContent value="assessments" className="focus:outline-none mt-0">
        <CourseAssessment 
          courseId={courseId} 
          courseName={courseName}
          field={field}
          level={level}
        />
      </TabsContent>
      
      <TabsContent value="certificate" className="focus:outline-none mt-0">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-8 w-8 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Course Completion Certificate</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Congratulations on completing the course! Your certificate of completion is available below.
          </p>
        </div>
        <Certificate 
          courseId={courseId} 
          courseName={courseName} 
          completionDate={certificateDate}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CourseTabs;
