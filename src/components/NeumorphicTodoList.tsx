import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Plus, X, CheckCircle, Circle, Tag, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { motion } from 'framer-motion';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  color: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

const NeumorphicTodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false,
        color: selectedColor,
        priority: selectedPriority,
        dueDate: selectedDate
      }]);
      setNewTodo('');
      setSelectedDate(undefined);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return <Tag className="h-4 w-4 text-blue-500" />;
      case 'medium': return <Tag className="h-4 w-4 text-yellow-500" />;
      case 'high': return <Tag className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Creative To-Do List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 mb-4">
            <Input
              type="text"
              placeholder="Add new task"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="neumorphic-input"
            />
            <div className="flex space-x-2">
              <Input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-12 h-10 p-1 neumorphic-input"
              />
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="neumorphic-input flex-grow"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="neumorphic-button">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {selectedDate ? format(selectedDate, 'PPP') : <span>Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={addTodo} className="neumorphic-button w-full">
              <Plus className="h-5 w-5 mr-2" /> Add Task
            </Button>
          </div>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {todos.map(todo => (
              <motion.li
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 rounded-lg neumorphic-card transition-all"
                style={{ borderLeft: `4px solid ${todo.color}` }}
              >
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" onClick={() => toggleTodo(todo.id)} className="p-0">
                    {todo.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </Button>
                  <span className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.text}
                  </span>
                  {getPriorityIcon(todo.priority)}
                  {todo.dueDate && (
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(todo.dueDate, 'MMM d')}
                    </span>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeTodo(todo.id)} className="hover:bg-red-100 dark:hover:bg-red-900 rounded-full">
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NeumorphicTodoList;