import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import LiveClasses from "./pages/LiveClasses";
import Analytics from "./pages/Analytics";
import Calendar from "./pages/Calendar";
import Discussions from "./pages/Discussions";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Achievements from "./pages/Achievements";
import LearningPaths from "./pages/LearningPaths";
import Community from "./pages/Community";
import ResourceLibrary from "./pages/ResourceLibrary";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme={theme} storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout toggleTheme={toggleTheme} theme={theme} />}>
                <Route index element={<Dashboard />} />
                <Route path="courses" element={<Courses />} />
                <Route path="live-classes" element={<LiveClasses />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="discussions" element={<Discussions />} />
                <Route path="achievements" element={<Achievements />} />
                <Route path="learning-paths" element={<LearningPaths />} />
                <Route path="community" element={<Community />} />
                <Route path="resource-library" element={<ResourceLibrary />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;