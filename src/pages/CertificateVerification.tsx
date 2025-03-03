
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Search, CheckCircle, XCircle, Calendar, User, BookOpen } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface VerifiedCertificate {
  id: string;
  name: string;
  courseName: string;
  studentName: string;
  earnedDate: string;
  isValid: boolean;
}

const CertificateVerification = () => {
  const [certificateId, setCertificateId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerifiedCertificate | null>(null);
  
  const handleVerify = async () => {
    if (!certificateId.trim()) {
      toast.error("Please enter a certificate ID");
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // Query the database for the certificate
      const { data: certificate, error } = await supabase
        .from('certificates')
        .select(`
          id,
          name,
          earned_date,
          courses:course_id (title),
          profiles:user_id (full_name)
        `)
        .eq('id', certificateId)
        .maybeSingle();
      
      if (error) {
        console.error("Error verifying certificate:", error);
        toast.error("Error verifying certificate. Please try again.");
        setVerificationResult(null);
      } else if (!certificate) {
        toast.error("Certificate not found. Please check the ID and try again.");
        setVerificationResult({
          id: certificateId,
          name: "Unknown Certificate",
          courseName: "Unknown Course",
          studentName: "Unknown Student",
          earnedDate: "N/A",
          isValid: false
        });
      } else {
        // Format and display the certificate information
        setVerificationResult({
          id: certificate.id,
          name: certificate.name,
          courseName: certificate.courses?.title || "Unknown Course",
          studentName: certificate.profiles?.full_name || "Unknown Student",
          earnedDate: certificate.earned_date,
          isValid: true
        });
        
        toast.success("Certificate verified successfully!");
      }
    } catch (error) {
      console.error("Exception during verification:", error);
      toast.error("Unexpected error during verification. Please try again.");
      setVerificationResult(null);
    } finally {
      setIsVerifying(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    if (dateString === "N/A") return dateString;
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="text-center mb-10">
        <div className="inline-block p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
          <Award className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Certificate Verification</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
          Verify the authenticity of an EduSpark certificate by entering the certificate ID below.
        </p>
      </div>
      
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
        <CardHeader>
          <CardTitle className="text-xl">Verify Certificate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <Input 
                  placeholder="Enter certificate ID" 
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handleVerify} 
                disabled={isVerifying || !certificateId.trim()}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
              >
                {isVerifying ? (
                  <>Verifying...</>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Verify
                  </>
                )}
              </Button>
            </div>
            
            {verificationResult && (
              <div className="mt-8 border rounded-lg overflow-hidden">
                <div className={`p-4 flex items-center ${verificationResult.isValid ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
                  {verificationResult.isValid ? (
                    <CheckCircle className="h-6 w-6 mr-2" />
                  ) : (
                    <XCircle className="h-6 w-6 mr-2" />
                  )}
                  <span className="font-semibold">
                    {verificationResult.isValid ? 
                      'Certificate is valid and authentic' : 
                      'Certificate is not valid or not found in our records'}
                  </span>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Certificate ID</h3>
                        <p className="font-medium">{verificationResult.id}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <Award className="mr-2 h-4 w-4" /> Certificate Name
                        </h3>
                        <p className="font-medium">{verificationResult.name}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <User className="mr-2 h-4 w-4" /> Issued To
                        </h3>
                        <p className="font-medium">{verificationResult.studentName}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <BookOpen className="mr-2 h-4 w-4" /> Course Name
                        </h3>
                        <p className="font-medium">{verificationResult.courseName}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="mr-2 h-4 w-4" /> Issue Date
                        </h3>
                        <p className="font-medium">{formatDate(verificationResult.earnedDate)}</p>
                      </div>
                      
                      {verificationResult.isValid && (
                        <div className="pt-4">
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <CheckCircle className="mr-1 h-3 w-3" /> Verified
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!verificationResult.isValid && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                      <p className="text-amber-800 dark:text-amber-300 text-sm">
                        If you believe this is an error, please contact our support team with the certificate details.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-10 text-center">
        <h2 className="text-xl font-semibold mb-4">How to Verify a Certificate</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="inline-block p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Find the Certificate ID</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Locate the unique ID on the certificate. It's usually at the bottom of the certificate.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="inline-block p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                <Input className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Enter the ID Above</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Type or paste the certificate ID into the verification field and click Verify.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="inline-block p-3 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">View Verification Result</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                The system will display the certificate details and confirm its authenticity.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CertificateVerification;
