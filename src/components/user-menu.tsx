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
import { KeyRound, LogOut, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export function UserMenu() {
  const { user, apiKey } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const getInitials = (email: string) => {
    const parts = email.split('@');
    return parts[0].charAt(0).toUpperCase();
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

  return (
    <div className="flex w-full items-center gap-2 p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getInitials(user.Email)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Minha Conta</p>
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
        <p className="text-sm font-medium leading-none truncate">{user.Email}</p>
         <p className="text-xs leading-none text-muted-foreground truncate">API Key: {obscureApiKey(apiKey)}</p>
      </div>
    </div>
  );
}
