import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from 'lucide-react';

const CommunityLeaderboard: React.FC = () => {
  return (
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-6 w-6" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
            <span>1. John Doe</span>
            <span>1250 points</span>
          </li>
          <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
            <span>2. Jane Smith</span>
            <span>1180 points</span>
          </li>
          <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
            <span>3. Alex Johnson</span>
            <span>1050 points</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default CommunityLeaderboard;