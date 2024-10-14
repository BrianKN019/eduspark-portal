import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Star } from 'lucide-react';
import { fetchCourses } from '@/lib/api';
import CourseCard from '@/components/CourseCard';
import CourseFilter from '@/components/CourseFilter';

const Courses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredCourses, setFilteredCourses] = useState([]);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  useEffect(() => {
    if (courses) {
      setFilteredCourses(
        courses.filter(course =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedCategory === 'all' || course.field === selectedCategory)
        )
      );
    }
  }, [searchTerm, selectedCategory, courses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  return (
    <div className="space-y-6 p-6 neumorphic-container">
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
              className="flex-grow neumorphic-input"
            />
            <Button type="submit" className="neumorphic-button">Search</Button>
          </form>
        </CardContent>
      </Card>

      <CourseFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      {isLoading ? (
        <p>Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-6 w-6" />
            Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Complete a course to earn a certificate of completion!</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Courses;