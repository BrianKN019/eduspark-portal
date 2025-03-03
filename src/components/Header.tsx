
import React, { useState, useEffect } from 'react';
import { Bell, Settings, Sun, Moon, Search, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, theme }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [initials, setInitials] = useState('');

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-30 px-4 py-2.5">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex md:hidden">
          {/* Placeholder for mobile layout balance */}
          <div className="w-10"></div>
        </div>

        <div className="flex-1 max-w-md mx-auto md:mx-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses, topics..."
              className="pl-10 bg-background/50 border-border/30 focus:border-primary rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hover:bg-primary/10" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground">3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <span className="font-medium">Notifications</span>
                <Button variant="ghost" size="sm" className="text-xs text-primary">Mark all as read</Button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New course available</p>
                      <p className="text-xs text-muted-foreground">Advanced React Patterns is now available</p>
                      <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Assignment feedback</p>
                      <p className="text-xs text-muted-foreground">Your JavaScript assignment has been reviewed</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-2 justify-center text-sm text-primary cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <Settings className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-primary/10">
                <Avatar className="h-9 w-9 border-2 border-border">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={userName} />
                  ) : (
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${initials}`} alt={userName} />
                  )}
                  <AvatarFallback className="bg-primary/20">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2 border-b border-border">
                <Avatar className="h-8 w-8">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={userName} />
                  ) : (
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${initials}`} alt={userName} />
                  )}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">Student</p>
                </div>
              </div>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to="/profile" className="flex w-full">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link to="/settings" className="flex w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
