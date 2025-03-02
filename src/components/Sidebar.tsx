
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
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile menu when screen size increases
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/courses', icon: BookOpen, label: 'Courses' },
    { to: '/live-classes', icon: Video, label: 'Live Classes' },
    { to: '/analytics', icon: BarChart2, label: 'Analytics' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/discussions', icon: MessageSquare, label: 'Discussions' },
    { to: '/achievements', icon: Award, label: 'Achievements & Badges' },
    { to: '/learning-paths', icon: Map, label: 'Learning Paths' },
    { to: '/community', icon: Users, label: 'Community & Forums' },
    { to: '/resources', icon: Library, label: 'Resource Library' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <Button
        className="fixed top-4 left-4 z-50 md:hidden"
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
      
      <aside className={`bg-card text-card-foreground ${
        isCollapsed ? 'w-16' : 'w-64'
      } space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition duration-300 ease-in-out neumorphic-sidebar z-40 shadow-xl`}>
        <div className="flex justify-end px-2 mb-4 md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2 px-4'} py-3 rounded transition duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground neumorphic-active'
                        : 'hover:bg-accent hover:text-accent-foreground neumorphic-hover'
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
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
            className="rounded-full opacity-80 hover:opacity-100"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
