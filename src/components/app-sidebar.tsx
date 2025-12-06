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
import { FolderGit2, Settings } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Logo } from './logo';
import { formatBytes } from '@/lib/utils';
import { Badge } from './ui/badge';

interface AppSidebarProps {
  projects: ProjectWithDetails[];
}

export function AppSidebar({ projects }: AppSidebarProps) {
  const params = useParams();
  const currentProjectName = params.projectName as string;

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Logo />
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">File Forge</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {projects.map((project) => (
            <SidebarMenuItem key={project.id}>
              <Link href={`/${project.name}`} legacyBehavior passHref>
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
                  <a>
                    <FolderGit2 />
                    <span>{project.name}</span>
                    <Badge variant="secondary" className="ml-auto group-data-[collapsible=icon]:hidden">{project.fileCount}</Badge>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton tooltip={{children: "Settings"}} asChild>
                    <Link href="#">
                        <Settings />
                        <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
