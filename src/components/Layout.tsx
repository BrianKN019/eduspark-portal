import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

const Layout: React.FC<LayoutProps> = ({ toggleTheme, theme }) => {
  return (
    <div className={`flex h-screen bg-background text-foreground ${theme}`}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleTheme={toggleTheme} theme={theme} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;