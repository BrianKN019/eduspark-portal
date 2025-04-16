
import React, { memo } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CourseFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

// Using memo to prevent unnecessary re-renders
const CourseFilter: React.FC<CourseFilterProps> = memo(({ 
  selectedCategory, 
  setSelectedCategory,
  categories 
}) => {
  return (
    <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {categories.map(category => (
          <TabsTrigger 
            key={category} 
            value={category} 
            className="capitalize transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          >
            {category === 'all' ? 'All' : category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
});

CourseFilter.displayName = 'CourseFilter';

export default CourseFilter;
