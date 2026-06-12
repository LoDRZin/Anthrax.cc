"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { updateAppearance } from "@/server/actions/appearance";
import "@uploadthing/react/styles.css";

type ProfileAppearanceData = {
  avatarUrl: string | null;
  backgroundUrl: string | null;
  audioUrl: string | null;
  effect: string | null;
};

export default function AppearanceForm({ profile }: { profile: ProfileAppearanceData }) {
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [backgroundUrl, setBackgroundUrl] = useState(profile.backgroundUrl || "");
  const [audioUrl, setAudioUrl] = useState(profile.audioUrl || "");
  const [effect, setEffect] = useState(profile.effect || "none");
  const [isSaving, setIsSaving] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateAiAvatar = () => {
    if (!aiPrompt) return;
    setIsGeneratingAi(true);
    // Pollinations AI URL (free, no key needed)
    const encodedPrompt = encodeURIComponent(aiPrompt);
    const randomSeed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${randomSeed}`;
    
    // Test the image load
    const img = new globalThis.Image();
    img.src = url;
    img.onload = () => {
      setAvatarUrl(url);
      setIsGeneratingAi(false);
    };
    img.onerror = () => {
      setIsGeneratingAi(false);
      alert("Erro ao gerar imagem.");
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateAppearance({
        avatarUrl,
        backgroundUrl,
        audioUrl,
        effect,
      });
      // Poderia adicionar um toast de sucesso aqui
    } catch (error) {
      console.error(error);
      // toast de erro
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className="space-y-3">
        <Label htmlFor="avatarUrl">URL do Avatar</Label>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Input 
            id="avatarUrl" 
            name="avatarUrl" 
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://imgur.com/sua-foto.png" 
            className="bg-black/50 border-white/10 flex-1" 
          />
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res?.[0]) setAvatarUrl(res[0].url);
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
            appearance={{
              button: "bg-white/10 text-white hover:bg-white/20 border border-white/20 text-sm h-10 px-4 py-2",
              allowedContent: "hidden"
            }}
            content={{
              button: "Upload Avatar"
            }}
          />
        </div>

        {/* IA Avatar Generation */}
        <div className="mt-4 p-4 border border-white/10 rounded-xl bg-white/5 space-y-3">
          <Label>Ou gere um com Inteligência Artificial 🪄</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="ex: cyberpunk hacker neon cat, 8k resolution" 
              className="bg-black/50 border-white/10 flex-1" 
            />
            <Button type="button" variant="secondary" onClick={handleGenerateAiAvatar} disabled={isGeneratingAi || !aiPrompt}>
              {isGeneratingAi ? "Gerando..." : "Gerar Avatar"}
            </Button>
          </div>
          <p className="text-xs text-white/50">Imagens geradas instantaneamente via Pollinations.ai</p>
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="backgroundUrl">URL do Background</Label>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Input 
            id="backgroundUrl" 
            name="backgroundUrl" 
            value={backgroundUrl}
            onChange={(e) => setBackgroundUrl(e.target.value)}
            placeholder="https://imgur.com/seu-fundo.gif" 
            className="bg-black/50 border-white/10 flex-1" 
          />
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res?.[0]) setBackgroundUrl(res[0].url);
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
            appearance={{
              button: "bg-white/10 text-white hover:bg-white/20 border border-white/20 text-sm h-10 px-4 py-2",
              allowedContent: "hidden"
            }}
            content={{
              button: "Upload Fundo"
            }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="audioUrl">URL da Música de Fundo (.mp3)</Label>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Input 
            id="audioUrl" 
            name="audioUrl" 
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            placeholder="https://site.com/musica.mp3" 
            className="bg-black/50 border-white/10 flex-1" 
          />
          <UploadButton
            endpoint="audioUploader"
            onClientUploadComplete={(res) => {
              if (res?.[0]) setAudioUrl(res[0].url);
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
            appearance={{
              button: "bg-white/10 text-white hover:bg-white/20 border border-white/20 text-sm h-10 px-4 py-2",
              allowedContent: "hidden"
            }}
            content={{
              button: "Upload Áudio"
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="effect">Efeito de Partículas</Label>
        <select 
          id="effect" 
          name="effect" 
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          className="flex h-9 w-full rounded-md border border-white/10 bg-black/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-white"
        >
          <option value="none" className="bg-[#0a0a0a]">Nenhum</option>
          <option value="snow" className="bg-[#0a0a0a]">Neve (Snow)</option>
          <option value="matrix" className="bg-[#0a0a0a]">Matrix</option>
          <option value="fogo" className="bg-[#0a0a0a]">Fogo</option>
          <option value="bolhas" className="bg-[#0a0a0a]">Bolhas</option>
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={isSaving}>
        {isSaving ? "Salvando..." : "Salvar Aparência"}
      </Button>
    </form>
  );
}
