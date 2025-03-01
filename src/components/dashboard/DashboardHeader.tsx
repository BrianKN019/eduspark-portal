
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface DashboardHeaderProps {
  userData: any; // Replace 'any' with a proper type if available
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userData }) => {
  const [theme, setTheme] = useState('light');
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [initials, setInitials] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            // Use full_name from profile or fallback to user_metadata.full_name
            const name = profile.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
            setUserName(name);
            setAvatarUrl(profile.avatar_url || '');
            
            // Create initials from name
            const nameInitials = name.split(' ')
              .map(part => part[0])
              .join('')
              .toUpperCase();
            setInitials(nameInitials);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
      <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-4 md:mb-0">
        Welcome back, {userName}!
      </h2>
      <div className="flex items-center space-x-4">
        <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
        {theme === 'light' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        <Avatar className="h-12 w-12 ring-2 ring-purple-500 ring-offset-2">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={userName} />
          ) : (
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${initials}`} alt={userName} />
          )}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <Button 
          onClick={handleSignOut} 
          variant="ghost" 
          size="icon"
          className="rounded-full hover:bg-red-100 dark:hover:bg-red-900"
        >
          <LogOut className="h-5 w-5 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
