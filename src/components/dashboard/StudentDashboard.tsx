import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Target } from 'lucide-react';

const StudentDashboard: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Your Learning Path</h3>
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-4 w-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button className="w-full neumorphic-button">Continue Last Course</Button>
            <Button className="w-full neumorphic-button" variant="outline">Take a Quiz</Button>
            <Button className="w-full neumorphic-button" variant="outline">Join Study Group</Button>
          </div>
        </CardContent>
      </Card>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-4 w-4" />
            Learning Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center">
              <input type="checkbox" className="mr-2 neumorphic-checkbox" />
              Complete JavaScript Basics
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2 neumorphic-checkbox" />
              Submit React Project
            </li>
            <li className="flex items-center">
              <input type="checkbox" className="mr-2 neumorphic-checkbox" />
              Attend AI Workshop
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default StudentDashboard;