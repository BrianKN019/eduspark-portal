import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from 'lucide-react';

const Community: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Community & Forums</h2>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-6 w-6" />
            Discussion Forums
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Connect with other learners, ask questions, and participate in discussions.</p>
          {/* Placeholder for forum topics or recent discussions */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;