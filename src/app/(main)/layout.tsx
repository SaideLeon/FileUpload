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

  // Redirect to login if not authenticated and not on a public page
  useEffect(() => {
    if (!isLoading && !user) {
      // Allow access to documentation without being logged in
      if (pathname !== '/documentation') {
         router.push('/login');
      }
    }
  }, [isLoading, user, pathname, router]);

  // The documentation page doesn't need an AppHeader from the layout, 
  // as it provides its own.
  const shouldShowHeader = !pathname.startsWith('/projects/') && !pathname.startsWith('/documentation');
  
  useEffect(() => {
    if (!apiKey) return;
    async function fetchProjects() {
      const fetchedProjects = await getProjects(apiKey);
      setProjects(fetchedProjects);
    }
    fetchProjects();
  }, [apiKey]);
  
  // Don't render layout for documentation if user is not logged in.
  // The documentation page has its own simplified header.
  if (!user && pathname === '/documentation') {
    return (
       <div className="min-h-svh flex flex-col w-full">
         {children}
      </div>
    )
  }

  if (isLoading) {
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
        <AppSidebar projects={projects} />
        <div className="md:pe-2 min-h-svh flex flex-col w-full">
            {shouldShowHeader && <AppHeader allProjects={projects} />}
            {children}
        </div>
    </SidebarProvider>
  );
}
