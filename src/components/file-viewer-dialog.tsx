'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { ProjectFile } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

interface FileViewerDialogProps {
  file: ProjectFile;
  children: React.ReactNode;
}

export function FileViewerDialog({ file, children }: FileViewerDialogProps) {
  const { name, url, type } = file;
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const renderContent = () => {
    switch (type) {
      case 'image':
        return (
          <div className="relative w-full min-h-[400px] flex items-center justify-center bg-slate-900/5">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {imageError ? (
              <div className="p-8 text-center text-muted-foreground">
                <p className="mb-4">Não foi possível carregar a imagem.</p>
                <Button asChild variant="outline">
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Abrir em nova aba
                  </a>
                </Button>
              </div>
            ) : (
              <img
                src={url}
                alt={name}
                className="max-w-full max-h-[80vh] object-contain"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
              />
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="aspect-video bg-black">
            <video controls src={url} className="w-full h-full">
              Seu navegador não suporta a tag de vídeo.
            </video>
          </div>
        );
      
      case 'document':
        return (
          <div className="w-full h-[80vh]">
            <iframe 
              src={url} 
              className="w-full h-full border-0" 
              title={name}
              onError={() => {
                console.error('Erro ao carregar documento');
              }}
            />
          </div>
        );
      
      default:
        return (
          <div className="p-8 text-center text-muted-foreground">
            <p>A pré-visualização para este tipo de arquivo não é suportada.</p>
            <Button asChild variant="outline" className="mt-4">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir em nova aba
              </a>
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-3 border-b">
          <DialogTitle className="truncate pr-8">{name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(95vh-80px)]">
          <div className="p-4">
            {renderContent()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
