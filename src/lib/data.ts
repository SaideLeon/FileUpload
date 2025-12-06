import type { Project, ProjectFile } from '@/lib/types';
// This file is no longer used for data generation, but is kept to prevent breaking imports.
// The data is now fetched from the live API.

// In a real app, this would be a database.
// We're using a Map to simulate a mutable data store.

const projects: Project[] = [];

const files = new Map<string, ProjectFile[]>();


// We export mutable stores and functions to manipulate them to simulate an API
export const mockProjectsStore = projects;
export const mockFilesStore = files;
