import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from 'lucide-react';

const CommunityChallenges: React.FC = () => {
  return (
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="mr-2 h-6 w-6" />
          Coding Challenges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Test your skills with daily coding challenges and compete with peers!</p>
      </CardContent>
    </Card>
  );
};

export default CommunityChallenges;