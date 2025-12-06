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
import {useTransition} from 'react';

interface DeleteFileButtonProps {
  projectName: string;
  fileName: string;
}

export function DeleteFileButton({ projectName, fileName }: DeleteFileButtonProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('fileName', fileName);

    startTransition(async () => {
        const result = await deleteFileAction(formData);
        if (result?.success) {
            toast({
                title: 'Success',
                description: result.success,
            });
        } else if (result?.error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error,
            });
        }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
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
