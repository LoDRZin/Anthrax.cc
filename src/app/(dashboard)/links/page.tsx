import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getLinks, createLink } from "@/server/actions/links";
import { createWidget } from "@/server/actions/widgets";
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

  async function addWidgetForm(formData: FormData) {
    "use server";
    const type = formData.get("type") as string;
    const inputData = formData.get("inputData") as string;
    if (!type || !inputData) return;

    let configObj: any = {};
    if (["spotify", "soundcloud", "youtube", "html"].includes(type)) {
      configObj = type === "html" ? { html: inputData } : { url: inputData };
    } else if (["github", "twitch"].includes(type)) {
      configObj = { username: inputData };
    } else if (type === "countdown") {
      configObj = { targetDate: inputData, title: "Contagem Regressiva" };
    } else {
      configObj = { value: inputData };
    }

    await createWidget(type, configObj);
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
          <CardTitle>Adicionar Widget Especial</CardTitle>
          <CardDescription>Incorpore players, gráficos e módulos interativos na sua página.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addWidgetForm} className="flex flex-col sm:flex-row gap-4">
            <select name="type" className="flex h-9 w-full sm:w-[200px] rounded-md border border-white/10 bg-black/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-white">
              <optgroup label="Música & Vídeo" className="bg-[#0a0a0a]">
                <option value="spotify">Spotify (URL)</option>
                <option value="soundcloud">SoundCloud (URL)</option>
                <option value="youtube">YouTube (URL)</option>
                <option value="twitch">Twitch (Username)</option>
              </optgroup>
              <optgroup label="Desenvolvedor" className="bg-[#0a0a0a]">
                <option value="github">GitHub Chart (Username)</option>
                <option value="html">Custom HTML (Code)</option>
              </optgroup>
              <optgroup label="Utilitários" className="bg-[#0a0a0a]">
                <option value="crypto">Cripto Ticker (Qualquer valor)</option>
                <option value="countdown">Contagem (Data ISO ex: 2026-12-31)</option>
              </optgroup>
            </select>
            <Input name="inputData" placeholder="Depende do Widget (Username, URL, Data ou Código HTML)" className="flex-1 bg-black/50 border-white/10" required />
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
