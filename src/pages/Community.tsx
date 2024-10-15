import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Community: React.FC = () => {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold">Community & Forums</h2>
      <Tabs defaultValue="forums" className="w-full">
        <TabsList className="flex flex-wrap justify-start">
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="chat">Real-Time Chat</TabsTrigger>
          <TabsTrigger value="studyGroups">Study Groups</TabsTrigger>
          <TabsTrigger value="askExpert">Ask an Expert</TabsTrigger>
          <TabsTrigger value="challenges">Coding Challenges</TabsTrigger>
          <TabsTrigger value="events">Community Events</TabsTrigger>
        </TabsList>
        <TabsContent value="forums"><CommunityForums /></TabsContent>
        <TabsContent value="chat"><CommunityChat /></TabsContent>
        <TabsContent value="studyGroups"><CommunityStudyGroups /></TabsContent>
        <TabsContent value="askExpert"><CommunityAskExpert /></TabsContent>
        <TabsContent value="challenges"><CommunityChallenges /></TabsContent>
        <TabsContent value="events"><CommunityEvents /></TabsContent>
      </Tabs>
      <CommunityResourceCenter />
      <CommunityLeaderboard />
      <CommunityInnovationCorner />
      <CommunityProjects />
    </div>
  );
};

export default Community;