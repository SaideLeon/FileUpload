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

export async function updateApiKeyInSession(newApiKey: string): Promise<boolean> {
    const sessionCookie = cookies().get('session');
    if (!sessionCookie) {
        // No session exists, cannot update API key
        return false;
    }

    try {
        const session = JSON.parse(sessionCookie.value) as AuthResponse;
        session.forge_api_key = newApiKey; // Update the API key

        // Set the updated session back to the cookie
        cookies().set('session', JSON.stringify(session), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        return true;
    } catch (error) {
        console.error('Failed to update API key in session cookie:', error);
        return false;
    }
}