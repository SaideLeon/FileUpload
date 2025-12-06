'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import type { ProjectFile } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';

interface FileViewerDialogProps {
  file: ProjectFile;
  children: React.ReactNode;
}

export function FileViewerDialog({ file, children }: FileViewerDialogProps) {
  const { name, url, type } = file;

  const renderContent = () => {
    switch (type) {
      case 'image':
        return (
          <div className="relative w-full aspect-video">
            <Image
              src={url}
              alt={name}
              fill
              unoptimized
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        );
      case 'video':
        return (
          <div className="aspect-video">
            <video controls src={url} className="w-full h-full">
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>
        );
      case 'document':
        return (
            <iframe src={url} className="w-full h-[80vh]" title={name} />
        );
      default:
        return (
            <div className="p-8 text-center text-muted-foreground">
                <p>A pré-visualização para este tipo de arquivo não é suportada.</p>
                <a href={url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-primary hover:underline">
                    Abrir em nova aba
                </a>
            </div>
        );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="truncate">{name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[90vh] overflow-y-auto">
          {renderContent()}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
