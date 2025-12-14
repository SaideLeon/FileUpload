'use client'

import { FilesTable } from '@/components/files-table';
import { getFilesByProjectName, getProjectByName } from '@/lib/api';
import type { Project, ProjectFile } from '@/lib/types';
import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { getProjects } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilesGrid } from '@/components/files-grid';
import { LayoutGrid, List } from 'lucide-react';

export default function ProjectPage() {
  const params = useParams();
  const { apiKey, isLoading: isAuthLoading } = useAuth();
  const projectName = params.projectName as string;
  const [project, setProject] = useState<Project | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectName || !apiKey) return;
    async function fetchData() {
      setLoading(true);
      try {
        const [projectData, filesData, allProjectsData] = await Promise.all([
          getProjectByName(apiKey, projectName),
          getFilesByProjectName(apiKey, projectName),
          getProjects(apiKey),
        ]);
        setProject(projectData);
        setFiles(filesData);
        setAllProjects(allProjectsData);
      } catch (error) {
        console.error("Failed to fetch project data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [projectName, apiKey]);

  const isLoading = loading || isAuthLoading;

  if (isLoading) {
    return (
      <>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
            <div className="flex-1">
                <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-10 w-28" />
        </header>
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
          <Skeleton className="h-96 w-full" />
        </main>
      </>
    )
  }
  
  if (!project) {
    return (
       <main className="flex-1 flex items-center justify-center p-4">
            <div className="p-8 rounded-lg border bg-card text-card-foreground shadow-sm text-center max-w-md">
                <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
                <p className="text-muted-foreground mb-6">
                    The project you are looking for does not exist or you do not have permission to view it.
                </p>
            </div>
        </main>
    )
  }

  return (
    <>
      <AppHeader currentProject={project} allProjects={allProjects} />
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        <Tabs defaultValue="grid">
          <div className="flex justify-end mb-4">
            <TabsList>
              <TabsTrigger value="grid"><LayoutGrid className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="table"><List className="w-4 h-4" /></TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="grid">
            <FilesGrid files={files} projectName={project.name} />
          </TabsContent>
          <TabsContent value="table">
            <FilesTable files={files} projectName={project.name} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
