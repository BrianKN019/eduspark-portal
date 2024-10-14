import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Video, FileText, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Community: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState('general');

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Community & Forums</h2>
      <Tabs defaultValue="forums" className="w-full">
        <TabsList>
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="chat">Real-Time Chat</TabsTrigger>
          <TabsTrigger value="studyGroups">Study Groups</TabsTrigger>
          <TabsTrigger value="askExpert">Ask an Expert</TabsTrigger>
        </TabsList>
        <TabsContent value="forums">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-6 w-6" />
                Discussion Forums
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Button onClick={() => setSelectedTopic('general')} variant={selectedTopic === 'general' ? 'default' : 'outline'}>General</Button>
                <Button onClick={() => setSelectedTopic('javascript')} variant={selectedTopic === 'javascript' ? 'default' : 'outline'}>#JavaScript</Button>
                <Button onClick={() => setSelectedTopic('examprep')} variant={selectedTopic === 'examprep' ? 'default' : 'outline'}>#ExamPrep</Button>
              </div>
              <Input placeholder="Search topics..." className="mb-4" />
              <ul className="space-y-2">
                <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
                  <span>How to optimize React performance?</span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost">👍 42</Button>
                    <Button size="sm" variant="ghost">👎 3</Button>
                  </div>
                </li>
                {/* Add more forum posts here */}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chat">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-6 w-6" />
                Real-Time Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Chat functionality coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="studyGroups">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-6 w-6" />
                Study Groups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Study group features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="askExpert">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="mr-2 h-6 w-6" />
                Ask an Expert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Expert Q&A sessions coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            Resource Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
              <span>Introduction to React Hooks</span>
              <Button size="sm">View</Button>
            </li>
            {/* Add more resources here */}
          </ul>
        </CardContent>
      </Card>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-6 w-6" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center justify-between p-2 bg-secondary rounded-md">
              <span>1. John Doe</span>
              <span>1250 points</span>
            </li>
            {/* Add more leaderboard entries here */}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Community;