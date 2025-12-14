'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';
import type { ProjectWithDetails } from '@/lib/types';
import { FolderGit2, Files, BookText, LogOut, Home, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Logo } from './logo';
import { formatBytes } from '@/lib/utils';
import { Badge } from './ui/badge';
import { useAuth } from '@/context/auth-context';
import { UserMenu } from './user-menu';

interface AppSidebarProps {
  projects: ProjectWithDetails[];
}

export function AppSidebar({ projects }: AppSidebarProps) {
  const params = useParams();
  const pathname = usePathname();
  const { user } = useAuth();
  const currentProjectName = params.projectName as string;

  if (!user) {
    return null; // Or a login prompt
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <Link href="/projects" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Logo />
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">File Forge</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton asChild isActive={pathname === '/projects'} tooltip={{ children: "Projetos" }}>
                    <Link href="/projects">
                        <Home />
                        <span>Projetos</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                 <SidebarMenuButton asChild isActive={pathname === '/all-files'} tooltip={{ children: "Todos os Arquivos" }}>
                    <Link href="/all-files">
                        <Files />
                        <span>Todos os Arquivos</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                 <SidebarMenuButton asChild isActive={pathname === '/documentation'} tooltip={{ children: "Documentação" }}>
                    <Link href="/documentation">
                        <BookText />
                        <span>Documentação</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          {projects.map((project) => (
            <SidebarMenuItem key={project.id}>
              <SidebarMenuButton
                asChild
                isActive={currentProjectName === project.name}
                tooltip={{
                  children: (
                    <>
                      <p className="font-semibold">{project.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {project.fileCount} files, {formatBytes(project.totalSize)}
                      </p>
                    </>
                  ),
                  className: 'w-48',
                }}
              >
                <Link href={`/${project.name}`}>
                  <FolderGit2 />
                  <span>{project.name}</span>
                  <Badge variant="secondary" className="ml-auto group-data-[collapsible=icon]:hidden">{project.fileCount}</Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
