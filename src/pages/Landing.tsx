
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  Users, 
  Award, 
  ChevronRight,
  CheckCircle,
  Star,
  Zap,
  Sparkles,
  Clock,
  Globe,
  Mail
} from 'lucide-react';

const Landing = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create a simple parallax effect
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPos = window.scrollY;
        heroRef.current.style.backgroundPositionY = `${scrollPos * 0.5}px`;
      }
    };
    
    // Add animated backgrounds for specific sections
    const animateStatsSection = () => {
      if (statsRef.current) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              statsRef.current?.classList.add('animate-fade-in');
              observer.unobserve(entry.target);
            }
          },
          { threshold: 0.1 }
        );
        
        observer.observe(statsRef.current);
      }
    };
    
    // Animate features on scroll
    const animateFeatures = () => {
      if (featuresRef.current) {
        const featureItems = featuresRef.current.querySelectorAll('.feature-item');
        
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry, index) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  entry.target.classList.add('animate-scale-in');
                  entry.target.classList.remove('opacity-0');
                }, index * 150);
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1 }
        );
        
        featureItems.forEach(item => {
          item.classList.add('opacity-0');
          observer.observe(item);
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    animateStatsSection();
    animateFeatures();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Animated Background */}
      <div 
        ref={heroRef}
        className="relative min-h-screen flex items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden"
      >
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="particles-container">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="particle absolute rounded-full bg-white opacity-20"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  animationDuration: `${Math.random() * 20 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Transform Your Learning Journey With <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">EduSpark</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Interactive courses, real-time collaboration, and personalized learning paths designed to accelerate your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none"
                asChild
              >
                <Link to="/login">
                  Get Started Now <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
                asChild
              >
                <a href="#features">
                  Explore Features
                </a>
              </Button>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-float">
            <Sparkles className="h-16 w-16 text-blue-400 opacity-50" />
          </div>
          <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 animate-float-delayed">
            <Award className="h-24 w-24 text-purple-400 opacity-50" />
          </div>
          <div className="absolute top-3/4 right-1/3 transform -translate-y-1/2 animate-float-slow">
            <BookOpen className="h-20 w-20 text-pink-400 opacity-50" />
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Stats Section */}
      <div ref={statsRef} className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Trusted by Thousands of Learners</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform connects enthusiastic learners with expert instructors and quality content.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard
              icon={<Users className="h-8 w-8 text-blue-500" />}
              value="50,000+"
              label="Active Learners"
              color="from-blue-500 to-blue-600"
              delay={0}
            />
            <StatCard
              icon={<BookOpen className="h-8 w-8 text-purple-500" />}
              value="500+"
              label="Courses Available"
              color="from-purple-500 to-purple-600"
              delay={0.2}
            />
            <StatCard
              icon={<Award className="h-8 w-8 text-pink-500" />}
              value="25,000+"
              label="Certificates Earned"
              color="from-pink-500 to-pink-600"
              delay={0.4}
            />
            <StatCard
              icon={<Star className="h-8 w-8 text-amber-500" />}
              value="4.8/5"
              label="Average Rating"
              color="from-amber-500 to-amber-600"
              delay={0.6}
            />
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" ref={featuresRef} className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Transform Your Learning Experience</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform offers cutting-edge features designed to enhance your educational journey.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-yellow-500" />}
              title="Interactive Learning"
              description="Engage with dynamic content, quizzes, and hands-on exercises that reinforce your understanding."
              gradient="from-yellow-50 to-amber-50"
              borderGradient="from-yellow-400 to-amber-400"
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-blue-500" />}
              title="Community Collaboration"
              description="Connect with fellow learners, participate in discussions, and share insights to enhance learning."
              gradient="from-blue-50 to-indigo-50"
              borderGradient="from-blue-400 to-indigo-400"
            />
            <FeatureCard
              icon={<Award className="h-10 w-10 text-purple-500" />}
              title="Recognized Certificates"
              description="Earn industry-recognized certificates to showcase your skills and knowledge to employers."
              gradient="from-purple-50 to-pink-50"
              borderGradient="from-purple-400 to-pink-400"
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-green-500" />}
              title="Flexible Learning"
              description="Learn at your own pace with 24/7 access to course materials and resources from any device."
              gradient="from-green-50 to-emerald-50"
              borderGradient="from-green-400 to-emerald-400"
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-violet-500" />}
              title="Personalized Paths"
              description="Follow customized learning paths designed to meet your specific career goals and interests."
              gradient="from-violet-50 to-purple-50"
              borderGradient="from-violet-400 to-purple-400"
            />
            <FeatureCard
              icon={<Globe className="h-10 w-10 text-cyan-500" />}
              title="Global Instructor Network"
              description="Learn from industry experts and educators from around the world with diverse perspectives."
              gradient="from-cyan-50 to-blue-50"
              borderGradient="from-cyan-400 to-blue-400"
            />
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">What Our Students Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of satisfied learners who have transformed their careers with EduSpark.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="Software Developer"
              testimonial="EduSpark helped me transition from marketing to software development in just 6 months. The structured learning paths and supportive community made all the difference."
              rating={5}
            />
            <TestimonialCard
              name="Michael Chen"
              role="Data Scientist"
              testimonial="The data science courses on EduSpark are comprehensive and practical. I was able to apply what I learned immediately in my job, earning a promotion within 3 months."
              rating={5}
            />
            <TestimonialCard
              name="Priya Patel"
              role="UX Designer"
              testimonial="As someone with no prior design experience, the UI/UX track on EduSpark gave me the skills and confidence to land my dream job at a top tech company."
              rating={4}
            />
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="particles-container">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i}
                className="particle absolute rounded-full bg-white opacity-20"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  animationDuration: `${Math.random() * 20 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your Future?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join EduSpark today and take the first step towards a brighter career and continuous growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link to="/login">
                  Start Learning Now <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
                asChild
              >
                <a href="#features">
                  Explore All Courses
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EduSpark</h3>
              <p className="text-gray-400 mb-4">Transforming education through technology and innovation.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Courses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Learning Paths</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resource Library</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <p className="text-gray-400 mb-4">Stay updated with our latest courses and news.</p>
              <form className="space-y-4">
                <div className="flex">
                  <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md transition-colors">
                    <Mail className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EduSpark Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* CSS for animations */}
      <style jsx>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 6s ease-in-out 2s infinite;
        }
        
        .animate-float-slow {
          animation: float 8s ease-in-out 1s infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .particle {
          position: absolute;
          animation: float-around 20s linear infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes float-around {
          0% { transform: translate(0, 0); }
          25% { transform: translate(100px, 100px); }
          50% { transform: translate(0, 200px); }
          75% { transform: translate(-100px, 100px); }
          100% { transform: translate(0, 0); }
        }
        
        .font-signature {
          font-family: 'Brush Script MT', cursive;
        }
      `}</style>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color, delay }) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden" 
      style={{ animationDelay: `${delay}s` }}>
      <div className={`h-2 w-full bg-gradient-to-r ${color}`}></div>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="mr-4 p-3 rounded-full bg-gray-100">{icon}</div>
          <div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-gray-500">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  borderGradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient, borderGradient }) => {
  return (
    <Card className={`feature-item border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${gradient} overflow-hidden`}>
      <div className={`h-2 w-full bg-gradient-to-r ${borderGradient}`}></div>
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">{icon}</div>
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Testimonial Card Component
interface TestimonialCardProps {
  name: string;
  role: string;
  testimonial: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, testimonial, rating }) => {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`inline-block h-5 w-5 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`} />
          ))}
        </div>
        <p className="text-gray-600 mb-6 italic">"{testimonial}"</p>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            {name.charAt(0)}
          </div>
          <div className="ml-4">
            <p className="font-bold">{name}</p>
            <p className="text-gray-500 text-sm">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Landing;
