
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Book } from 'lucide-react';

interface CourseData {
  id: string;
  progress_percentage: number;
  courses?: {
    title: string;
  };
}

interface CourseProgressListProps {
  courseProgresses: CourseData[];
}

const CourseProgressList: React.FC<CourseProgressListProps> = ({ courseProgresses }) => {
  return (
    <Card className="neumorphic-card shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950 rounded-t-lg">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
          Course Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        {courseProgresses.length > 0 ? (
          <div className="space-y-6">
            {courseProgresses.map((progress) => (
              <div key={progress.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Book className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{progress.courses?.title || 'Course'}</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    {progress.progress_percentage}% Complete
                  </span>
                </div>
                <Progress value={progress.progress_percentage} className="h-2" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No courses enrolled yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseProgressList;
