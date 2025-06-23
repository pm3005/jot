
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DatabaseNote {
  id: string;
  title: string;
  content: string;
  folder_id: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseFolder {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<DatabaseNote[]>([]);
  const [folders, setFolders] = useState<DatabaseFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching notes",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchFolders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setFolders(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching folders",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createNote = async (title: string = 'Untitled Note', folderId?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          title,
          content: '',
          folder_id: folderId || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchNotes();
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating note",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateNote = async (id: string, updates: Partial<Pick<DatabaseNote, 'title' | 'content' | 'folder_id' | 'tags'>>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchNotes();
    } catch (error: any) {
      toast({
        title: "Error updating note",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchNotes();
    } catch (error: any) {
      toast({
        title: "Error deleting note",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createFolder = async (name: string, color: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('folders')
        .insert({
          name,
          color,
          user_id: user.id,
        });

      if (error) throw error;
      await fetchFolders();
    } catch (error: any) {
      toast({
        title: "Error creating folder",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateFolder = async (id: string, updates: Partial<Pick<DatabaseFolder, 'name' | 'color'>>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('folders')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchFolders();
    } catch (error: any) {
      toast({
        title: "Error updating folder",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteFolder = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchFolders();
      await fetchNotes(); // Refresh notes as folder references will be cleared
    } catch (error: any) {
      toast({
        title: "Error deleting folder",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([fetchNotes(), fetchFolders()]).finally(() => {
        setLoading(false);
      });
    } else {
      setNotes([]);
      setFolders([]);
      setLoading(false);
    }
  }, [user]);

  return {
    notes,
    folders,
    loading,
    createNote,
    updateNote,
    deleteNote,
    createFolder,
    updateFolder,
    deleteFolder,
    refreshData: () => Promise.all([fetchNotes(), fetchFolders()]),
  };
};
