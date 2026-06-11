import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getLinks, createLink } from "@/server/actions/links";
import { createMusicWidget } from "@/server/actions/widgets";
import LinksList from "@/components/dashboard/LinksList";
import { Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function LinksPage() {
  const links = await getLinks();

  async function addLink(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    if (!title || !url) return;
    await createLink({ title, url });
    revalidatePath("/links");
  }

  async function addWidget(formData: FormData) {
    "use server";
    const type = formData.get("type") as "spotify" | "soundcloud";
    const url = formData.get("url") as string;
    if (!type || !url) return;
    await createMusicWidget(type, url);
    revalidatePath("/links");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Seus Links</h2>
        <p className="text-muted-foreground">Gerencie e reordene os links que aparecerão no seu perfil público.</p>
      </div>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Adicionar Novo Link</CardTitle>
          <CardDescription>Insira a URL e um título atrativo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addLink} className="flex flex-col sm:flex-row gap-4">
            <Input name="title" placeholder="Título (ex: Meu Discord)" className="flex-1 bg-black/50 border-white/10" required />
            <Input name="url" type="url" placeholder="https://..." className="flex-1 bg-black/50 border-white/10" required />
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Link
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Adicionar Widget de Música (Spotify/SoundCloud)</CardTitle>
          <CardDescription>Cole o link direto da música ou playlist para criar um player na sua página.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addWidget} className="flex flex-col sm:flex-row gap-4">
            <select name="type" className="flex h-9 w-full sm:w-[150px] rounded-md border border-white/10 bg-black/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-white">
              <option value="spotify" className="bg-[#0a0a0a]">Spotify</option>
              <option value="soundcloud" className="bg-[#0a0a0a]">SoundCloud</option>
            </select>
            <Input name="url" type="url" placeholder="URL da música (Ex: https://open.spotify.com/...)" className="flex-1 bg-black/50 border-white/10" required />
            <Button type="submit" variant="secondary">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Widget
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {links.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-white/10 rounded-xl">
            <p className="text-muted-foreground">Você ainda não tem nenhum link.</p>
          </div>
        ) : (
          <LinksList initialLinks={links} />
        )}
      </div>
    </div>
  );
}
