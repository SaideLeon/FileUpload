'use server';

import type { Project, ProjectFile, ProjectWithDetails, ProjectsResponse, ListResponse, AuthResponse, ApiError } from '@/lib/types';
import { getSession } from './session';

const API_URL = process.env.API_BASE_URL || 'https://uploader.nativespeak.app';

if (!API_URL) {
  throw new Error('Missing API_BASE_URL environment variable');
}

type SuccessResult<T> = { success: true; data: T; error?: never };
type ErrorResult = { success: false; data?: never; error: string };
type ApiResult<T> = SuccessResult<T> | ErrorResult;

// ===== Auth Functions =====

async function handleAuthResponse(response: Response): Promise<ApiResult<AuthResponse>> {
    if (!response.ok) {
        const errorText = await response.text().catch(() => `Request failed with status: ${response.status}`);
        const finalError = errorText.replace(/"/g, ''); // Clean up error string
        return { success: false, error: finalError };
    }
    const data: AuthResponse = await response.json();
    return { success: true, data };
}

export async function login(formData: FormData): Promise<ApiResult<AuthResponse>> {
    const email = formData.get('email');
    const password = formData.get('password');
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return handleAuthResponse(response);
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
}

export async function register(formData: FormData): Promise<ApiResult<AuthResponse>> {
    const email = formData.get('email');
    const password = formData.get('password');
     try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return handleAuthResponse(response);
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
    }
}

export async function rotateApiKey(apiKey: string): Promise<{ success: string; error?: never; data?: { new_api_key: string }} | { error: string; success?: never; data?: never }> {
  try {
    const response = await fetch(`${API_URL}/api/user/rotate-api-key`, {
      method: 'POST',
      headers: { 'Authorization': apiKey },
    });
     if (!response.ok) {
      const errorJson = await response.json().catch(() => ({ error: `Request failed with status: ${response.status}` }));
      throw new Error(errorJson.error);
    }
    const data = await response.json();
    return { success: 'API Key rotated successfully.', data };
  } catch (error) {
     const message = error instanceof Error ? error.message : 'Unknown error.';
     return { error: message };
  }
}

// ===== Data Fetching Functions =====

export async function getProjects(apiKey: string): Promise<ProjectWithDetails[]> {
  try {
    const response = await fetch(`${API_URL}/api/projects`, { 
        headers: { 'Authorization': apiKey },
        next: { revalidate: 0 } 
    });
    if (!response.ok) {
      console.error("Failed to fetch projects:", await response.text());
      return [];
    }
    const data: ProjectsResponse = await response.json();
    
    return (data.projects || []).map(p => ({
      id: p.name, 
      name: p.name,
      fileCount: p.file_count,
      totalSize: p.total_size,
    }));
  } catch (error) {
    console.error("Error in getProjects:", error);
    return [];
  }
}

export async function getProjectByName(apiKey: string, name: string): Promise<Project | null> {
    const projects = await getProjects(apiKey);
    const project = projects.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (!project) return null;
    return {
        id: project.id,
        name: project.name,
    };
}

export async function getFilesByProjectName(apiKey: string, projectName: string): Promise<ProjectFile[]> {
  try {
    const response = await fetch(`${API_URL}/api/list?project=${encodeURIComponent(projectName)}`, { 
        headers: { 'Authorization': apiKey },
        next: { revalidate: 0 } 
    });
    if (!response.ok) {
        console.error(`Failed to fetch files for ${projectName}:`, await response.text());
        return [];
    }
    const data: ListResponse = await response.json();
    
    const files = (data.files || []).map(f => ({
        id: f.name, 
        name: f.name,
        url: f.url,
        size: f.size,
        uploadedAt: new Date(f.uploaded_at).toISOString(),
        type: getFileType(f.name),
    }));

    return files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  } catch(error) {
    console.error(`Error fetching files for ${projectName}:`, error);
    return [];
  }
}

export async function deleteFile(apiKey: string, projectName: string, fileName: string): Promise<{ success: string; error?: never; } | { error: string; success?: never; }> {
    try {
        const response = await fetch(`${API_URL}/api/delete?project=${encodeURIComponent(projectName)}&file=${encodeURIComponent(fileName)}`, {
            method: 'DELETE',
            headers: { 'Authorization': apiKey }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to delete file' }));
            throw new Error(errorData.error || 'Failed to delete the file.');
        }
        
        return { success: `File "${fileName}" was deleted successfully.` };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { error: message };
    }
}


function getFileType(fileName: string): ProjectFile['type'] {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return 'other';

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'md'];
    const spreadsheetExtensions = ['xls', 'xlsx', 'csv'];

    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';
    if (documentExtensions.includes(extension)) return 'document';
    if (spreadsheetExtensions.includes(extension)) return 'spreadsheet';

    return 'other';
}
