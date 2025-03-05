
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion, AnimatePresence } from 'framer-motion';

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
        <AnimatePresence mode="wait" initial={false}>
          <motion.main 
            className="flex-1 overflow-x-hidden overflow-y-auto bg-background pt-6 md:pt-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            key={location.pathname}
          >
            <div className="container mx-auto px-6 py-8 md:py-4">
              <Outlet />
            </div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Layout;
