import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Library, Book, Video, FileText } from 'lucide-react';

const Resources: React.FC = () => {
  const resourceCategories = [
    { icon: Book, title: "E-Books", count: 150 },
    { icon: Video, title: "Video Tutorials", count: 300 },
    { icon: FileText, title: "Articles", count: 500 },
  ];

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
          <p className="mb-4">Access a wide range of learning resources including e-books, articles, and video tutorials.</p>
          <div className="grid gap-4 md:grid-cols-3">
            {resourceCategories.map((category, index) => (
              <Card key={index} className="neumorphic-card">
                <CardContent className="flex flex-col items-center p-4">
                  <category.icon className="h-12 w-12 mb-2" />
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} items</p>
                  <Button className="mt-4">Browse</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Resources;