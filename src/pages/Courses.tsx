
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Star } from 'lucide-react';
import { fetchCourses, updateCourseProgress } from '@/lib/api';
import CourseCard from '@/components/CourseCard';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

const Courses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);

  // Add isRefetching to handle loading state properly
  const { data: courses, isLoading, error, isRefetching } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

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
    }
  });

  useEffect(() => {
    // Add debugging to see if courses are loading
    console.log("Courses data:", courses);
    console.log("Course progress:", courseProgress);
    
    if (courses && Array.isArray(courses)) {
      const filtered = courses
        .filter(course =>
          (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           course.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (selectedCategory === 'all' || course.field === selectedCategory)
        )
        .slice(0, 10);
      setFilteredCourses(filtered);
    }
  }, [searchTerm, selectedCategory, courses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleEnrollment = async (courseId: string) => {
    try {
      console.log("Enrolling in course:", courseId);
      const result = await updateCourseProgress(courseId, 0);
      console.log("Enrollment result:", result);
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
        <div className="flex justify-center items-center h-32">
          <p>Loading courses...</p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course}
              onEnroll={() => handleEnrollment(course.id)}
              progress={getProgress(course.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-32">
          <p>No courses found. Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
