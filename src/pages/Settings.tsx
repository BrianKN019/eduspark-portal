import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Settings: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Settings</h2>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email Notifications</label>
            <select className="w-full p-2 rounded neumorphic-select">
              <option>All notifications</option>
              <option>Important only</option>
              <option>None</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select className="w-full p-2 rounded neumorphic-select">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <Button className="w-full neumorphic-button">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;