
import React from 'react';
import { Certificate } from '@/types/achievements';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award, Calendar } from 'lucide-react';
import { toast } from "sonner";

interface CertificateListProps {
  certificates: Certificate[];
}

const CertificateList: React.FC<CertificateListProps> = ({ certificates }) => {
  const handleDownload = (certificate: Certificate) => {
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = certificate.downloadUrl;
      link.download = `${certificate.name.replace(/\s+/g, '_')}_Certificate.pdf`;
      link.target = "_blank"; // Opens in a new tab
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${certificate.name} opened successfully!`);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error("Failed to open certificate. Please try again.");
    }
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
              View Certificate
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CertificateList;
