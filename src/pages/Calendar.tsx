import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus, X, Tag, Clock, ChevronLeft, ChevronRight, Sun, Moon, Cloud, Zap } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

type TodoItem = {
  id: number;
  text: string;
  date: Date;
  tag: string;
  color: string;
  priority: 'low' | 'medium' | 'high';
};

const Calendar: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const addTodo = () => {
    if (newTodo.trim() !== '' && selectedDate) {
      const newItem: TodoItem = {
        id: Date.now(),
        text: newTodo,
        date: selectedDate,
        tag: selectedTag,
        color: selectedColor,
        priority: selectedPriority
      };
      setTodos([...todos, newItem]);
      setNewTodo('');
    }
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return <Cloud className="h-4 w-4 text-blue-400" />;
      case 'medium': return <Sun className="h-4 w-4 text-yellow-400" />;
      case 'high': return <Zap className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
  };

  const handleEventDrop = (arg: any) => {
    const updatedTodos = todos.map(todo =>
      todo.id === parseInt(arg.event.id) ? { ...todo, date: arg.event.start } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Interactive Calendar & Task Manager</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 neumorphic-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <CardTitle className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy')}</CardTitle>
              <Button variant="ghost" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
              }}
              events={todos.map(todo => ({
                id: todo.id.toString(),
                title: todo.text,
                start: todo.date,
                color: todo.color,
                extendedProps: { priority: todo.priority, tag: todo.tag }
              }))}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              dateClick={handleDateClick}
              eventDrop={handleEventDrop}
              eventContent={(eventInfo) => (
                <div className="flex items-center p-1 rounded-lg shadow-sm" style={{ backgroundColor: eventInfo.event.backgroundColor }}>
                  <span className="mr-1">{getPriorityIcon(eventInfo.event.extendedProps.priority)}</span>
                  <span className="font-medium text-white">{eventInfo.event.title}</span>
                  {eventInfo.event.extendedProps.tag && (
                    <span className="ml-1 text-xs bg-white bg-opacity-30 rounded px-1">
                      {eventInfo.event.extendedProps.tag}
                    </span>
                  )}
                </div>
              )}
            />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Plus className="mr-2 h-5 w-5" />
                Create New Task
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Task description"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="w-full"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="text"
                  placeholder="Add tag"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full"
                />
                <div className="flex space-x-2">
                  <Input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="flex-grow border rounded p-2"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <Button onClick={addTodo} className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white">
                  Add Task
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Clock className="mr-2 h-5 w-5" />
                Task List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {todos.map(todo => (
                  <li key={todo.id} className="flex items-center justify-between p-2 rounded-lg shadow-sm transition-all hover:shadow-md" style={{ backgroundColor: `${todo.color}20` }}>
                    <div className="flex items-center space-x-2">
                      {getPriorityIcon(todo.priority)}
                      <span className="font-medium">{todo.text}</span>
                      <span className="text-sm text-gray-500">{format(todo.date, 'MMM d')}</span>
                      {todo.tag && <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">{todo.tag}</span>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeTodo(todo.id)} className="hover:bg-red-100 dark:hover:bg-red-900">
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;