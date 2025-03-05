
import React from 'react';
import { Certificate } from '@/types/achievements';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award, Calendar, Check } from 'lucide-react';
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface CertificateListProps {
  certificates: Certificate[];
}

const CertificateList: React.FC<CertificateListProps> = ({ certificates }) => {
  const generatePDF = async (certificate: Certificate) => {
    try {
      toast.info("Generating certificate...");
      
      // Create a temporary div for the certificate
      const certificateDiv = document.createElement('div');
      certificateDiv.innerHTML = `
        <div id="certificate-${certificate.id}" style="width: 800px; height: 1000px; padding: 0; background-color: #0a101f; position: absolute; left: -9999px; font-family: Arial, sans-serif;">
          <div style="border: 8px solid rgba(234, 179, 8, 0.5); height: 100%; padding: 40px; box-sizing: border-box; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
            <div style="width: 80px; height: 80px; background-color: #eab308; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15L8.5 9.5L15.5 9.5L12 15Z" fill="#0a101f"/>
                <path d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8Z" fill="#0a101f"/>
                <path d="M19 16L17 18L17 22M5 16L7 18L7 22" stroke="#0a101f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            
            <h1 style="font-size: 30px; margin: 0 0 24px 0; color: #eab308; text-align: center; font-weight: bold;">CERTIFICATE OF COMPLETION</h1>
            
            <div style="text-align: center; margin-bottom: 20px;">
              <p style="margin: 0; color: #9ca3af; font-size: 16px;">This certifies that</p>
              <h2 style="font-size: 32px; margin: 12px 0; font-weight: bold;">JOHN DOE</h2>
              <p style="margin: 0; color: #9ca3af; font-size: 16px;">has successfully completed</p>
              <h3 style="font-size: 24px; margin: 12px 0; font-weight: bold;">${certificate.name}</h3>
              <p style="margin: 0 0 32px 0; color: #9ca3af; font-size: 16px;">on ${new Date(certificate.earnedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            
            <div style="display: flex; justify-content: space-around; align-items: center; width: 100%; margin-top: 32px;">
              <div style="text-align: center;">
                <div style="width: 128px; height: 48px; margin: 0 auto 8px auto; border-bottom: 1px solid #4b5563;">
                  <div style="font-size: 18px; color: white;">Jane Smith</div>
                </div>
                <p style="margin: 0; font-size: 14px; color: #9ca3af;">Course Director</p>
              </div>
              
              <div style="width: 64px; height: 64px; background-color: #eab308; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px dashed #fde68a;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#0a101f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              
              <div style="text-align: center;">
                <div style="width: 128px; height: 48px; margin: 0 auto 8px auto; border-bottom: 1px solid #4b5563;">
                  <div style="font-size: 18px; color: white;">John Doe</div>
                </div>
                <p style="margin: 0; font-size: 14px; color: #9ca3af;">EduSpark Director</p>
              </div>
            </div>
            
            <div style="width: 100%; margin-top: 48px; padding-top: 16px; border-top: 1px solid #374151; display: flex; justify-content: space-around; font-size: 14px; color: #9ca3af;">
              <div style="text-align: center;">
                <p style="margin: 0;">Course ID</p>
                <p style="margin: 0;">${certificate.id.slice(0, 8)}</p>
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
          backgroundColor: '#0a101f'
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
          orientation: 'portrait',
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

  if (certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center bg-[#0a101f] rounded-lg border border-yellow-500/20">
        <Award className="h-16 w-16 text-yellow-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-white">No Certificates Yet</h3>
        <p className="text-gray-400">Complete courses to earn certificates that will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {certificates.map((certificate) => (
        <Card key={certificate.id} className="overflow-hidden border-0 shadow-xl bg-[#0a101f] transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2"></div>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2 text-white">
              <Award className="h-5 w-5 text-yellow-400" />
              <span>{certificate.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4 text-gray-300">{certificate.description}</p>
            <div className="flex items-center text-sm text-gray-400 mb-6">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Earned on: {new Date(certificate.earnedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            
            {/* Certificate preview */}
            <div className="mb-6 rounded-md border border-yellow-500/30 p-4 bg-[#111827] relative overflow-hidden group">
              <div className="flex items-center justify-center h-40">
                {/* Certificate mini preview */}
                <div className="relative w-full max-w-[220px] aspect-[3/4] border-4 border-yellow-500/50 p-4 flex flex-col items-center text-center scale-90 group-hover:scale-100 transition-transform duration-300">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mb-2">
                    <Check className="h-5 w-5 text-[#0a101f]" />
                  </div>
                  <h4 className="text-[10px] text-yellow-400 font-bold mb-1">CERTIFICATE</h4>
                  <div className="text-[8px] text-gray-300 mb-1">This certifies that</div>
                  <div className="text-[12px] font-bold text-white">John Doe</div>
                  <div className="text-[8px] text-gray-300 mt-1 mb-1">has completed</div>
                  <div className="text-[10px] font-bold text-white">{certificate.name}</div>
                  <div className="mt-auto w-full border-t border-gray-700 pt-1 flex justify-around text-[6px] text-gray-400">
                    <div>ID: {certificate.id.slice(0, 6)}</div>
                    <div>DATE: {new Date(certificate.earnedDate).toLocaleDateString()}</div>
                  </div>
                </div>
                
                {/* Overlay with download button on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    onClick={() => handleDownload(certificate)} 
                    variant="outline"
                    size="sm"
                    className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Preview
                  </Button>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => handleDownload(certificate)} 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Certificate
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CertificateList;
