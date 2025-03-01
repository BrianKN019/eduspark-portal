
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, BrainCircuit, Award } from 'lucide-react';
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
          courseId={courseId}
          currentLessonIndex={currentLessonIndex}
          setCurrentLessonIndex={setCurrentLessonIndex}
          onLessonComplete={onLessonComplete}
          userProgress={userProgress}
          courseName={courseName}
        />
      </TabsContent>
      
      <TabsContent value="notes">
        <CourseNotes courseId={courseId} />
      </TabsContent>
      
      <TabsContent value="assessments">
        <CourseAssessment 
          courseId={courseId} 
          courseName={courseName}
          field={field}
          level={level}
        />
      </TabsContent>
      
      <TabsContent value="certificate">
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
