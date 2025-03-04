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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center text-2xl font-bold text-gray-800 dark:text-white">
            <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 4.75 7.5 4.75a4.875 4.875 0 00-4.875 4.875c0 1.076.33 2.052.932 2.879l.597.459m0-4.511l-.597.459m3.475 5.617c.931.718 2.299 1.153 3.757 1.153a4.875 4.875 0 004.875-4.875c0-1.076-.33-2.052-.932-2.879l-.597-.459m0 4.511l.597-.459m-3.475-5.617c-.931-.718-2.299-1.153-3.757-1.153a4.875 4.875 0 00-4.875 4.875c0 1.076.33 2.052.932 2.879l.597.459m0-4.511l-.597.459m3.475 5.617c.931.718 2.299 1.153 3.757 1.153a4.875 4.875 0 004.875-4.875c0-1.076-.33-2.052-.932-2.879l-.597-.459m0 4.511l.597-.459"></path>
            </svg>
            EduPro
          </Link>
          <div className="space-x-4">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate('/login')} variant="ghost" className="text-gray-700 dark:text-gray-300">
                  Log In
                </Button>
                <Button onClick={handleGetStarted} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-bold text-gray-900 dark:text-white mb-8"
          >
            Unlock Your Potential with Expert-Led Courses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-700 dark:text-gray-300 mb-12"
          >
            Join a community of learners and gain the skills you need to succeed.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button onClick={handleGetStarted} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-8 rounded-full text-lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Explore Our Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4 text-purple-600 dark:text-purple-400">
                  <feature.icon className="h-6 w-6 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">{feature.name}</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What Our Learners Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex items-center mb-4">
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
                <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
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
