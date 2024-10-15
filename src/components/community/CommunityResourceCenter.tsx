import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

const CommunityResourceCenter: React.FC = () => {
  return (
    <Card className="neumorphic-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-6 w-6" />
          Resource Center
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
            <span>Introduction to React Hooks</span>
            <Button size="sm">View</Button>
          </li>
          <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
            <span>Machine Learning Fundamentals</span>
            <Button size="sm">View</Button>
          </li>
          <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
            <span>Cybersecurity Best Practices</span>
            <Button size="sm">View</Button>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default CommunityResourceCenter;