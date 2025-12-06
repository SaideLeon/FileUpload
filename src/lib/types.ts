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

// Types for Go API responses
export interface ApiProjectInfo {
	name: string;
	file_count: number;
	total_size: number;
}

export interface ProjectsResponse {
	Projects: ApiProjectInfo[];
	Total: number;
}

export interface ApiFileInfo {
	name: string;
	url: string;
	size: number;
	uploaded_at: string; // "2006-01-02 15:04:05"
}

export interface ListResponse {
	Project: string;
	Files: ApiFileInfo[];
	Total: number;
}
