import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AppearanceForm from "@/components/dashboard/AppearanceForm";
import AdvancedStylingForm from "@/components/dashboard/AdvancedStylingForm";
import { DashboardPageTransition } from "@/components/dashboard/DashboardPageTransition";
import { MagicCard } from "@/components/magicui/magic-card";

export default async function AppearancePage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) redirect("/settings");

  // Passe os dados pro client component
  const profileData = {
    avatarUrl: profile.avatarUrl,
    backgroundUrl: profile.backgroundUrl,
    audioUrl: profile.audioUrl,
    effect: profile.effect,
  };

  return (
    <DashboardPageTransition className="max-w-2xl mx-auto space-y-8">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">Aparência</h2>
        <p className="text-white/50 text-base">Personalize o visual e a experiência do seu perfil público.</p>
      </div>

      <MagicCard className="bg-black/40 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden p-6" gradientColor="rgba(168, 85, 247, 0.08)">
        <div className="space-y-1 mb-6">
          <h3 className="text-xl font-bold text-white">Mídias e Efeitos</h3>
          <p className="text-sm text-white/50">Cole os links diretos ou faça upload de imagens e áudios para seu perfil.</p>
        </div>
        <AppearanceForm profile={profileData} />
      </MagicCard>

      <MagicCard className="bg-black/40 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden p-6" gradientColor="rgba(59, 130, 246, 0.08)">
        <div className="space-y-1 mb-6">
          <h3 className="text-xl font-bold text-white">Estilização Avançada</h3>
          <p className="text-sm text-white/50">Controle total sobre o design do seu perfil.</p>
        </div>
        <AdvancedStylingForm uiConfigStr={profile.uiConfig} />
      </MagicCard>
    </DashboardPageTransition>
  );
}
