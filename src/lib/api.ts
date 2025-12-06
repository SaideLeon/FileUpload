'use server';

import type { Project, ProjectFile, ProjectWithDetails } from '@/lib/types';
import { mockFilesStore, mockProjectsStore } from '@/lib/data';

// Simulate network latency
const DUMMY_LATENCY = 100;

export async function getProjects(): Promise<ProjectWithDetails[]> {
  await new Promise(resolve => setTimeout(resolve, DUMMY_LATENCY));
  const projects = mockProjectsStore;
  const files = mockFilesStore;
  
  return projects.map(p => {
    const projectFiles = files.get(p.name) || [];
    return {
      ...p,
      fileCount: projectFiles.length,
      totalSize: projectFiles.reduce((sum, file) => sum + file.size, 0),
    };
  });
}

export async function getProjectByName(name: string): Promise<Project | null> {
    await new Promise(resolve => setTimeout(resolve, DUMMY_LATENCY));
    const project = mockProjectsStore.find(p => p.name === name);
    return project || null;
}

export async function getFilesByProjectName(projectName: string): Promise<ProjectFile[]> {
    await new Promise(resolve => setTimeout(resolve, DUMMY_LATENCY));
    const files = mockFilesStore.get(projectName) || [];
    // sort by date descending
    return files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}
