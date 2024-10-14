import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

type TodoItem = {
  id: number;
  text: string;
  date: Date;
  tag: string;
  color: string;
};

const Calendar: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');

  const addTodo = () => {
    if (newTodo.trim() !== '' && selectedDate) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        date: selectedDate,
        tag: selectedTag,
        color: selectedColor
      }]);
      setNewTodo('');
    }
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Calendar</h2>
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle>To-Do List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="New todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-grow"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
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
              placeholder="Tag"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-24"
            />
            <Input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Button onClick={addTodo}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <ul className="space-y-2">
            {todos.map(todo => (
              <li key={todo.id} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: todo.color + '20' }}>
                <div>
                  <span className="font-medium">{todo.text}</span>
                  <span className="ml-2 text-sm text-gray-500">{format(todo.date, 'PPP')}</span>
                  {todo.tag && <span className="ml-2 px-2 py-1 bg-gray-200 rounded-full text-xs">{todo.tag}</span>}
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeTodo(todo.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;