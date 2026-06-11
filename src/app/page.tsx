import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-black text-white">
      <header className="absolute top-4 right-4 flex gap-4">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="outline" className="bg-transparent border-white/20 hover:bg-white/10">Entrar</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Criar Conta</Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link href="/dashboard">
            <Button variant="outline" className="mr-4 bg-transparent border-white/20 hover:bg-white/10">Ir para o Dashboard</Button>
          </Link>
          <UserButton />
        </Show>
      </header>

      <main className="text-center max-w-3xl">
        <h1 className="text-6xl font-bold tracking-tighter mb-6">
          Seu Link in Bio, <br /><span className="text-primary">Evoluído.</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Anthrax.cc é a plataforma definitiva para agrupar seus links com uma estética gamer única.
        </p>
        
        <Show when="signed-out">
          <SignUpButton mode="modal">
             <Button size="lg" className="text-lg px-8 py-6 rounded-xl bg-white text-black hover:bg-neutral-200">
               Começar Agora
             </Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
           <Link href="/dashboard">
             <Button size="lg" className="text-lg px-8 py-6 rounded-xl bg-white text-black hover:bg-neutral-200">
               Acessar Meu Painel
             </Button>
           </Link>
        </Show>
      </main>
    </div>
  );
}
