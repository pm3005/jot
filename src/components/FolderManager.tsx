
import { useState } from 'react';
import { Plus, Folder as FolderIcon, Edit2, Trash2, X, Check } from 'lucide-react';
import { Folder } from '@/types/Note';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FolderManagerProps {
  folders: Folder[];
  onCreateFolder: (name: string, color: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

const FOLDER_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Indigo', value: '#6366F1' },
];

const FolderManager = ({
  folders,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  selectedFolderId,
  onSelectFolder
}: FolderManagerProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0].value);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), selectedColor);
      setNewFolderName('');
      setSelectedColor(FOLDER_COLORS[0].value);
      setIsCreating(false);
    }
  };

  const handleStartEdit = (folder: Folder) => {
    setEditingId(folder.id);
    setEditingName(folder.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      onRenameFolder(editingId, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-300">Folders</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 hover:bg-navy-800 rounded transition-colors"
          title="New Folder"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* All Notes option */}
      <div
        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors mb-2 ${
          selectedFolderId === null
            ? 'bg-gold-500 text-navy-900'
            : 'hover:bg-navy-800 text-slate-300'
        }`}
        onClick={() => onSelectFolder(null)}
      >
        <FolderIcon size={16} />
        <span className="text-sm">All Notes</span>
      </div>

      {/* Create new folder form */}
      {isCreating && (
        <div className="mb-3 p-3 bg-navy-800 rounded-lg">
          <input
            type="text"
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="w-full mb-3 px-3 py-2 bg-navy-700 border border-navy-600 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
            autoFocus
          />
          
          <div className="mb-3">
            <p className="text-xs text-slate-400 mb-2">Choose color:</p>
            <div className="flex space-x-2">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === color.value ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleCreateFolder}
              className="flex-1 px-3 py-2 bg-gold-500 text-navy-900 rounded hover:bg-gold-400 transition-colors text-sm"
            >
              Create
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewFolderName('');
                setSelectedColor(FOLDER_COLORS[0].value);
              }}
              className="flex-1 px-3 py-2 bg-navy-700 text-slate-300 rounded hover:bg-navy-600 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Folders list */}
      {folders.map((folder) => (
        <div
          key={folder.id}
          className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors mb-1 ${
            selectedFolderId === folder.id
              ? 'bg-gold-500 text-navy-900'
              : 'hover:bg-navy-800 text-slate-300'
          }`}
          onClick={() => editingId !== folder.id && onSelectFolder(folder.id)}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: folder.color }}
            />
            {editingId === folder.id ? (
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1 px-2 py-1 bg-navy-700 border border-navy-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
              />
            ) : (
              <span className="text-sm truncate">{folder.name}</span>
            )}
          </div>

          {editingId === folder.id ? (
            <div className="flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveEdit();
                }}
                className="p-1 hover:bg-navy-700 rounded"
              >
                <Check size={12} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelEdit();
                }}
                className="p-1 hover:bg-navy-700 rounded"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-navy-700 rounded transition-all"
                >
                  <Edit2 size={12} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => handleStartEdit(folder)}>
                  <Edit2 size={12} className="mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDeleteFolder(folder.id)}
                  className="text-red-600"
                >
                  <Trash2 size={12} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}
    </div>
  );
};

export default FolderManager;
