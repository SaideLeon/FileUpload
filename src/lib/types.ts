export interface Project {
  id: string;
  name: string;
}

export type FileType = 'image' | 'video' | 'document' | 'spreadsheet' | 'other';

export interface ProjectFile {
  id: string;
  name: string;
  url: string;
  size: number; // in bytes
  uploadedAt: string; // ISO date string
  type: FileType;
}

export interface ProjectWithDetails extends Project {
  fileCount: number;
  totalSize: number; // in bytes
}
