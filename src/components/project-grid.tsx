
import type { ProjectWithDetails, ProjectFile } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { FolderGit2 } from 'lucide-react';
import Link from 'next/link';
import { formatBytes } from '@/lib/utils';
import Image from 'next/image';

interface ProjectGridProps {
  projects: ProjectWithDetails[];
  filesPerProject?: Record<string, ProjectFile[]>;
}

export function ProjectGrid({ projects, filesPerProject = {} }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => {
        const projectFiles = filesPerProject[project.name] || [];
        const imageFiles = projectFiles.filter(f => 
          f.type === 'image'
        );
        const previewImages = imageFiles.slice(0, 4);
        const hasImages = previewImages.length > 0;

        return (
          <Link key={project.id} href={`/${project.name}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden h-full flex flex-col">
              {/* Preview Grid */}
              <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
                {hasImages ? (
                  <div className={`grid h-full ${
                    previewImages.length === 1 ? 'grid-cols-1' :
                    previewImages.length === 2 ? 'grid-cols-2' :
                    previewImages.length >= 3 ? 'grid-cols-2 grid-rows-2' : ''
                  } gap-0.5`}>
                    {previewImages.map((file, idx) => (
                      <div key={idx} className={`relative overflow-hidden ${previewImages.length === 3 && idx === 0 ? 'row-span-2' : ''}`}>
                        <Image
                          src={file.url}
                          alt={`Preview ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FolderGit2 className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
                
                {/* Overlay com contagem de arquivos */}
                {project.fileCount > 0 && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                    {project.fileCount} {project.fileCount === 1 ? 'file' : 'files'}
                  </div>
                )}
              </div>

              {/* Info */}
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between flex-1">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatBytes(project.totalSize)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
