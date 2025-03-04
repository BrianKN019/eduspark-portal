
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LiveClasses from "./pages/LiveClasses";
import Analytics from "./pages/Analytics";
import Calendar from "./pages/Calendar";
import Discussions from "./pages/Discussions";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import LearningPaths from "./pages/LearningPaths";
import Community from "./pages/Community";
import ResourceLibrary from "./pages/ResourceLibrary";
import Achievements from "./pages/Achievements";
import Landing from "./pages/Landing";
import CertificateVerification from "./pages/CertificateVerification";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient();

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900">
        <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Loading your experience...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    toast.error("Please log in to access this page", {
      id: "auth-redirect",
      duration: 3000,
    });
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

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
          <AuthProvider>
            <Toaster position="top-right" richColors />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-certificate" element={<CertificateVerification />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout toggleTheme={toggleTheme} theme={theme} />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="courses" element={<Courses />} />
                  <Route path="courses/:courseId" element={<CourseDetail />} />
                  <Route path="live-classes" element={<LiveClasses />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="discussions" element={<Discussions />} />
                  <Route path="learning-paths" element={<LearningPaths />} />
                  <Route path="community" element={<Community />} />
                  <Route path="resource-library" element={<ResourceLibrary />} />
                  <Route path="achievements" element={<Achievements />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
