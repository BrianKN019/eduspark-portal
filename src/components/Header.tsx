import React from 'react';
import { Bell, Settings, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, theme }) => {
  return (
    <header className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
      <h1 className="text-2xl font-bold">LMS Platform</h1>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;