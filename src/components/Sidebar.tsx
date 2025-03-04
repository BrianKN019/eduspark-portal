
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  X, 
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GitBranch,
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  SquareMenu,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const location = useLocation();

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
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
    { name: "Live Classes", href: "/dashboard/live-classes", icon: Video },
    { name: "Learning Paths", href: "/dashboard/learning-paths", icon: GitBranch },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
    { name: "Discussions", href: "/dashboard/discussions", icon: MessageSquare },
    { name: "Community", href: "/dashboard/community", icon: Users },
    { name: "Resource Library", href: "/dashboard/resource-library", icon: Library },
    { name: "Achievements", href: "/dashboard/achievements", icon: Award },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "5rem" }
  };

  const itemTextVariants = {
    expanded: { opacity: 1, x: 0, display: "block" },
    collapsed: { 
      opacity: 0, 
      x: -10, 
      transitionEnd: { display: "none" } 
    }
  };

  const mobileMenuVariants = {
    open: { 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: { 
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <Button
        className="fixed top-4 left-4 z-50 md:hidden bg-gradient-to-r from-purple-500/90 to-blue-500/90 backdrop-blur-sm shadow-lg border border-purple-400/20 rounded-full"
        onClick={toggleMobileMenu}
        size="icon"
        variant="outline"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <Menu className="h-5 w-5 text-white" />
        )}
      </Button>

      {/* Backdrop Overlay for Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside 
            className="fixed inset-y-0 left-0 z-40 md:hidden w-64 bg-gradient-to-b from-background to-background border-r border-border/50 shadow-xl"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex justify-between items-center px-4 py-5 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                  EduSpark
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileMenu}
                aria-label="Close menu"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="px-2 py-4">
              <ul className="space-y-1">
                {navigationItems.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) => {
                        const isCurrentActive = isActive || activeItem === item.href;
                        return `
                          flex items-center space-x-3 px-4 py-3 rounded-lg
                          transition-all duration-200 group relative
                          ${isCurrentActive
                            ? 'bg-gradient-to-r from-purple-600/20 to-blue-500/20 text-purple-600 dark:text-purple-400 font-medium'
                            : 'hover:bg-purple-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}
                        `;
                      }}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setActiveItem(item.href);
                      }}
                    >
                      <div className={activeItem === item.href ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}>
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                      </div>
                      <span className="whitespace-nowrap">{item.name}</span>
                      {activeItem === item.href && (
                        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-600 to-blue-500 rounded-r"></div>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
      
      {/* Desktop Sidebar */}
      <motion.aside 
        className="hidden md:block bg-gradient-to-b from-background to-background text-card-foreground max-h-screen overflow-y-auto py-6 border-r border-border/50 shadow-sm relative z-10"
        variants={sidebarVariants}
        initial={isCollapsed ? "collapsed" : "expanded"}
        animate={isCollapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className={`flex justify-center ${isCollapsed ? 'px-0' : 'px-4'} mb-8`}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <motion.span 
              className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 whitespace-nowrap"
              variants={itemTextVariants}
              initial={isCollapsed ? "collapsed" : "expanded"}
              animate={isCollapsed ? "collapsed" : "expanded"}
            >
              EduSpark
            </motion.span>
          </div>
        </div>
        
        <nav className={isCollapsed ? 'px-2' : 'px-3'}>
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) => {
                    const isCurrentActive = isActive || activeItem === item.href;
                    return `
                      flex items-center ${isCollapsed ? 'justify-center' : 'px-3'} py-3 rounded-lg
                      transition-all duration-200 overflow-hidden group relative
                      ${isCurrentActive
                        ? 'bg-gradient-to-r from-purple-600/20 to-blue-500/20 text-purple-600 dark:text-purple-400 font-medium'
                        : 'hover:bg-purple-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}
                    `;
                  }}
                  onClick={() => {
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
                      variants={itemTextVariants}
                      className="ml-3 whitespace-nowrap"
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
        
        <div className="absolute bottom-5 right-2">
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
