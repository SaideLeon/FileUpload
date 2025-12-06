import { getProjects } from '@/lib/api';
import { redirect } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default async function Home() {
  const projects = await getProjects();
  if (projects && projects.length > 0) {
    redirect(`/${projects[0].name}`);
  }

  // Fallback if there are no projects
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="p-8 rounded-lg border bg-card text-card-foreground shadow-md text-center">
        <h1 className="text-2xl font-bold mb-2">No Projects Found</h1>
        <p className="text-muted-foreground">Please create a project to get started.</p>
        <div className="mt-6 space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-8 w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
}
