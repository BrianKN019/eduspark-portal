
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Trash2, Edit, Plus } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface CourseNote {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface CourseNotesProps {
  courseId: string;
}

const CourseNotes: React.FC<CourseNotesProps> = ({ courseId }) => {
  const [notes, setNotes] = useState<CourseNote[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, [courseId]);

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('course_notes')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
        return;
      }

      setNotes(data || []);
    } catch (error) {
      console.error("Exception fetching notes:", error);
    }
  };

  const saveNote = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to save notes");
        return;
      }

      if (!title.trim() || !content.trim()) {
        toast.error("Title and content are required");
        return;
      }

      if (isEditing && currentNoteId) {
        // Update existing note
        const { error } = await supabase
          .from('course_notes')
          .update({
            title,
            content,
          })
          .eq('id', currentNoteId)
          .eq('user_id', user.id);

        if (error) {
          console.error("Error updating note:", error);
          toast.error("Failed to update note");
          return;
        }
        
        toast.success("Note updated successfully");
      } else {
        // Create new note
        const { error } = await supabase
          .from('course_notes')
          .insert([{
            user_id: user.id,
            course_id: courseId,
            title,
            content,
          }]);

        if (error) {
          console.error("Error creating note:", error);
          toast.error("Failed to create note");
          return;
        }
        
        toast.success("Note saved successfully");
      }

      // Reset form and refresh notes
      setTitle('');
      setContent('');
      setIsEditing(false);
      setCurrentNoteId(null);
      fetchNotes();
    } catch (error) {
      console.error("Exception saving note:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const editNote = (note: CourseNote) => {
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(true);
    setCurrentNoteId(note.id);
  };

  const deleteNote = async (noteId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('course_notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) {
        console.error("Error deleting note:", error);
        toast.error("Failed to delete note");
        return;
      }

      toast.success("Note deleted successfully");
      fetchNotes();
      
      // Reset form if the deleted note was being edited
      if (currentNoteId === noteId) {
        setTitle('');
        setContent('');
        setIsEditing(false);
        setCurrentNoteId(null);
      }
    } catch (error) {
      console.error("Exception deleting note:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setIsEditing(false);
    setCurrentNoteId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Note Editor */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Note" : "Create Note"}
            </CardTitle>
            <CardDescription>
              {isEditing 
                ? "Update your existing note" 
                : "Take notes to remember important concepts from this course"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-2"
              />
              <Textarea
                placeholder="Write your notes here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetForm}>
              {isEditing ? "Cancel" : "Clear"}
            </Button>
            <Button onClick={saveNote}>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Update Note" : "Save Note"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Notes List */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Notes</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={resetForm}
                className="h-8 w-8 p-0"
                title="New Note"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto">
            <div className="space-y-4">
              {notes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No notes yet. Create your first note!
                </p>
              ) : (
                notes.map((note) => (
                  <Card key={note.id} className="overflow-hidden">
                    <CardHeader className="p-3 pb-0">
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                      <p className="text-xs text-gray-500">
                        {new Date(note.created_at).toLocaleDateString()}
                      </p>
                    </CardHeader>
                    <CardContent className="p-3 pt-2">
                      <p className="text-sm line-clamp-3">{note.content}</p>
                    </CardContent>
                    <CardFooter className="p-2 pt-0 flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => editNote(note)}
                        className="h-8 w-8 p-0"
                        title="Edit Note"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        title="Delete Note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseNotes;
