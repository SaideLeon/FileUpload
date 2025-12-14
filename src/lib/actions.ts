'use server';

import { revalidatePath } from 'next/cache';
import { deleteFile, login, register } from './api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// ===== AUTH ACTIONS =====
const COOKIE_SETTINGS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: '/',
};

export async function loginAction(prevState: any, formData: FormData) {
  const result = await login(formData);

  if (result.success && result.data) {
    cookies().set('session', JSON.stringify(result.data), COOKIE_SETTINGS);
    // No direct redirect, component will handle it
  }
  return result;
}

export async function registerAction(prevState: any, formData: FormData) {
  const result = await register(formData);

  if (result.success && result.data) {
     cookies().set('session', JSON.stringify(result.data), COOKIE_SETTINGS);
     // No direct redirect, component will handle it
  }
  return result;
}

export async function logoutAction() {
    cookies().delete('session');
    redirect('/login');
}


// ===== DELETE ACTION =====
export async function deleteFileAction(prevState: any, formData: FormData) {
  const projectName = formData.get('projectName') as string;
  const fileName = formData.get('fileName') as string;
  const apiKey = formData.get('apiKey') as string;
  
  if (!apiKey) {
    return { error: 'Authentication error: API Key is missing.' };
  }
  if (!projectName || !fileName) {
    return { error: 'Project name and file name are required.' };
  }
  
  const result = await deleteFile(apiKey, projectName, fileName);

  if (result.success) {
    revalidatePath(`/${projectName}`);
    revalidatePath('/projects');
    revalidatePath('/all-files');
  }

  return result;
}
