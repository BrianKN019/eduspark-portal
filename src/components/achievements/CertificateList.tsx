import React from 'react';
import { Certificate } from '@/types/achievements';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

interface CertificateListProps {
  certificates: Certificate[];
}

const CertificateList: React.FC<CertificateListProps> = ({ certificates }) => {
  const handleDownload = (certificate: Certificate) => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = certificate.downloadUrl;
    link.download = `${certificate.name.replace(/\s+/g, '_')}_Certificate.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {certificates.map((certificate) => (
        <Card key={certificate.id} className="neumorphic-card neumorphic-convex">
          <CardHeader>
            <CardTitle>{certificate.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{certificate.description}</p>
            <p className="text-sm text-gray-500 mb-4">Earned on: {new Date(certificate.earnedDate).toLocaleDateString()}</p>
            <Button onClick={() => handleDownload(certificate)} className="neumorphic-button neumorphic-convex">
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