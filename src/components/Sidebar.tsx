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
  X,
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
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([null]));

  const folderColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  ];

  // Filter notes by search and folder
  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFolder =
      selectedFolderId === null ? true : note.folderId === selectedFolderId;

    return matchesSearch && matchesFolder;
  });

  // Get notes inside a specific folder (with search filter)
  const getFolderNotes = (folderId: string | null) => {
    return filteredNotes.filter(note => note.folderId === folderId);
  };

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

const toggleFolderExpansion = (folderId: string | null) => {
  if (folderId === null) {
    const newExpanded = new Set(expandedFolders);
    newExpanded.has(null) ? newExpanded.delete(null) : newExpanded.add(null);
    setExpandedFolders(newExpanded);
  } else {
    setExpandedFolders(new Set([folderId]));
  }
};


  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);

  const getFolderColor = (folderId: string | null) => {
    if (folderId === null) return '#6b7280';
    const folder = folders.find(f => f.id === folderId);
    return folder?.color || '#6b7280';
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-navy-900 text-white transition-all duration-300 z-10 ${
        collapsed ? 'w-16' : 'w-80'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-navy-700">
        <div className="flex items-center justify-between">
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-navy-800 rounded-lg transition-colors"
            title="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          {!collapsed && (
            <>
              <h1 className="text-xl font-bold text-white">Jot</h1>
              <button
                onClick={() => onNewNote()}
                className="p-2 hover:bg-navy-800 rounded-lg transition-colors"
                title="New Note"
              >
                <PlusCircle size={20} />
              </button>
            </>
          )}

          {collapsed && (
            <button
              onClick={() => onNewNote()}
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
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-navy-800 border border-navy-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto h-[calc(100vh-140px)] ${collapsed ? 'p-2' : 'p-4'}`}>
        {collapsed ? (
          // Collapsed notes buttons
          filteredNotes.map(note => (
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
          ))
        ) : (
          // Expanded sidebar content
          <>
            {/* Folders & Folder Controls */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-slate-400 font-semibold">
                  <FolderPlus size={18} />
                  <span>Folders</span>
                </div>
                <button
                  onClick={() => setShowCreateFolder(!showCreateFolder)}
                  className="p-1 hover:bg-navy-800 rounded transition-colors"
                  title="Create Folder"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Create Folder Form */}
              {showCreateFolder && (
                <div className="p-3 mt-2 rounded-lg bg-navy-800 border border-navy-700 space-y-2">
                  <input
                    type="text"
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md text-sm bg-navy-900 border border-navy-600 placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateFolder();
                    }}
                  />
              
                  <div className="flex items-center justify-between">
                    {/* Color picker */}
                    <div className="flex space-x-2">
                      {folderColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewFolderColor(color)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform duration-150 ${
                            newFolderColor === color
                              ? 'border-white scale-110'
                              : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Select ${color} color`}
                        />
                      ))}
                    </div>
              
                    {/* Create button */}
                    <button
                      onClick={handleCreateFolder}
                      className="px-2 py-1 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}


              {/* All Notes button */}
              <button
                onClick={() => {
                  onSelectFolder(null);
                  toggleFolderExpansion(null);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                  selectedFolderId === null ? 'bg-blue-50 text-blue-700' : 'hover:bg-navy-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {expandedFolders.has(null) ? (
                    <FolderOpen className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Folder className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="font-medium">All Notes</span>
                </div>
                <span className="text-xs text-slate-400">({notes.length})</span>
              </button>

              {/* Folder List */}
              <div className="mt-2 space-y-1">
                {folders.map(folder => (
                  <div key={folder.id} className="group relative">
                    <div className="flex items-center justify-between p-2 hover:bg-navy-800 rounded-lg cursor-pointer">
                      <button
                        onClick={() => {
                          onSelectFolder(folder.id);
                          toggleFolderExpansion(folder.id);
                        }}
                        className={`flex items-center justify-between flex-1 ${
                          selectedFolderId === folder.id ? 'text-blue-400' : 'text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {expandedFolders.has(folder.id) ? (
                            <FolderOpen
                              className="w-5 h-5"
                              style={{ color: folder.color }}
                            />
                          ) : (
                            <Folder
                              className="w-5 h-5"
                              style={{ color: folder.color }}
                            />
                          )}

                          {editingFolder === folder.id ? (
                            <input
                              type="text"
                              value={editFolderName}
                              onChange={e => setEditFolderName(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleRenameFolder(folder.id)}
                              onBlur={() => handleRenameFolder(folder.id)}
                              autoFocus
                              className="bg-navy-900 border border-navy-700 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                            />
                          ) : (
                            <span className="font-medium truncate">{folder.name}</span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{`(${folder.noteCount ?? 0})`}</span>
                      </button>

                      {/* Folder Options */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setShowFolderOptions(showFolderOptions === folder.id ? null : folder.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-navy-700 rounded transition"
                        title="Folder options"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>

                    {showFolderOptions === folder.id && (
                      <div className="absolute right-3 top-full mt-1 bg-navy-800 border border-navy-700 rounded shadow z-20 min-w-[140px]">
                        <button
                          onClick={() => {
                            onNewNote(folder.id);
                            setShowFolderOptions(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-navy-700 rounded-t"
                        >
                          Add Note
                        </button>
                        <button
                          onClick={() => startEditingFolder(folder.id, folder.name)}
                          className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-navy-700"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => {
                            onDeleteFolder(folder.id);
                            setShowFolderOptions(null);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-700 rounded-b"
                        >
                          Delete
                        </button>
                      </div>
                    )}

                    {/* Notes inside expanded folder */}
                    {expandedFolders.has(folder.id) && selectedFolderId === folder.id && (
                      <div className="ml-6 mt-1 space-y-1">
                        {getFolderNotes(folder.id).map(note => (
                          <div
                            key={note.id}
                            onClick={() => onNoteSelect(note.id)}
                            className={`group relative p-3 rounded-lg cursor-pointer transition-colors hover:bg-navy-800 ${
                              activeNoteId === note.id ? 'bg-blue-700 text-white' : 'text-slate-300'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate text-sm">{note.title}</h3>
                                <p className="text-xs line-clamp-2 text-slate-400 mt-1">
                                  {note.content.replace(/<[^>]*>/g, '').substring(0, 80)}...
                                </p>
                                <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                                  <span>{formatDate(note.updatedAt)}</span>
                                  {note.tags.length > 0 && (
                                    <>
                                      <span>•</span>
                                      <div className="flex items-center space-x-1">
                                        <Tag className="w-3 h-3" />
                                        <span>{note.tags.length}</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <select
                                  value={note.folderId}
                                  onChange={e => {
                                    e.stopPropagation();
                                    onMoveNoteToFolder(note.id, e.target.value);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 text-xs border border-navy-700 rounded px-2 py-1 bg-navy-900 text-white transition-opacity"
                                  onClick={e => e.stopPropagation()}
                                >
                                  {folders.map(f => (
                                    <option key={f.id} value={f.id}>
                                      {f.name}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    onDeleteNote(note.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-700 hover:text-red-400 rounded transition"
                                  title="Delete Note"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes List for "All" folder (null selectedFolderId) */}
            {selectedFolderId === null && expandedFolders.has(null) && (
              <div>
                {filteredNotes.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <FileText className="mx-auto mb-4" size={48} />
                    No notes found
                  </div>
                ) : (
                  filteredNotes.map(note => (
                    <div
                      key={note.id}
                      onClick={() => onNoteSelect(note.id)}
                      className={`group relative p-4 rounded-lg cursor-pointer transition-colors hover:bg-navy-800 ${
                        activeNoteId === note.id ? 'bg-blue-700 text-white' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: getFolderColor(note.folderId) }}
                            />
                            <h3 className="font-medium truncate">{note.title}</h3>
                            <span className="text-xs text-slate-400">
                              ({folders.find(f => f.id === note.folderId)?.name ?? 'No Folder'})
                            </span>
                          </div>
                          <p className="text-sm line-clamp-2 text-slate-400 mb-2">
                            {note.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-slate-400">
                            <span>{formatDate(note.updatedAt)}</span>
                            {note.tags.length > 0 && (
                              <>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <Tag className="w-3 h-3" />
                                  <span>{note.tags.length} tags</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <select
                            value={note.folderId}
                            onChange={e => {
                              e.stopPropagation();
                              onMoveNoteToFolder(note.id, e.target.value);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-xs border border-navy-700 rounded px-2 py-1 bg-navy-900 text-white transition-opacity"
                            onClick={e => e.stopPropagation()}
                          >
                            {folders.map(f => (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onDeleteNote(note.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-700 hover:text-red-400 rounded transition"
                            title="Delete Note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
