'use client';

import type { Project, ProjectWithDetails } from '@/lib/types';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter, useParams } from 'next/navigation';
import { FileUploadDialog } from './file-upload-dialog';

interface AppHeaderProps {
  currentProject: Project;
  allProjects: ProjectWithDetails[];
}

export function AppHeader({ currentProject, allProjects }: AppHeaderProps) {
  const router = useRouter();
  const params = useParams();
  const projectName = params.projectName as string;

  const handleProjectChange = (newProjectName: string) => {
    router.push(`/${newProjectName}`);
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="text-lg font-semibold hidden md:block">{currentProject.name}</h1>
        <div className="md:hidden">
          <Select value={projectName} onValueChange={handleProjectChange}>
            <SelectTrigger className="w-48 h-8">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {allProjects.map((project) => (
                <SelectItem key={project.id} value={project.name}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <FileUploadDialog projectName={currentProject.name} />
    </header>
  );
}
