import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Users } from 'lucide-react';

const LiveClasses: React.FC = () => {
  const upcomingClasses = [
    { id: 1, title: "Advanced React Patterns", date: "2024-10-15", time: "14:00", instructor: "Jane Doe" },
    { id: 2, title: "GraphQL Fundamentals", date: "2024-11-17", time: "10:00", instructor: "John Smith" },
    { id: 3, title: "Machine Learning Basics", date: "2024-12-20", time: "15:30", instructor: "Alice Johnson" },
  ];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold mb-4">Live Classes</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {upcomingClasses.map((classItem) => (
          <Card key={classItem.id} className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                {classItem.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                {classItem.date} at {classItem.time}
              </p>
              <p className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4" />
                Instructor: {classItem.instructor}
              </p>
              <Button className="w-full">Join Class</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveClasses;