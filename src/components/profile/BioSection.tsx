
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen } from 'lucide-react';

interface BioSectionProps {
  bio: string;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BioSection: React.FC<BioSectionProps> = ({ bio, isEditing, handleInputChange }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border/50 bg-card/90 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-900/30 dark:to-blue-900/30 rounded-t-lg border-b border-border/20">
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">About Me</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        {isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-foreground/80">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={handleInputChange}
              className="w-full min-h-[200px] bg-background/50 border-border/50 focus:border-primary resize-none"
              placeholder="Tell us about yourself, your interests, goals, and expertise..."
            />
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center">
            {bio ? (
              <p className="text-foreground/90 prose dark:prose-invert max-w-none">
                {bio}
              </p>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full py-10 text-muted-foreground">
                <BookOpen className="h-10 w-10 mb-3 text-primary/50" />
                <p className="text-lg">Your bio is empty</p>
                <p className="text-sm">Edit your profile to add information about yourself</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BioSection;
