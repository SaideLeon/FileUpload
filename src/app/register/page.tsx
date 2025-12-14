'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { registerAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

const initialState = {
  success: false,
  error: '',
};

export default function RegisterPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [state, formAction, isPending] = useActionState(registerAction, initialState);

    useEffect(() => {
        if (state.success) {
            toast({ title: "Cadastro realizado com sucesso!" });
            router.push('/projects');
        } else if (state.error) {
            toast({
                variant: 'destructive',
                title: 'Erro no Cadastro',
                description: state.error,
            });
        }
    }, [state, router, toast]);

    return (
       <div className="flex items-center justify-center min-h-svh bg-background px-4">
            <Card className="mx-auto max-w-sm w-full">
                 <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Logo />
                    </div>
                    <CardTitle className="text-2xl">Cadastro</CardTitle>
                    <CardDescription>
                        Crie sua conta para começar a usar o File Forge
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Criando conta...' : 'Criar conta'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="underline">
                            Faça login
                        </Link>
                    </div>
                </CardContent>
            </Card>
       </div>
    );
}
