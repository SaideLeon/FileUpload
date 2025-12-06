import { FilesTable } from '@/components/files-table';
import { ProjectSummary } from '@/components/project-summary';
import { getFilesByProjectName, getProjectByName } from '@/lib/api';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectPage({ params }: { params: { projectName: string } }) {
  const { projectName } = await params;
  
  const [project, files] = await Promise.all([
    getProjectByName(projectName),
    getFilesByProjectName(projectName),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      <ProjectSummary project={project} files={files} />
      <FilesTable files={files} projectName={project.name} />
    </main>
  );
}
