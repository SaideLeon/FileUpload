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
import { Upload } from 'lucide-react';
import { useRef, useState, useActionState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadFileAction } from '@/lib/actions';
import { useAuth } from '@/context/auth-context';
import type { ProjectWithDetails } from '@/lib/types';

const initialState = {
  success: '',
  error: '',
};

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

  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(uploadFileAction, initialState);
  const { apiKey } = useAuth();
  
  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Erro no Upload',
        description: state.error,
      });
    } else if (state.success) {
      toast({
        title: 'Sucesso',
        description: state.success,
      });
      // Reset and close on success
      setFile(null);
      setNewProjectName('');
      setSelectedProject(projectName || 'default');
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state, toast, projectName]);

  useEffect(() => {
    if (open) {
      setSelectedProject(projectName || 'default');
      setNewProjectName('');
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
    if (!isOpen) {
      // Reset form if dialog is closed
      setFile(null);
      setNewProjectName('');
      setSelectedProject(projectName || 'default');
      formRef.current?.reset();
    }
  }

  const finalProjectName = selectedProject === '__new__' ? newProjectName : selectedProject;
  const canSubmit = file && apiKey && finalProjectName;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form ref={formRef} action={formAction}>
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
                  Selecionado: {file.name} ({(file.size / 1024).toFixed(1)} KB)
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
                  <SelectItem value="__new__">✨ Criar novo projeto</SelectItem>
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
                />
              </div>
            )}

            <input type="hidden" name="project" value={finalProjectName} />
            <input type="hidden" name="apiKey" value={apiKey || ''} />
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
