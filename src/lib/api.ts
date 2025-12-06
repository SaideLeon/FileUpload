'use server';

import type { Project, ProjectFile, ProjectWithDetails, ProjectsResponse, ListResponse } from '@/lib/types';

const API_URL = process.env.API_BASE_URL;

if (!API_URL) {
  throw new Error('Missing API_BASE_URL environment variable');
}

export async function getProjects(): Promise<ProjectWithDetails[]> {
  const response = await fetch(`${API_URL}/projects`, { next: { revalidate: 0 } });
  if (!response.ok) {
    console.error("Failed to fetch projects:", await response.text());
    return [];
  }
  const data: ProjectsResponse = await response.json();
  
  // The API returns project details directly, so we just need to adapt the name
  return (data.projects || []).map(p => ({
    id: p.name, // Assuming name is unique enough to be an ID
    name: p.name,
    fileCount: p.file_count,
    totalSize: p.total_size,
  }));
}

export async function getProjectByName(name: string): Promise<Project | null> {
    const projects = await getProjects();
    const project = projects.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (!project) return null;
    return {
        id: project.id,
        name: project.name,
    };
}

export async function getFilesByProjectName(projectName: string): Promise<ProjectFile[]> {
    const response = await fetch(`${API_URL}/list?project=${projectName}`, { next: { revalidate: 0 } });
    if (!response.ok) {
        console.error(`Failed to fetch files for ${projectName}:`, await response.text());
        return [];
    }
    const data: ListResponse = await response.json();
    
    const files = (data.Files || []).map(f => ({
        id: f.name, // The backend doesn't provide a unique ID, using name
        name: f.name,
        url: f.url,
        size: f.size,
        uploadedAt: new Date(f.uploaded_at.replace(' ', 'T') + 'Z').toISOString(), // Make it a valid ISO string
        type: getFileType(f.name),
    }));

    // sort by date descending
    return files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

function getFileType(fileName: string): ProjectFile['type'] {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return 'other';

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt'];
    const spreadsheetExtensions = ['xls', 'xlsx', 'csv'];

    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';
    if (documentExtensions.includes(extension)) return 'document';
    if (spreadsheetExtensions.includes(extension)) return 'spreadsheet';

    return 'other';
}
