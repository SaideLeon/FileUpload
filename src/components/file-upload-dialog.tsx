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
import { Upload } from 'lucide-react';
import { useRef, useState, useActionState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadFileAction } from '@/lib/actions';

const initialState = {
  success: '',
  error: '',
};

export function FileUploadDialog({ projectName }: { projectName: string }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(uploadFileAction, initialState);

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
      formRef.current?.reset();
      setOpen(false);
    }
  }, [state, toast]);

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
      formRef.current?.reset();
    }
  }

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
                disabled={isPending}
              />
              {file && (
                <p className="text-xs text-muted-foreground">
                  Selecionado: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
            <input type="hidden" name="project" value={projectName} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending || !file}>
              {isPending ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
