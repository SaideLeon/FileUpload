'use server';

import { revalidatePath } from 'next/cache';

const API_URL = process.env.API_BASE_URL;

if (!API_URL) {
  throw new Error('Missing API_BASE_URL environment variable');
}

export async function deleteFileAction(prevState: any, formData: FormData) {
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
    revalidatePath('/');
    return { success: `File "${fileName}" was deleted successfully.` };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { error: message };
  }
}
