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
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import type { ProjectWithDetails } from '@/lib/types';

interface FileUploadDialogProps {
  projectName: string;
  allProjects: ProjectWithDetails[];
}

export function FileUploadDialog({ projectName, allProjects }: FileUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedProject, setSelectedProject] = useState(projectName || 'default');
  const [newProjectName, setNewProjectName] = useState('');
  const [isPending, setIsPending] = useState(false);
  
  const { toast } = useToast();
  const { apiKey } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (open) {
      setSelectedProject(projectName || 'default');
      setNewProjectName('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open, projectName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (isPending) return; // Prevent closing while uploading
    setOpen(isOpen);
  }

  const finalProjectName = selectedProject === '__new__' ? newProjectName : selectedProject;
  const canSubmit = file && apiKey && finalProjectName;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsPending(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project', finalProjectName);
    
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://uploader.nativespeak.app';

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': apiKey },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Upload failed: ${response.statusText}` }));
        throw new Error(errorData.error);
      }
      
      toast({
        title: 'Sucesso',
        description: `Arquivo "${file.name}" enviado com sucesso.`,
      });
      
      setOpen(false);
      
      // Revalidate data by refreshing the page.
      // This is a simple way to ensure the file list is updated.
      window.location.reload();

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro no Upload',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form ref={formRef} onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Selecione um arquivo e escolha um projeto existente ou crie um novo para fazer o upload.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">Arquivo</Label>
              <Input
                id="file"
                name="file"
                type="file"
                required
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={isPending}
              />
              {file && (
                <p className="text-xs text-muted-foreground">
                  Selecionado: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="project-select">Projeto</Label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
                disabled={isPending}
              >
                <SelectTrigger id="project-select">
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__new__">
                    <span className="flex items-center">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Criar novo projeto
                    </span>
                  </SelectItem>
                  {allProjects.map((p) => (
                    <SelectItem key={p.id} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                  {allProjects.length === 0 && (
                     <SelectItem value="default" disabled={projectName !== 'default'}>default</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {selectedProject === '__new__' && (
              <div className="grid gap-2">
                <Label htmlFor="new-project-name">Nome do Novo Projeto</Label>
                <Input 
                  id="new-project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="ex: meu-incrivel-projeto"
                  disabled={isPending}
                  required
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending || !canSubmit}>
              {isPending ? 'Enviando...' : 'Enviar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
