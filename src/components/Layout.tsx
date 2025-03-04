
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';

interface LayoutProps {
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

const Layout: React.FC<LayoutProps> = ({ toggleTheme, theme }) => {
  const location = useLocation();

  return (
    <div className={`flex h-screen bg-background text-foreground ${theme}`}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleTheme={toggleTheme} theme={theme} />
        <motion.main 
          className="flex-1 overflow-x-hidden overflow-y-auto bg-background pt-6 md:pt-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          key={location.pathname} // Re-render animation when route changes
        >
          <div className="container mx-auto px-6 py-8 md:py-4">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
