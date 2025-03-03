
import React from 'react';
import { Certificate } from '@/types/achievements';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award, Calendar } from 'lucide-react';
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
        <div id="certificate-${certificate.id}" style="width: 800px; height: 600px; padding: 40px; background-color: #fff; position: absolute; left: -9999px; font-family: Arial, sans-serif;">
          <div style="border: 10px double gold; height: 100%; padding: 20px; box-sizing: border-box; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(rgba(255,255,255,0.92), rgba(255,255,255,0.92)), url('https://img.freepik.com/free-vector/abstract-background-with-squares_23-2148995948.jpg'); background-size: cover;">
            <div style="position: absolute; top: 10px; left: 10px; right: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px; text-align: center;">
              <h1 style="margin: 0; color: #333; font-size: 24px;">CERTIFICATE OF COMPLETION</h1>
            </div>
            
            <div style="margin-top: 60px; text-align: center;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Wikimedia-logo.png" alt="Logo" style="width: 80px; height: 80px; margin-bottom: 20px;" />
              <h2 style="margin: 0; color: #333; font-size: 20px;">This is to certify that</h2>
              <h1 style="margin: 15px 0; color: #1a5fb4; font-size: 32px; font-family: 'Brush Script MT', cursive;">John Doe</h1>
              <p style="margin: 10px 0; font-size: 18px;">has successfully completed the course</p>
              <h3 style="margin: 15px 0; color: #2c3e50; font-size: 26px;">${certificate.name}</h3>
              <p style="margin: 10px 0; font-size: 16px;">${certificate.description}</p>
            </div>
            
            <div style="position: absolute; bottom: 60px; left: 0; right: 0; display: flex; justify-content: space-between; padding: 0 50px;">
              <div style="text-align: center;">
                <div style="width: 150px; border-top: 1px solid #333;"></div>
                <p style="margin: 5px 0; font-size: 14px;">Instructor Signature</p>
              </div>
              <div style="text-align: center;">
                <div style="width: 150px; border-top: 1px solid #333;"></div>
                <p style="margin: 5px 0; font-size: 14px;">Date: ${new Date(certificate.earnedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
            
            <div style="position: absolute; bottom: 10px; left: 0; right: 0; text-align: center; font-size: 12px; color: #666;">
              <p>Certificate ID: ${certificate.id}</p>
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
          useCORS: true
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        
        // Calculate dimensions to fit properly on a single page
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
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
      <div className="flex flex-col items-center justify-center p-10 text-center">
        <Award className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Certificates Yet</h3>
        <p className="text-gray-500">Complete courses to earn certificates that will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {certificates.map((certificate) => (
        <Card key={certificate.id} className="overflow-hidden border-0 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2"></div>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span>{certificate.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{certificate.description}</p>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Earned on: {new Date(certificate.earnedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <Button 
              onClick={() => handleDownload(certificate)} 
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-medium"
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
