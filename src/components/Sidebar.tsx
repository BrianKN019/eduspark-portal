import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Video, 
  User, 
  BarChart2, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Award, 
  Map, 
  Users, 
  Library, 
  Menu, 
  X, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GitBranch,
  BarChart3,
  CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('/');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveItem(window.location.pathname);
  }, [window.location.pathname]);

  const navigationItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Live Classes", href: "/live-classes", icon: Video },
    { name: "Learning Paths", href: "/learning-paths", icon: GitBranch },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Calendar", href: "/calendar", icon: CalendarDays },
    { name: "Discussions", href: "/discussions", icon: MessageSquare },
    { name: "Community", href: "/community", icon: Users },
    { name: "Resource Library", href: "/resource-library", icon: Library },
    { name: "Achievements", href: "/achievements", icon: Award },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "4rem" }
  };

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -10 }
  };

  return (
    <>
      <Button
        className="fixed top-4 left-4 z-50 md:hidden bg-background/80 backdrop-blur-sm"
        onClick={toggleMobileMenu}
        size="icon"
        variant="outline"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />
      
      <motion.aside 
        className={`bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 
        text-card-foreground max-h-screen overflow-y-auto py-7 px-2 ${
          isMobileMenuOpen ? 'fixed' : 'hidden md:block'
        } md:relative inset-y-0 left-0 z-40 shadow-lg 
        rounded-r-2xl border-r border-gray-200 dark:border-gray-800`}
        variants={sidebarVariants}
        initial={isCollapsed ? "collapsed" : "expanded"}
        animate={isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex justify-between items-center px-3 mb-8">
          {!isCollapsed && (
            <motion.div 
              className="flex items-center gap-2"
              variants={itemVariants}
              initial="expanded"
              animate={isCollapsed ? "collapsed" : "expanded"}
            >
              <Sparkles className="h-6 w-6 text-purple-600" />
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                EduSpark
              </span>
            </motion.div>
          )}
          <div className="flex md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <nav>
          <ul className="space-y-1.5">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) => {
                    const isCurrentActive = isActive || activeItem === item.href;
                    return `
                      flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3 rounded-lg
                      transition-all duration-200 overflow-hidden group relative
                      ${isCurrentActive
                        ? 'bg-gradient-to-r from-purple-600/20 to-blue-500/20 text-purple-600 dark:text-purple-400 font-medium'
                        : 'hover:bg-purple-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}
                    `;
                  }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setActiveItem(item.href);
                  }}
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className={`
                    ${activeItem === item.href ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'} 
                    ${isCollapsed ? 'mx-auto' : ''}
                  `}>
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                  </div>
                  
                  {!isCollapsed && (
                    <motion.span
                      variants={itemVariants}
                      initial="expanded"
                      animate={isCollapsed ? "collapsed" : "expanded"}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}

                  {activeItem === item.href && (
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-600 to-blue-500 rounded-r"></div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="hidden md:block absolute bottom-5 right-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCollapse}
            className="rounded-full hover:bg-purple-100 dark:hover:bg-gray-800"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-purple-600" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-purple-600" />
            )}
          </Button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
