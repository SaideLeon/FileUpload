'use client';

import type { ProjectFile } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { FileIcon } from './file-icon';
import { formatBytes } from '@/lib/utils';
import Image from 'next/image';
import { CopyUrlButton } from './copy-url-button';
import { FileViewerDialog } from './file-viewer-dialog';
import { DeleteFileButton } from './delete-file-button';
import { Eye } from 'lucide-react';

interface FilesGridProps {
  files: (ProjectFile & {projectName?: string})[];
  projectName: string;
}

export function FilesGrid({ files, projectName }: FilesGridProps) {
    if (files.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed">
                <FileIcon type="other" className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold">No Files Found</h3>
                <p className="text-muted-foreground">Upload a file to get started.</p>
            </div>
        );
    }
    
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
      {files.map((file) => (
        <Card key={file.id} className="group overflow-hidden">
            <CardContent className="p-0">
                <FileViewerDialog file={file}>
                    <div className="relative aspect-square bg-muted flex items-center justify-center cursor-pointer">
                        {file.type === 'image' ? (
                            <Image
                            src={file.url}
                            alt={file.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            />
                        ) : (
                            <FileIcon type={file.type} className="w-10 h-10" />
                        )}
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Eye className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </FileViewerDialog>
            </CardContent>
            <CardFooter className="p-2 flex-col items-start text-sm">
                <p className="font-medium truncate w-full" title={file.name}>{file.name}</p>
                <div className="w-full flex justify-between items-center text-muted-foreground text-xs">
                    <span>{formatBytes(file.size)}</span>
                    <div className="flex items-center -mr-2">
                      <CopyUrlButton url={file.url} />
                      <DeleteFileButton projectName={projectName} fileName={file.name} />
                    </div>
                </div>
            </CardFooter>
        </Card>
      ))}
    </div>
  );
}
