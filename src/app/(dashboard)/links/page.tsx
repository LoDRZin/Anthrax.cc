import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getLinks, createLink } from "@/server/actions/links";
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
          <form action={addLink} className="flex gap-4">
            <Input name="title" placeholder="Título (ex: Meu Discord)" className="flex-1 bg-black/50 border-white/10" required />
            <Input name="url" type="url" placeholder="https://..." className="flex-1 bg-black/50 border-white/10" required />
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
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
