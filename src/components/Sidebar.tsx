import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Video, User, BarChart2, Calendar, MessageSquare, Settings, Award, Map, Users, Library } from 'lucide-react';

const Sidebar: React.FC = () => {
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

  return (
    <aside className="bg-card text-card-foreground w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out neumorphic-sidebar">
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-3 rounded transition duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground neumorphic-active'
                      : 'hover:bg-accent hover:text-accent-foreground neumorphic-hover'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;