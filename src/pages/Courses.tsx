import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Star, Award } from 'lucide-react';
import { fetchCourses } from '@/lib/api';

const Courses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', searchTerm, selectedCategory],
    queryFn: () => fetchCourses(searchTerm, selectedCategory),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger search
  };

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
        <TabsList>
          <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>All</TabsTrigger>
          <TabsTrigger value="beginner" onClick={() => setSelectedCategory('beginner')}>Beginner</TabsTrigger>
          <TabsTrigger value="intermediate" onClick={() => setSelectedCategory('intermediate')}>Intermediate</TabsTrigger>
          <TabsTrigger value="advanced" onClick={() => setSelectedCategory('advanced')}>Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {isLoading ? (
            <p>Loading courses...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses?.map((course) => (
                <Card key={course.id} className="neumorphic-card">
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{course.description}</p>
                    <div className="flex items-center mt-2">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <Star className="h-4 w-4 mr-2" />
                      <span>{course.rating} ({course.reviews} reviews)</span>
                    </div>
                    <Button className="mt-4 w-full">Enroll Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        {/* Add other TabsContent for different categories */}
      </Tabs>

      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-6 w-6" />
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