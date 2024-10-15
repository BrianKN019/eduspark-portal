import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from 'lucide-react';

const CommunityEvents: React.FC = () => {
  return (
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="mr-2 h-6 w-6" />
          Community Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Discover and participate in virtual meetups, webinars, and hackathons.</p>
      </CardContent>
    </Card>
  );
};

export default CommunityEvents;