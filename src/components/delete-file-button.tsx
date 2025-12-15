'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteFileAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useActionState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';

interface DeleteFileButtonProps {
  projectName: string;
  fileName: string;
}

const initialState = {
  success: '',
  error: '',
};

export function DeleteFileButton({ projectName, fileName }: DeleteFileButtonProps) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(deleteFileAction, initialState);
  const { apiKey } = useAuth();

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Success',
        description: state.success,
      });
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleDelete = () => {
    if (!apiKey) {
        toast({ variant: 'destructive', title: 'Error', description: 'API Key not found.' });
        return;
    }
    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('fileName', fileName);
    formData.append('apiKey', apiKey);
    formAction(formData);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Trash2 className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Delete file</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this file?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the file <span className="font-medium text-foreground">{fileName}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
