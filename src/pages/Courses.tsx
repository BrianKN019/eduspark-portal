
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Star } from 'lucide-react';
import { fetchCourses } from '@/lib/api';
import CourseCard from '@/components/CourseCard';
import { toast } from "sonner";

const Courses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredCourses, setFilteredCourses] = useState([]);

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  useEffect(() => {
    if (courses) {
      setFilteredCourses(
        courses.filter(course =>
          (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           course.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (selectedCategory === 'all' || course.field === selectedCategory)
        )
      );
    }
  }, [searchTerm, selectedCategory, courses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleEnrollment = async (courseId: string) => {
    try {
      await updateCourseProgress(courseId, 0);
      toast.success("Successfully enrolled in the course!");
    } catch (error) {
      toast.error("Failed to enroll in the course. Please try again.");
    }
  };

  if (error) {
    toast.error("Failed to load courses. Please refresh the page.");
  }

  const categories = ['all', 'Technology', 'Design', 'Business', 'Marketing', 'Arts', 'Personal Development'];

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

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <p>Loading courses...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course}
              onEnroll={() => handleEnrollment(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
