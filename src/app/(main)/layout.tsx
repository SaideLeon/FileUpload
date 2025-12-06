
import { AppSidebar } from '@/components/app-sidebar';
import { getProjects } from '@/lib/api';
import { SidebarProvider } from '@/components/ui/sidebar';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const projects = await getProjects();
  
  return (
    <SidebarProvider>
      <AppSidebar projects={projects} />
      <div className="md:pe-2 min-h-svh flex flex-col w-full">
        {children}
      </div>
    </SidebarProvider>
  );
}
