import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award, Calendar, Clock, Users, Star } from 'lucide-react';

const DashboardCard = ({ title, value, icon, description }) => (
  <Card className="neumorphic-card">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const OverviewTab = ({ userData }) => (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard 
        title="Courses in Progress" 
        value={userData?.coursesInProgress} 
        icon={<BookOpen className="h-4 w-4 text-blue-500" />}
        description="Active learning journeys"
      />
      <DashboardCard 
        title="Completed Courses" 
        value={userData?.completedCourses} 
        icon={<Award className="h-4 w-4 text-green-500" />}
        description="Your learning achievements"
      />
      <DashboardCard 
        title="Upcoming Deadlines" 
        value={userData?.upcomingDeadlines} 
        icon={<Calendar className="h-4 w-4 text-red-500" />}
        description="Tasks due soon"
      />
      <DashboardCard 
        title="Study Time" 
        value={`${userData?.studyTime} hrs`} 
        icon={<Clock className="h-4 w-4 text-purple-500" />}
        description="Total time invested in learning"
      />
      <DashboardCard 
        title="Forum Contributions" 
        value={userData?.forumContributions} 
        icon={<Users className="h-4 w-4 text-yellow-500" />}
        description="Your community engagement"
      />
      <DashboardCard 
        title="Average Course Rating" 
        value={userData?.averageCourseRating} 
        icon={<Star className="h-4 w-4 text-orange-500" />}
        description="Your feedback on courses"
      />
    </div>
    <Card className="neumorphic-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={userData?.overallProgress} className="w-full neumorphic-progress" />
        <p className="text-sm text-right mt-1">{userData?.overallProgress}% Complete</p>
        <p className="text-xs text-muted-foreground mt-2">Keep up the great work! You're making excellent progress in your learning journey.</p>
      </CardContent>
    </Card>
  </div>
);

export default OverviewTab;