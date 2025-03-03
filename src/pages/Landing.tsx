
// src/pages/Landing.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle, Rocket, ShieldCheck, GraduationCap, 
  Lightbulb, Users, Code, MessageSquare, BookOpenCheck, 
  LayoutDashboard, Sparkles, UserPlus, FileCode2, BrainCircuit, 
  Search, Presentation, FileSearch2, ScrollText, ListChecks, 
  BadgeCheck, CalendarCheck2, User2 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Landing = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage for theme preference on mount
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const subscribe = async () => {
    setIsSubmitting(true);
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast({
      title: "Subscription Successful!",
      description: "Thank you for subscribing to our newsletter.",
    });
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const FeatureCard = ({ title, description, icon: Icon }) => (
    <motion.div variants={cardVariants} className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4 text-purple-600 dark:text-purple-400">
        <Icon className="h-6 w-6 mr-2" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );

  const FAQItem = ({ question, answer }) => (
    <AccordionItem value={question}>
      <AccordionTrigger className="font-semibold text-lg">{question}</AccordionTrigger>
      <AccordionContent className="text-gray-600 dark:text-gray-300">{answer}</AccordionContent>
    </AccordionItem>
  );

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen flex flex-col"
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500"
              variants={fadeInUp}
            >
              Unlock Your Potential with EduSpark
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8"
              variants={fadeInUp}
            >
              The ultimate platform for online learning and skill development.
            </motion.p>
            <motion.div className="flex justify-center space-x-4" variants={fadeInUp}>
              <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700" asChild>
                <Link to="/courses">Explore Courses <ArrowRight className="ml-2" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700" asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-700">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h2
              className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4"
              variants={fadeInUp}
            >
              Key Features
            </motion.h2>
            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300"
              variants={fadeInUp}
            >
              Explore the features that make EduSpark the best choice for your learning journey.
            </motion.p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <FeatureCard
              title="Interactive Courses"
              description="Engaging content with quizzes, assignments, and real-time feedback."
              icon={Lightbulb}
            />
            <FeatureCard
              title="Expert Instructors"
              description="Learn from industry experts with years of experience."
              icon={GraduationCap}
            />
            <FeatureCard
              title="Personalized Learning"
              description="Customized learning paths based on your goals and interests."
              icon={BrainCircuit}
            />
            <FeatureCard
              title="Community Support"
              description="Connect with fellow learners and collaborate on projects."
              icon={Users}
            />
            <FeatureCard
              title="Coding Challenges"
              description="Sharpen your coding skills with practical challenges and exercises."
              icon={Code}
            />
            <FeatureCard
              title="Live Discussions"
              description="Participate in live Q&A sessions and discussions with instructors."
              icon={MessageSquare}
            />
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h2
              className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4"
              variants={fadeInUp}
            >
              What Our Students Say
            </motion.h2>
            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300"
              variants={fadeInUp}
            >
              Read testimonials from students who have transformed their careers with EduSpark.
            </motion.p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800"
              variants={cardVariants}
            >
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                "EduSpark has been a game-changer for me. The courses are well-structured, and the instructors are incredibly supportive."
              </p>
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="font-semibold text-gray-900 dark:text-white">Alice Johnson</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Software Engineer</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800"
              variants={cardVariants}
            >
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                "I highly recommend EduSpark to anyone looking to enhance their skills. The community is fantastic, and the learning experience is top-notch."
              </p>
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="font-semibold text-gray-900 dark:text-white">Bob Williams</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data Scientist</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24 bg-purple-100 dark:bg-purple-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h2
              className="text-3xl md:text-4xl font-semibold text-purple-900 dark:text-purple-100 mb-4"
              variants={fadeInUp}
            >
              Ready to Transform Your Career?
            </motion.h2>
            <motion.p
              className="text-lg text-purple-700 dark:text-purple-300 mb-8"
              variants={fadeInUp}
            >
              Join EduSpark today and start your journey towards a brighter future.
            </motion.p>
            <motion.div className="flex justify-center" variants={fadeInUp}>
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700" asChild>
                <Link to="/login">Get Started Now <ArrowRight className="ml-2" /></Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-700">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h2
              className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white mb-4"
              variants={fadeInUp}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300"
              variants={fadeInUp}
            >
              Find answers to common questions about EduSpark.
            </motion.p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="initial" animate="animate">
            <Accordion type="single" collapsible>
              <FAQItem
                question="What is EduSpark?"
                answer="EduSpark is an online learning platform that offers a wide range of courses and resources to help you develop new skills and advance your career."
              />
              <FAQItem
                question="How do I enroll in a course?"
                answer="To enroll in a course, simply create an account, browse our course catalog, and select the course you want to join. Follow the prompts to complete the enrollment process."
              />
              <FAQItem
                question="Are the courses self-paced?"
                answer="Yes, most of our courses are self-paced, allowing you to learn at your own speed and on your own schedule."
              />
              <FAQItem
                question="What kind of support is available?"
                answer="We offer comprehensive support, including access to instructors, community forums, and technical assistance."
              />
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="py-16 md:py-24 bg-blue-100 dark:bg-blue-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h2
              className="text-3xl md:text-4xl font-semibold text-blue-900 dark:text-blue-100 mb-4"
              variants={fadeInUp}
            >
              Subscribe to Our Newsletter
            </motion.h2>
            <motion.p
              className="text-lg text-blue-700 dark:text-blue-300 mb-8"
              variants={fadeInUp}
            >
              Stay up-to-date with the latest courses, events, and resources.
            </motion.p>
            <motion.div className="flex justify-center" variants={fadeInUp}>
              <div className="max-w-md w-full flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  className="bg-green-600 text-white hover:bg-green-700 rounded-md"
                  onClick={subscribe}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Subscribe"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} EduSpark. All rights reserved.
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Landing;
