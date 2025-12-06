'use server';

import { revalidatePath } from 'next/cache';
import { mockFilesStore } from '@/lib/data';
import type { ProjectFile } from './types';
import {faker} from '@faker-js/faker';

export async function deleteFileAction(formData: FormData) {
  const projectName = formData.get('projectName') as string;
  const fileName = formData.get('fileName') as string;

  if (!projectName || !fileName) {
    return { error: 'Project name and file name are required.' };
  }

  try {
    const projectFiles = mockFilesStore.get(projectName);
    if (projectFiles) {
      const updatedFiles = projectFiles.filter(file => file.name !== fileName);
      mockFilesStore.set(projectName, updatedFiles);
    }
    revalidatePath(`/${projectName}`);
    return { success: `File "${fileName}" was deleted successfully.` };
  } catch (error) {
    return { error: 'Failed to delete the file.' };
  }
}

export async function uploadFileAction(formData: FormData) {
    const projectName = formData.get('projectName') as string;
    const file = formData.get('file') as File;
    const uploadUrl = 'https://uploader.nativespeak.app/upload';

    if (!projectName || !file || file.size === 0) {
        return { error: 'Project name and a valid file are required.' };
    }
    
    try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: uploadFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed:', errorText);
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        const result = await response.json();
        const uploadedFileUrl = result.url;


        const projectFiles = mockFilesStore.get(projectName) || [];
        
        const fileTypeMap: Record<string, ProjectFile['type']> = {
            'image': 'image',
            'video': 'video',
            'pdf': 'document', 'msword': 'document', 'vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
            'csv': 'spreadsheet', 'vnd.ms-excel': 'spreadsheet', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'spreadsheet',
        };

        const primaryType = file.type.split('/')[0];
        const secondaryType = file.type.split('/')[1];

        const newFile: ProjectFile = {
            id: faker.string.uuid(),
            name: file.name,
            url: uploadedFileUrl,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            type: fileTypeMap[primaryType] || fileTypeMap[secondaryType] || 'other',
        };

        mockFilesStore.set(projectName, [newFile, ...projectFiles]);

        revalidatePath(`/${projectName}`);
        return { success: `File "${file.name}" uploaded successfully.` };
    } catch (error) {
        console.error('Upload action error:', error);
        if (error instanceof Error) {
            return { error: `Failed to upload the file: ${error.message}` };
        }
        return { error: 'An unknown error occurred during file upload.' };
    }
}
