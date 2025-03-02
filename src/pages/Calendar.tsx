
import React from 'react';
import InteractiveCalendar from '@/components/InteractiveCalendar';
import NeumorphicTodoList from '@/components/NeumorphicTodoList';

const Calendar: React.FC = () => {
  return (
    <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Premium Calendar & Task Manager</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">Plan your schedule, manage tasks, and stay productive with our premium tools.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <InteractiveCalendar />
        </div>
        <div className="order-1 lg:order-2">
          <NeumorphicTodoList />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
