import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardPageTransition } from "@/components/dashboard/DashboardPageTransition";
import { MagicCard } from "@/components/magicui/magic-card";
import SettingsForm from "@/components/dashboard/SettingsForm";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const profile = await prisma.profile.findUnique({ where: { userId } });

  const profileData = {
    username: profile?.username || "",
    displayName: profile?.displayName || "",
    bio: profile?.bio || "",
    discordId: profile?.discordId || "",
  };

  return (
    <DashboardPageTransition className="max-w-2xl mx-auto space-y-8">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">Configurações</h2>
        <p className="text-white/50 text-base">Gerencie as informações básicas do seu perfil público.</p>
      </div>

      <MagicCard className="bg-black/40 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden p-6" gradientColor="rgba(239, 68, 68, 0.08)">
        <div className="space-y-1 mb-6">
          <h3 className="text-xl font-bold text-white">Perfil Público</h3>
          <p className="text-sm text-white/50">Como os outros verão você no site.</p>
        </div>
        <SettingsForm profile={profileData} />
      </MagicCard>
    </DashboardPageTransition>
  );
}
