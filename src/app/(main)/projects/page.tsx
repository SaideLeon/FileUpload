
import { getProjects, getFilesByProjectName } from '@/lib/api';
import { ProjectGrid } from '@/components/project-grid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FolderGit2 } from 'lucide-react';
import type { ProjectFile } from '@/lib/types';
import { AppHeader } from '@/components/app-header';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await getProjects();

  if (!projects || projects.length === 0) {
    return (
        <div className="flex flex-col w-full min-h-svh">
            <AppHeader allProjects={[]} />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="p-8 rounded-lg border bg-card text-card-foreground shadow-sm text-center max-w-md">
                    <FolderGit2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h1 className="text-2xl font-bold mb-2">No Projects Found</h1>
                    <p className="text-muted-foreground mb-6">
                        It looks like you don't have any projects yet.
                    </p>
                </div>
            </main>
        </div>
    );
  }

  const filesPerProjectPromises = projects.map(p => 
      getFilesByProjectName(p.name).then(files => ({ [p.name]: files }))
  );
  
  const filesPerProjectArray = await Promise.all(filesPerProjectPromises);
  const filesPerProject = filesPerProjectArray.reduce((acc, curr) => ({ ...acc, ...curr }), {}) as Record<string, ProjectFile[]>;

  return (
    <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        <ProjectGrid projects={projects} filesPerProject={filesPerProject} />
    </main>
  );
}
