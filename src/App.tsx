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
import Resources from "./pages/Resources";
import { motion } from "framer-motion";

const queryClient = new QueryClient();

const AnimatedBackground = () => (
  <motion.div
    className="fixed inset-0 z-[-1]"
    initial={{ backgroundPosition: "0% 0%" }}
    animate={{ backgroundPosition: "100% 100%" }}
    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
    style={{
      background: "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
      backgroundSize: "400% 400%",
    }}
  />
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <AnimatedBackground />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="live-classes" element={<LiveClasses />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="discussions" element={<Discussions />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="learning-paths" element={<LearningPaths />} />
              <Route path="community" element={<Community />} />
              <Route path="resources" element={<Resources />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;