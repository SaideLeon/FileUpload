import { AppHeader } from '@/components/app-header';
import { FilesTable } from '@/components/files-table';
import { ProjectSummary } from '@/components/project-summary';
import { getFilesByProjectName, getProjectByName, getProjects } from '@/lib/api';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProjectPage({ params }: { params: { projectName: string } }) {
  const { projectName } = params;
  
  const [project, files, allProjects] = await Promise.all([
    getProjectByName(projectName),
    getFilesByProjectName(projectName),
    getProjects()
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full bg-background md:m-2 md:rounded-lg md:border md:shadow-sm">
      <AppHeader currentProject={project} allProjects={allProjects} />
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        <ProjectSummary project={project} files={files} />
        <FilesTable files={files} projectName={project.name} />
      </main>
    </div>
  );
}
