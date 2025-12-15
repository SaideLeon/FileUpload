'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthResponse } from '@/lib/types';
import { getSession } from '@/lib/session';

interface AuthContextType {
  user: User | null;
  apiKey: string | null;
  isLoading: boolean;
  setApiKey: (key: string | null) => void; // Added setApiKey
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  apiKey: null,
  isLoading: true,
  setApiKey: () => {}, // Default empty function
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      setIsLoading(true);
      try {
        const session = await getSession();
        if (session) {
          setUser(session.user);
          setApiKey(session.forge_api_key);
        } else {
          setUser(null);
          setApiKey(null);
        }
      } catch (error) {
        console.error('Failed to load session:', error);
        setUser(null);
        setApiKey(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, apiKey, isLoading, setApiKey }}> {/* Passed setApiKey */}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}