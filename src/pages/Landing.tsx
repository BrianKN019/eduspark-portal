
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RocketIcon, 
  Trophy, 
  Users, 
  FileVideo, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  Sparkles,
  Star,
  Brain,
  BarChart3,
  Zap,
  GraduationCap,
  Medal,
  Fingerprint
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

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

  const stats = [
    { value: "95%", label: "Completion Rate", icon: <CheckCircle2 className="h-6 w-6 text-green-500" /> },
    { value: "10K+", label: "Active Students", icon: <Users className="h-6 w-6 text-blue-500" /> },
    { value: "500+", label: "Premium Courses", icon: <BookOpen className="h-6 w-6 text-purple-500" /> },
    { value: "24/7", label: "Expert Support", icon: <Clock className="h-6 w-6 text-amber-500" /> },
  ];

  const features = [
    {
      title: "Personalized Learning Paths",
      description: "AI-powered learning paths customized to your goals and skill level",
      icon: <Brain className="h-6 w-6 text-purple-600" />
    },
    {
      title: "Interactive Live Classes",
      description: "Engage with instructors and peers in real-time collaborative sessions",
      icon: <FileVideo className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Achievement System",
      description: "Earn badges, certificates and rewards as you progress through courses",
      icon: <Trophy className="h-6 w-6 text-amber-600" />
    },
    {
      title: "Detailed Analytics",
      description: "Track your progress with comprehensive performance insights",
      icon: <BarChart3 className="h-6 w-6 text-green-600" />
    },
    {
      title: "Accelerated Learning",
      description: "Master concepts faster with our proven learning methodology",
      icon: <Zap className="h-6 w-6 text-orange-600" />
    },
    {
      title: "Industry Recognition",
      description: "Earn credentials valued by top employers worldwide",
      icon: <GraduationCap className="h-6 w-6 text-indigo-600" />
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      content: "EduSpark completely transformed my career path. The AI-driven course recommendations were spot on, and I landed my dream job within months of completing my learning path.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      content: "The interactive learning experience and community support made complex topics accessible. I've tried many platforms, but nothing compares to the engagement level here.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "UX Designer",
      content: "As someone who values both theoretical knowledge and practical application, EduSpark's project-based learning approach was perfect. The feedback from industry experts was invaluable.",
      rating: 5
    }
  ];

  return (
    <div className="overflow-hidden bg-gradient-to-b from-background to-background">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div 
              className="w-full lg:w-1/2 text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Badge className="mb-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                <span className="font-medium">ULTRA PREMIUM PRO MAX</span>
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-primary to-blue-600">
                Elevate Your Learning Experience
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 lg:pr-10">
                Unlock your potential with cutting-edge courses, AI-powered learning paths, and a vibrant community of learners and experts.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20">
                  <Link to="/login" className="flex items-center">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  Explore Courses
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-card rounded-2xl shadow-xl overflow-hidden border border-border/50">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" 
                    alt="Students learning" 
                    className="w-full h-[300px] md:h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
                        <RocketIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Advanced Learning</h3>
                        <p className="text-sm text-muted-foreground">Interactive & Engaging</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 border-t border-b border-border/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center p-6 bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-border/50"
                variants={fadeIn}
              >
                <div className="mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <Fingerprint className="h-3.5 w-3.5 mr-1" />
              <span className="font-medium">UNIQUE FEATURES</span>
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Unlock Your Full Potential
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with expert-designed curriculum to provide a learning experience unlike any other.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/50 group"
                variants={fadeIn}
              >
                <div className="w-12 h-12 mb-5 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50 border-t border-b border-border/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <Medal className="h-3.5 w-3.5 mr-1" />
              <span className="font-medium">SUCCESS STORIES</span>
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              What Our Students Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied learners who have transformed their careers and lives through our platform.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-card p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-border/50"
                variants={fadeIn}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Ready to Elevate Your Learning Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our community of learners today and take the first step towards mastering new skills and advancing your career.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20">
              <Link to="/login" className="flex items-center">
                Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
