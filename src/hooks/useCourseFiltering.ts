
import { useState, useEffect } from 'react';

export interface Course {
  id: string;
  title: string;
  description: string;
  field: string;
  level: string;
  lessons_count: number;
  rating: number;
  reviews_count: number;
  thumbnail_url?: string;
}

interface UseCourseFilteringProps {
  courses: Course[] | undefined;
  placeholderImages: string[];
}

export function useCourseFiltering({ courses, placeholderImages }: UseCourseFilteringProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    if (!courses || !Array.isArray(courses)) {
      setFilteredCourses([]);
      return;
    }

    // Process courses data to add placeholder images
    const processed = courses.map((course, index) => {
      // If course doesn't have a thumbnail, add one
      if (!course.thumbnail_url) {
        return {
          ...course,
          thumbnail_url: placeholderImages[index % placeholderImages.length]
        };
      }
      return course;
    });
    
    // Apply filters
    const filtered = processed.filter(course =>
      (course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       course.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === 'all' || course.field === selectedCategory)
    );
    
    setFilteredCourses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, courses, placeholderImages]);

  // Get current courses for pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredCourses,
    currentCourses,
    currentPage,
    setCurrentPage,
    totalPages
  };
}
