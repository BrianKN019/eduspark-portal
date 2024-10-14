import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    field: string;
    level: string;
    lessons: number;
    rating: number;
    reviews: number;
    description: string;
  };
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{course.description}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{course.field}</span>
          <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full">{course.level}</span>
        </div>
        <div className="flex items-center mt-2">
          <BookOpen className="h-4 w-4 mr-2" />
          <span>{course.lessons} lessons</span>
        </div>
        <div className="flex items-center mt-2">
          <Star className="h-4 w-4 mr-2 text-yellow-400" />
          <span>{course.rating} ({course.reviews} reviews)</span>
        </div>
        <Button className="mt-4 w-full neumorphic-button">Enroll Now</Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;