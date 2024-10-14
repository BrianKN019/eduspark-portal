import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminDashboard: React.FC = () => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4">Admin Control Panel</h3>
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle>Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Total Users: 5,000</p>
            <p>Active Courses: 50</p>
            <p>Revenue This Month: $25,000</p>
          </div>
        </CardContent>
      </Card>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button className="w-full neumorphic-button">Add New User</Button>
            <Button className="w-full neumorphic-button" variant="outline">Manage Roles</Button>
            <Button className="w-full neumorphic-button" variant="outline">View User Reports</Button>
          </div>
        </CardContent>
      </Card>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>Server Status: Operational</p>
            <p>Database Load: 35%</p>
            <p>Last Backup: 2 hours ago</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AdminDashboard;