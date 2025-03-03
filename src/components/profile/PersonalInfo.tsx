
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Briefcase, Save, X, Upload } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PersonalInfoProps {
  userProfile: {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    occupation: string;
    avatar_url: string;
  };
  isEditing: boolean;
  loading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSaveProfile: () => Promise<void>;
  handleCancelEdit: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  userProfile,
  isEditing,
  loading,
  handleInputChange,
  handleSaveProfile,
  handleCancelEdit
}) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile || !userProfile.id) return;

    try {
      setUploading(true);
      
      // Create a unique file name
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${userProfile.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update the profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userProfile.id);
        
      if (updateError) throw updateError;
      
      toast.success('Avatar uploaded successfully');
      
      // Clean up the preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      
      setAvatarFile(null);
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Error uploading avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="neumorphic-card shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border/50 bg-card/90 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-900/30 dark:to-blue-900/30 rounded-t-lg border-b border-border/20">
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-6 pb-6">
        <div className="relative mb-6 group">
          <Avatar className="h-24 w-24 border-4 border-purple-200 dark:border-purple-900 group-hover:border-purple-300 dark:group-hover:border-purple-800 transition-all duration-300">
            {(previewUrl || userProfile.avatar_url) ? (
              <AvatarImage 
                src={previewUrl || userProfile.avatar_url || `https://api.dicebear.com/6.x/initials/svg?seed=${userProfile.name}`} 
                alt={userProfile.name} 
              />
            ) : (
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xl">
                {getInitials(userProfile.name)}
              </AvatarFallback>
            )}
          </Avatar>
          
          {isEditing && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <div className="bg-primary hover:bg-primary/90 text-white rounded-full p-1 shadow-md">
                  <Upload className="h-4 w-4" />
                </div>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
              
              {avatarFile && (
                <Button 
                  size="icon" 
                  className="h-6 w-6 bg-green-500 hover:bg-green-600 p-1 rounded-full"
                  onClick={handleUploadAvatar}
                  disabled={uploading}
                >
                  <Save className="h-3 w-3 text-white" />
                </Button>
              )}
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground/80">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={userProfile.name}
                onChange={handleInputChange}
                className="w-full bg-background/50 border-border/50 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground/80">Email</Label>
              <Input
                id="email"
                name="email"
                value={userProfile.email}
                readOnly
                disabled
                className="w-full bg-muted/50 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground/80">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={userProfile.phone}
                onChange={handleInputChange}
                className="w-full bg-background/50 border-border/50 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-foreground/80">Location</Label>
              <Input
                id="location"
                name="location"
                value={userProfile.location}
                onChange={handleInputChange}
                className="w-full bg-background/50 border-border/50 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occupation" className="text-sm font-medium text-foreground/80">Occupation</Label>
              <Input
                id="occupation"
                name="occupation"
                value={userProfile.occupation}
                onChange={handleInputChange}
                className="w-full bg-background/50 border-border/50 focus:border-primary"
              />
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button 
                onClick={handleSaveProfile} 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md shadow-green-500/20 flex items-center justify-center"
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              
              <Button 
                onClick={handleCancelEdit} 
                variant="outline" 
                className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">{userProfile.name}</h3>
            <p className="text-muted-foreground mb-6">{userProfile.occupation || 'Not specified'}</p>
            <div className="w-full space-y-4">
              <div className="flex items-center gap-3 text-foreground/80">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{userProfile.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-foreground/80">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{userProfile.phone || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-foreground/80">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{userProfile.location || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-foreground/80">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Occupation</p>
                  <p className="font-medium">{userProfile.occupation || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
