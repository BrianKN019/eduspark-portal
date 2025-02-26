
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCourses } from '@/lib/api';

const DashboardCourses: React.FC = () => {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  const inProgressCourses = courses?.slice(0, 3) || [];

  return (
    <Card className="overflow-hidden shadow-lg">
      <CardHeader>
        <CardTitle>In Progress Courses</CardTitle>
      </CardHeader>
      <CardContent>
        {inProgressCourses.map(course => (
          <div key={course.id} className="mb-4">
            <h4 className="font-semibold">{course.title}</h4>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${Math.floor(Math.random() * 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Level: {course.level}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DashboardCourses;
