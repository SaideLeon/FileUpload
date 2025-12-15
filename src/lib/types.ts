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
  projectName?: string;
}

export interface ProjectWithDetails extends Project {
  fileCount: number;
  totalSize: number; // in bytes
}

// ===== API RESPONSE TYPES =====

export interface ApiProjectInfo {
	name: string;
	file_count: number;
	total_size: number;
}

export interface ProjectsResponse {
	projects: ApiProjectInfo[];
	total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiFileInfo {
	name: string;
	url: string;
	size: number;
	uploaded_at: string; // "2025-12-14T10:09:32.588992Z"
}

export interface ListResponse {
	project: string;
	files: ApiFileInfo[];
	total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface Plan {
  ID: string;
  Name: string;
  Price: number;
  StorageLimit: number;
  CreatedAt: string;
}

export interface User {
  ID: string;
  Name: string;
  WhatsappNumber: string;
  Email: string;
  ForgeAPIKey: string;
  StorageUsage: number;
  PlanID: string;
  Plan: Plan;
  CreatedAt: string;
  Projects: any[]; // Define more strictly if needed
}

export interface AuthResponse {
  message: string;
  user: User;
  forge_api_key: string;
  token?: string; // Token is present on login but not on register
}

export interface ApiError {
  error: string;
}
