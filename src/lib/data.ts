import type { Project, ProjectFile } from '@/lib/types';
import {faker} from '@faker-js/faker';

// In a real app, this would be a database.
// We're using a Map to simulate a mutable data store.

const projects: Project[] = [
    { id: '1', name: 'Website-Redesign' },
    { id: '2', name: 'Mobile-App-V2' },
    { id: '3', name: 'Marketing-Campaign-Q3' },
];

const fileTypes: { type: ProjectFile['type']; ext: string[] }[] = [
    { type: 'image', ext: ['.jpg', '.png', '.gif'] },
    { type: 'video', ext: ['.mp4', '.mov'] },
    { type: 'document', ext: ['.pdf', '.docx'] },
    { type: 'spreadsheet', ext: ['.xlsx', '.csv'] },
];

const generateRandomFile = (projectId: string): ProjectFile => {
    const fileTypeData = faker.helpers.arrayElement(fileTypes);
    const extension = faker.helpers.arrayElement(fileTypeData.ext);
    const name = `${faker.lorem.slug()}${extension}`;
    return {
        id: faker.string.uuid(),
        name: name,
        url: `/uploads/${projectId}/${name}`,
        size: faker.number.int({ min: 10 * 1024, max: 200 * 1024 * 1024 }), // 10KB to 200MB
        uploadedAt: faker.date.recent({ days: 90 }).toISOString(),
        type: fileTypeData.type,
    };
};

const files = new Map<string, ProjectFile[]>();
projects.forEach(project => {
    files.set(project.name, Array.from({ length: faker.number.int({min: 5, max: 25}) }, () => generateRandomFile(project.id)));
});

// We export mutable stores and functions to manipulate them to simulate an API
export const mockProjectsStore = projects;
export const mockFilesStore = files;
