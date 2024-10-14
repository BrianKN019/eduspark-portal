import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Library } from 'lucide-react';

const Resources: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Resource Library</h2>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Library className="mr-2 h-6 w-6" />
            Learning Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Access a wide range of learning resources including e-books, articles, and video tutorials.</p>
          {/* Placeholder for resource categories or search functionality */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;