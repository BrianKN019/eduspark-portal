import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Star, Award, Cpu, Atom, Palette, Cog, Microscope } from 'lucide-react';
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

  const sampleCourses = [
    { id: 1, title: "Introduction to Machine Learning", field: "Technology", level: "Beginner", lessons: 12, rating: 4.7, reviews: 1250, description: "Learn the basics of ML algorithms and their applications." },
    { id: 2, title: "Advanced Quantum Computing", field: "Science", level: "Advanced", lessons: 15, rating: 4.9, reviews: 320, description: "Explore cutting-edge quantum algorithms and their implementations." },
    { id: 3, title: "Digital Art and Design Fundamentals", field: "Arts", level: "Beginner", lessons: 10, rating: 4.5, reviews: 890, description: "Master the basics of digital art creation and design principles." },
    { id: 4, title: "Robotics Engineering", field: "Engineering", level: "Intermediate", lessons: 14, rating: 4.6, reviews: 750, description: "Design and build your own robots with advanced control systems." },
    { id: 5, title: "Cybersecurity Essentials", field: "Technology", level: "Beginner", lessons: 8, rating: 4.8, reviews: 1100, description: "Learn to protect systems and networks from cyber threats." },
    { id: 6, title: "Astrophysics and Cosmology", field: "Science", level: "Advanced", lessons: 16, rating: 4.9, reviews: 280, description: "Unravel the mysteries of the universe and celestial bodies." },
    { id: 7, title: "3D Animation and Visual Effects", field: "Arts", level: "Intermediate", lessons: 12, rating: 4.7, reviews: 620, description: "Create stunning 3D animations and visual effects for films and games." },
    { id: 8, title: "Sustainable Energy Systems", field: "Engineering", level: "Intermediate", lessons: 10, rating: 4.6, reviews: 480, description: "Design and implement renewable energy solutions for a sustainable future." },
    { id: 9, title: "Blockchain Development", field: "Technology", level: "Advanced", lessons: 14, rating: 4.8, reviews: 390, description: "Build decentralized applications and smart contracts on blockchain platforms." },
    { id: 10, title: "Genetic Engineering and CRISPR", field: "Science", level: "Advanced", lessons: 15, rating: 4.9, reviews: 210, description: "Explore the cutting-edge of genetic modification techniques." },
    { id: 11, title: "Virtual Reality Game Design", field: "Arts", level: "Intermediate", lessons: 11, rating: 4.7, reviews: 540, description: "Create immersive VR experiences and games using Unity." },
    { id: 12, title: "Aerospace Engineering", field: "Engineering", level: "Advanced", lessons: 16, rating: 4.8, reviews: 300, description: "Design and analyze aircraft and spacecraft systems." },
    { id: 13, title: "Data Science and Big Data Analytics", field: "Technology", level: "Intermediate", lessons: 13, rating: 4.6, reviews: 980, description: "Harness the power of big data to derive meaningful insights." },
    { id: 14, title: "Neuroscience and Brain-Computer Interfaces", field: "Science", level: "Advanced", lessons: 14, rating: 4.9, reviews: 180, description: "Explore the frontiers of brain science and neural engineering." },
    { id: 15, title: "Sound Design for Film and Games", field: "Arts", level: "Intermediate", lessons: 9, rating: 4.5, reviews: 420, description: "Create immersive audio experiences for visual media." },
    { id: 16, title: "Nanotechnology and Materials Science", field: "Engineering", level: "Advanced", lessons: 15, rating: 4.8, reviews: 250, description: "Manipulate matter at the atomic scale to create revolutionary materials." },
    { id: 17, title: "Cloud Computing and DevOps", field: "Technology", level: "Intermediate", lessons: 12, rating: 4.7, reviews: 730, description: "Master cloud infrastructure and continuous integration/deployment." },
    { id: 18, title: "Bioinformatics and Computational Biology", field: "Science", level: "Intermediate", lessons: 13, rating: 4.6, reviews: 340, description: "Apply computational methods to solve biological problems." },
    { id: 19, title: "Augmented Reality App Development", field: "Arts", level: "Advanced", lessons: 14, rating: 4.8, reviews: 290, description: "Create AR applications for mobile devices and wearables." },
    { id: 20, title: "Mechatronics and Smart Systems", field: "Engineering", level: "Intermediate", lessons: 11, rating: 4.7, reviews: 410, description: "Design intelligent electromechanical systems and products." },
  ];

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
              {sampleCourses.map((course) => (
                <Card key={course.id} className="neumorphic-card">
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