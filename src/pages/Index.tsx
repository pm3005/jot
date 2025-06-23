import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/hooks/useNotes';
import { convertDatabaseNoteToNote, convertDatabaseFolderToFolder } from '@/types/Note';
import Sidebar from '@/components/Sidebar';
import NoteEditor from '@/components/NoteEditor';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { 
    notes: dbNotes, 
    folders: dbFolders, 
    loading: dataLoading,
    createNote,
    updateNote,
    deleteNote,
    createFolder,
    updateFolder,
    deleteFolder,
  } = useNotes();

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Convert database format to app format
  const notes = dbNotes.map(convertDatabaseNoteToNote);
  const folders = dbFolders.map(convertDatabaseFolderToFolder);

  const activeNote = notes.find(note => note.id === activeNoteId);

  const handleNewNote = async () => {
    const newNote = await createNote('Untitled Note', selectedFolderId || undefined);
    if (newNote) {
      setActiveNoteId(newNote.id);
    }
  };

  const handleUpdateNote = async (noteId: string, updates: any) => {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.folderId !== undefined) dbUpdates.folder_id = updates.folderId;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

    await updateNote(noteId, dbUpdates);
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
    if (activeNoteId === noteId) {
      const remainingNotes = notes.filter(note => note.id !== noteId);
      setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
    }
  };

  const handleCreateFolder = async (name: string, color: string) => {
    await createFolder(name, color);
  };

  const handleDeleteFolder = async (folderId: string) => {
    await deleteFolder(folderId);
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
  };

  const handleRenameFolder = async (folderId: string, newName: string) => {
    await updateFolder(folderId, { name: newName });
  };

  const handleMoveNoteToFolder = async (noteId: string, folderId: string | null) => {
    await updateNote(noteId, { folder_id: folderId });
  };

  // Show loading screen while checking authentication
  if (authLoading || dataLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  // Don't render main content if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar
        notes={notes}
        folders={folders}
        activeNoteId={activeNoteId}
        selectedFolderId={selectedFolderId}
        onNoteSelect={setActiveNoteId}
        onNewNote={handleNewNote}
        onDeleteNote={handleDeleteNote}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        onRenameFolder={handleRenameFolder}
        onSelectFolder={setSelectedFolderId}
        onMoveNoteToFolder={handleMoveNoteToFolder}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'} relative`}>
        {activeNote ? (
          <NoteEditor
            note={activeNote}
            onUpdateNote={handleUpdateNote}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-slate-600 mb-4">
                No note selected
              </h2>
              <p className="text-slate-500 mb-6">
                Create a new note or select an existing one to start writing
              </p>
              <button
                onClick={handleNewNote}
                className="px-6 py-3 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-700 transition-colors"
              >
                Create New Note
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
