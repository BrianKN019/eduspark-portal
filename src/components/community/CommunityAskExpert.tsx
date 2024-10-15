import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from 'lucide-react';

const CommunityAskExpert: React.FC = () => {
  return (
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Video className="mr-2 h-6 w-6" />
          Ask an Expert
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Schedule one-on-one sessions with industry experts and mentors.</p>
      </CardContent>
    </Card>
  );
};

export default CommunityAskExpert;