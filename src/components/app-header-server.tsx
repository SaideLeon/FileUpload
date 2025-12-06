import type { Project, ProjectWithDetails } from '@/lib/types';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const AppHeaderClient = dynamic(() => import('./app-header').then(mod => mod.AppHeader), {
  ssr: false,
  loading: () => <AppHeaderSkeleton />,
});

interface AppHeaderProps {
  currentProject: Project;
  allProjects: ProjectWithDetails[];
}

export function AppHeader(props: AppHeaderProps) {
  return <AppHeaderClient {...props} />;
}

function AppHeaderSkeleton() {
    return (
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6">
            <Skeleton className="h-7 w-7 md:hidden" />
            <div className="flex-1">
                <Skeleton className="h-6 w-32 hidden md:block" />
                <div className="md:hidden">
                    <Skeleton className="w-48 h-8" />
                </div>
            </div>
            <Skeleton className="h-10 w-28" />
        </header>
    );
}
