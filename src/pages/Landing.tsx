
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { 
  ChevronRight, Check, Star, Users, Award, BookOpen, Zap, 
  ArrowRight, Code, Globe, Lock, Map, TrendingUp, Play,
  Search, ShieldCheck
} from 'lucide-react';
import FooterLink from '@/components/FooterLink';
import { useAuth } from '@/contexts/AuthContext';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      name: 'Personalized Learning Paths',
      description: 'Tailored learning experiences that adapt to your unique goals and skill levels.',
      icon: TrendingUp,
    },
    {
      name: 'Expert Instructors',
      description: 'Learn from industry-leading experts with years of experience in their respective fields.',
      icon: Users,
    },
    {
      name: 'Interactive Courses',
      description: 'Engaging content with quizzes, assignments, and real-world projects to enhance your understanding.',
      icon: BookOpen,
    },
    {
      name: 'Community Support',
      description: 'Connect with fellow learners, share insights, and collaborate on projects.',
      icon: Globe,
    },
    {
      name: 'Certificate Verification',
      description: 'Verify your achievements with blockchain-based certificates that showcase your skills.',
      icon: ShieldCheck,
    },
    {
      name: 'Mobile Access',
      description: 'Learn anytime, anywhere with our mobile-friendly platform.',
      icon: Zap,
    },
  ];

  const testimonials = [
    {
      name: 'Alice Johnson',
      title: 'Software Engineer',
      quote: 'EduPro helped me transition into a new career in tech. The courses are well-structured and the instructors are incredibly supportive.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b2933e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80',
    },
    {
      name: 'Bob Williams',
      title: 'Data Scientist',
      quote: 'I was able to upskill quickly with EduPro and land a job at a top company. The hands-on projects were invaluable.',
      image: 'https://images.unsplash.com/photo-1500648767791-00d0cb3dfaf5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80',
    },
    {
      name: 'Charlie Brown',
      title: 'UX Designer',
      quote: 'The design courses on EduPro are top-notch. I learned the latest tools and techniques and built a stunning portfolio.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228247?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=80',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-background to-background/80 min-h-screen">
      {/* Premium Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">EduPro</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">Features</a>
            <a href="#testimonials" className="text-foreground/80 hover:text-primary transition-colors">Testimonials</a>
            <a href="#pricing" className="text-foreground/80 hover:text-primary transition-colors">Pricing</a>
            <a href="#certificates" className="text-foreground/80 hover:text-primary transition-colors">Certificates</a>
            <a href="#faq" className="text-foreground/80 hover:text-primary transition-colors">FAQ</a>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-primary hover:text-primary-foreground hover:bg-primary"
                >
                  Log In
                </Button>
                <Button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              #1 Learning Platform for Professionals
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 leading-tight">
              Accelerate Your Career With Expert-Led Courses
            </h1>
            <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
              Elevate your skills with our premium courses designed by industry experts. Join thousands of professionals growing their careers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-6"
                size="lg"
              >
                Start Learning Now <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10"
                size="lg"
                onClick={() => window.open('#demo', '_blank')}
              >
                Watch Demo
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-foreground/60">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span>10,000+ Learners</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-500" />
                <span>500+ Courses</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-16 max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-primary/20 relative border border-purple-500/30 group"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Animated border effect */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 animate-border-flow"></div>
            
            <div className="relative z-10 w-full h-full p-0.5">
              <div className="bg-background/90 w-full h-full rounded-xl overflow-hidden">
                <img 
                  src="/lovable-uploads/d93226ad-8145-47e0-ac2d-5f76e44283fc.png" 
                  alt="EduPro Dashboard Preview" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-background/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Premium Learning Experience
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Explore the features that make our platform the top choice for professionals.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                variants={fadeIn}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.name}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Active Students" },
              { value: "500+", label: "Premium Courses" },
              { value: "200+", label: "Expert Instructors" },
              { value: "98%", label: "Satisfaction Rate" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-2">{stat.value}</h3>
                <p className="text-foreground/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-background to-background/90">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Student Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              What Our Students Say
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Hear from our community of learners who transformed their careers with our platform.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-8 hover:shadow-xl relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-6xl text-primary/20 absolute top-4 left-4">"</div>
                <p className="text-foreground/80 mb-6 relative z-10">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Verification Section */}
      <section id="certificates" className="py-20 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Trust & Verification
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Verified Digital Certificates
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Our certificates are secure, verifiable, and recognized by employers worldwide.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <div className="space-y-6">
                <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Secure & Tamper-Proof</h3>
                      <p className="text-foreground/70">
                        Our certificates use advanced encryption technology to ensure they cannot be forged or tampered with.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Globe className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Globally Recognized</h3>
                      <p className="text-foreground/70">
                        Our certificates are recognized by leading employers and educational institutions worldwide.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Search className="h-6 w-6 text-purple-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Instantly Verifiable</h3>
                      <p className="text-foreground/70">
                        Employers can instantly verify the authenticity of certificates using our online verification system.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="bg-card/70 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-xl relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-b from-purple-600/20 to-transparent rounded-full transform translate-x-16 -translate-y-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-t from-blue-600/20 to-transparent rounded-full transform -translate-x-16 translate-y-16 blur-3xl"></div>
                
                <div className="p-8 relative z-10">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-center mb-6">Verify a Certificate</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-background/50 border border-border/50 rounded-lg p-6">
                      <img 
                        src="https://placehold.co/400x250/5046e5/white?text=Certificate+Preview" 
                        alt="Certificate Preview" 
                        className="w-full h-auto rounded-md mb-4"
                      />
                      <div className="text-center">
                        <p className="text-sm text-foreground/70">
                          Enter your certificate ID to verify its authenticity
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/verify-certificate')}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    size="lg"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Verify Certificate
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold text-white mb-8"
          >
            Ready to Transform Your Career?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-white mb-12"
          >
            Start learning today and unlock new opportunities.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button onClick={handleGetStarted} className="bg-white text-purple-600 hover:bg-gray-100 py-3 px-8 rounded-full text-lg font-semibold">
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer with updated navigation */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">EduPro</h3>
              <p className="text-gray-400 text-sm">
                Empowering education through technology and innovation. Join thousands of learners on their journey to success.
              </p>
              <div className="flex space-x-4 pt-2">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <FooterLink to="/dashboard" requiresAuth={true}>Dashboard</FooterLink>
                </li>
                <li>
                  <FooterLink to="/dashboard/courses" requiresAuth={true}>Courses</FooterLink>
                </li>
                <li>
                  <FooterLink to="/dashboard/learning-paths" requiresAuth={true}>Learning Paths</FooterLink>
                </li>
                <li>
                  <FooterLink to="/dashboard/community" requiresAuth={true}>Community</FooterLink>
                </li>
                <li>
                  <FooterLink to="/verify-certificate">Certificate Verification</FooterLink>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <FooterLink to="/dashboard/resource-library" requiresAuth={true}>Resource Library</FooterLink>
                </li>
                <li>
                  <FooterLink to="/dashboard/live-classes" requiresAuth={true}>Live Classes</FooterLink>
                </li>
                <li>
                  <FooterLink to="/dashboard/discussions" requiresAuth={true}>Discussions</FooterLink>
                </li>
                <li>
                  <FooterLink to="/dashboard/achievements" requiresAuth={true}>Achievements</FooterLink>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Account</h3>
              <ul className="space-y-3">
                <li>
                  <FooterLink to="/login">Login / Register</FooterLink>
                </li>
                <li>
                  <FooterLink to="/dashboard/profile" requiresAuth={true}>My Profile</FooterLink>
                </li>
                <li>
                  <FooterLink to="/dashboard/settings" requiresAuth={true}>Settings</FooterLink>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2025 EduPro. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
      
      <style>
        {`
        @keyframes borderFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-border-flow {
          background: linear-gradient(
            90deg,
            rgba(139, 92, 246, 0.7),
            rgba(59, 130, 246, 0.7),
            rgba(139, 92, 246, 0.7)
          );
          animation: borderFlow 8s ease infinite;
          background-size: 300% 300%;
          padding: 2px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .group:hover .animate-border-flow {
          opacity: 1;
        }
        `}
      </style>
    </div>
  );
};

export default Landing;
