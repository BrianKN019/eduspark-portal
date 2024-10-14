import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award, Calendar } from 'lucide-react';

const DashboardCard = ({ title, value, icon }) => (
  <Card className="neumorphic-card">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const OverviewTab = ({ userData }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <DashboardCard title="Courses in Progress" value={userData?.coursesInProgress} icon={<BookOpen className="h-4 w-4" />} />
    <DashboardCard title="Completed Courses" value={userData?.completedCourses} icon={<Award className="h-4 w-4" />} />
    <DashboardCard title="Upcoming Deadlines" value={userData?.upcomingDeadlines} icon={<Calendar className="h-4 w-4" />} />
    <Card className="neumorphic-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={userData?.overallProgress} className="w-full neumorphic-progress" />
        <p className="text-sm text-right mt-1">{userData?.overallProgress}%</p>
      </CardContent>
    </Card>
  </div>
);

export default OverviewTab;