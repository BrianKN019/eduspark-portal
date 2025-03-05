
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Users, Star, Award, Calendar } from 'lucide-react';
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

  // Function to determine level badge color
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'advanced':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="outline"
            onClick={() => navigate('/dashboard/courses')}
            className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Courses
          </Button>
          
          {/* Estimated completion time */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Est. completion: {course.lessons_count * 2} days</span>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          {course.title}
        </h1>
        
        <div className="mt-2">
          <div className="flex items-center mb-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 font-medium">{course.rating.toFixed(1)}</span>
            <span className="mx-1 text-gray-400">|</span>
            <span className="text-gray-600 dark:text-gray-300">{course.reviews_count} reviews</span>
            <span className="mx-2 text-gray-400">•</span>
            <Award className="h-4 w-4 text-orange-500" />
            <span className="ml-1 text-gray-600 dark:text-gray-300">Certified Course</span>
          </div>
        </div>
        
        <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          {course.description}
        </p>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <span className="inline-flex items-center text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-100 px-4 py-1.5 rounded-full font-medium">
            <BookOpen className="mr-1.5 h-4 w-4" />
            {course.field}
          </span>
          <span className={`inline-flex items-center text-sm px-4 py-1.5 rounded-full font-medium ${getLevelColor(course.level)}`}>
            <Users className="mr-1.5 h-4 w-4" />
            {course.level}
          </span>
          <span className="inline-flex items-center text-sm bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-100 px-4 py-1.5 rounded-full font-medium">
            <Clock className="mr-1.5 h-4 w-4" />
            {course.lessons_count} Lessons
          </span>
        </div>
      </div>
      
      <div className="lg:col-span-1 hidden lg:flex justify-center items-center">
        <div className="relative w-full h-full max-h-56">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-8 text-center">
              <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-full shadow-xl mb-4">
                <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Premium Content</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                High-quality materials curated by experts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
