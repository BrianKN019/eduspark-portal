import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus, Tag, Clock, Trash2, Edit, ChevronDown, Check } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Event {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  color: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  isAllDay?: boolean;
}

// Define a type for the calendar events from the database
interface CalendarEventData {
  id: string;
  title: string;
  start_date: string;
  end_date?: string;
  color: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  is_all_day: boolean;
  user_id: string;
  created_at: string;
}

const InteractiveCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    start: new Date(),
    color: '#3b82f6',
    priority: 'medium',
    isAllDay: false,
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventEndDate, setEventEndDate] = useState<Date | null>(null);
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Explicitly cast the response data to any type first
        const { data, error } = await supabase
          .from('calendar_events' as any)
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error fetching events:', error);
          toast.error('Failed to load events');
          return;
        }
        
        if (data) {
          // Safely cast to our expected type
          const eventsData = data as unknown as CalendarEventData[];
          const formattedEvents = eventsData.map(event => ({
            id: event.id,
            title: event.title,
            start: new Date(event.start_date),
            end: event.end_date ? new Date(event.end_date) : undefined,
            color: event.color,
            description: event.description,
            priority: event.priority as 'low' | 'medium' | 'high',
            isAllDay: event.is_all_day
          }));
          
          setEvents(formattedEvents);
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
    resetForm();
  };

  const resetForm = () => {
    setNewEvent({
      title: '',
      start: selectedDate || new Date(),
      color: '#3b82f6',
      priority: 'medium',
      isAllDay: false,
    });
    setEventEndDate(null);
    setDescription('');
    setIsEditing(false);
    setEditingEventId(null);
  };

  const saveEvent = async (event: Omit<Event, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to save events');
        return null;
      }
      
      const eventData = {
        title: event.title,
        start_date: event.start.toISOString(),
        end_date: eventEndDate ? eventEndDate.toISOString() : null,
        color: event.color,
        description: description,
        priority: event.priority,
        is_all_day: event.isAllDay,
        user_id: user.id,
      };
      
      // Cast to any to avoid type errors during development
      const { data, error } = await supabase
        .from('calendar_events' as any)
        .insert([eventData])
        .select();
        
      if (error) {
        console.error('Error saving event:', error);
        toast.error('Failed to save event');
        return null;
      }
      
      toast.success('Event saved successfully');
      return data[0] as unknown as CalendarEventData;
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
      return null;
    }
  };

  const updateEvent = async (id: string, event: Omit<Event, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to update events');
        return false;
      }
      
      const eventData = {
        title: event.title,
        start_date: event.start.toISOString(),
        end_date: eventEndDate ? eventEndDate.toISOString() : null,
        color: event.color,
        description: description,
        priority: event.priority,
        is_all_day: event.isAllDay,
      };
      
      // Cast to any to avoid type errors during development
      const { error } = await supabase
        .from('calendar_events' as any)
        .update(eventData)
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error updating event:', error);
        toast.error('Failed to update event');
        return false;
      }
      
      toast.success('Event updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
      return false;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to delete events');
        return false;
      }
      
      // Cast to any to avoid type errors during development
      const { error } = await supabase
        .from('calendar_events' as any)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
        return false;
      }
      
      toast.success('Event deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      return false;
    }
  };

  const handleAddEvent = async () => {
    if (newEvent.title.trim() === '' || !selectedDate) {
      toast.error('Please enter an event title and select a date');
      return;
    }

    const eventToAdd = {
      ...newEvent,
      start: selectedDate,
    };

    if (isEditing && editingEventId) {
      // Update existing event
      const success = await updateEvent(editingEventId, eventToAdd);
      if (success) {
        setEvents(events.map(event => 
          event.id === editingEventId 
            ? { ...eventToAdd, id: editingEventId, end: eventEndDate || undefined } 
            : event
        ));
      }
    } else {
      // Add new event
      const savedEvent = await saveEvent(eventToAdd);
      if (savedEvent) {
        setEvents([...events, {
          ...eventToAdd,
          id: savedEvent.id,
          end: eventEndDate || undefined,
          description: description
        }]);
      }
    }

    setSelectedDate(null);
    resetForm();
  };

  const handleEventClick = (info: any) => {
    const clickedEvent = events.find(event => event.id === info.event.id);
    if (clickedEvent) {
      setIsEditing(true);
      setEditingEventId(clickedEvent.id);
      setSelectedDate(clickedEvent.start);
      setEventEndDate(clickedEvent.end || null);
      setNewEvent({
        title: clickedEvent.title,
        start: clickedEvent.start,
        color: clickedEvent.color,
        priority: clickedEvent.priority,
        isAllDay: clickedEvent.isAllDay || false,
      });
      setDescription(clickedEvent.description || '');
    }
  };

  const handleDeleteEvent = async () => {
    if (editingEventId) {
      const confirmed = window.confirm('Are you sure you want to delete this event?');
      if (confirmed) {
        const success = await deleteEvent(editingEventId);
        if (success) {
          setEvents(events.filter(event => event.id !== editingEventId));
          setSelectedDate(null);
          resetForm();
        }
      }
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return 'text-blue-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <Card className="shadow-xl border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
      <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-5">
        <CardTitle className="text-2xl font-bold">Premium Calendar</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <Popover open={!!selectedDate} onOpenChange={(open) => !open && setSelectedDate(null)}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : <span>Select date to add event</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {isEditing ? 'Edit Event' : 'Add New Event'}
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event Title
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter event title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="border rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date (Optional)
                    </label>
                    <Calendar
                      mode="single"
                      selected={eventEndDate}
                      onSelect={setEventEndDate}
                      initialFocus
                      className="border rounded-md"
                      disabled={(date) => selectedDate ? date < selectedDate : false}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      All Day Event
                    </label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newEvent.isAllDay}
                        onChange={(e) => setNewEvent({ ...newEvent, isAllDay: e.target.checked })}
                        className="mr-2 h-4 w-4"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        This event lasts all day
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      placeholder="Add a description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      rows={3}
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Color
                      </label>
                      <Input
                        type="color"
                        value={newEvent.color}
                        onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
                        className="h-10 w-full p-1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Priority
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            <div className="flex items-center">
                              <Tag className={`mr-2 h-4 w-4 ${getPriorityColor(newEvent.priority)}`} />
                              <span className="capitalize">{newEvent.priority}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setNewEvent({ ...newEvent, priority: 'low' })}>
                            <Tag className="mr-2 h-4 w-4 text-blue-500" />
                            <span>Low</span>
                            {newEvent.priority === 'low' && <Check className="ml-2 h-4 w-4" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setNewEvent({ ...newEvent, priority: 'medium' })}>
                            <Tag className="mr-2 h-4 w-4 text-yellow-500" />
                            <span>Medium</span>
                            {newEvent.priority === 'medium' && <Check className="ml-2 h-4 w-4" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setNewEvent({ ...newEvent, priority: 'high' })}>
                            <Tag className="mr-2 h-4 w-4 text-red-500" />
                            <span>High</span>
                            {newEvent.priority === 'high' && <Check className="ml-2 h-4 w-4" />}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    {isEditing && (
                      <Button variant="destructive" onClick={handleDeleteEvent} className="flex items-center">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    )}
                    <div className="flex gap-2 ml-auto">
                      <Button variant="outline" onClick={() => setSelectedDate(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddEvent} className="bg-gradient-to-r from-indigo-500 to-purple-600">
                        {isEditing ? (
                          <>
                            <Edit className="mr-2 h-4 w-4" />
                            Update
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button 
              onClick={() => setSelectedDate(new Date())} 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 w-full md:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" /> New Event
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
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
            eventClick={handleEventClick}
            height="auto"
            eventContent={(eventInfo) => (
              <div className="p-1 rounded-md shadow-sm text-xs w-full overflow-hidden" style={{ backgroundColor: eventInfo.event.backgroundColor }}>
                <div className="font-semibold text-white truncate">{eventInfo.event.title}</div>
                {eventInfo.event.extendedProps.priority && (
                  <div className="flex items-center mt-1">
                    <Tag className="h-3 w-3 mr-1 text-white" />
                    <span className="text-white capitalize text-[10px]">{eventInfo.event.extendedProps.priority}</span>
                  </div>
                )}
                {!eventInfo.event.allDay && eventInfo.timeText && (
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1 text-white" />
                    <span className="text-white text-[10px]">{eventInfo.timeText}</span>
                  </div>
                )}
              </div>
            )}
            buttonText={{
              today: 'Today',
              month: 'Month',
              week: 'Week',
              day: 'Day',
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: 'short'
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }}
            firstDay={1}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDayText="All day"
            dayMaxEvents={3}
            eventMaxStack={3}
            moreLinkClick="popover"
            moreLinkText="+ more"
            nowIndicator={true}
            dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
            dayPopoverFormat={{ month: 'long', day: 'numeric', year: 'numeric' }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveCalendar;
