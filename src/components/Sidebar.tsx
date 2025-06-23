import React, { useState } from 'react';
import {
  PlusCircle,
  Search,
  FileText,
  Trash2,
  Menu,
  Folder,
  FolderOpen,
  FolderPlus,
  Plus,
  MoreVertical,
  Tag,
} from 'lucide-react';
import { Note, Folder as FolderType } from '@/types/Note';

interface SidebarProps {
  notes: Note[];
  folders: FolderType[];
  activeNoteId: string | null;
  selectedFolderId: string | null;
  onNoteSelect: (noteId: string) => void;
  onNewNote: (folderId?: string) => void;
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
  onToggleCollapse,
}: SidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#3b82f6');
  const [showFolderOptions, setShowFolderOptions] = useState<string | null>(null);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);

  const folderColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  ];

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolderId === null || note.folderId === selectedFolderId;
    return matchesSearch && matchesFolder;
  });

  const getFolderNotes = (folderId: string | null) =>
    filteredNotes.filter(note => note.folderId === folderId);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), newFolderColor);
      setNewFolderName('');
      setNewFolderColor('#3b82f6');
      setShowCreateFolder(false);
    }
  };

  const handleRenameFolder = (folderId: string) => {
    if (editFolderName.trim()) {
      onRenameFolder(folderId, editFolderName.trim());
      setEditingFolder(null);
      setEditFolderName('');
    }
  };

  const startEditingFolder = (folderId: string, currentName: string) => {
    setEditingFolder(folderId);
    setEditFolderName(currentName);
    setShowFolderOptions(null);
  };

  const toggleFolder = (folderId: string | null) => {
    setExpandedFolder(prev => (prev === folderId ? null : folderId));
    onSelectFolder(folderId);
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);

  const getFolderColor = (folderId: string | null) => {
    if (!folderId) return '#6b7280';
    const folder = folders.find(f => f.id === folderId);
    return folder?.color || '#6b7280';
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-navy-900 text-white transition-all duration-300 z-10 ${collapsed ? 'w-16' : 'w-80'}`}>
      <div className="p-4 border-b border-navy-700">
        <div className="flex items-center justify-between">
          <button onClick={onToggleCollapse} className="p-2 hover:bg-navy-800 rounded-lg">
            <Menu size={20} />
          </button>
          {!collapsed && (
            <>
              <h1 className="text-xl font-bold">Jot</h1>
              <button onClick={() => onNewNote()} className="p-2 hover:bg-navy-800 rounded-lg">
                <PlusCircle size={20} />
              </button>
            </>
          )}
        </div>
        {!collapsed && (
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-navy-800 border border-navy-700 rounded-lg"
            />
          </div>
        )}
      </div>

      <div className={`flex-1 overflow-y-auto h-[calc(100vh-140px)] ${collapsed ? 'p-2' : 'p-4'}`}>
        {!collapsed && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-slate-400 font-semibold">
                <FolderPlus size={18} />
                <span>Folders</span>
              </div>
              <button onClick={() => setShowCreateFolder(!showCreateFolder)} className="p-1 hover:bg-navy-800 rounded">
                <Plus size={16} />
              </button>
            </div>

            {showCreateFolder && (
              <div className="mb-3 p-3 bg-navy-800 rounded-lg">
                <input
                  type="text"
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                  className="w-full mb-2 px-3 py-2 bg-navy-900 border border-navy-700 rounded"
                />
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {folderColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewFolderColor(color)}
                        className={`w-6 h-6 rounded-full border-2 ${newFolderColor === color ? 'border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <button onClick={handleCreateFolder} className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">
                    Create
                  </button>
                </div>
              </div>
            )}

            {/* All Notes button */}
            <button
              onClick={() => toggleFolder(null)}
              className={`w-full flex items-center justify-between p-2 rounded-lg ${expandedFolder === null ? 'bg-blue-50 text-blue-700' : 'hover:bg-navy-800'}`}
            >
              <div className="flex items-center space-x-2">
                {expandedFolder === null ? <FolderOpen size={18} /> : <Folder size={18} />}
                <span className="font-medium">All Notes</span>
              </div>
              <span className="text-xs text-slate-400">({notes.length})</span>
            </button>

            {/* Folder List */}
            <div className="mt-2 space-y-1">
              {folders.map(folder => (
                <div key={folder.id} className="group relative">
                  <div
                    className="flex items-center justify-between p-2 hover:bg-navy-800 rounded-lg cursor-pointer"
                    onClick={() => toggleFolder(folder.id)}
                  >
                    <div className="flex items-center space-x-2">
                      {expandedFolder === folder.id ? (
                        <FolderOpen className="w-5 h-5" style={{ color: folder.color }} />
                      ) : (
                        <Folder className="w-5 h-5" style={{ color: folder.color }} />
                      )}
                      {editingFolder === folder.id ? (
                        <input
                          type="text"
                          value={editFolderName}
                          onChange={e => setEditFolderName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleRenameFolder(folder.id)}
                          onBlur={() => handleRenameFolder(folder.id)}
                          autoFocus
                          className="bg-navy-900 border border-navy-700 rounded px-2 py-1 text-white text-sm"
                        />
                      ) : (
                        <span className="font-medium truncate">{folder.name}</span>
                      )}
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setShowFolderOptions(showFolderOptions === folder.id ? null : folder.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-navy-700 rounded"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  {showFolderOptions === folder.id && (
                    <div className="absolute right-3 top-full mt-1 bg-navy-800 border border-navy-700 rounded shadow z-20 min-w-[140px]">
                      <button
                        onClick={() => {
                          onNewNote(folder.id);
                          setShowFolderOptions(null);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-navy-700"
                      >
                        Add Note
                      </button>
                      <button
                        onClick={() => startEditingFolder(folder.id, folder.name)}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-navy-700"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => {
                          onDeleteFolder(folder.id);
                          setShowFolderOptions(null);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {expandedFolder === folder.id && (
                    <div className="ml-6 mt-1 space-y-1">
                      {getFolderNotes(folder.id).map(note => (
                        <div
                          key={note.id}
                          onClick={() => onNoteSelect(note.id)}
                          className={`group relative p-3 rounded-lg cursor-pointer transition-colors hover:bg-navy-800 ${
                            activeNoteId === note.id ? 'bg-blue-700 text-white' : 'text-slate-300'
                          }`}
                        >
                          <h3 className="font-medium truncate text-sm">{note.title}</h3>
                          <p className="text-xs line-clamp-2 text-slate-400 mt-1">
                            {note.content.replace(/<[^>]*>/g, '').substring(0, 80)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
