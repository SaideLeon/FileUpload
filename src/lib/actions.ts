'use server';

import { revalidatePath } from 'next/cache';
import type { ProjectFile } from './types';

const API_URL = process.env.API_BASE_URL;

if (!API_URL) {
  throw new Error('Missing API_BASE_URL environment variable');
}


export async function deleteFileAction(formData: FormData) {
  const projectName = formData.get('projectName') as string;
  const fileName = formData.get('fileName') as string;

  if (!projectName || !fileName) {
    return { error: 'Project name and file name are required.' };
  }

  try {
    const response = await fetch(`${API_URL}/delete?project=${projectName}&file=${fileName}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete the file.');
    }
    
    revalidatePath(`/${projectName}`);
    return { success: `File "${fileName}" was deleted successfully.` };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { error: message };
  }
}

export async function uploadFileAction(formData: FormData) {
    const projectName = formData.get('projectName') as string;
    const file = formData.get('file') as File;
    const uploadUrl = `${API_URL}/upload`;

    if (!projectName || !file || file.size === 0) {
        return { error: 'Project name and a valid file are required.' };
    }
    
    try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('project', projectName);

        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: uploadFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed:', errorText);
            let errorMessage = `Upload failed with status: ${response.status}`;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorMessage;
            } catch (e) {
                // ignore
            }
            throw new Error(errorMessage);
        }

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
