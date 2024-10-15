import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket } from 'lucide-react';

const CommunityProjects: React.FC = () => {
  return (
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Rocket className="mr-2 h-6 w-6" />
          Community Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Collaborate on open-source projects and build your portfolio.</p>
        <Button className="mt-2">Explore Projects</Button>
      </CardContent>
    </Card>
  );
};

export default CommunityProjects;