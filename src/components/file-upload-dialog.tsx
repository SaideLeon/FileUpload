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
import { Upload } from 'lucide-react';
import { useRef, useState, useTransition, useActionState, useEffect } from 'react';
import { uploadFileAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

const initialState = {
    error: '',
    success: '',
};

export function FileUploadDialog({ projectName }: { projectName: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(uploadFileAction, initialState);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  
  useEffect(() => {
    if (state.success) {
      toast({ title: 'Success', description: state.success });
      setOpen(false);
      setFileName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else if (state.error) {
      toast({ variant: 'destructive', title: 'Error', description: state.error });
    }
  }, [state, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.files?.[0]?.name || '');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Select a file to upload to the project <span className="font-medium text-foreground">{projectName}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">File</Label>
              <Input id="file" name="file" type="file" required onChange={handleFileChange} ref={fileInputRef} />
              <input type="hidden" name="projectName" value={projectName} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending || !fileName}>
              {isPending ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
