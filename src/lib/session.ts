'use server';

import { cookies } from 'next/headers';
import type { AuthResponse } from './types';

export async function getSession(): Promise<AuthResponse | null> {
    const sessionCookie = cookies().get('session');
    if (!sessionCookie) {
        return null;
    }
    try {
        return JSON.parse(sessionCookie.value) as AuthResponse;
    } catch (error) {
        console.error('Failed to parse session cookie:', error);
        return null;
    }
}
