'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';

interface ImageViewerDialogProps {
  fileName: string;
  imageUrl: string;
  children: React.ReactNode;
}

export function ImageViewerDialog({ fileName, imageUrl, children }: ImageViewerDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>{fileName}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video">
          <Image
            src={imageUrl}
            alt={fileName}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
