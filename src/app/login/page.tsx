'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { loginAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

const initialState = {
  success: false,
  error: '',
};

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [state, formAction, isPending] = useActionState(loginAction, initialState);

    useEffect(() => {
        if (state.success) {
            toast({ title: "Login bem-sucedido!" });
            router.push('/projects');
        } else if (state.error) {
            toast({
                variant: 'destructive',
                title: 'Erro no Login',
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
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Entre com seu email para acessar seu painel
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
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                             <div className="flex items-center">
                                <Label htmlFor="password">Senha</Label>
                                {/* <Link href="#" className="ml-auto inline-block text-sm underline">
                                    Esqueceu sua senha?
                                </Link> */}
                            </div>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Entrando...' : 'Login'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Não tem uma conta?{" "}
                        <Link href="/register" className="underline">
                            Cadastre-se
                        </Link>
                    </div>
                </CardContent>
            </Card>
       </div>
    );
}
