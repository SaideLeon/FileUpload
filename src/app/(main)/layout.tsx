'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { getProjects } from '@/lib/api';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppHeader } from '@/components/app-header';
import { useEffect, useState } from 'react';
import type { ProjectWithDetails } from '@/lib/types';
import { usePathname } from 'next/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const pathname = usePathname();

  // The documentation page doesn't need an AppHeader from the layout, 
  // as it provides its own.
  const shouldShowHeader = !pathname.startsWith('/projects/') && !pathname.startsWith('/documentation');
  
  useEffect(() => {
    async function fetchProjects() {
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    }
    fetchProjects();
  }, []);

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
