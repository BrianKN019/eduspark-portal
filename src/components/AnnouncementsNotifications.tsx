import React from 'react';
import { Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';

// Mock data - replace with actual API call
const fetchNotifications = async () => {
  // Simulate API call
  return [
    { id: 1, message: "New assignment due in 3 days", type: "assignment" },
    { id: 2, message: "Live session scheduled for tomorrow", type: "live_session" },
    { id: 3, message: "Course update: New module available", type: "course_update" },
  ];
};

const AnnouncementsNotifications: React.FC = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  if (isLoading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-4 w-4" />
          Announcements & Notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {notifications?.map((notification) => (
            <li key={notification.id} className="flex items-center p-2 bg-accent rounded-md">
              <span className="mr-2">
                {notification.type === 'assignment' && '📝'}
                {notification.type === 'live_session' && '🎥'}
                {notification.type === 'course_update' && '📚'}
              </span>
              {notification.message}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AnnouncementsNotifications;