
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, Search, CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
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
      console.log('Verifying certificate ID:', certificateId);
      
      // Query Supabase for the certificate without assuming it's a UUID
      const { data: certificate, error } = await supabase
        .from('certificates')
        .select(`
          id,
          name,
          earned_date,
          user_id,
          course_id,
          courses(title),
          profiles(full_name)
        `)
        .eq('id', certificateId)
        .single();
      
      if (error) {
        console.error('Certificate lookup error:', error);
        setVerificationResult('failure');
        setCertificateData(null);
        toast.error('Certificate not found or invalid');
        setLoading(false);
        return;
      }
      
      // Certificate found
      console.log('Certificate verified:', certificate);
      setVerificationResult('success');
      setCertificateData({
        studentName: certificate.profiles?.full_name || 'Student',
        courseName: certificate.courses?.title || certificate.name,
        issueDate: certificate.earned_date,
        expiryDate: new Date(new Date(certificate.earned_date).getFullYear() + 3, 
                           new Date(certificate.earned_date).getMonth(), 
                           new Date(certificate.earned_date).getDate()).toISOString()
      });
      
      toast.success('Certificate verified successfully');
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An error occurred during verification');
      setVerificationResult('failure');
      setCertificateData(null);
    } finally {
      setLoading(false);
    }
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setCertificateData(null);
    setCertificateId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a101f] to-[#111827] flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-8 left-8 flex items-center text-yellow-400 hover:text-yellow-300 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <Card className="border-yellow-500/20 shadow-xl bg-[#0a101f]/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto bg-yellow-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-yellow-400" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              Certificate Verification
            </CardTitle>
            <CardDescription className="text-gray-300">
              Verify the authenticity of an EduSpark certificate using the unique certificate ID
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {verificationResult === null ? (
              <form onSubmit={handleVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certificateId" className="text-gray-200">Certificate ID</Label>
                  <div className="relative">
                    <Input 
                      id="certificateId"
                      placeholder="e.g. CERT-123456"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      className="pl-10 bg-[#111827] border-yellow-500/20 text-white"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
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
                      <h3 className="text-xl font-semibold text-green-400">Certificate Verified</h3>
                      
                      {certificateData && (
                        <div className="w-full bg-[#111827] border border-yellow-500/20 rounded-lg p-4 space-y-3 mt-2">
                          <div className="grid grid-cols-3 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-400">Student Name:</span>
                            <span className="col-span-2 font-semibold text-white">{certificateData.studentName}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-400">Course:</span>
                            <span className="col-span-2 font-semibold text-white">{certificateData.courseName}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 items-center">
                            <span className="text-sm font-medium text-gray-400">Issue Date:</span>
                            <span className="col-span-2 text-gray-200">{new Date(certificateData.issueDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                          {certificateData.expiryDate && (
                            <div className="grid grid-cols-3 gap-2 items-center">
                              <span className="text-sm font-medium text-gray-400">Expiry Date:</span>
                              <span className="col-span-2 text-gray-200">{new Date(certificateData.expiryDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
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
                      <h3 className="text-xl font-semibold text-red-400">Verification Failed</h3>
                      <p className="text-center text-gray-300">
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
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
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
