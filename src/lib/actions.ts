'use server';

import { revalidatePath } from 'next/cache';
import { deleteFile, uploadFile as apiUploadFile } from './api';

// ===== UPLOAD ACTION =====
export async function uploadFileAction(prevState: any, formData: FormData) {
  const file = formData.get('file') as File;
  const projectName = formData.get('project') as string;

  if (!file || file.size === 0) {
    return { error: 'Por favor selecione um arquivo para upload.' };
  }
  if (!projectName) {
    return { error: 'Project name is missing.' };
  }
  
  const result = await apiUploadFile(formData);

  if (result.success) {
    revalidatePath(`/${projectName}`);
    revalidatePath('/projects');
    revalidatePath('/all-files');
  }

  return result;
}


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