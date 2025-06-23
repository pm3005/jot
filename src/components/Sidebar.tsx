import { useState } from 'react';
import { Note, Folder } from '@/types/Note';
import { PlusCircle, Search, Menu, Trash2, FileText, FolderOpen, LogOut } from 'lucide-react';
import FolderManager from './FolderManager';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
  notes: Note[];
  folders: Folder[];
  activeNoteId: string | null;
  selectedFolderId: string | null;
  onNoteSelect: (noteId: string) => void;
  onNewNote: () => void;
  onDeleteNote: (noteId: string) => void;
  onCreateFolder: (name: string, color: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onSelectFolder: (folderId: string | null) => void;
  onMoveNoteToFolder: (noteId: string, folderId: string | null) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({
  notes,
  folders,
  activeNoteId,
  selectedFolderId,
  onNoteSelect,
  onNewNote,
  onDeleteNote,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  onSelectFolder,
  onMoveNoteToFolder,
  collapsed,
  onToggleCollapse
}: SidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFolder = selectedFolderId === null || note.folderId === selectedFolderId;
    
    return matchesSearch && matchesFolder;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const getPreview = (content: string, maxLength: number = 100) => {
    const textContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-navy-900 text-white transition-all duration-300 z-10 ${
      collapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-navy-700">
        <div className="flex items-center justify-between">
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-navy-800 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          
          {!collapsed && (
            <>
              <h1 className="text-xl font-bold text-white">Jot</h1>
              <button
                onClick={onNewNote}
                className="p-2 hover:bg-navy-800 rounded-lg transition-colors"
                title="New Note"
              >
                <PlusCircle size={20} />
              </button>
            </>
          )}
          
          {collapsed && (
            <button
              onClick={onNewNote}
              className="p-2 hover:bg-navy-800 rounded-lg transition-colors"
              title="New Note"
            >
              <PlusCircle size={20} />
            </button>
          )}
        </div>
        
        {!collapsed && (
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto h-[calc(100vh-140px)]">
        {collapsed ? (
          <div className="p-2">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => onNoteSelect(note.id)}
                className={`w-full p-3 mb-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                  activeNoteId === note.id
                    ? 'bg-slate-200 text-navy-900'
                    : 'hover:bg-navy-800 text-slate-300'
                }`}
                title={note.title}
              >
                <FileText size={20} />
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4">
            {/* Folder Manager */}
            <FolderManager
              folders={folders}
              onCreateFolder={onCreateFolder}
              onDeleteFolder={onDeleteFolder}
              onRenameFolder={onRenameFolder}
              selectedFolderId={selectedFolderId}
              onSelectFolder={onSelectFolder}
            />

            {/* Notes List */}
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto mb-4 text-slate-500" size={48} />
                <p className="text-slate-400">No notes found</p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`note-card mb-3 p-4 rounded-lg cursor-pointer transition-all duration-200 group ${
                    activeNoteId === note.id
                      ? 'bg-slate-200 text-navy-900'
                      : 'bg-navy-800 hover:bg-navy-700 text-white'
                  }`}
                  onClick={() => onNoteSelect(note.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold truncate flex-1 mr-2">
                      {note.title}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all hover:bg-navy-600"
                          title="Note options"
                        >
                          <FileText size={14} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white">
                        <DropdownMenuItem onClick={() => onMoveNoteToFolder(note.id, null)} className="hover:bg-slate-100">
                          <FolderOpen size={14} className="mr-2" />
                          Remove from folder
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {folders.map((folder) => (
                          <DropdownMenuItem
                            key={folder.id}
                            onClick={() => onMoveNoteToFolder(note.id, folder.id)}
                            className="hover:bg-slate-100"
                          >
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: folder.color }}
                            />
                            Move to {folder.name}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDeleteNote(note.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete note
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <p className={`text-sm mb-2 line-clamp-2 ${
                    activeNoteId === note.id ? 'text-navy-700' : 'text-slate-400'
                  }`}>
                    {getPreview(note.content)}
                  </p>
                  
                  <div className={`text-xs ${
                    activeNoteId === note.id ? 'text-navy-600' : 'text-slate-500'
                  }`}>
                    {formatDate(note.updatedAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer - Sign Out Button */}
      <div className="p-4 border-t border-navy-700">
        {collapsed ? (
          <button
            onClick={handleSignOut}
            className="w-full p-2 hover:bg-navy-800 rounded-lg transition-colors flex items-center justify-center"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        ) : (
          <button
            onClick={handleSignOut}
            className="w-full p-3 hover:bg-navy-800 rounded-lg transition-colors flex items-center space-x-2 text-slate-300 hover:text-white"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
