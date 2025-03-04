
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Award, BookOpen, CheckCircle, Star, ArrowRight, Play, Users, Clock, BarChart, Layers, ChevronDown, Tag, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UserSkills {
  [key: string]: number;
}

interface LearningPath {
  id: number;
  name: string;
  progress: number;
  courses: {
    id: string;
    title: string;
    description: string;
    thumbnail_url?: string;
    progress?: number;
  }[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  category: string;
  enrolled?: boolean;
}

const LearningPaths: React.FC = () => {
  const [userSkills, setUserSkills] = useState<UserSkills>({});
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [expandedPath, setExpandedPath] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch user skills - in a real app this would come from the database
      setUserSkills({
        'JavaScript': 75,
        'React': 60,
        'Node.js': 45,
        'Python': 30,
        'Data Science': 25,
        'Machine Learning': 20,
        'UI/UX Design': 40,
        'Product Management': 50,
      });

      // Fetch learning paths - this is where you'd integrate with your backend
      const mockLearningPaths: LearningPath[] = [
        {
          id: 1,
          name: 'Frontend Developer Career Path',
          progress: 65,
          category: 'web-development',
          courses: [
            { id: '101', title: 'HTML & CSS Mastery', description: 'Master the fundamentals of web development', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=HTML+CSS', progress: 100 },
            { id: '102', title: 'JavaScript Fundamentals', description: 'Core concepts of JavaScript programming', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=JS', progress: 80 },
            { id: '103', title: 'React Essentials', description: 'Build interactive UIs with React', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=React', progress: 60 },
            { id: '104', title: 'Advanced React Patterns', description: 'Learn advanced component patterns', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Advanced', progress: 20 },
            { id: '105', title: 'Frontend Testing', description: 'Write robust tests for your applications', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Testing', progress: 0 }
          ],
          difficulty: 'Intermediate',
          estimatedTime: '3 months',
          enrolled: true
        },
        {
          id: 2,
          name: 'Backend Developer Path',
          progress: 30,
          category: 'web-development',
          courses: [
            { id: '201', title: 'Node.js Basics', description: 'Server-side JavaScript fundamentals', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Node.js' },
            { id: '202', title: 'Express.js Framework', description: 'Build web applications with Express', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Express' },
            { id: '203', title: 'Database Design', description: 'Design efficient database schemas', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=DB' },
            { id: '204', title: 'API Development', description: 'Build robust RESTful APIs', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=API' },
            { id: '205', title: 'Server Security', description: 'Secure your backend applications', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Security' }
          ],
          difficulty: 'Advanced',
          estimatedTime: '4 months',
          enrolled: true
        },
        {
          id: 3,
          name: 'Full Stack Developer Path',
          progress: 20,
          category: 'web-development',
          courses: [
            { id: '301', title: 'Frontend Basics', description: 'HTML, CSS and JavaScript essentials', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Frontend' },
            { id: '302', title: 'Backend Basics', description: 'Server-side fundamentals', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Backend' },
            { id: '303', title: 'Full Stack Projects', description: 'Build end-to-end applications', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Projects' },
            { id: '304', title: 'DevOps for Web', description: 'Deployment and CI/CD pipelines', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=DevOps' },
            { id: '305', title: 'Advanced Web Security', description: 'Secure your full stack applications', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Security' }
          ],
          difficulty: 'Advanced',
          estimatedTime: '6 months',
          enrolled: true
        },
        {
          id: 4,
          name: 'Data Science Specialization',
          progress: 10,
          category: 'data-science',
          courses: [
            { id: '401', title: 'Python for Data Science', description: 'Python programming for data analysis', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Python' },
            { id: '402', title: 'Statistics Fundamentals', description: 'Essential statistical concepts', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Stats' },
            { id: '403', title: 'Machine Learning Basics', description: 'Introduction to ML algorithms', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=ML' },
            { id: '404', title: 'Deep Learning', description: 'Neural networks and deep learning', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=DL' },
            { id: '405', title: 'Big Data Analytics', description: 'Working with large-scale datasets', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Big+Data' }
          ],
          difficulty: 'Advanced',
          estimatedTime: '5 months',
          enrolled: false
        },
        {
          id: 5,
          name: 'UI/UX Design Path',
          progress: 0,
          category: 'design',
          courses: [
            { id: '501', title: 'Design Principles', description: 'Fundamentals of good design', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Design' },
            { id: '502', title: 'User Research', description: 'Understanding user needs', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Research' },
            { id: '503', title: 'Wireframing and Prototyping', description: 'Creating effective prototypes', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Prototype' },
            { id: '504', title: 'UI Design', description: 'Creating beautiful interfaces', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=UI' },
            { id: '505', title: 'UX Writing', description: 'Crafting user-centered content', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=UX+Writing' }
          ],
          difficulty: 'Intermediate',
          estimatedTime: '3 months',
          enrolled: false
        },
        {
          id: 6,
          name: 'Mobile App Development',
          progress: 0,
          category: 'mobile',
          courses: [
            { id: '601', title: 'React Native Fundamentals', description: 'Cross-platform mobile development', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=React+Native' },
            { id: '602', title: 'Mobile UI Design', description: 'Design principles for mobile interfaces', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Mobile+UI' },
            { id: '603', title: 'State Management', description: 'Managing application state', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=State' },
            { id: '604', title: 'Native Modules', description: 'Integrating with native functionality', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Native' },
            { id: '605', title: 'App Store Deployment', description: 'Publishing to app stores', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Deployment' }
          ],
          difficulty: 'Intermediate',
          estimatedTime: '4 months',
          enrolled: false
        },
        {
          id: 7,
          name: 'DevOps Engineering Path',
          progress: 0,
          category: 'devops',
          courses: [
            { id: '701', title: 'Linux Fundamentals', description: 'Essential Linux skills for DevOps', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Linux' },
            { id: '702', title: 'Docker & Containerization', description: 'Containerize applications', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Docker' },
            { id: '703', title: 'Kubernetes Orchestration', description: 'Managing containerized applications', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=K8s' },
            { id: '704', title: 'CI/CD Pipelines', description: 'Automating software delivery', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=CI/CD' },
            { id: '705', title: 'Cloud Infrastructure', description: 'Working with cloud providers', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Cloud' }
          ],
          difficulty: 'Advanced',
          estimatedTime: '5 months',
          enrolled: false
        },
        {
          id: 8,
          name: 'Product Management',
          progress: 0,
          category: 'business',
          courses: [
            { id: '801', title: 'Product Strategy', description: 'Developing product vision and strategy', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Strategy' },
            { id: '802', title: 'User Research', description: 'Understanding user needs and behaviors', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Research' },
            { id: '803', title: 'Agile Methodologies', description: 'Leading agile product development', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Agile' },
            { id: '804', title: 'Product Analytics', description: 'Data-driven decision making', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=Analytics' },
            { id: '805', title: 'Go-to-Market Strategy', description: 'Launching and growing products', thumbnail_url: 'https://placehold.co/100x60/5046e5/white?text=GTM' }
          ],
          difficulty: 'Intermediate',
          estimatedTime: '4 months',
          enrolled: false
        }
      ];

      setLearningPaths(mockLearningPaths);
      setSelectedPath(mockLearningPaths[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load learning paths data');
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollPath = async (pathId: number) => {
    try {
      // In a real app, this would call your backend API
      toast.success(`Successfully enrolled in learning path!`);
      
      // Update local state to reflect enrollment
      setLearningPaths(prevPaths => 
        prevPaths.map(path => 
          path.id === pathId ? { ...path, enrolled: true, progress: 0 } : path
        )
      );
    } catch (error) {
      console.error('Error enrolling in path:', error);
      toast.error('Failed to enroll in learning path');
    }
  };

  const togglePathExpansion = (pathId: number) => {
    setExpandedPath(expandedPath === pathId ? null : pathId);
  };

  const filteredPaths = learningPaths.filter(path => {
    // Filter by search term
    const matchesSearch = path.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        path.courses.some(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by tab
    const matchesTab = activeTab === 'all' || 
                     (activeTab === 'enrolled' && path.enrolled) ||
                     (activeTab === 'not-enrolled' && !path.enrolled) ||
                     path.category === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'Intermediate': return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'Advanced': return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default: return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">Learning Paths</h1>
          <p className="text-foreground/70 mt-1">Structured curriculum paths to achieve your career goals</p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search paths or courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg bg-background/50 border border-border/50 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:flex md:flex-wrap mb-6 bg-background/50 p-1 rounded-xl">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
            All Paths
          </TabsTrigger>
          <TabsTrigger value="enrolled" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
            My Paths
          </TabsTrigger>
          <TabsTrigger value="web-development" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
            Web Dev
          </TabsTrigger>
          <TabsTrigger value="data-science" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
            Data Science
          </TabsTrigger>
          <TabsTrigger value="design" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
            Design
          </TabsTrigger>
          <TabsTrigger value="mobile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">
            Mobile
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredPaths.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPaths.map((path) => (
                <AnimatePresence key={path.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className={`rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 ${expandedPath === path.id ? 'ring-2 ring-primary/40' : ''}`}
                  >
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => togglePathExpansion(path.id)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold">{path.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className={getDifficultyColor(path.difficulty)}>
                              {path.difficulty}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
                              <Clock className="h-3 w-3 mr-1" /> {path.estimatedTime}
                            </Badge>
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-400">
                              <BookOpen className="h-3 w-3 mr-1" /> {path.courses.length} Courses
                            </Badge>
                          </div>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedPath === path.id ? 'transform rotate-180' : ''}`} />
                      </div>
                      
                      {path.enrolled && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm">{path.progress}%</span>
                          </div>
                          <Progress value={path.progress} className={`h-2 ${getProgressColor(path.progress)}`} />
                        </div>
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {expandedPath === path.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-6"
                        >
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold flex items-center">
                                <Layers className="h-4 w-4 mr-2 text-primary" />
                                Course Sequence
                              </h4>
                              <div className="space-y-3">
                                {path.courses.map((course, index) => (
                                  <div key={course.id} className="flex bg-background/50 rounded-lg p-3 items-center">
                                    <div className="flex-shrink-0 mr-3 relative">
                                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                        {index + 1}
                                      </div>
                                      {index < path.courses.length - 1 && (
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-border"></div>
                                      )}
                                    </div>
                                    <div className="flex flex-1 items-center">
                                      {course.thumbnail_url && (
                                        <img 
                                          src={course.thumbnail_url} 
                                          alt={course.title} 
                                          className="w-14 h-10 rounded-md object-cover mr-3"
                                        />
                                      )}
                                      <div className="flex-1">
                                        <div className="font-medium">{course.title}</div>
                                        <p className="text-sm text-muted-foreground">{course.description}</p>
                                      </div>
                                      {typeof course.progress !== 'undefined' && (
                                        <div className="ml-auto pl-2">
                                          {course.progress === 100 ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                          ) : course.progress > 0 ? (
                                            <div className="text-xs font-medium text-primary">{course.progress}%</div>
                                          ) : (
                                            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="pt-4 flex justify-end">
                              {path.enrolled ? (
                                <Button
                                  onClick={() => navigate('/dashboard/courses')}
                                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                                >
                                  {path.progress > 0 ? (
                                    <>
                                      <Play className="mr-2 h-4 w-4" />
                                      Continue Learning
                                    </>
                                  ) : (
                                    <>
                                      <Play className="mr-2 h-4 w-4" />
                                      Start Learning
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleEnrollPath(path.id)}
                                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                                >
                                  <Users className="mr-2 h-4 w-4" />
                                  Enroll Now
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card/50 rounded-xl border border-border/50">
              <Map className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No learning paths found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or explore other categories</p>
              <Button onClick={() => {setSearchTerm(''); setActiveTab('all');}}>
                View All Paths
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedPath && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="mt-8 bg-card/70 backdrop-blur-sm border-border/50 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-border/20">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="mb-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20">
                    <TrendingUp className="h-3 w-3 mr-1" /> Career Path
                  </Badge>
                  <CardTitle className="text-2xl font-bold">Your Skill Development</CardTitle>
                  <CardDescription>Track your progress across different skill areas</CardDescription>
                </div>
                <Button variant="outline" className="bg-card/50 border-border/50">
                  <BarChart className="h-4 w-4 mr-2" /> View Detailed Report
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" /> Your Skills Progress
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {Object.entries(userSkills).map(([skill, level]) => (
                  <div key={skill} className="bg-background/50 rounded-lg p-4 border border-border/30">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{skill}</h4>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {level}%
                      </Badge>
                    </div>
                    <Progress value={level} className="w-full h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Advanced</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 border-t border-border/20 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Updated recently based on your course completions
              </div>
              <Button variant="ghost" className="text-primary">
                <Tag className="h-4 w-4 mr-2" /> Recommended Skills
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default LearningPaths;
