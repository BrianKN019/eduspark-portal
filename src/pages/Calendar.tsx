import React, { useState } from 'react';
import NeumorphicCalendar from '@/components/NeumorphicCalendar';
import NeumorphicTodoList from '@/components/NeumorphicTodoList';

const Calendar: React.FC = () => {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Meeting with Team',
      start: new Date(2023, 4, 15, 10, 0),
      end: new Date(2023, 4, 15, 11, 0),
      color: '#4CAF50'
    },
    {
      id: '2',
      title: 'Lunch with Client',
      start: new Date(2023, 4, 16, 12, 30),
      end: new Date(2023, 4, 16, 13, 30),
      color: '#2196F3'
    },
    // Add more sample events as needed
  ]);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Calendar & Tasks</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NeumorphicCalendar events={events} />
        </div>
        <div>
          <NeumorphicTodoList />
        </div>
      </div>
    </div>
  );
};

export default Calendar;