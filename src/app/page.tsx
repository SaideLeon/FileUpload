
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { FolderGit2, Link as LinkIcon, Zap, Clock, BarChart, ShieldCheck, Star, Sparkles, Server } from "lucide-react";
import { Logo } from "@/components/logo";

export default function LandingPage() {
  const features = [
    {
      icon: <FolderGit2 className="h-8 w-8" />,
      title: "Organização por Projetos",
      description: "Separe seus arquivos por projetos diferentes. Cada projeto tem seu próprio diretório isolado e seguro.",
    },
    {
      icon: <LinkIcon className="h-8 w-8" />,
      title: "URLs Públicas",
      description: "Cada arquivo recebe uma URL pública permanente que você pode usar em qualquer aplicação ou compartilhar.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Upload Rápido",
      description: "API REST simples e rápida. Faça upload de qualquer tipo de arquivo em segundos via POST.",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Timestamp Automático",
      description: "Nunca se preocupe com nomes duplicados. Cada arquivo recebe um timestamp único automaticamente.",
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Estatísticas Completas",
      description: "Veja quantos arquivos tem em cada projeto, tamanho total e outras métricas importantes.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Seguro e Isolado",
      description: "Cada projeto é isolado dos outros. Nomes são sanitizados para máxima segurança.",
    },
  ];

  const faqs = [
    {
      question: "Como funciona a organização por projetos?",
      answer: "Cada upload pode ser associado a um projeto específico. Os arquivos são automaticamente organizados em diretórios separados, facilitando o gerenciamento.",
    },
    {
      question: "Posso usar em produção?",
      answer: "Sim! O serviço está pronto para produção em https://uploader.nativespeak.app com SSL automático e alta disponibilidade.",
    },
    {
      question: "Que tipos de arquivo são suportados?",
      answer: "Todos! Imagens, vídeos, PDFs, documentos, áudio e qualquer outro tipo de arquivo. Sem restrições de formato.",
    },
    {
      question: "Como integro com minha aplicação?",
      answer: "Use nossa API REST simples. Basta fazer um POST com o arquivo e o nome do projeto. Você receberá a URL pública instantaneamente. Veja a documentação para mais detalhes.",
    },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50 border-b border-border/50">
        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
          <Logo />
          <span className="text-lg font-semibold text-primary">File Forge</span>
        </Link>
        <nav className="ml-auto hidden lg:flex gap-4 sm:gap-6 items-center">
          <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground" prefetch={false}>
            Recursos
          </Link>
          <Link href="#faq" className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground" prefetch={false}>
            FAQ
          </Link>
          <Link href="/documentation" className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground" prefetch={false}>
            Documentação
          </Link>
          <Button asChild>
            <Link href="/projects">Começar Agora</Link>
          </Button>
        </nav>
        <nav className="ml-auto lg:hidden">
           <Button asChild>
            <Link href="/projects">Acessar App</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full pt-24 md:pt-32 lg:pt-40 border-b relative">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] [mask-image:linear-gradient(to_bottom,white_5%,transparent_100%)]"></div>
          <div className="container space-y-10 xl:space-y-16 text-center pb-16 relative">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-muted-foreground shadow-sm">
              ✨ Organize seus arquivos por projetos
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Gerencie uploads <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Do Seu Jeito!</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Upload inteligente com organização automática por projetos. Acesse seus arquivos de qualquer lugar com URLs
              públicas estáveis.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/projects">Começar Agora</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/documentation">Ver Documentação</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Recursos Que <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Você Vai Amar</span></h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tudo que você precisa para gerenciar seus arquivos de forma eficiente e segura.
                </p>
              </div>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="grid gap-4 p-6 rounded-lg bg-card border hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Perguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Frequentes</span></h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tire suas dúvidas sobre o File Forge.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl pt-12">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 File Forge. Todos os direitos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-muted-foreground" prefetch={false}>
            Feito com ❤️ para desenvolvedores
          </Link>
        </nav>
      </footer>
    </div>
  )
}
