import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MapPin, Briefcase, Book, Save, X, LogOut } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress";
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    id: '',
    name: "",
    email: "",
    phone: "",
    location: "",
    occupation: "",
    bio: "",
    avatar_url: "",
    courses: ["React Fundamentals", "Advanced JavaScript", "Node.js Basics"],
  });
  const [courseProgresses, setCourseProgresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
    fetchCourseProgresses();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch profile data
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        }
        
        setUserProfile({
          id: user.id,
          name: profile?.full_name || user.user_metadata?.full_name || 'User',
          email: user.email || '',
          phone: profile?.phone || user.user_metadata?.phone || '',
          location: profile?.location || '',
          occupation: profile?.occupation || '',
          bio: profile?.bio || '',
          avatar_url: profile?.avatar_url || '',
          courses: userProfile.courses, // Keep existing courses
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseProgresses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: progresses, error } = await supabase
          .from('course_progress')
          .select('*, courses(*)')
          .eq('user_id', user.id);
        
        if (error) throw error;
        setCourseProgresses(progresses || []);
      }
    } catch (error) {
      console.error('Error fetching course progresses:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      // Update the profile
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: userProfile.name,
          phone: userProfile.phone,
          location: userProfile.location,
          occupation: userProfile.occupation,
          bio: userProfile.bio,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    fetchUserProfile(); // Reset form to original values
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">User Profile</h2>
        <Button 
          onClick={handleLogout}
          variant="destructive"
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="neumorphic-card shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-6 pb-6">
            <Avatar className="h-24 w-24 mb-4 border-4 border-purple-200 dark:border-purple-900">
              {userProfile.avatar_url ? (
                <AvatarImage src={userProfile.avatar_url} alt={userProfile.name} />
              ) : (
                <AvatarImage 
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${userProfile.name}`} 
                  alt={userProfile.name} 
                />
              )}
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {getInitials(userProfile.name)}
              </AvatarFallback>
            </Avatar>
            
            {isEditing ? (
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={userProfile.name}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={userProfile.email}
                    readOnly
                    disabled
                    className="w-full bg-gray-100"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={userProfile.phone}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={userProfile.location}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="occupation" className="text-sm font-medium">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={userProfile.occupation}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button 
                    onClick={handleSaveProfile} 
                    className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white flex items-center justify-center"
                    disabled={loading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  
                  <Button 
                    onClick={handleCancelEdit} 
                    variant="outline" 
                    className="w-full border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-semibold mb-2">{userProfile.name}</h3>
                <p className="text-muted-foreground mb-4">{userProfile.occupation}</p>
                <div className="w-full space-y-3">
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Mail className="h-4 w-4 text-blue-500" /> {userProfile.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Phone className="h-4 w-4 text-blue-500" /> {userProfile.phone || 'Not specified'}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin className="h-4 w-4 text-blue-500" /> {userProfile.location || 'Not specified'}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Briefcase className="h-4 w-4 text-blue-500" /> {userProfile.occupation || 'Not specified'}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="neumorphic-card shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">Bio</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-6">
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">About Me</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={userProfile.bio}
                  onChange={handleInputChange}
                  className="w-full min-h-[150px]"
                  placeholder="Tell us about yourself..."
                />
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                {userProfile.bio || "No bio information provided yet."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="neumorphic-card shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950 rounded-t-lg">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
            Course Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-6">
          {courseProgresses.length > 0 ? (
            <div className="space-y-6">
              {courseProgresses.map((progress) => (
                <div key={progress.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{progress.courses?.title || 'Course'}</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">
                      {progress.progress_percentage}% Complete
                    </span>
                  </div>
                  <Progress value={progress.progress_percentage} className="h-2" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No courses enrolled yet.</p>
          )}
        </CardContent>
      </Card>
      
      {!isEditing && (
        <Button 
          onClick={() => setIsEditing(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Edit Profile
        </Button>
      )}
    </div>
  );
};

export default Profile;
