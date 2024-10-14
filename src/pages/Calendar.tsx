import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Calendar: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Calendar</h2>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Calendar implementation coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;