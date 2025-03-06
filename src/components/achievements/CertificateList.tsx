
import React from 'react';
import { Certificate } from '@/types/achievements';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award, Calendar, Check, Shield, Eye } from 'lucide-react';
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Link } from 'react-router-dom';

interface CertificateListProps {
  certificates: Certificate[];
}

const CertificateList: React.FC<CertificateListProps> = ({ certificates }) => {
  const generatePDF = async (certificate: Certificate) => {
    try {
      toast.info("Generating certificate...");
      
      // Create a temporary div for the certificate
      const certificateDiv = document.createElement('div');
      
      // Generate a unique verification code
      const verificationCode = `${certificate.id.slice(0, 6)}-${new Date(certificate.earnedDate).getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      certificateDiv.innerHTML = `
        <div id="certificate-${certificate.id}" style="width: 800px; height: 600px; padding: 0; background-color: #ffffff; position: absolute; left: -9999px; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="position: relative; height: 100%; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #333; border: 1px solid #e0e0e0; background: radial-gradient(circle at top right, rgba(225, 245, 254, 0.4), transparent 70%), radial-gradient(circle at bottom left, rgba(227, 242, 253, 0.4), transparent 70%);">
            <!-- Decorative elements -->
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, #2196f3, #3f51b5);"></div>
            <div style="position: absolute; top: 10px; right: 10px; font-size: 10px; color: #666; background-color: #f3f9ff; padding: 4px 8px; border-radius: 12px;">
              <span style="color: #2196f3; margin-right: 4px;">✓</span> ${verificationCode}
            </div>
            
            <!-- Certificate header -->
            <div style="width: 70px; height: 70px; background-color: #f0f8ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; border: 2px solid #e3f2fd;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="#2196f3"/>
                <path d="M19.7071 9.70711C20.0976 9.31658 20.0976 8.68342 19.7071 8.29289C19.3166 7.90237 18.6834 7.90237 18.2929 8.29289L14 12.5858L12.7071 11.2929C12.3166 10.9024 11.6834 10.9024 11.2929 11.2929C10.9024 11.6834 10.9024 12.3166 11.2929 12.7071L13.2929 14.7071C13.6834 15.0976 14.3166 15.0976 14.7071 14.7071L19.7071 9.70711Z" fill="#2196f3"/>
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2196f3" stroke-width="2"/>
              </svg>
            </div>
            
            <h1 style="font-size: 28px; margin: 0 0 16px 0; color: #1976d2; text-align: center; font-weight: 600; letter-spacing: 1px;">CERTIFICATE OF COMPLETION</h1>
            
            <div style="width: 100%; height: 1px; background: linear-gradient(90deg, transparent, #e0e0e0, transparent); margin-bottom: 20px;"></div>
            
            <div style="text-align: center; margin-bottom: 24px;">
              <p style="margin: 0; color: #757575; font-size: 16px;">This certifies that</p>
              <h2 style="font-size: 28px; margin: 12px 0; font-weight: 500; color: #333;">JOHN DOE</h2>
              <p style="margin: 0; color: #757575; font-size: 16px;">has successfully completed</p>
              <h3 style="font-size: 22px; margin: 12px 0; font-weight: 600; color: #1976d2;">${certificate.name}</h3>
              <p style="margin: 0 0 20px 0; color: #757575; font-size: 16px;">on ${new Date(certificate.earnedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            
            <div style="display: flex; justify-content: space-around; align-items: center; width: 100%; margin-top: 24px;">
              <div style="text-align: center;">
                <div style="width: 120px; height: 40px; margin: 0 auto 8px auto; border-bottom: 1px solid #e0e0e0;">
                  <div style="font-size: 18px; color: #333; font-family: 'Satisfy', cursive;">Jane Smith</div>
                </div>
                <p style="margin: 0; font-size: 14px; color: #757575;">Course Director</p>
              </div>
              
              <div style="width: 56px; height: 56px; background-color: #e3f2fd; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #bbdefb;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#2196f3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              
              <div style="text-align: center;">
                <div style="width: 120px; height: 40px; margin: 0 auto 8px auto; border-bottom: 1px solid #e0e0e0;">
                  <div style="font-size: 18px; color: #333; font-family: 'Satisfy', cursive;">John Doe</div>
                </div>
                <p style="margin: 0; font-size: 14px; color: #757575;">EduSpark Director</p>
              </div>
            </div>
            
            <div style="position: absolute; bottom: 16px; left: 0; right: 0; text-align: center; font-size: 12px; color: #9e9e9e;">
              <p style="margin: 0;">Verify this certificate at:</p>
              <p style="margin: 0; font-family: monospace; color: #2196f3;">eduspark.example.com/verify-certificate?id=${certificate.id}</p>
            </div>
            
            <div style="width: 100%; margin-top: 30px; padding-top: 16px; border-top: 1px solid #e0e0e0; display: flex; justify-content: space-around; font-size: 12px; color: #9e9e9e; position: absolute; bottom: 50px; left: 0; right: 0; padding: 0 40px;">
              <div style="text-align: center;">
                <p style="margin: 0;">Certificate ID</p>
                <p style="margin: 0; font-family: monospace;">${certificate.id.slice(0, 12)}</p>
              </div>
              <div style="text-align: center;">
                <p style="margin: 0;">EduSpark LMS</p>
                <p style="margin: 0;">Official Certificate</p>
              </div>
              <div style="text-align: center;">
                <p style="margin: 0;">Date Issued</p>
                <p style="margin: 0;">${new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(certificateDiv);
      
      const content = document.getElementById(`certificate-${certificate.id}`);
      if (!content) {
        toast.error("Failed to generate certificate");
        return;
      }
      
      try {
        const canvas = await html2canvas(content, {
          scale: 2,
          logging: false,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        
        // Calculate dimensions to fit properly on a single page
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height) * 0.95; // 95% of the page
        const imgWidth = canvas.width * ratio;
        const imgHeight = canvas.height * ratio;
        
        // Center the image on the page
        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;
        
        pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
        pdf.save(`${certificate.name.replace(/\s+/g, '_')}_Certificate.pdf`);
        
        toast.success("Certificate downloaded successfully!");
      } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error("Failed to generate certificate");
      } finally {
        // Clean up
        document.body.removeChild(certificateDiv);
      }
    } catch (error) {
      console.error('Error creating certificate:', error);
      toast.error("Failed to generate certificate. Please try again.");
    }
  };

  const handleDownload = (certificate: Certificate) => {
    generatePDF(certificate);
  };
  
  const handlePreview = (certificate: Certificate) => {
    // In a real implementation, this would navigate to a preview page
    toast.info("Opening certificate preview");
  };

  if (certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-lg border border-blue-100 shadow-sm">
        <Award className="h-16 w-16 text-blue-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-gray-800">No Certificates Yet</h3>
        <p className="text-gray-500">Complete courses to earn certificates that will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {certificates.map((certificate) => (
        <Card key={certificate.id} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-1.5"></div>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-blue-700">
              <Award className="h-5 w-5 text-blue-500" />
              <span>{certificate.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4 text-gray-600">{certificate.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Calendar className="h-4 w-4 mr-2 text-blue-400" />
              <span>Earned on: {new Date(certificate.earnedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            
            {/* Certificate preview */}
            <div className="mb-6 rounded-md border border-gray-200 p-4 bg-gray-50 relative overflow-hidden group">
              <div className="flex items-center justify-center h-40">
                {/* Certificate mini preview */}
                <div className="relative w-full max-w-[220px] aspect-[4/3] border border-gray-200 shadow-sm p-4 flex flex-col items-center text-center scale-90 group-hover:scale-95 transition-transform duration-300 bg-white">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <Check className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="text-[10px] text-blue-700 font-bold mb-1">CERTIFICATE</h4>
                  <div className="text-[8px] text-gray-500 mb-1">This certifies that</div>
                  <div className="text-[12px] font-medium text-gray-800">John Doe</div>
                  <div className="text-[8px] text-gray-500 mt-1 mb-1">has completed</div>
                  <div className="text-[10px] font-bold text-blue-600">{certificate.name}</div>
                  <div className="mt-auto w-full border-t border-gray-100 pt-1 flex justify-around text-[6px] text-gray-400">
                    <div>ID: {certificate.id.slice(0, 6)}</div>
                    <div>DATE: {new Date(certificate.earnedDate).toLocaleDateString()}</div>
                  </div>
                </div>
                
                {/* Security watermark */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjJDMTcuNTIyOCAyMiAyMiAxNy41MjI4IDIyIDEyQzIyIDYuNDc3MTUgMTcuNTIyOCAyIDEyIDJDNi40NzcxNSAyIDIgNi40NzcxNSAyIDEyQzIgMTcuNTIyOCA2LjQ3NzE1IDIyIDEyIDIyWiIgc3Ryb2tlPSIjRTNGMkZEIiBzdHJva2Utd2lkdGg9IjEuNSIvPjxwYXRoIGQ9Ik0xNSA5TDEwLjUgMTMuNUw5IDEyIiBzdHJva2U9IiNFM0YyRkQiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-repeat opacity-5 pointer-events-none"></div>
                
                {/* Overlay with buttons on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handlePreview(certificate)} 
                      variant="outline"
                      size="sm"
                      className="border-blue-400 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Preview
                    </Button>
                    <Button 
                      onClick={() => handleDownload(certificate)} 
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => handleDownload(certificate)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Certificate
              </Button>
              
              <div className="flex justify-between items-center text-xs text-gray-500 px-2">
                <div className="flex items-center">
                  <Shield className="h-3 w-3 mr-1 text-blue-400" />
                  <span>Secure & Verifiable</span>
                </div>
                <Link 
                  to={`/verify-certificate?id=${certificate.id}`}
                  className="text-blue-500 hover:text-blue-600 hover:underline"
                >
                  Verify
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CertificateList;
