import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  start: Date;
  color: string;
}

const InteractiveCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({ title: '', color: '#3b82f6' });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
  };

  const handleAddEvent = () => {
    if (newEvent.title && selectedDate) {
      const event: Event = {
        id: Date.now().toString(),
        title: newEvent.title,
        start: selectedDate,
        color: newEvent.color,
      };
      setEvents([...events, event]);
      setNewEvent({ title: '', color: '#3b82f6' });
      setSelectedDate(null);
    }
  };

  return (
    <Card className="neumorphic-card overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <h2 className="text-2xl font-bold">Interactive Calendar</h2>
        </div>
        <div className="p-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Select date to add event</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Input
                type="text"
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="mb-2"
              />
              <Input
                type="color"
                value={newEvent.color}
                onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                className="mb-2"
              />
              <Button onClick={handleAddEvent} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            </PopoverContent>
          </Popover>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          dateClick={handleDateClick}
          height="auto"
          eventContent={(eventInfo) => (
            <div className="p-1 rounded-md shadow-sm text-xs" style={{ backgroundColor: eventInfo.event.backgroundColor }}>
              {eventInfo.event.title}
            </div>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default InteractiveCalendar;