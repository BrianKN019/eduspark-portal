import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CourseFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CourseFilter: React.FC<CourseFilterProps> = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        <TabsTrigger value="all" className="neumorphic-button">All</TabsTrigger>
        <TabsTrigger value="Technology" className="neumorphic-button">Technology</TabsTrigger>
        <TabsTrigger value="Science" className="neumorphic-button">Science</TabsTrigger>
        <TabsTrigger value="Arts" className="neumorphic-button">Arts</TabsTrigger>
        <TabsTrigger value="Engineering" className="neumorphic-button">Engineering</TabsTrigger>
        <TabsTrigger value="Other" className="neumorphic-button">Other</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default CourseFilter;