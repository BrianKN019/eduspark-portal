
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CalendarDays, Trash2, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { HexColorPicker } from "react-colorful";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  color?: string;
  extendedProps?: {
    description?: string;
    priority?: 'low' | 'medium' | 'high';
  };
}

interface CalendarEventData {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  is_all_day: boolean;
  color: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  user_id: string;
}

const InteractiveCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const [newEvent, setNewEvent] = useState<{
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    description: string;
    priority: 'low' | 'medium' | 'high';
    color: string;
  }>({
    title: '',
    start: new Date(),
    end: new Date(),
    allDay: false,
    description: '',
    priority: 'medium',
    color: '#3B82F6', // Default blue color
  });
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching events:', error);
        return;
      }
      
      const formattedEvents: CalendarEvent[] = (data as CalendarEventData[]).map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_date),
        end: new Date(event.end_date || event.start_date),
        allDay: event.is_all_day,
        color: event.color,
        extendedProps: {
          description: event.description,
          priority: event.priority
        }
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error in fetchEvents:', error);
    }
  };
  
  const handleDateSelect = (selectInfo: any) => {
    const start = selectInfo.start;
    const end = selectInfo.end;
    
    setNewEvent({
      ...newEvent,
      start,
      end,
      allDay: selectInfo.allDay
    });
    
    setIsAddEventOpen(true);
  };
  
  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end || clickInfo.event.start,
      allDay: clickInfo.event.allDay,
      color: clickInfo.event.backgroundColor,
      extendedProps: {
        description: clickInfo.event.extendedProps.description,
        priority: clickInfo.event.extendedProps.priority
      }
    });
    
    setIsViewEventOpen(true);
  };
  
  const handleAddEvent = async () => {
    if (!newEvent.title.trim()) {
      toast.error('Please enter an event title');
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add events');
        return;
      }
      
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          title: newEvent.title,
          start_date: newEvent.start.toISOString(),
          end_date: newEvent.end.toISOString(),
          is_all_day: newEvent.allDay,
          description: newEvent.description,
          priority: newEvent.priority,
          color: newEvent.color,
          user_id: user.id
        })
        .select();
      
      if (error) {
        console.error('Error adding event:', error);
        toast.error('Failed to add event');
        return;
      }
      
      const createdEvent = data[0] as CalendarEventData;
      
      setEvents([...events, {
        id: createdEvent.id,
        title: createdEvent.title,
        start: new Date(createdEvent.start_date),
        end: new Date(createdEvent.end_date),
        allDay: createdEvent.is_all_day,
        color: createdEvent.color,
        extendedProps: {
          description: createdEvent.description,
          priority: createdEvent.priority
        }
      }]);
      
      setIsAddEventOpen(false);
      resetNewEvent();
      toast.success('Event added successfully');
    } catch (error) {
      console.error('Error in handleAddEvent:', error);
      toast.error('An error occurred');
    }
  };
  
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', selectedEvent.id);
      
      if (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
        return;
      }
      
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setIsViewEventOpen(false);
      setSelectedEvent(null);
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Error in handleDeleteEvent:', error);
      toast.error('An error occurred');
    }
  };
  
  const resetNewEvent = () => {
    setNewEvent({
      title: '',
      start: new Date(),
      end: new Date(),
      allDay: false,
      description: '',
      priority: 'medium',
      color: '#3B82F6',
    });
  };
  
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };
  
  return (
    <Card className="neumorphic-card neumorphic-convex shadow-lg">
      <CardHeader className="pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center">
            <CalendarDays className="mr-2 h-6 w-6 text-blue-500" />
            Interactive Calendar
          </CardTitle>
          <Button onClick={() => {
            resetNewEvent();
            setIsAddEventOpen(true);
          }} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="bg-white dark:bg-gray-850 rounded-lg overflow-hidden shadow-sm">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            height="auto"
            aspectRatio={1.5}
          />
        </div>
      </CardContent>
      
      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Fill in the details for your new calendar event.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="Enter event title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <div className="relative">
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {format(newEvent.start, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newEvent.start}
                        onSelect={(date) => {
                          if (date) {
                            const current = new Date(newEvent.start);
                            date.setHours(current.getHours());
                            date.setMinutes(current.getMinutes());
                            setNewEvent({...newEvent, start: date});
                            
                            // If end date is before start date, update it
                            if (date > newEvent.end) {
                              setNewEvent(prev => ({...prev, end: date}));
                            }
                          }
                          setIsDatePickerOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <div className="relative">
                  <Popover open={isEndDatePickerOpen} onOpenChange={setIsEndDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {format(newEvent.end, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newEvent.end}
                        onSelect={(date) => {
                          if (date) {
                            const current = new Date(newEvent.end);
                            date.setHours(current.getHours());
                            date.setMinutes(current.getMinutes());
                            setNewEvent({...newEvent, end: date});
                          }
                          setIsEndDatePickerOpen(false);
                        }}
                        disabled={(date) => date < newEvent.start}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="all-day"
                checked={newEvent.allDay}
                onCheckedChange={(checked) => setNewEvent({...newEvent, allDay: checked})}
              />
              <Label htmlFor="all-day">All day event</Label>
            </div>
            
            <div className="space-y-2">
              <Label>Event Color</Label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: newEvent.color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                ></div>
                <span className="text-sm">{newEvent.color}</span>
              </div>
              
              {showColorPicker && (
                <div className="mt-2 z-10 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <HexColorPicker 
                    color={newEvent.color} 
                    onChange={(color) => setNewEvent({...newEvent, color})} 
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <div className="flex space-x-2">
                {['low', 'medium', 'high'].map((priority) => (
                  <Button
                    key={priority}
                    type="button"
                    variant={newEvent.priority === priority ? "default" : "outline"}
                    className={newEvent.priority === priority ? "" : "border-gray-300"}
                    onClick={() => setNewEvent({...newEvent, priority: priority as 'low' | 'medium' | 'high'})}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Enter event description"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Event Dialog */}
      <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: selectedEvent?.color }}
              ></div>
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Start</p>
                <p className="text-sm">
                  {selectedEvent && format(selectedEvent.start, "PPP")}
                  {selectedEvent && !selectedEvent.allDay && ` at ${format(selectedEvent.start, "p")}`}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">End</p>
                <p className="text-sm">
                  {selectedEvent && format(selectedEvent.end, "PPP")}
                  {selectedEvent && !selectedEvent.allDay && ` at ${format(selectedEvent.end, "p")}`}
                </p>
              </div>
            </div>
            
            {selectedEvent?.extendedProps?.priority && (
              <div>
                <p className="text-sm font-medium mb-1">Priority</p>
                <span className={`inline-block px-2 py-1 rounded text-xs ${getPriorityStyles(selectedEvent.extendedProps.priority)}`}>
                  {selectedEvent.extendedProps.priority.charAt(0).toUpperCase() + selectedEvent.extendedProps.priority.slice(1)}
                </span>
              </div>
            )}
            
            {selectedEvent?.extendedProps?.description && (
              <div>
                <p className="text-sm font-medium mb-1">Description</p>
                <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  {selectedEvent.extendedProps.description}
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={handleDeleteEvent} className="flex items-center">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button onClick={() => setIsViewEventOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Helper function to render event content
function renderEventContent(eventInfo: any) {
  const priority = eventInfo.event.extendedProps.priority || 'medium';
  let priorityColor = 'bg-yellow-500';
  
  if (priority === 'high') priorityColor = 'bg-red-500';
  if (priority === 'low') priorityColor = 'bg-green-500';
  
  return (
    <div className="flex items-center px-1 py-0.5 overflow-hidden" style={{ fontSize: '0.8rem' }}>
      <div className={`w-2 h-2 rounded-full mr-1 ${priorityColor}`}></div>
      <div className="font-medium truncate">{eventInfo.event.title}</div>
    </div>
  );
}

export default InteractiveCalendar;
