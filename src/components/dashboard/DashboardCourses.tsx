import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardCourses: React.FC = () => {
  const inProgressCourses = [
    { id: 1, name: 'React Fundamentals', progress: 60 },
    { id: 2, name: 'Advanced JavaScript', progress: 30 },
    { id: 3, name: 'Node.js Basics', progress: 45 },
  ];

  return (
    <Card className="overflow-hidden shadow-lg">
      <CardHeader>
        <CardTitle>In Progress Courses</CardTitle>
      </CardHeader>
      <CardContent>
        {inProgressCourses.map(course => (
          <div key={course.id} className="mb-4">
            <h4 className="font-semibold">{course.name}</h4>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{course.progress}% complete</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DashboardCourses;