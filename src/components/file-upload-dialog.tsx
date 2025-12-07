'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadFile } from '@/lib/api';
import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function FileUploadDialog({ projectName }: { projectName: string }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      toast({ 
        variant: 'destructive', 
        title: 'Erro', 
        description: 'Por favor selecione um arquivo para upload.' 
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('project', projectName);
      
      const result = await uploadFile(formData);

      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({ 
        title: 'Sucesso', 
        description: result.success
      });
      
      // Resetar e fechar
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setOpen(false);
      
      // Recarregar a página para mostrar o novo arquivo
      router.refresh();

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido ao fazer upload.';
      console.error('Upload error:', error);
      
      toast({ 
        variant: 'destructive', 
        title: 'Erro no Upload', 
        description: message 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Select a file to upload to the project <span className="font-medium text-foreground">{projectName}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">File</Label>
              <Input 
                id="file" 
                name="file" 
                type="file" 
                required 
                onChange={handleFileChange} 
                ref={fileInputRef}
                disabled={uploading}
              />
              {file && (
                <p className="text-xs text-muted-foreground">
                  Selecionado: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={uploading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={uploading || !file}>
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
