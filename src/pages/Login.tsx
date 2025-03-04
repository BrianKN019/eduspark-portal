
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus, LogIn, ArrowLeft, ChevronRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success("Successfully logged in!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Error logging in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success("Registration successful! Please check your email for verification.");
    } catch (error: any) {
      toast.error(error.message || "Error signing up");
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login and register tabs
  const toggleTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="text-primary hover:text-primary-foreground hover:bg-primary flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row items-stretch">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-600 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10 backdrop-blur-sm"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              {/* Abstract pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path className="fill-white" d="M0,0 L100,0 L100,100 L0,100 Z" />
                <path className="fill-white" d="M0,0 C40,40 60,40 100,0 L100,100 L0,100 Z" />
                <path className="fill-white" d="M0,100 C40,60 60,60 100,100 L100,0 L0,0 Z" />
              </svg>
            </div>
          </div>
          
          <div className="relative z-10 max-w-md mx-auto text-white">
            <div className="flex items-center space-x-2 mb-8">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-2xl text-white">EduPro</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Unlock Your Learning Potential</h1>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of learners advancing their careers with premium courses and expert guidance.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <ChevronRight className="h-5 w-5" />
                </div>
                <p className="text-white/90">Access to 500+ premium courses</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <ChevronRight className="h-5 w-5" />
                </div>
                <p className="text-white/90">Interactive learning experiences</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <ChevronRight className="h-5 w-5" />
                </div>
                <p className="text-white/90">Verified certificates</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <ChevronRight className="h-5 w-5" />
                </div>
                <p className="text-white/90">Supportive community</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Right side - Auth form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12"
        >
          <Card className="w-full max-w-md mx-auto border-border/50 shadow-xl bg-card/90 backdrop-blur-sm">
            <Tabs value={activeTab} onValueChange={toggleTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <LogIn className="h-4 w-4 mr-2" /> Log In
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <UserPlus className="h-4 w-4 mr-2" /> Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center mb-2">Welcome Back</CardTitle>
                    <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-background/50"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 bg-background/50"
                          required
                        />
                      </div>
                      <div className="text-right">
                        <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-5"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Logging in...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <LogIn className="mr-2 h-4 w-4" /> Log In
                        </span>
                      )}
                    </Button>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                      Don't have an account? 
                      <span 
                        className="text-primary hover:underline cursor-pointer ml-1" 
                        onClick={() => toggleTab("register")}
                      >
                        Sign up
                      </span>
                    </p>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleSignUp}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center mb-2">Create Account</CardTitle>
                    <CardDescription className="text-center">Enter your details to create your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 bg-background/50"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-background/50"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 bg-background/50"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 6 characters long
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-5"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating account...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <UserPlus className="mr-2 h-4 w-4" /> Create Account
                        </span>
                      )}
                    </Button>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                      Already have an account? 
                      <span 
                        className="text-primary hover:underline cursor-pointer ml-1" 
                        onClick={() => toggleTab("login")}
                      >
                        Log in
                      </span>
                    </p>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
