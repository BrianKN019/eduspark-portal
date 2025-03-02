import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, CheckCircle, Circle, Tag, Clock, Calendar as CalendarIcon, Filter, MoreHorizontal, Edit, Trash2, Star } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  color: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  created_at?: string;
  favorite?: boolean;
}

// Define a type for the task data from the database
interface TaskData {
  id: string;
  text: string;
  completed: boolean;
  color: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
  user_id: string;
  favorite: boolean;
}

const NeumorphicTodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'favorite'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('tasks' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching todos:', error);
          toast.error('Failed to load tasks');
          return;
        }
        
        if (data) {
          const tasksData = data as unknown as TaskData[];
          const formattedTodos = tasksData.map(todo => ({
            id: todo.id,
            text: todo.text,
            completed: todo.completed,
            color: todo.color,
            priority: todo.priority as 'low' | 'medium' | 'high',
            dueDate: todo.due_date ? new Date(todo.due_date) : undefined,
            created_at: todo.created_at,
            favorite: todo.favorite
          }));
          
          setTodos(formattedTodos);
        }
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTodo = async (todo: Omit<Todo, 'id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to save tasks');
        return null;
      }
      
      const todoData = {
        text: todo.text,
        completed: todo.completed,
        color: todo.color,
        priority: todo.priority,
        due_date: todo.dueDate ? todo.dueDate.toISOString() : null,
        user_id: user.id,
        favorite: todo.favorite || false
      };
      
      const { data, error } = await supabase
        .from('tasks' as any)
        .insert([todoData])
        .select();
        
      if (error) {
        console.error('Error saving task:', error);
        toast.error('Failed to save task');
        return null;
      }
      
      toast.success('Task added successfully');
      return data[0] as unknown as TaskData;
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Failed to save task');
      return null;
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to update tasks');
        return false;
      }
      
      const todoData: any = {};
      
      if (updates.text !== undefined) todoData.text = updates.text;
      if (updates.completed !== undefined) todoData.completed = updates.completed;
      if (updates.color !== undefined) todoData.color = updates.color;
      if (updates.priority !== undefined) todoData.priority = updates.priority;
      if (updates.dueDate !== undefined) todoData.due_date = updates.dueDate ? updates.dueDate.toISOString() : null;
      if (updates.favorite !== undefined) todoData.favorite = updates.favorite;
      
      const { error } = await supabase
        .from('tasks' as any)
        .update(todoData)
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error updating task:', error);
        toast.error('Failed to update task');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      return false;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to delete tasks');
        return false;
      }
      
      const { error } = await supabase
        .from('tasks' as any)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
        return false;
      }
      
      toast.success('Task deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return false;
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() === '') {
      toast.error('Please enter a task');
      return;
    }
    
    const newTodoItem: Omit<Todo, 'id'> = {
      text: newTodo,
      completed: false,
      color: selectedColor,
      priority: selectedPriority,
      dueDate: dueDate,
      favorite: false
    };
    
    const savedTodo = await saveTodo(newTodoItem);
    
    if (savedTodo) {
      setTodos([{
        ...newTodoItem,
        id: savedTodo.id,
        created_at: savedTodo.created_at
      }, ...todos]);
      
      setNewTodo('');
      setDueDate(undefined);
    }
  };

  const toggleTodo = async (id: string) => {
    const todoToToggle = todos.find(todo => todo.id === id);
    if (!todoToToggle) return;
    
    const newCompletedState = !todoToToggle.completed;
    const success = await updateTodo(id, { completed: newCompletedState });
    
    if (success) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: newCompletedState } : todo
      ));
      
      toast.success(newCompletedState ? 'Task completed!' : 'Task marked as incomplete');
    }
  };

  const toggleFavorite = async (id: string) => {
    const todoToToggle = todos.find(todo => todo.id === id);
    if (!todoToToggle) return;
    
    const newFavoriteState = !todoToToggle.favorite;
    const success = await updateTodo(id, { favorite: newFavoriteState });
    
    if (success) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, favorite: newFavoriteState } : todo
      ));
    }
  };

  const removeTodo = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;
    
    const success = await deleteTodo(id);
    
    if (success) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  const startEditingTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.text);
    setSelectedColor(todo.color);
    setSelectedPriority(todo.priority);
    setDueDate(todo.dueDate);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setNewTodo('');
    setSelectedColor('#3b82f6');
    setSelectedPriority('medium');
    setDueDate(undefined);
  };

  const saveEditedTodo = async () => {
    if (!editingTodo) return;
    if (newTodo.trim() === '') {
      toast.error('Please enter a task');
      return;
    }
    
    const updates: Partial<Todo> = {
      text: newTodo,
      color: selectedColor,
      priority: selectedPriority,
      dueDate: dueDate
    };
    
    const success = await updateTodo(editingTodo.id, updates);
    
    if (success) {
      setTodos(todos.map(todo =>
        todo.id === editingTodo.id ? { ...todo, ...updates } : todo
      ));
      
      setEditingTodo(null);
      setNewTodo('');
      setSelectedColor('#3b82f6');
      setSelectedPriority('medium');
      setDueDate(undefined);
      
      toast.success('Task updated successfully');
    }
  };

  const getPriorityIcon = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return <Tag className="h-4 w-4 text-blue-500" />;
      case 'medium': return <Tag className="h-4 w-4 text-yellow-500" />;
      case 'high': return <Tag className="h-4 w-4 text-red-500" />;
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    if (filter === 'favorite') return todo.favorite;
    return true;
  });

  return (
    <Card className="shadow-xl border-0 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
      <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-5">
        <CardTitle className="text-2xl font-bold">Premium Task Manager</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-grow flex gap-2">
              <Input
                type="text"
                placeholder="Add new task"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="flex-grow shadow-sm"
              />
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="px-3 aspect-square" style={{ borderColor: selectedColor, color: selectedColor }}>
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: selectedColor }}></div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-2">
                    <h4 className="font-medium">Select Color</h4>
                    <Input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full h-10 p-1"
                    />
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280', '#000000'].map(color => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="px-3">
                    {getPriorityIcon(selectedPriority)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <div className="space-y-2">
                    <h4 className="font-medium">Priority</h4>
                    <div className="space-y-2">
                      <button
                        className={`flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${selectedPriority === 'low' ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        onClick={() => setSelectedPriority('low')}
                      >
                        <Tag className="h-4 w-4 text-blue-500" />
                        <span>Low</span>
                      </button>
                      <button
                        className={`flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${selectedPriority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}
                        onClick={() => setSelectedPriority('medium')}
                      >
                        <Tag className="h-4 w-4 text-yellow-500" />
                        <span>Medium</span>
                      </button>
                      <button
                        className={`flex items-center gap-2 w-full p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${selectedPriority === 'high' ? 'bg-red-50 dark:bg-red-900/20' : ''}`}
                        onClick={() => setSelectedPriority('high')}
                      >
                        <Tag className="h-4 w-4 text-red-500" />
                        <span>High</span>
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="px-3">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                  {dueDate && (
                    <div className="p-2 border-t flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {format(dueDate, "PP")}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => setDueDate(undefined)}>
                        Clear
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              onClick={editingTodo ? saveEditedTodo : addTodo} 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md"
            >
              {editingTodo ? (
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
            
            {editingTodo && (
              <Button variant="outline" onClick={cancelEditing}>
                Cancel
              </Button>
            )}
          </div>
          
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex space-x-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
              >
                All
              </Button>
              <Button 
                variant={filter === 'active' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setFilter('active')}
                className={filter === 'active' ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
              >
                Active
              </Button>
              <Button 
                variant={filter === 'completed' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setFilter('completed')}
                className={filter === 'completed' ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
              >
                Completed
              </Button>
              <Button 
                variant={filter === 'favorite' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setFilter('favorite')}
                className={filter === 'favorite' ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
              >
                <Star className="h-4 w-4 mr-1" />
                Favorites
              </Button>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {todos.filter(t => !t.completed).length} tasks left
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="mb-2">No tasks found</div>
              {filter !== 'all' && (
                <Button variant="link" onClick={() => setFilter('all')}>
                  Show all tasks
                </Button>
              )}
            </div>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {filteredTodos.map(todo => (
                <li 
                  key={todo.id} 
                  className={`flex items-center justify-between p-3 rounded-lg transition-all bg-white dark:bg-gray-800 shadow-sm hover:shadow-md border-l-4 ${todo.completed ? 'opacity-75' : ''}`} 
                  style={{ borderLeftColor: todo.color }}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <Button variant="ghost" size="sm" onClick={() => toggleTodo(todo.id)} className="p-0 mr-2">
                      {todo.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                        {todo.text}
                      </div>
                      
                      <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400 space-x-2">
                        <span className="flex items-center">
                          {getPriorityIcon(todo.priority)}
                          <span className="ml-1 capitalize">{todo.priority}</span>
                        </span>
                        
                        {todo.dueDate && (
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(todo.dueDate, "MMM d")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleFavorite(todo.id)} 
                      className="mr-1 hover:bg-transparent"
                    >
                      <Star className={`h-4 w-4 ${todo.favorite ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startEditingTodo(todo)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleTodo(todo.id)}>
                          {todo.completed ? (
                            <>
                              <Circle className="mr-2 h-4 w-4" />
                              Mark as Undone
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Done
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => removeTodo(todo.id)} className="text-red-600 dark:text-red-400">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NeumorphicTodoList;
