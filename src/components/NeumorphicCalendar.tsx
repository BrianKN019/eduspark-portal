import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
}

const NeumorphicCalendar: React.FC<{ events: Event[] }> = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));

  return (
    <Card className="neumorphic-card overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={handlePrevMonth} className="text-white">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <CardTitle className="text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</CardTitle>
          <Button variant="ghost" onClick={handleNextMonth} className="text-white">
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          events={events}
          height="auto"
          dayMaxEvents={3}
          eventContent={(eventInfo) => (
            <div className="text-xs p-1 rounded-md shadow-sm" style={{ backgroundColor: eventInfo.event.backgroundColor }}>
              {eventInfo.timeText && <div className="font-semibold">{eventInfo.timeText}</div>}
              <div className="font-medium truncate">{eventInfo.event.title}</div>
            </div>
          )}
          dayCellContent={(args) => (
            <div className="flex flex-col items-center justify-center h-full">
              <span className={`text-sm ${!isSameMonth(args.date, currentDate) ? 'text-gray-400' : ''}`}>
                {format(args.date, 'd')}
              </span>
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default NeumorphicCalendar;