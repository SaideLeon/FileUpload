import { getFilesByProjectName, getProjects } from "@/lib/api";
import { ProjectGrid } from "@/components/project-grid";
import { AppHeader } from "@/components/app-header";
import type { ProjectFile } from "@/lib/types";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
    const projects = await getProjects();
  
    const filesPerProjectPromises = projects.map(p => 
        getFilesByProjectName(p.name).then(files => ({ [p.name]: files }))
    );
    
    const filesPerProjectArray = await Promise.all(filesPerProjectPromises);
    const filesPerProject = filesPerProjectArray.reduce((acc, curr) => ({ ...acc, ...curr }), {}) as Record<string, ProjectFile[]>;

    return (
        <div className="flex flex-col h-full bg-background md:m-2 md:rounded-lg md:border md:shadow-sm">
            <AppHeader allProjects={projects} />
            <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
                <ProjectGrid projects={projects} filesPerProject={filesPerProject} />
            </main>
        </div>
    )
}
