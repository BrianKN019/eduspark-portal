import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from 'lucide-react';

const CommunityStudyGroups: React.FC = () => {
  return (
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-6 w-6" />
          Study Groups
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Join or create study groups for collaborative learning experiences.</p>
      </CardContent>
    </Card>
  );
};

export default CommunityStudyGroups;