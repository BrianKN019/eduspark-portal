
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BioSectionProps {
  bio: string;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BioSection: React.FC<BioSectionProps> = ({ bio, isEditing, handleInputChange }) => {
  return (
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
              value={bio}
              onChange={handleInputChange}
              className="w-full min-h-[150px]"
              placeholder="Tell us about yourself..."
            />
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">
            {bio || "No bio information provided yet."}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BioSection;
