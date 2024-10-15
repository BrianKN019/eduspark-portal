import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from 'lucide-react';

interface DashboardHeaderProps {
  userData: any; // Replace 'any' with a proper type if available
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userData }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
      <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4 md:mb-0">
        Welcome back, Brian K!
      </h2>
      <div className="flex items-center space-x-4">
        <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
        {theme === 'light' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        <Avatar className="h-12 w-12 ring-2 ring-purple-500 ring-offset-2">
          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=BK`} alt="Brian K" />
          <AvatarFallback>BK</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default DashboardHeader;