
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Award, Search, Shield, CheckCircle, XCircle, RefreshCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface VerificationResult {
  valid: boolean;
  certificate?: {
    name: string;
    user_name: string;
    course_name: string;
    issued_date: string;
  };
}

const CertificateVerification: React.FC = () => {
  const [certificateId, setCertificateId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateId.trim()) {
      toast.error("Please enter a Certificate ID");
      return;
    }
    
    setIsVerifying(true);
    setResult(null);
    
    try {
      // Check certificate against the database
      const { data: certificate, error } = await supabase
        .from('certificates')
        .select(`
          id,
          name,
          earned_date,
          course_id,
          user_id,
          courses:course_id (title),
          profiles:user_id (full_name)
        `)
        .eq('id', certificateId)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (certificate) {
        setResult({
          valid: true,
          certificate: {
            name: certificate.name,
            user_name: certificate.profiles?.full_name || 'Unknown User',
            course_name: certificate.courses?.title || 'Unknown Course',
            issued_date: new Date(certificate.earned_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }
        });
      } else {
        setResult({ valid: false });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error("Failed to verify certificate. Please try again.");
      setResult({ valid: false });
    } finally {
      setIsVerifying(false);
    }
  };

  const resetVerification = () => {
    setCertificateId('');
    setResult(null);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-12">
          <div className="inline-block p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
            <Shield className="h-16 w-16 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Certificate Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xl mx-auto">
            Verify the authenticity of an EduSpark certificate by entering the certificate ID below.
          </p>
        </div>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-6 w-6 text-yellow-500" />
              Verify Certificate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label htmlFor="certificate-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Certificate ID
                </label>
                <div className="relative">
                  <Input
                    id="certificate-id"
                    type="text"
                    placeholder="Enter the certificate ID (UUID format)"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    className="pr-10"
                    disabled={isVerifying}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  The Certificate ID is a unique identifier found on the certificate.
                </p>
              </div>

              <div className="flex justify-center">
                <Button 
                  type="submit"
                  disabled={isVerifying}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 w-full max-w-xs"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Verify Certificate
                    </>
                  )}
                </Button>
              </div>
            </form>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 rounded-lg overflow-hidden"
              >
                {result.valid ? (
                  <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <div className="rounded-full bg-green-100 dark:bg-green-800 p-2">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="ml-3 font-bold text-green-700 dark:text-green-400">
                        Valid Certificate
                      </h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Certificate Name</p>
                        <p className="font-medium">{result.certificate?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Issued To</p>
                        <p className="font-medium">{result.certificate?.user_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Course</p>
                        <p className="font-medium">{result.certificate?.course_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Issue Date</p>
                        <p className="font-medium">{result.certificate?.issued_date}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <div className="rounded-full bg-red-100 dark:bg-red-800 p-2">
                        <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className="ml-3 font-bold text-red-700 dark:text-red-400">
                        Invalid Certificate
                      </h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      The certificate ID you provided could not be verified in our system. Please check the ID and try again.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 border-red-200 hover:bg-red-50 text-red-600 dark:border-red-800 dark:hover:bg-red-900/20 dark:text-red-400"
                      onClick={resetVerification}
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>

        <div className="mt-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">About Certificate Verification</h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Our certificate verification system allows employers, institutions, and other third parties to verify the authenticity of certificates issued by EduSpark.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Each certificate has a unique identifier that can be used to confirm its validity and retrieve details about the achievement it represents.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              If you have any questions about the verification process, please contact our support team.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CertificateVerification;
