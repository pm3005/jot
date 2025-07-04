export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

// Utility functions to convert between database and app formats
export const convertDatabaseNoteToNote = (dbNote: any): Note => ({
  id: dbNote.id,
  title: dbNote.title || '',
  content: dbNote.content || '',
  createdAt: new Date(dbNote.created_at),
  updatedAt: new Date(dbNote.updated_at),
  tags: dbNote.tags || [],
  folderId: dbNote.folder_id || undefined,
});

export const convertDatabaseFolderToFolder = (dbFolder: any): Folder => ({
  id: dbFolder.id,
  name: dbFolder.name,
  color: dbFolder.color,
  createdAt: new Date(dbFolder.created_at),
});