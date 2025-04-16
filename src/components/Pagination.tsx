
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Create page numbers array with ellipsis when needed
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 5) {
      // Show all pages if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis1');
      }
      
      // Add pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis2');
      }
      
      // Always include last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {getPageNumbers().map((page, index) => (
        page === 'ellipsis1' || page === 'ellipsis2' ? (
          <span key={`ellipsis-${index}`} className="px-2">...</span>
        ) : (
          <Button 
            key={`page-${page}`}
            onClick={() => onPageChange(Number(page))}
            variant={currentPage === page ? "default" : "outline"}
            className={currentPage === page ? "bg-blue-600" : ""}
            size="sm"
          >
            {page}
          </Button>
        )
      ))}
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
