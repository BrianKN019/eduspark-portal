import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import PersonalInfo from '@/components/profile/PersonalInfo';
import BioSection from '@/components/profile/BioSection';
import CourseProgressList from '@/components/profile/CourseProgressList';

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
        <PersonalInfo
          userProfile={userProfile}
          isEditing={isEditing}
          loading={loading}
          handleInputChange={handleInputChange}
          handleSaveProfile={handleSaveProfile}
          handleCancelEdit={handleCancelEdit}
        />
        
        <BioSection
          bio={userProfile.bio}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
        />
      </div>
      
      <CourseProgressList courseProgresses={courseProgresses} />
      
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
