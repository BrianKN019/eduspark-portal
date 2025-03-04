
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, Search, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const CertificateVerification: React.FC = () => {
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failure' | null>(null);
  const [certificateData, setCertificateData] = useState<{
    studentName: string;
    courseName: string;
    issueDate: string;
    expiryDate?: string;
  } | null>(null);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }
    
    setLoading(true);
    
    try {
      // Mock verification - in real implementation, this would call the Supabase backend
      setTimeout(() => {
        if (certificateId === 'CERT-123456' || certificateId === 'CERT-654321') {
          setVerificationResult('success');
          setCertificateData({
            studentName: 'John Doe',
            courseName: certificateId === 'CERT-123456' ? 'Advanced React Development' : 'Full Stack Web Development',
            issueDate: '2025-02-15',
            expiryDate: '2028-02-15'
          });
          toast.success('Certificate verified successfully');
        } else {
          setVerificationResult('failure');
          setCertificateData(null);
          toast.error('Certificate not found or invalid');
        }
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An error occurred during verification');
      setLoading(false);
      setVerificationResult('failure');
    }
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setCertificateData(null);
    setCertificateId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-8 left-8 flex items-center text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <Card className="border-border/50 shadow-xl bg-card/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Certificate Verification
            </CardTitle>
            <CardDescription>
              Verify the authenticity of an EduPro certificate using the unique certificate ID
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {verificationResult === null ? (
              <form onSubmit={handleVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certificateId">Certificate ID</Label>
                  <div className="relative">
                    <Input 
                      id="certificateId"
                      placeholder="e.g. CERT-123456"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      className="pl-10"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The certificate ID can be found at the bottom of your certificate
                  </p>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="py-4"
              >
                <div className="flex flex-col items-center space-y-4">
                  {verificationResult === 'success' ? (
                    <>
                      <div className="bg-green-500/20 rounded-full p-3">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">Certificate Verified</h3>
                      
                      {certificateData && (
                        <div className="w-full bg-card border border-border/50 rounded-lg p-4 space-y-3 mt-2">
                          <div className="grid grid-cols-3 gap-2 items-center">
                            <span className="text-sm font-medium text-foreground/70">Student Name:</span>
                            <span className="col-span-2 font-semibold">{certificateData.studentName}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 items-center">
                            <span className="text-sm font-medium text-foreground/70">Course:</span>
                            <span className="col-span-2 font-semibold">{certificateData.courseName}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 items-center">
                            <span className="text-sm font-medium text-foreground/70">Issue Date:</span>
                            <span className="col-span-2">{certificateData.issueDate}</span>
                          </div>
                          {certificateData.expiryDate && (
                            <div className="grid grid-cols-3 gap-2 items-center">
                              <span className="text-sm font-medium text-foreground/70">Expiry Date:</span>
                              <span className="col-span-2">{certificateData.expiryDate}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="bg-red-500/20 rounded-full p-3">
                        <XCircle className="h-12 w-12 text-red-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">Verification Failed</h3>
                      <p className="text-center text-muted-foreground">
                        The certificate ID you provided could not be verified. Please check the ID and try again,
                        or contact support for assistance.
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center">
            {verificationResult === null ? (
              <Button 
                onClick={handleVerification}
                disabled={loading || !certificateId.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify Certificate'
                )}
              </Button>
            ) : (
              <Button 
                onClick={resetVerification}
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10"
              >
                Verify Another Certificate
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default CertificateVerification;
