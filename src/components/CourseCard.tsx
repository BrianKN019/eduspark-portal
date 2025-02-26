
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Users } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    field: string;
    level: string;
    lessons_count: number;
    rating: number;
    reviews_count: number;
    thumbnail_url?: string;
  };
  onEnroll: () => void;
  progress?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnroll, progress = 0 }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {course.thumbnail_url && (
        <div className="w-full h-32 overflow-hidden">
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {course.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full">
            {course.field}
          </span>
          <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full">
            {course.level}
          </span>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>{course.lessons_count} lessons</span>
          </div>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            <span>{course.rating.toFixed(1)} ({course.reviews_count} reviews)</span>
          </div>
          {progress > 0 && (
            <div className="w-full">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">{progress}% completed</p>
            </div>
          )}
        </div>
        <Button 
          onClick={onEnroll} 
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          {progress > 0 ? 'Continue Course' : 'Enroll Now'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
