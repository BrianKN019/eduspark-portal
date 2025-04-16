
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from 'lucide-react';
import { fetchCourses, updateCourseProgress } from '@/lib/api';
import CourseCard from '@/components/CourseCard';
import LoadingCourseCard from '@/components/LoadingCourseCard';
import Pagination from '@/components/Pagination';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useCourseFiltering } from '@/hooks/useCourseFiltering';

// Placeholder images for courses that don't have thumbnails
const placeholderImages = [
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
];

const Courses: React.FC = () => {
  // Use a stale time to prevent frequent refetches
  const { data: courses, isLoading, error, isRefetching } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
  });

  // Get course progress separately with its own stale time
  const { data: courseProgress } = useQuery({
    queryKey: ['courseProgress'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];
        
        const { data, error } = await supabase
          .from('course_progress')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          console.error("Error fetching course progress:", error);
          return [];
        }
        
        return data || [];
      } catch (e) {
        console.error("Exception in course progress query:", e);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes stale time
  });

  // Use our custom hook for filtering and pagination
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    currentCourses,
    currentPage,
    setCurrentPage,
    totalPages
  } = useCourseFiltering({ 
    courses, 
    placeholderImages 
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleEnrollment = async (courseId: string) => {
    try {
      const result = await updateCourseProgress(courseId, 0);
      toast.success("Successfully enrolled in the course!");
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error("Failed to enroll in the course. Please try again.");
    }
  };

  const getProgress = (courseId: string) => {
    if (!courseProgress) return 0;
    const progress = courseProgress.find(p => p.course_id === courseId);
    return progress ? progress.progress_percentage : 0;
  };

  if (error) {
    console.error("Error loading courses:", error);
    toast.error("Failed to load courses. Please refresh the page.");
  }

  const categories = ['all', 'Technology', 'Design', 'Business', 'Marketing', 'Arts', 'Personal Development'];

  // Show loading state for both initial load and refetching
  const isDataLoading = isLoading || isRefetching;

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Course Catalog</h2>
      
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-6 w-6" />
            Search Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 gap-2">
          {categories.map(category => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === 'all' ? 'All Courses' : category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isDataLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <LoadingCourseCard key={`loading-${index}`} />
          ))}
        </div>
      ) : currentCourses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course}
                onEnroll={() => handleEnrollment(course.id)}
                progress={getProgress(course.id)}
              />
            ))}
          </div>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-32">
          <p>No courses found. Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
