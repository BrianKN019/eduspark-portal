import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from 'lucide-react';

const CommunityChat: React.FC = () => {
  return (
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-6 w-6" />
          Real-Time Chat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Interactive chat rooms coming soon! Connect with peers in real-time.</p>
      </CardContent>
    </Card>
  );
};

export default CommunityChat;