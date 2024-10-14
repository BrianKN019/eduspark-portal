import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from 'lucide-react';

const Achievements: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Achievements & Badges</h2>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-6 w-6" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Here you'll be able to view your earned badges and certifications.</p>
          {/* Placeholder for achievements list */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;