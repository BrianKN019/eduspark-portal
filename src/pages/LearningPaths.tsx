import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from 'lucide-react';

const LearningPaths: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Learning Paths</h2>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Map className="mr-2 h-6 w-6" />
            Your Learning Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Discover and follow curated learning paths to achieve your goals.</p>
          {/* Placeholder for learning paths */}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningPaths;