'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/lib/actions';
import { useAuth } from '@/context/auth-context';
import { KeyRound, LogOut, Copy, Check, Loader2 } from 'lucide-react'; // Added Loader2 for loading indicator
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

// Import the new API key rotation functions
import { rotateApiKey } from '@/lib/api';
import { updateApiKeyInSession } from '@/lib/session';

export function UserMenu() {
  const { user, apiKey, setApiKey } = useAuth(); // Destructure setApiKey
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isRotatingKey, setIsRotatingKey] = useState(false); // New state for loading

  if (!user) return null;

  const getInitials = (name: string) => {
    if (!name) return '?';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const handleCopyApiKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast({ title: 'API Key copiada para a área de transferência!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const obscureApiKey = (key: string | null) => {
    if (!key) return '';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  }

  const handleRotateApiKey = async () => {
    if (!apiKey) {
      toast({
        title: 'Erro',
        description: 'Nenhuma chave de API encontrada para girar.',
        variant: 'destructive',
      });
      return;
    }

    setIsRotatingKey(true);
    try {
      const result = await rotateApiKey(apiKey);

      if (result.success) {
        const newKey = result.data?.new_api_key;
        if (newKey) {
          const sessionUpdated = await updateApiKeyInSession(newKey);
          if (sessionUpdated) {
            setApiKey(newKey); // Update the API key in AuthContext
            toast({ title: 'API Key girada com sucesso!', description: 'Sua nova chave de API foi atualizada.' });
          } else {
            toast({
              title: 'Erro',
              description: 'API Key girada, mas falha ao atualizar a sessão. Por favor, faça login novamente.',
              variant: 'destructive',
            });
            // Optionally force logout if session update fails critically
            // await logoutAction();
          }
        } else {
          toast({
            title: 'Erro',
            description: 'API Key girada, mas nenhuma nova chave foi retornada.',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Erro ao girar API Key',
          description: result.error || 'Ocorreu um erro desconhecido.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido ao girar a API Key.',
        variant: 'destructive',
      });
    } finally {
      setIsRotatingKey(false);
    }
  };

  return (
    <div className="flex w-full items-center gap-2 p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getInitials(user.Name)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none truncate">{user.Name}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.Email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* API Key Modal */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <KeyRound className="mr-2 h-4 w-4" />
                <span>Ver API Key</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sua Chave de API (Forge API Key)</AlertDialogTitle>
                <AlertDialogDescription>
                  Use esta chave para autenticar suas requisições na API. Mantenha-a segura e não a exponha no lado do cliente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="relative my-4">
                <div className="w-full rounded-md border bg-muted px-4 py-2 font-mono text-sm text-muted-foreground break-all">
                  {apiKey}
                </div>
                <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2" onClick={handleCopyApiKey}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Fechar</AlertDialogCancel>
                <Button
                  onClick={handleRotateApiKey}
                  disabled={isRotatingKey}
                >
                  {isRotatingKey ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <KeyRound className="mr-2 h-4 w-4" />
                  )}
                  <span>{isRotatingKey ? 'Girando...' : 'Girar API Key'}</span>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


          <DropdownMenuSeparator />
          <form action={logoutAction}>
            <button type="submit" className="w-full">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex-1 group-data-[collapsible=icon]:hidden">
        <p className="text-sm font-medium leading-none truncate">{user.Name}</p>
         <p className="text-xs leading-none text-muted-foreground truncate">API Key: {obscureApiKey(apiKey)}</p>
      </div>
    </div>
  );
}