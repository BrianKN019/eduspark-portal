
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2, Shield, QRCodeIcon, CheckCircle } from 'lucide-react';
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
  const [certificateId, setCertificateId] = useState<string>('');

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
            
          if (existingCert) {
            setCertificateExists(true);
            setCertificateId(existingCert.id);
          }
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
        backgroundColor: '#ffffff', // Light background
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
      
      // Add verification QR code
      const verificationUrl = `${window.location.origin}/verify-certificate?id=${certificateId}`;
      
      // Save PDF
      const fileName = `${courseName.replace(/\s+/g, '_')}_Certificate.pdf`;
      pdf.save(fileName);
      
      // Store certificate in database if it doesn't exist
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !certificateExists) {
        const { data } = await supabase
          .from('certificates')
          .insert({
            user_id: user.id,
            course_id: courseId,
            name: `${courseName} Certificate`,
            description: `Certificate of completion for ${courseName}`,
            download_url: `/certificates/${fileName}`,
            earned_date: new Date().toISOString()
          })
          .select('id')
          .single();
          
        if (data) {
          setCertificateId(data.id);
          setCertificateExists(true);
        }
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
        backgroundColor: '#ffffff',
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
  
  // Generate verification hash based on certificate data
  const verificationCode = `${certificateId || "CERT"}${courseId.slice(0, 4)}${new Date(completionDate).getFullYear()}`;
  
  return (
    <div className="space-y-6">
      <Card className="border shadow-lg overflow-hidden bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-30 animate-pulse"></div>
              <Award className="h-16 w-16 text-blue-500 relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
              Congratulations on completing the course!
            </h2>
            <p className="text-center text-gray-600">
              You've earned this certificate of completion. Download it to showcase your achievement.
            </p>
          </div>
          
          <div 
            ref={certificateRef}
            className="certificate-container relative border border-gray-200 rounded-lg mb-6 bg-white overflow-hidden"
          >
            {/* Premium certificate design with security elements */}
            <div className="relative p-8 flex flex-col items-center text-center">
              {/* Decorative background elements */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#e1f5fe,transparent_70%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#e3f2fd,transparent_70%)]"></div>
              
              {/* Certificate header */}
              <div className="relative z-10 flex items-center justify-center mb-6">
                <div className="h-20 w-20 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-100 rounded-full"></div>
                  <Award className="h-10 w-10 text-blue-600" />
                </div>
              </div>
              
              {/* Certificate title */}
              <h1 className="text-3xl font-bold text-blue-800 mb-6 relative z-10">
                CERTIFICATE OF COMPLETION
              </h1>
              
              {/* Certificate security number */}
              <div className="absolute top-4 right-4 flex items-center text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
                <Shield className="h-3 w-3 mr-1 text-blue-500" />
                <span>{verificationCode}</span>
              </div>
              
              {/* Certificate content */}
              <div className="text-center space-y-2 w-full relative z-10">
                <p className="text-gray-500 text-lg">This certifies that</p>
                <h2 className="text-3xl font-serif text-gray-800 my-2">{studentName}</h2>
                <p className="text-gray-500 text-lg">has successfully completed</p>
                <h3 className="text-2xl font-bold text-blue-700 my-3">{courseName}</h3>
                <p className="text-gray-500 mb-6">on {formatDate(completionDate || new Date().toISOString())}</p>
                
                {/* Signature and stamp section */}
                <div className="flex justify-around items-center mt-8 w-full">
                  <div className="text-center">
                    <div className="w-32 h-12 mx-auto mb-2 border-b border-gray-300">
                      <div className="font-script text-gray-700">Jane Smith</div>
                    </div>
                    <p className="text-sm text-gray-500">Course Director</p>
                  </div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-12 mx-auto mb-2 border-b border-gray-300">
                      <div className="font-script text-gray-700">John Doe</div>
                    </div>
                    <p className="text-sm text-gray-500">EduSpark Director</p>
                  </div>
                </div>
              </div>
              
              {/* Holographic security pattern */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 opacity-50"></div>
              
              {/* Certificate verification */}
              <div className="mt-12 pt-4 text-center text-sm text-gray-500 relative z-10">
                <p>Verify this certificate at:</p>
                <p className="font-mono text-blue-600">{window.location.origin}/verify-certificate?id={certificateId || verificationCode}</p>
              </div>
              
              {/* Certificate footer */}
              <div className="w-full mt-8 pt-4 border-t border-gray-200 flex justify-around text-xs text-gray-400">
                <div className="text-center">
                  <p>Certificate ID</p>
                  <p className="font-mono">{certificateId || verificationCode}</p>
                </div>
                <div className="text-center">
                  <p>EduSpark LMS</p>
                  <p>Official Certificate</p>
                </div>
                <div className="text-center">
                  <p>Date Issued</p>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div id="certificate-buttons" className="flex justify-center space-x-4">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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
              className="border-blue-500 text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300"
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
