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
import { DeleteFileButton } from './delete-file-button';
import { FileViewerDialog } from './file-viewer-dialog';
import { Button } from '@/components/ui/button';

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
            <CardContent className="flex flex-col items-center justify-center py-12">
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] hidden sm:table-cell">Type</TableHead>
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
              return (
                <TableRow key={file.id}>
                  <TableCell className="hidden sm:table-cell">
                    <FileIcon type={file.type} />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileIcon type={file.type} className="sm:hidden flex-shrink-0" />
                      {viewable ? (
                        <FileViewerDialog file={file}>
                          <Button
                            variant="link"
                            className="h-auto p-0 text-left font-medium text-primary hover:underline truncate max-w-xs"
                          >
                            {file.name}
                          </Button>
                        </FileViewerDialog>
                      ) : (
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="truncate max-w-xs hover:underline text-primary"
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
                    <DeleteFileButton projectName={file.projectName || projectName || ''} fileName={file.name} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
