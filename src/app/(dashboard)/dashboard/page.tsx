import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { ExternalLink, Link as LinkIcon, Palette, Settings } from "lucide-react";



export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      links: true,
      _count: { select: { pageViews: true } },
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
        <p className="text-muted-foreground">Bem-vindo ao seu painel. Aqui está um resumo do seu perfil.</p>
      </div>

      {!profile ? (
        <div className="p-8 border border-dashed border-white/10 rounded-xl text-center space-y-4">
          <p className="text-muted-foreground text-lg">Você ainda não configurou seu perfil!</p>
          <Link href="/settings">
            <Button>Configurar meu perfil agora</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stats */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <p className="text-sm text-muted-foreground">Total de Views</p>
            <p className="text-4xl font-bold mt-1">{profile._count.pageViews}</p>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
            <p className="text-sm text-muted-foreground">Links Cadastrados</p>
            <p className="text-4xl font-bold mt-1">{profile.links.length}</p>
          </div>
          <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md col-span-1">
            <p className="text-sm text-muted-foreground">Seu Perfil Público</p>
            {profile.username ? (
              <Link href={`/${profile.username}`} target="_blank" className="flex items-center gap-2 text-primary hover:underline mt-2 font-semibold">
                anthrax.cc/{profile.username} <ExternalLink className="h-4 w-4" />
              </Link>
            ) : (
              <p className="text-muted-foreground text-sm mt-2">Defina seu username nas configurações.</p>
            )}
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Link href="/links" className="group bg-black/40 border border-white/10 hover:border-white/30 rounded-xl p-6 backdrop-blur-md transition-all">
              <LinkIcon className="h-8 w-8 mb-3 text-muted-foreground group-hover:text-white transition-colors" />
              <p className="font-semibold">Gerenciar Links</p>
              <p className="text-sm text-muted-foreground">Adicione e reordene seus links.</p>
            </Link>
            <Link href="/appearance" className="group bg-black/40 border border-white/10 hover:border-white/30 rounded-xl p-6 backdrop-blur-md transition-all">
              <Palette className="h-8 w-8 mb-3 text-muted-foreground group-hover:text-white transition-colors" />
              <p className="font-semibold">Aparência</p>
              <p className="text-sm text-muted-foreground">Customize avatar, fundo e efeitos.</p>
            </Link>
            <Link href="/settings" className="group bg-black/40 border border-white/10 hover:border-white/30 rounded-xl p-6 backdrop-blur-md transition-all">
              <Settings className="h-8 w-8 mb-3 text-muted-foreground group-hover:text-white transition-colors" />
              <p className="font-semibold">Configurações</p>
              <p className="text-sm text-muted-foreground">Edite seu username e bio.</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
