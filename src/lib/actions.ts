'use server';

import { revalidatePath } from 'next/cache';

const API_URL = process.env.API_BASE_URL;

if (!API_URL) {
  throw new Error('Missing API_BASE_URL environment variable');
}

// ===== UPLOAD ACTION =====
export async function uploadFileAction(prevState: any, formData: FormData) {
  const file = formData.get('file') as File;
  const projectName = formData.get('projectName') as string;

  if (!file || file.size === 0) {
    return { error: 'Arquivo é obrigatório.' };
  }
  if (!projectName) {
    return { error: 'Nome do projeto é obrigatório.' };
  }

  try {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('project', projectName);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    revalidatePath(`/${projectName}`);
    revalidatePath('/');
    
    return { 
      success: `Arquivo "${file.name}" enviado com sucesso!`,
      url: result.url,
      fileName: result.file
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido ao fazer upload.';
    console.error('Upload error:', error);
    return { error: message };
  }
}


// ===== DELETE ACTION =====
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
