import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CommunityForums from '@/components/community/CommunityForums';
import CommunityChat from '@/components/community/CommunityChat';
import CommunityStudyGroups from '@/components/community/CommunityStudyGroups';
import CommunityAskExpert from '@/components/community/CommunityAskExpert';
import CommunityChallenges from '@/components/community/CommunityChallenges';
import CommunityEvents from '@/components/community/CommunityEvents';
import CommunityResourceCenter from '@/components/community/CommunityResourceCenter';
import CommunityLeaderboard from '@/components/community/CommunityLeaderboard';
import CommunityInnovationCorner from '@/components/community/CommunityInnovationCorner';
import CommunityProjects from '@/components/community/CommunityProjects';
import { MessageSquare, Users, Video, HelpCircle, Code, Calendar } from 'lucide-react';

const Community: React.FC = () => {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold">Community & Forums</h2>
      <Tabs defaultValue="forums" className="w-full">
        <TabsList className="flex flex-wrap justify-start neumorphic-convex">
          <TabsTrigger value="forums" className="neumorphic-convex">Forums</TabsTrigger>
          <TabsTrigger value="chat" className="neumorphic-convex">Real-Time Chat</TabsTrigger>
          <TabsTrigger value="studyGroups" className="neumorphic-convex">Study Groups</TabsTrigger>
          <TabsTrigger value="askExpert" className="neumorphic-convex">Ask an Expert</TabsTrigger>
          <TabsTrigger value="challenges" className="neumorphic-convex">Coding Challenges</TabsTrigger>
          <TabsTrigger value="events" className="neumorphic-convex">Community Events</TabsTrigger>
        </TabsList>
        <TabsContent value="forums">
          <CommunityForums />
          <Card className="mt-4 neumorphic-card neumorphic-convex">
            <CardHeader>
              <CardTitle>Popular Forum Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• Best practices for React hooks</li>
                <li>• Python vs JavaScript for beginners</li>
                <li>• How to prepare for technical interviews</li>
                <li>• Pros and cons of different CSS frameworks</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chat">
          <CommunityChat />
          <Card className="mt-4 neumorphic-card neumorphic-convex">
            <CardHeader>
              <CardTitle>Chat Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="neumorphic-button neumorphic-convex">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  General Discussion
                </Button>
                <Button variant="outline" className="neumorphic-button neumorphic-convex">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  JavaScript
                </Button>
                <Button variant="outline" className="neumorphic-button neumorphic-convex">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Python
                </Button>
                <Button variant="outline" className="neumorphic-button neumorphic-convex">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Data Science
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="studyGroups">
          <CommunityStudyGroups />
          <Card className="mt-4 neumorphic-card neumorphic-convex">
            <CardHeader>
              <CardTitle>Active Study Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start neumorphic-button neumorphic-convex">
                  <Users className="mr-2 h-4 w-4" />
                  React Mastery (5/10 members)
                </Button>
                <Button variant="outline" className="w-full justify-start neumorphic-button neumorphic-convex">
                  <Users className="mr-2 h-4 w-4" />
                  Python for Data Science (8/12 members)
                </Button>
                <Button variant="outline" className="w-full justify-start neumorphic-button neumorphic-convex">
                  <Users className="mr-2 h-4 w-4" />
                  Algorithms Study Group (3/8 members)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="askExpert">
          
          <CommunityAskExpert />
          <Card className="mt-4 neumorphic-card neumorphic-convex">
            <CardHeader>
              <CardTitle>Upcoming Expert Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start neumorphic-button neumorphic-convex">
                  <Video className="mr-2 h-4 w-4" />
                  Web Security Best Practices with John Doe
                </Button>
                <Button variant="outline" className="w-full justify-start neumorphic-button neumorphic-convex">
                  <Video className="mr-2 h-4 w-4" />
                  Machine Learning in Production with Jane Smith
                </Button>
                <Button variant="outline" className="w-full justify-start neumorphic-button neumorphic-convex">
                  <Video className="mr-2 h-4 w-4" />
                  Scaling Node.js Applications with Mike Johnson
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="challenges">
          <CommunityChallenges />
          <Card className="mt-4 neumorphic-card neumorphic-convex">
            <CardHeader>
              <CardTitle>Weekly Coding Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start neumorphic-button neumorphic-convex">
                  <Code className="mr-2 h-4 w-4" />
                  Implement a Custom Hook (React)
                </Button>
                <Button variant="outline" className="w-full justify-start neumorphic-button neumorphic-convex">
                  <Code className="mr-2 h-4 w-4" />
                  Optimize Database Queries (SQL)
                </Button>
                <Button variant="outline" className="w-full justify-start neumorphic-button neumorphic-convex">
                  <Code className="mr-2 h-4 w-4" />
                  Build a RESTful API (Node.js)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="events">
          <CommunityEvents />
          <Card className="mt-4 neumorphic-card neumorphic-convex">
            <CardHeader>
              <CardTitle>Upcoming Community Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start neumorphic-button neumorphic-convex">
                  <Calendar className="mr-2 h-4 w-4" />
                  Virtual Hackathon: AI for Good
                </Button>
                <Button variant="outline" className="w-full justify-start neumorphic-button neumorphic-convex">
                  <Calendar className="mr-2 h-4 w-4" />
                  Web Development Workshop Series
                </Button>
                <Button variant="outline" className="w-full justify-start neumorphic-button neumorphic-convex">
                  <Calendar className="mr-2 h-4 w-4" />
                  Tech Talk: Future of Cloud Computing
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <CommunityResourceCenter />
      <CommunityLeaderboard />
      <CommunityInnovationCorner />
      <CommunityProjects />
    </div>
  );
};

export default Community;