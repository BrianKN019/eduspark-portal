
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Briefcase, Save, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoProps {
  userProfile: {
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
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
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
  );
};

export default PersonalInfo;
