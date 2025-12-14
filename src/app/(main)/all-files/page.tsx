'use client';

import { FilesTable } from '@/components/files-table';
import { getFilesByProjectName, getProjects } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import type { ProjectFile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AllFilesPage() {
  const { apiKey, isLoading: isAuthLoading } = useAuth();
  const [allFiles, setAllFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiKey) return;
    
    setLoading(true);
    async function fetchAllFiles() {
      const allProjects = await getProjects(apiKey);
      const allFilesPromises = allProjects.map(p => 
        getFilesByProjectName(apiKey, p.name).then(files => 
          files.map(f => ({...f, projectName: p.name}))
        )
      );
      const allFilesNested = await Promise.all(allFilesPromises);
      setAllFiles(allFilesNested.flat());
      setLoading(false);
    }
    
    fetchAllFiles();
  }, [apiKey]);

  if (isAuthLoading || loading) {
    return (
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        <Skeleton className="h-96 w-full" />
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      <FilesTable files={allFiles} showProjectColumn={true} />
    </main>
  );
}
