
import React, { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2 } from 'lucide-react';
import { toast } from "sonner";

interface CertificateProps {
  courseId: string;
  courseName: string;
  completionDate: string;
}

const Certificate: React.FC<CertificateProps> = ({ 
  courseId, 
  courseName, 
  completionDate 
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const handleDownload = () => {
    // In a real implementation, you would generate a PDF
    // For now, we'll just show a toast
    toast.success("Certificate downloaded successfully!");
  };
  
  const handleShare = () => {
    // Share the achievement on social media
    if (navigator.share) {
      navigator.share({
        title: `My ${courseName} Certificate`,
        text: `I've successfully completed the ${courseName} course on EduSpark LMS!`,
        url: window.location.href,
      })
      .then(() => toast.success("Shared successfully!"))
      .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      toast.info("Copy this link to share your achievement!");
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4 mb-6">
            <Award className="h-16 w-16 text-yellow-500" />
            <h2 className="text-2xl font-bold text-center">
              Congratulations on completing the course!
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300">
              You've earned this certificate of completion. Download it to showcase your achievement.
            </p>
          </div>
          
          <div 
            ref={certificateRef}
            className="border-8 border-double border-gray-200 dark:border-gray-800 p-8 mb-6 bg-white dark:bg-gray-900"
          >
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <Award className="h-20 w-20 text-yellow-500" />
              </div>
              
              <div>
                <h1 className="text-2xl font-serif mb-2">CERTIFICATE OF COMPLETION</h1>
                <p className="text-gray-500">This certifies that</p>
                <h2 className="text-xl font-bold my-2">Student Name</h2>
                <p className="text-gray-500">has successfully completed</p>
                <h3 className="text-xl font-bold my-2">{courseName}</h3>
                <p className="text-gray-500 mb-4">on {formatDate(completionDate)}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-around">
                <div className="text-center">
                  <p className="font-bold">Course ID</p>
                  <p className="text-sm text-gray-500">{courseId.slice(0, 8)}</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">EduSpark LMS</p>
                  <p className="text-sm text-gray-500">Official Certificate</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600"
            >
              <Download className="mr-2 h-4 w-4" /> Download Certificate
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-4 w-4" /> Share Achievement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Certificate;
