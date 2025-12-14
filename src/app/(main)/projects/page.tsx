'use client'

import { getProjects, getFilesByProjectName } from '@/lib/api';
import { ProjectGrid } from '@/components/project-grid';
import { FolderGit2 } from 'lucide-react';
import type { ProjectFile, ProjectWithDetails } from '@/lib/types';
import { AppHeader } from '@/components/app-header';
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


export default function ProjectsPage() {
  const { apiKey, isLoading: isAuthLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [filesPerProject, setFilesPerProject] = useState<Record<string, ProjectFile[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiKey) return;

    async function fetchData() {
      setLoading(true);
      const projectData = await getProjects(apiKey);
      setProjects(projectData);

      if (projectData.length > 0) {
        const filesPerProjectPromises = projectData.map(p => 
            getFilesByProjectName(apiKey, p.name).then(files => ({ [p.name]: files }))
        );
        const filesPerProjectArray = await Promise.all(filesPerProjectPromises);
        const filesPerProjectMap = filesPerProjectArray.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setFilesPerProject(filesPerProjectMap);
      }
      setLoading(false);
    }
    fetchData();
  }, [apiKey]);

  const isLoading = isAuthLoading || loading;

  if (isLoading) {
    return (
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (!projects || projects.length === 0) {
    return (
        <>
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="p-8 rounded-lg border bg-card text-card-foreground shadow-sm text-center max-w-md">
                    <FolderGit2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h1 className="text-2xl font-bold mb-2">No Projects Found</h1>
                    <p className="text-muted-foreground mb-6">
                        It looks like you don't have any projects yet. Upload a file to create your first project.
                    </p>
                </div>
            </main>
        </>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        <ProjectGrid projects={projects} filesPerProject={filesPerProject} />
    </main>
  );
}
