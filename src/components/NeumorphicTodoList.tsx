
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit, Check, Star, Clock, CalendarDays } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { HexColorPicker } from "react-colorful";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  color: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
  favorite: boolean;
  user_id: string;
}

interface TaskData {
  id: string;
  text: string;
  completed: boolean;
  color: string;
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
  favorite: boolean;
  user_id: string;
}

const NeumorphicTodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'favorites'>('all');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<'created' | 'due' | 'priority'>('created');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const [newTask, setNewTask] = useState<{
    text: string;
    priority: 'low' | 'medium' | 'high';
    color: string;
    due_date: Date | null;
  }>({
    text: '',
    priority: 'medium',
    color: '#3B82F6', // Default blue color
    due_date: null
  });
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const fetchTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }
      
      setTasks(data as Task[]);
    } catch (error) {
      console.error('Error in fetchTasks:', error);
    }
  };
  
  const addTask = async () => {
    if (!newTask.text.trim()) {
      toast.error('Task text cannot be empty');
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add tasks');
        return;
      }
      
      const newTaskData = {
        text: newTask.text,
        completed: false,
        color: newTask.color,
        priority: newTask.priority,
        due_date: newTask.due_date ? newTask.due_date.toISOString() : null,
        favorite: false,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert(newTaskData)
        .select();
      
      if (error) {
        console.error('Error adding task:', error);
        toast.error('Failed to add task');
        return;
      }
      
      setTasks([...tasks, data[0] as Task]);
      resetNewTask();
      setIsAddTaskOpen(false);
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Error in addTask:', error);
      toast.error('An error occurred');
    }
  };
  
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating task:', error);
        toast.error('Failed to update task');
        return;
      }
      
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
    } catch (error) {
      console.error('Error in updateTask:', error);
      toast.error('An error occurred');
    }
  };
  
  const toggleTaskCompletion = async (id: string, completed: boolean) => {
    await updateTask(id, { completed });
  };
  
  const toggleFavorite = async (id: string, favorite: boolean) => {
    await updateTask(id, { favorite });
  };
  
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
        return;
      }
      
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error in deleteTask:', error);
      toast.error('An error occurred');
    }
  };
  
  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setIsEditTaskOpen(true);
  };
  
  const saveEditedTask = async () => {
    if (!editTask) return;
    
    try {
      await updateTask(editTask.id, {
        text: editTask.text,
        priority: editTask.priority,
        color: editTask.color,
        due_date: editTask.due_date
      });
      
      setIsEditTaskOpen(false);
      setEditTask(null);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error in saveEditedTask:', error);
      toast.error('An error occurred');
    }
  };
  
  const resetNewTask = () => {
    setNewTask({
      text: '',
      priority: 'medium',
      color: '#3B82F6',
      due_date: null
    });
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    if (filter === 'favorites') return task.favorite;
    return true;
  });
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    } else if (sortBy === 'due') {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    } else {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
  
  return (
    <Card className="neumorphic-card neumorphic-convex shadow-lg">
      <CardHeader className="pb-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-950">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Todo List</CardTitle>
          <Button onClick={() => setIsAddTaskOpen(true)} size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            size="sm"
            variant={filter === 'all' ? "default" : "outline"}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? "bg-blue-600" : ""}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'active' ? "default" : "outline"}
            onClick={() => setFilter('active')}
            className={filter === 'active' ? "bg-green-600" : ""}
          >
            Active
          </Button>
          <Button
            size="sm"
            variant={filter === 'completed' ? "default" : "outline"}
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? "bg-purple-600" : ""}
          >
            Completed
          </Button>
          <Button
            size="sm"
            variant={filter === 'favorites' ? "default" : "outline"}
            onClick={() => setFilter('favorites')}
            className={filter === 'favorites' ? "bg-yellow-600" : ""}
          >
            <Star className="h-4 w-4 mr-1" />
            Favorites
          </Button>
        </div>
        
        <div className="mb-4">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'created' | 'due' | 'priority')}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Date Created</SelectItem>
              <SelectItem value="due">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <Check className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No tasks to display</p>
              <Button 
                variant="link" 
                onClick={() => setIsAddTaskOpen(true)}
                className="mt-2"
              >
                Add your first task
              </Button>
            </div>
          ) : (
            sortedTasks.map(task => (
              <div 
                key={task.id} 
                className={`flex items-start group p-3 rounded-lg transition-all duration-200 ${
                  task.completed 
                    ? 'bg-gray-50 dark:bg-gray-800/50' 
                    : 'bg-white dark:bg-gray-800 hover:shadow-md'
                }`}
                style={{ borderLeft: `4px solid ${task.color}` }}
              >
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={() => toggleTaskCompletion(task.id, !task.completed)}
                  className="mt-1"
                />
                
                <div className="ml-3 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                        {task.text}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                          task.priority === 'high' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                            : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        
                        {task.due_date && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(task.due_date), "MMM d")}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8" 
                        onClick={() => toggleFavorite(task.id, !task.favorite)}
                      >
                        <Star className={`h-4 w-4 ${task.favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                      
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8" 
                        onClick={() => handleEditTask(task)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-red-500 hover:text-red-600" 
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-text">Task</Label>
              <Input
                id="task-text"
                value={newTask.text}
                onChange={(e) => setNewTask({...newTask, text: e.target.value})}
                placeholder="Enter task description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <div className="flex space-x-2">
                {['low', 'medium', 'high'].map((priority) => (
                  <Button
                    key={priority}
                    type="button"
                    variant={newTask.priority === priority ? "default" : "outline"}
                    className={newTask.priority === priority ? "" : "border-gray-300"}
                    onClick={() => setNewTask({...newTask, priority: priority as 'low' | 'medium' | 'high'})}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Task Color</Label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: newTask.color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                ></div>
                <span className="text-sm">{newTask.color}</span>
              </div>
              
              {showColorPicker && (
                <div className="mt-2 z-10 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <HexColorPicker 
                    color={newTask.color} 
                    onChange={(color) => setNewTask({...newTask, color})} 
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date (Optional)</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {newTask.due_date ? format(newTask.due_date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newTask.due_date || undefined}
                    onSelect={(date) => {
                      setNewTask({...newTask, due_date: date});
                      setIsDatePickerOpen(false);
                    }}
                  />
                  {newTask.due_date && (
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setNewTask({...newTask, due_date: null});
                          setIsDatePickerOpen(false);
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        Clear date
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetNewTask();
              setIsAddTaskOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={addTask}>
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Task Dialog */}
      {editTask && (
        <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-task-text">Task</Label>
                <Input
                  id="edit-task-text"
                  value={editTask.text}
                  onChange={(e) => setEditTask({...editTask, text: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <div className="flex space-x-2">
                  {['low', 'medium', 'high'].map((priority) => (
                    <Button
                      key={priority}
                      type="button"
                      variant={editTask.priority === priority ? "default" : "outline"}
                      className={editTask.priority === priority ? "" : "border-gray-300"}
                      onClick={() => setEditTask({...editTask, priority: priority as 'low' | 'medium' | 'high'})}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Task Color</Label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: editTask.color }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  ></div>
                  <span className="text-sm">{editTask.color}</span>
                </div>
                
                {showColorPicker && (
                  <div className="mt-2 z-10 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                    <HexColorPicker 
                      color={editTask.color} 
                      onChange={(color) => setEditTask({...editTask, color})} 
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-due-date">Due Date (Optional)</Label>
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {editTask.due_date ? format(new Date(editTask.due_date), "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editTask.due_date ? new Date(editTask.due_date) : undefined}
                      onSelect={(date) => {
                        setEditTask({...editTask, due_date: date ? date.toISOString() : null});
                        setIsDatePickerOpen(false);
                      }}
                    />
                    {editTask.due_date && (
                      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setEditTask({...editTask, due_date: null});
                            setIsDatePickerOpen(false);
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          Clear date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditTaskOpen(false);
                setEditTask(null);
              }}>
                Cancel
              </Button>
              <Button onClick={saveEditedTask}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default NeumorphicTodoList;
