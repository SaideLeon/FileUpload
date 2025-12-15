'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'lucide-react';
import { useCallback } from 'react';

interface CopyUrlButtonProps {
  url: string;
}

export function CopyUrlButton({ url }: CopyUrlButtonProps) {
  const { toast } = useToast();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast({
          title: 'Copied to clipboard',
          description: 'The URL has been copied to your clipboard.',
        });
      },
      (err) => {
        toast({
          title: 'Failed to copy',
          description: 'Could not copy the URL to your clipboard.',
          variant: 'destructive',
        });
        console.error('Failed to copy URL: ', err);
      }
    );
  }, [url, toast]);

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
      <Link className="h-4 w-4" />
    </Button>
  );
}
