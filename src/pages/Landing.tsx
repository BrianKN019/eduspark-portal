
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Check, Star, Users, Award, BookOpen, Zap, ArrowRight, Code, Globe, Lock } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

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
            <a href="#faq" className="text-foreground/80 hover:text-primary transition-colors">FAQ</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="text-primary hover:text-primary-foreground hover:bg-primary"
            >
              Log In
            </Button>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Get Started
            </Button>
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text leading-tight">
              Accelerate Your Career With Expert-Led Courses
            </h1>
            <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
              Elevate your skills with our premium courses designed by industry experts. Join thousands of professionals growing their careers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <Button 
                onClick={() => navigate('/login')}
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
            <div className="flex items-center justify-center gap-6 text-foreground/60">
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
            className="mt-16 max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-primary/20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img 
              src="https://placehold.co/1200x600/5046e5/white?text=EduPro+Dashboard+Preview" 
              alt="Platform Dashboard" 
              className="w-full h-auto object-cover"
            />
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
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
            {[
              {
                icon: <BookOpen className="h-8 w-8 text-purple-500" />,
                title: "Expert-Led Courses",
                description: "Learn from industry leaders and experts with years of real-world experience in their fields."
              },
              {
                icon: <Award className="h-8 w-8 text-blue-500" />,
                title: "Recognized Certificates",
                description: "Earn certificates recognized by top companies and enhance your professional credibility."
              },
              {
                icon: <Zap className="h-8 w-8 text-yellow-500" />,
                title: "Accelerated Learning",
                description: "Our structured curriculum helps you learn complex skills in record time."
              },
              {
                icon: <Users className="h-8 w-8 text-green-500" />,
                title: "Community Support",
                description: "Join a thriving community of learners and professionals for networking and collaboration."
              },
              {
                icon: <Code className="h-8 w-8 text-red-500" />,
                title: "Hands-on Projects",
                description: "Apply your knowledge through practical projects that build your portfolio."
              },
              {
                icon: <Globe className="h-8 w-8 text-indigo-500" />,
                title: "Lifetime Access",
                description: "Purchase once and enjoy lifetime access to course content and future updates."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                variants={fadeIn}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              What Our Students Say
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Hear from our community of learners who transformed their careers with our platform.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The courses on this platform completely transformed my career path. I went from a junior developer to a senior position in just 8 months!",
                author: "Sarah Johnson",
                role: "Senior Frontend Developer",
                image: "https://randomuser.me/api/portraits/women/32.jpg"
              },
              {
                quote: "As someone transitioning careers, these courses provided exactly what I needed - practical skills with real-world applications. Worth every penny!",
                author: "Michael Chen",
                role: "Data Scientist",
                image: "https://randomuser.me/api/portraits/men/46.jpg"
              },
              {
                quote: "The community and mentorship aspects set this platform apart. I not only learned new skills but also made valuable connections in my industry.",
                author: "Jessica Williams",
                role: "Product Manager",
                image: "https://randomuser.me/api/portraits/women/65.jpg"
              }
            ].map((testimonial, index) => (
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
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img src={testimonial.image} alt={testimonial.author} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-foreground/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-background/30 to-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              Simple Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Choose Your Learning Plan
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              Flexible options to fit your learning goals and budget.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Standard",
                price: "$19",
                period: "per month",
                description: "Perfect for individual learners",
                features: [
                  "Access to 100+ courses",
                  "Community forum access",
                  "Monthly webinars",
                  "Email support",
                  "Course completion certificates"
                ],
                isFeatured: false,
                ctaText: "Get Started"
              },
              {
                name: "Pro",
                price: "$49",
                period: "per month",
                description: "Best for serious career advancement",
                features: [
                  "Access to all 500+ courses",
                  "Priority community support",
                  "Weekly live Q&A sessions",
                  "1-on-1 mentor sessions monthly",
                  "Industry-recognized certificates",
                  "Job placement assistance"
                ],
                isFeatured: true,
                ctaText: "Get Pro Access"
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "per team",
                description: "For teams and organizations",
                features: [
                  "Custom learning paths",
                  "Dedicated account manager",
                  "Team progress analytics",
                  "API access",
                  "Custom certification",
                  "LMS integration"
                ],
                isFeatured: false,
                ctaText: "Contact Us"
              }
            ].map((plan, index) => (
              <motion.div 
                key={index}
                className={`${
                  plan.isFeatured 
                    ? 'border-primary/50 bg-gradient-to-b from-primary/5 to-transparent ring-2 ring-primary/20' 
                    : 'border-border bg-card/60'
                } backdrop-blur-sm border rounded-xl overflow-hidden relative`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.isFeatured && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-foreground/60 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-foreground/70 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.isFeatured
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                    onClick={() => navigate('/login')}
                  >
                    {plan.ctaText}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-primary/20 rounded-2xl p-10 text-center max-w-4xl mx-auto backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of successful learners today and take the first step toward your professional growth.
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-6"
              size="lg"
            >
              Start Your Learning Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">EduPro</span>
              </div>
              <p className="text-foreground/70 mb-4">
                Premium learning experiences for modern professionals.
              </p>
              <div className="flex space-x-4">
                {/* Social icons would go here */}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Platform</h4>
              <ul className="space-y-2 text-foreground/70">
                <li><a href="#" className="hover:text-primary">Courses</a></li>
                <li><a href="#" className="hover:text-primary">Learning Paths</a></li>
                <li><a href="#" className="hover:text-primary">Certificates</a></li>
                <li><a href="#" className="hover:text-primary">For Teams</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-foreground/70">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-foreground/70">
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center text-foreground/60 text-sm">
            <p>© 2023 EduPro Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
