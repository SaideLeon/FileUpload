'use client';

import type { Project, ProjectWithDetails } from '@/lib/types';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { FileUploadDialog } from './file-upload-dialog';
import { useAuth } from '@/context/auth-context';

interface AppHeaderProps {
  currentProject?: Project;
  allProjects: ProjectWithDetails[];
}

export function AppHeader({ currentProject, allProjects }: AppHeaderProps) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { user } = useAuth();
  
  const projectName = params.projectName as string || '';

  const handleProjectChange = (newProjectName: string) => {
    if (newProjectName === '__all-files') {
      router.push('/all-files');
    } else if (newProjectName === '__all-projects') {
      router.push('/projects');
    } else {
      router.push(`/${newProjectName}`);
    }
  };

  const getTitle = () => {
    if (currentProject) {
      return currentProject.name;
    }
    if (pathname === '/all-files') {
      return 'Todos os Arquivos';
    }
     if (pathname === '/projects') {
      return 'Projetos';
    }
    return 'File Forge';
  }

  // Determine the current value for the Select component
  const selectValue = currentProject 
    ? projectName 
    : pathname === '/all-files' 
    ? '__all-files'
    : pathname === '/projects'
    ? '__all-projects'
    : '';

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <h1 className="text-lg font-semibold hidden md:block">{getTitle()}</h1>
        <div className="md:hidden">
          {user && allProjects.length > 0 && (
            <Select value={selectValue} onValueChange={handleProjectChange}>
              <SelectTrigger className="w-48 h-8">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="__all-projects">Todos os Projetos</SelectItem>
                 <SelectItem value="__all-files">Todos os Arquivos</SelectItem>
                {allProjects.map((project) => (
                  <SelectItem key={project.id} value={project.name}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      {user && <FileUploadDialog projectName={projectName} allProjects={allProjects} />}
    </header>
  );
}
