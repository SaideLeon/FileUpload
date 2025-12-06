import { FilesTable } from '@/components/files-table';
import { getFilesByProjectName, getProjects } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AllFilesPage() {
  const allProjects = await getProjects();
  
  const allFilesPromises = allProjects.map(p => getFilesByProjectName(p.name).then(files => files.map(f => ({...f, projectName: p.name}))));
  const allFilesNested = await Promise.all(allFilesPromises);
  const allFiles = allFilesNested.flat();

  return (
    <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      <FilesTable files={allFiles} showProjectColumn={true} />
    </main>
  );
}
