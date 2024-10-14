import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase } from 'lucide-react';

const InstructorDashboard: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Instructor Overview</h3>
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Student Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Active Students: 120</p>
            <p>Average Course Completion: 78%</p>
            <p>Discussion Posts This Week: 45</p>
          </div>
        </CardContent>
      </Card>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            Course Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button className="w-full neumorphic-button">Create New Course</Button>
            <Button className="w-full neumorphic-button" variant="outline">Update Existing Course</Button>
            <Button className="w-full neumorphic-button" variant="outline">View Student Submissions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default InstructorDashboard;