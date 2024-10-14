import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', users: 4000, courses: 2400, amt: 2400 },
  { name: 'Feb', users: 3000, courses: 1398, amt: 2210 },
  { name: 'Mar', users: 2000, courses: 9800, amt: 2290 },
  { name: 'Apr', users: 2780, courses: 3908, amt: 2000 },
  { name: 'May', users: 1890, courses: 4800, amt: 2181 },
  { name: 'Jun', users: 2390, courses: 3800, amt: 2500 },
  { name: 'Jul', users: 3490, courses: 4300, amt: 2100 },
];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Analytics</h2>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle>Platform Growth</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="courses" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;