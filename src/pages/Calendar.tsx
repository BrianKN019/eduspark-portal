
import React from 'react';
import InteractiveCalendar from '@/components/InteractiveCalendar';
import NeumorphicTodoList from '@/components/NeumorphicTodoList';

const Calendar: React.FC = () => {
  return (
    <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Premium Calendar & Task Manager</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractiveCalendar />
        </div>
        <div>
          <NeumorphicTodoList />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
