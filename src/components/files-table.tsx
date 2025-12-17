'use client';

import type { ProjectFile } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBytes } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { FileIcon } from './file-icon';
import { CopyUrlButton } from './copy-url-button';
import { FileViewerDialog } from './file-viewer-dialog';
import { Button } from '@/components/ui/button';
import { DeleteFileButton } from './delete-file-button';

interface FilesTableProps {
  files: (ProjectFile & {projectName?: string})[];
  projectName?: string;
  showProjectColumn?: boolean;
}

export function FilesTable({ files, projectName, showProjectColumn = false }: FilesTableProps) {
  if (files.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Files</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FileIcon type="other" className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold">No Files Found</h3>
                <p className="text-muted-foreground">Upload a file to get started.</p>
            </CardContent>
        </Card>
    );
  }

  const isFileViewable = (type: ProjectFile['type']) => {
    return ['image', 'video', 'document'].includes(type);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] hidden sm:table-cell">Type</TableHead>
                <TableHead>Name</TableHead>
                {showProjectColumn && <TableHead className="hidden md:table-cell">Project</TableHead>}
                <TableHead className="hidden md:table-cell">Size</TableHead>
                <TableHead className="hidden lg:table-cell">Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => {
                const viewable = isFileViewable(file.type);
                const project = file.projectName || projectName;
                return (
                  <TableRow key={file.id}>
                    <TableCell className="hidden sm:table-cell">
                      <FileIcon type={file.type} />
                    </TableCell>
                    <TableCell className="font-medium max-w-[150px] sm:max-w-xs md:max-w-md lg:max-w-lg truncate">
                      <div className="flex items-center gap-2">
                        <FileIcon type={file.type} className="sm:hidden flex-shrink-0" />
                        {viewable ? (
                          <FileViewerDialog file={file}>
                            <Button
                              variant="link"
                              className="h-auto p-0 text-left font-medium text-primary hover:underline truncate"
                              title={file.name}
                            >
                              {file.name}
                            </Button>
                          </FileViewerDialog>
                        ) : (
                          <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="truncate hover:underline text-primary"
                            title={file.name}
                          >
                            {file.name}
                          </a>
                        )}
                      </div>
                    </TableCell>
                    {showProjectColumn && <TableCell className="hidden md:table-cell">{file.projectName}</TableCell>}
                    <TableCell className="hidden md:table-cell">{formatBytes(file.size)}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <CopyUrlButton url={file.url} />
                        {project && <DeleteFileButton projectName={project} fileName={file.name} />}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
