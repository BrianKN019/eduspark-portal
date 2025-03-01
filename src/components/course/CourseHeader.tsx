
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseHeaderProps {
  course: {
    title: string;
    description: string;
    field: string;
    level: string;
    lessons_count: number;
    rating: number;
    reviews_count: number;
  };
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex items-center space-x-4 mb-4">
          <Button 
            variant="outline"
            onClick={() => navigate('/courses')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
          </Button>
        </div>
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{course.description}</p>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <span className="inline-flex items-center text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 py-1 rounded-full">
            <BookOpen className="mr-1 h-4 w-4" />
            {course.field}
          </span>
          <span className="inline-flex items-center text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-3 py-1 rounded-full">
            <Users className="mr-1 h-4 w-4" />
            {course.level}
          </span>
          <span className="inline-flex items-center text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-800 px-3 py-1 rounded-full">
            <Clock className="mr-1 h-4 w-4" />
            {course.lessons_count} Lessons
          </span>
          <span className="inline-flex items-center text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 px-3 py-1 rounded-full">
            <Star className="mr-1 h-4 w-4" />
            {course.rating.toFixed(1)} ({course.reviews_count} reviews)
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
