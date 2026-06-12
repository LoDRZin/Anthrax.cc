import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getLinks, createLink } from "@/server/actions/links";
import { createWidget } from "@/server/actions/widgets";
import LinksList from "@/components/dashboard/LinksList";
import { Plus, Link2, LayoutGrid } from "lucide-react";
import { revalidatePath } from "next/cache";
import { DashboardPageTransition } from "@/components/dashboard/DashboardPageTransition";
import { MagicCard } from "@/components/magicui/magic-card";

export default async function LinksPage() {
  const links = await getLinks();

  async function addLink(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const icon = formData.get("icon") as string;
    if (!title || !url) return;
    await createLink({ title, url, icon: icon !== "none" ? icon : undefined });
    revalidatePath("/links");
  }

  async function addWidgetForm(formData: FormData) {
    "use server";
    const type = formData.get("type") as string;
    const inputData = formData.get("inputData") as string;
    if (!type || !inputData) return;

    let configObj: any = {};
    if (["spotify", "soundcloud", "youtube", "html", "notion"].includes(type)) {
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
    <DashboardPageTransition className="max-w-2xl mx-auto space-y-8">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">Seus Links</h2>
        <p className="text-white/50 text-base">Gerencie e reordene os links e widgets que aparecerão no seu perfil público.</p>
      </div>

      {/* Adicionar Novo Link */}
      <MagicCard className="bg-black/40 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden p-6" gradientColor="rgba(59, 130, 246, 0.08)">
        <div className="flex items-center gap-2 mb-1.5 text-white">
          <Link2 className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-bold">Adicionar Novo Link</h3>
        </div>
        <p className="text-sm text-white/50 mb-6">Insira a URL e um título atrativo.</p>
        
        <form action={addLink} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-[160px] relative">
              <select 
                name="icon" 
                className="flex h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-sm shadow-sm transition-all focus:outline-none focus:border-blue-500/50 text-white backdrop-blur-md cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat' }}
              >
                <option value="none" className="bg-[#0a0a0a] text-white">Ícone...</option>
                <option value="Instagram" className="bg-[#0a0a0a] text-white">Instagram</option>
                <option value="Twitter" className="bg-[#0a0a0a] text-white">Twitter</option>
                <option value="Github" className="bg-[#0a0a0a] text-white">GitHub</option>
                <option value="Youtube" className="bg-[#0a0a0a] text-white">YouTube</option>
                <option value="Globe" className="bg-[#0a0a0a] text-white">Site</option>
                <option value="Mail" className="bg-[#0a0a0a] text-white">Email</option>
                <option value="ShoppingBag" className="bg-[#0a0a0a] text-white">Loja</option>
              </select>
            </div>
            <Input 
              name="title" 
              placeholder="Título (ex: Meu Discord)" 
              className="flex-1 bg-black/40 border-white/10 hover:border-white/20 focus:border-blue-500/50 transition-all rounded-xl h-11 text-white placeholder-white/30 backdrop-blur-md" 
              required 
            />
            <Input 
              name="url" 
              type="url" 
              placeholder="https://..." 
              className="flex-1 bg-black/40 border-white/10 hover:border-white/20 focus:border-blue-500/50 transition-all rounded-xl h-11 text-white placeholder-white/30 backdrop-blur-md" 
              required 
            />
          </div>
          <Button type="submit" className="w-full h-11 rounded-xl bg-white text-black hover:bg-white/90 font-bold transition-all active:scale-[0.99] cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Link
          </Button>
        </form>
      </MagicCard>

      {/* Adicionar Widget Especial */}
      <MagicCard className="bg-black/40 border border-white/5 backdrop-blur-md rounded-2xl overflow-hidden p-6" gradientColor="rgba(168, 85, 247, 0.08)">
        <div className="flex items-center gap-2 mb-1.5 text-white">
          <LayoutGrid className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-bold">Adicionar Widget Especial</h3>
        </div>
        <p className="text-sm text-white/50 mb-6">Incorpore players, gráficos e módulos interativos na sua página.</p>
        
        <form action={addWidgetForm} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-[220px] relative">
              <select 
                name="type" 
                className="flex h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-sm shadow-sm transition-all focus:outline-none focus:border-purple-500/50 text-white backdrop-blur-md cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat' }}
              >
                <optgroup label="Música & Vídeo" className="bg-[#0a0a0a] text-white">
                  <option value="spotify" className="text-white">Spotify (URL)</option>
                  <option value="soundcloud" className="text-white">SoundCloud (URL)</option>
                  <option value="youtube" className="text-white">YouTube (URL)</option>
                  <option value="twitch" className="text-white">Twitch (Username)</option>
                </optgroup>
                <optgroup label="Desenvolvedor" className="bg-[#0a0a0a] text-white">
                  <option value="github" className="text-white">GitHub Chart (Username)</option>
                  <option value="html" className="text-white">Custom HTML (Code)</option>
                </optgroup>
                <optgroup label="Utilitários" className="bg-[#0a0a0a] text-white">
                  <option value="crypto" className="text-white">Cripto Ticker (Qualquer valor)</option>
                  <option value="countdown" className="text-white">Contagem (Data ISO ex: 2026-12-31)</option>
                  <option value="notion" className="text-white">Notion Page (URL pública)</option>
                </optgroup>
              </select>
            </div>
            <Input 
              name="inputData" 
              placeholder="Depende do Widget (Username, URL, Data ou Código HTML)" 
              className="flex-1 bg-black/40 border-white/10 hover:border-white/20 focus:border-purple-500/50 transition-all rounded-xl h-11 text-white placeholder-white/30 backdrop-blur-md" 
              required 
            />
          </div>
          <Button type="submit" className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all active:scale-[0.99] cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Widget
          </Button>
        </form>
      </MagicCard>

      <div className="space-y-4">
        {links.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-white/10 rounded-2xl bg-black/20 backdrop-blur-sm">
            <p className="text-white/40 text-sm">Você ainda não tem nenhum link ou widget.</p>
          </div>
        ) : (
          <LinksList initialLinks={links} />
        )}
      </div>
    </DashboardPageTransition>
  );
}
