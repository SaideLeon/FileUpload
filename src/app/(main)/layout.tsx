'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { getProjects } from '@/lib/api';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/app-header';
import { useEffect, useState } from 'react';
import type { ProjectWithDetails } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { user, apiKey, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  // The documentation page doesn't need an AppHeader from the layout, 
  // as it provides its own.
  const shouldShowHeader = pathname === '/projects' || pathname === '/all-files';
  
  useEffect(() => {
    if (!apiKey) return;
    async function fetchProjects() {
      const fetchedProjects = await getProjects(apiKey);
      setProjects(fetchedProjects);
    }
    fetchProjects();
  }, [apiKey]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-svh w-full">
        <div className="p-8 rounded-lg text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Carregando...</h1>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar projects={projects} />
        <main className="flex-1 flex flex-col min-h-svh w-full">
            {shouldShowHeader && <AppHeader allProjects={projects} />}
            {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
