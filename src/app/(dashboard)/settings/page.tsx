import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { updateProfile } from "@/server/actions";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const profile = await prisma.profile.findUnique({ where: { userId } });

  async function saveProfile(formData: FormData) {
    "use server";
    const data = {
      username: formData.get("username") as string,
      displayName: formData.get("displayName") as string,
      bio: formData.get("bio") as string,
      discordId: formData.get("discordId") as string,
    };
    await updateProfile(data);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie as informações básicas do seu perfil público.</p>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Perfil Público</CardTitle>
          <CardDescription>
            Como os outros verão você no site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveProfile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username (URL)</Label>
              <div className="flex items-center">
                <span className="flex items-center px-3 h-10 bg-white/5 border border-white/10 border-r-0 rounded-l-md text-muted-foreground text-sm">
                  anthrax.cc/
                </span>
                <Input id="username" name="username" defaultValue={profile?.username || ""} placeholder="seunome" className="rounded-l-none bg-black/50 border-white/10 focus-visible:ring-primary" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Nome de Exibição</Label>
              <Input id="displayName" name="displayName" defaultValue={profile?.displayName || ""} placeholder="Como quer ser chamado?" className="bg-black/50 border-white/10 focus-visible:ring-primary" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea id="bio" name="bio" defaultValue={profile?.bio || ""} placeholder="Uma breve descrição sobre você..." className="bg-black/50 border-white/10" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discordId">Discord ID (Lanyard)</Label>
              <Input id="discordId" name="discordId" defaultValue={profile?.discordId || ""} placeholder="Ex: 123456789012345678" className="bg-black/50 border-white/10" />
              <p className="text-xs text-muted-foreground mt-1">
                Para o status funcionar, você precisa entrar no servidor Discord do Lanyard.
              </p>
            </div>

            <Button type="submit" className="w-full sm:w-auto">Salvar Alterações</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
