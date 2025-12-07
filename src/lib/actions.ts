'use server';

import { revalidatePath } from 'next/cache';
import { deleteFile } from './api';

// ===== DELETE ACTION =====
export async function deleteFileAction(prevState: any, formData: FormData) {
  const projectName = formData.get('projectName') as string;
  const fileName = formData.get('fileName') as string;

  if (!projectName || !fileName) {
    return { error: 'Project name and file name are required.' };
  }
  
  const result = await deleteFile(projectName, fileName);

  if (result.success) {
    revalidatePath(`/${projectName}`);
    revalidatePath('/projects');
    revalidatePath('/all-files');
  }

  return result;
}
