import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AppearanceForm from "@/components/dashboard/AppearanceForm";
import AdvancedStylingForm from "@/components/dashboard/AdvancedStylingForm";

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
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Aparência</h2>
        <p className="text-muted-foreground">Personalize o visual e a experiência do seu perfil público.</p>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Mídias e Efeitos</CardTitle>
          <CardDescription>Cole os links diretos ou faça upload de imagens e áudios para seu perfil.</CardDescription>
        </CardHeader>
        <CardContent>
          <AppearanceForm profile={profileData} />
        </CardContent>
      </Card>
      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Estilização Avançada</CardTitle>
          <CardDescription>Controle total sobre o design do seu perfil (Parte 1).</CardDescription>
        </CardHeader>
        <CardContent>
          <AdvancedStylingForm uiConfigStr={profile.uiConfig} />
        </CardContent>
      </Card>
    </div>
  );
}
