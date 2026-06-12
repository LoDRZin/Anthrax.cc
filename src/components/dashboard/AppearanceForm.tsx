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
