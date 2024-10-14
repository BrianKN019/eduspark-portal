import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Discussions: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Discussions</h2>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle>Recent Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Discussion forum implementation coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Discussions;