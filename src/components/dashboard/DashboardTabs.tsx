import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const DashboardTabs: React.FC = () => {
  return (
    <Card className="overflow-hidden shadow-lg">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <CardContent>
          <TabsContent value="overview">Overview content</TabsContent>
          <TabsContent value="progress">Progress content</TabsContent>
          <TabsContent value="notifications">Notifications content</TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default DashboardTabs;