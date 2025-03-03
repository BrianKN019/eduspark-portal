import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2, Check } from 'lucide-react';
import { toast } from "sonner";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  const [studentName, setStudentName] = useState<string>('Student Name');
  const [isDownloading, setIsDownloading] = useState(false);
  const [certificateExists, setCertificateExists] = useState(false);

  // Fetch current user's name and check if certificate exists
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .maybeSingle();
            
          if (profile && profile.full_name) {
            setStudentName(profile.full_name);
          }
          
          // Check if certificate exists
          const { data: existingCert } = await supabase
            .from('certificates')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', courseId)
            .maybeSingle();
            
          setCertificateExists(!!existingCert);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [courseId]);
  
  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    try {
      setIsDownloading(true);
      
      // First hide the buttons for the screenshot
      const certificateElement = certificateRef.current;
      const buttonsElement = document.getElementById('certificate-buttons');
      if (buttonsElement) buttonsElement.style.display = 'none';
      
      // Capture certificate with high quality settings
      const canvas = await html2canvas(certificateElement, {
        scale: 4, // Higher resolution for better quality
        logging: false,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        windowWidth: certificateElement.scrollWidth,
        windowHeight: certificateElement.scrollHeight
      });
      
      // Show the buttons again
      if (buttonsElement) buttonsElement.style.display = 'flex';
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create PDF with proper sizing for single page fit
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to fit the certificate on a single page
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Center the image
      const x = 10; // left margin
      const y = (pdfHeight - imgHeight) / 2; // center vertically
      
      // Add image
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      // Save PDF
      const fileName = `${courseName.replace(/\s+/g, '_')}_Certificate.pdf`;
      pdf.save(fileName);
      
      // Store certificate in database if it doesn't exist
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !certificateExists) {
        await supabase
          .from('certificates')
          .insert({
            user_id: user.id,
            course_id: courseId,
            name: `${courseName} Certificate`,
            description: `Certificate of completion for ${courseName}`,
            download_url: `/certificates/${fileName}`,
            earned_date: new Date().toISOString()
          });
          
        setCertificateExists(true);
      }
      
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to download certificate. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleShare = async () => {
    if (!certificateRef.current) return;
    
    try {
      // For sharing, we need a file or URL, so create a temporary image first
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true
      });
      
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error("Failed to generate certificate image");
          return;
        }
        
        // Create a file from the blob
        const file = new File([blob], `${courseName}_Certificate.png`, { type: 'image/png' });
        
        if (navigator.share) {
          try {
            await navigator.share({
              title: `My ${courseName} Certificate`,
              text: `I've successfully completed the ${courseName} course on EduSpark LMS!`,
              files: [file]
            });
            toast.success("Shared successfully!");
          } catch (error) {
            console.error("Error sharing:", error);
            // Fallback if sharing files fails, try sharing just the text
            navigator.share({
              title: `My ${courseName} Certificate`,
              text: `I've successfully completed the ${courseName} course on EduSpark LMS!`,
              url: window.location.href,
            }).then(() => toast.success("Shared successfully!"))
              .catch((error) => console.error("Error sharing:", error));
          }
        } else {
          // Fallback for browsers that don't support the Web Share API
          toast.info("Copy this link to share your achievement!");
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error sharing certificate:', error);
      toast.error("Failed to share certificate. Please try again.");
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Format date in a more formal way for certificates
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-30 animate-pulse"></div>
              <Award className="h-16 w-16 text-yellow-500 relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Congratulations on completing the course!
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300">
              You've earned this certificate of completion. Download it to showcase your achievement.
            </p>
          </div>
          
          <div 
            ref={certificateRef}
            className="certificate-container border-8 border-double border-yellow-200 dark:border-yellow-700 p-8 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg"
          >
            <div className="text-center space-y-6 relative">
              {/* Premium border design */}
              <div className="absolute inset-0 border-4 border-double border-yellow-300 dark:border-yellow-600 m-4 rounded-lg pointer-events-none"></div>
              
              {/* Certificate header with gold emblem */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-full">
                  <Award className="h-20 w-20 text-white" />
                </div>
              </div>
              
              {/* Certificate content */}
              <div className="px-8 py-6">
                <h1 className="text-3xl font-serif font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-800 dark:from-yellow-400 dark:to-yellow-600">CERTIFICATE OF COMPLETION</h1>
                <p className="text-gray-600 dark:text-gray-300">This certifies that</p>
                <h2 className="text-2xl font-bold my-3 font-serif">{studentName}</h2>
                <p className="text-gray-600 dark:text-gray-300">has successfully completed</p>
                <h3 className="text-2xl font-bold my-3 font-serif">{courseName}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">on {formatDate(completionDate || new Date().toISOString())}</p>
                
                {/* Signature and stamp section */}
                <div className="flex justify-around items-center mt-8">
                  <div className="text-center">
                    <div className="w-32 h-12 mx-auto mb-2 border-b border-gray-400">
                      <div className="font-signature text-lg text-gray-700 dark:text-gray-300 transform -rotate-2">Jane Smith</div>
                    </div>
                    <p className="font-bold">Course Director</p>
                  </div>
                  <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-yellow-600 dark:border-yellow-500 rounded-full">
                    <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full">
                      <Check className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-12 mx-auto mb-2 border-b border-gray-400">
                      <div className="font-signature text-lg text-gray-700 dark:text-gray-300 transform rotate-1">John Doe</div>
                    </div>
                    <p className="font-bold">EduSpark Director</p>
                  </div>
                </div>
              </div>
              
              {/* Certificate footer with verification */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-around">
                <div className="text-center">
                  <p className="font-bold">Course ID</p>
                  <p className="text-sm text-gray-500">{courseId.slice(0, 8)}</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">EduSpark LMS</p>
                  <p className="text-sm text-gray-500">Official Certificate</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">Date Issued</p>
                  <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div id="certificate-buttons" className="flex justify-center space-x-4">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 shadow-md hover:shadow-lg transition-all duration-300"
            >
              {isDownloading ? (
                <>Downloading...</>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Download Certificate
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="border-yellow-400 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 shadow-md hover:shadow-lg transition-all duration-300"
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
