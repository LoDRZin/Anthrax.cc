import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { ExternalLink, Eye, Link as LinkIcon, Activity } from "lucide-react";
import { DashboardPageTransition } from "@/components/dashboard/DashboardPageTransition";
import { MagicCard } from "@/components/magicui/magic-card";



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
    <DashboardPageTransition className="max-w-4xl mx-auto space-y-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-bold tracking-tight text-white drop-shadow-md">Visão Geral</h2>
        <p className="text-white/50 text-lg">Bem-vindo ao seu painel. Aqui está o controle total do seu império.</p>
      </div>

      {!profile ? (
        <MagicCard className="p-8 border border-white/5 rounded-2xl text-center space-y-6 bg-black/40 backdrop-blur-md" gradientColor="rgba(255,255,255,0.05)">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="text-white/40" size={32} />
          </div>
          <p className="text-white/60 text-xl font-medium">Você ainda não configurou seu perfil!</p>
          <Link href="/settings">
            <Button className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-md font-semibold transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Configurar Meu Perfil
            </Button>
          </Link>
        </MagicCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Views */}
          <MagicCard className="flex flex-col justify-between p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md" gradientColor="rgba(255,255,255,0.08)">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-white/50 uppercase tracking-wider">Total de Views</p>
              <Eye className="text-white/30" size={20} />
            </div>
            <p className="text-5xl font-black text-white drop-shadow-lg tracking-tighter">{profile._count.pageViews}</p>
          </MagicCard>
          
          {/* Stats Links */}
          <MagicCard className="flex flex-col justify-between p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md" gradientColor="rgba(255,255,255,0.08)">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-white/50 uppercase tracking-wider">Links Ativos</p>
              <LinkIcon className="text-white/30" size={20} />
            </div>
            <p className="text-5xl font-black text-white drop-shadow-lg tracking-tighter">{profile.links.length}</p>
          </MagicCard>
          
          {/* Public Profile Link */}
          <MagicCard className="col-span-1 flex flex-col justify-between p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md" gradientColor="rgba(255,255,255,0.08)">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-white/50 uppercase tracking-wider">Seu Perfil</p>
              <ExternalLink className="text-white/30" size={20} />
            </div>
            {profile.username ? (
              <Link href={`/${profile.username}`} target="_blank" className="group">
                <div className="flex items-center gap-2 text-white/90 group-hover:text-white transition-colors mt-2">
                  <span className="font-semibold text-lg truncate">anthrax.cc/<span className="text-primary">{profile.username}</span></span>
                </div>
                <div className="h-1 w-0 bg-white/50 mt-2 group-hover:w-full transition-all duration-300" />
              </Link>
            ) : (
              <span className="text-white/40 text-sm italic">Nome de usuário não definido</span>
            )}
          </MagicCard>

          {/* Quick Actions */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Link href="/links" className="w-full">
              <MagicCard className="group h-full flex flex-col items-center justify-center p-8 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md hover:-translate-y-1 transition-all duration-300" gradientColor="rgba(255,255,255,0.08)">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LinkIcon className="text-white/60 group-hover:text-white" size={32} />
                </div>
                <p className="font-bold text-white text-lg">Gerenciar Links</p>
                <p className="text-sm text-white/40 mt-2 text-center">Adicione e reordene seus links sociais e widgets.</p>
              </MagicCard>
            </Link>

            <Link href="/appearance" className="w-full">
              <MagicCard className="group h-full flex flex-col items-center justify-center p-8 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md hover:-translate-y-1 transition-all duration-300" gradientColor="rgba(255,255,255,0.08)">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Palette className="text-white/60 group-hover:text-white" size={32} />
                </div>
                <p className="font-bold text-white text-lg">Aparência</p>
                <p className="text-sm text-white/40 mt-2 text-center">Customize seu avatar, fundo, fonte e efeitos 3D.</p>
              </MagicCard>
            </Link>

            <Link href="/settings" className="w-full">
              <MagicCard className="group h-full flex flex-col items-center justify-center p-8 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md hover:-translate-y-1 transition-all duration-300" gradientColor="rgba(255,255,255,0.08)">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Settings className="text-white/60 group-hover:text-white" size={32} />
                </div>
                <p className="font-bold text-white text-lg">Configurações</p>
                <p className="text-sm text-white/40 mt-2 text-center">Edite seu username, bio e status do Discord.</p>
              </MagicCard>
            </Link>
          </div>
        </div>
      )}
    </DashboardPageTransition>
  );
}
