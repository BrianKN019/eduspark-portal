import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from 'lucide-react';

const CommunityInnovationCorner: React.FC = () => {
  return (
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-6 w-6" />
          Innovation Corner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Share your innovative ideas and get feedback from the community!</p>
        <Button className="mt-2">Submit Idea</Button>
      </CardContent>
    </Card>
  );
};

export default CommunityInnovationCorner;