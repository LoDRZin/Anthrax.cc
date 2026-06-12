import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AppearanceForm from "@/components/dashboard/AppearanceForm";
import { DashboardPageTransition } from "@/components/dashboard/DashboardPageTransition";

export default async function AppearancePage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) redirect("/settings");

  const profileData = {
    displayName: profile.displayName || "",
    username: profile.username || "",
    bio: profile.bio || "",
    avatarUrl: profile.avatarUrl || "",
    backgroundUrl: profile.backgroundUrl || "",
    audioUrl: profile.audioUrl || "",
    effect: profile.effect || "none",
    uiConfig: profile.uiConfig || "",
  };

  return (
    <DashboardPageTransition className="space-y-6">
      <div className="flex flex-col gap-1 select-none">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Aparência do Perfil
        </h2>
        <p className="text-white/50 text-xs md:text-sm">
          Personalize as mídias, cores, tipografia, efeitos e widgets do seu perfil público.
        </p>
      </div>

      <AppearanceForm profile={profileData} />
    </DashboardPageTransition>
  );
}
