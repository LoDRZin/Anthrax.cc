"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/utils/uploadthing";
import { updateAppearance } from "@/server/actions/appearance";
import "@uploadthing/react/styles.css";
import { motion } from "framer-motion";
import { Sparkles, Image as ImageIcon, Music, User, Wand2 } from "lucide-react";
import { toast } from "sonner";

type ProfileAppearanceData = {
  avatarUrl: string | null;
  backgroundUrl: string | null;
  audioUrl: string | null;
  effect: string | null;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
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
      toast.success("Avatar gerado por IA carregado!");
    };
    img.onerror = () => {
      setIsGeneratingAi(false);
      toast.error("Erro ao gerar imagem por IA.");
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
      toast.success("Aparência salva com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar aparência.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Avatar Section */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center gap-2 text-white/90">
            <User className="w-4 h-4 text-purple-400" />
            <Label htmlFor="avatarUrl" className="text-sm font-semibold tracking-wide uppercase">URL do Avatar</Label>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 w-full group">
              <Input 
                id="avatarUrl" 
                name="avatarUrl" 
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://imgur.com/sua-foto.png" 
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-purple-500/50 transition-all rounded-xl h-11 text-white placeholder-white/30 backdrop-blur-md" 
              />
              <div className="absolute inset-0 -z-10 bg-purple-500/0 rounded-xl blur-md group-focus-within:bg-purple-500/5 transition-all duration-300 pointer-events-none" />
            </div>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res?.[0]) {
                  setAvatarUrl(res[0].url);
                  toast.success("Avatar enviado com sucesso!");
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Erro no upload: ${error.message}`);
              }}
              appearance={{
                button: "bg-white/5 text-white hover:bg-white/10 border border-white/10 text-sm h-11 px-5 rounded-xl transition-all font-medium active:scale-95 cursor-pointer",
                allowedContent: "hidden"
              }}
              content={{
                button: "Upload Avatar"
              }}
            />
          </div>

          {/* IA Avatar Generation */}
          <div className="mt-4 p-5 border border-purple-500/10 rounded-2xl bg-purple-950/10 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <Label className="text-sm font-medium text-white/90">Ou gere um avatar único com IA 🪄</Label>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="ex: cyberpunk hacker neon cat, 8k resolution" 
                className="bg-black/50 border-white/10 focus:border-purple-500/50 rounded-xl h-10 text-white placeholder-white/30" 
              />
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleGenerateAiAvatar} 
                disabled={isGeneratingAi || !aiPrompt}
                className="h-10 px-5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white border-0 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingAi ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Gerando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    Gerar
                  </div>
                )}
              </Button>
            </div>
            <p className="text-xs text-purple-400/60 mt-2 font-mono">Imagens geradas instantaneamente via Pollinations.ai</p>
          </div>
        </motion.div>

        {/* Background URL */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center gap-2 text-white/90">
            <ImageIcon className="w-4 h-4 text-blue-400" />
            <Label htmlFor="backgroundUrl" className="text-sm font-semibold tracking-wide uppercase">URL do Background</Label>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 w-full group">
              <Input 
                id="backgroundUrl" 
                name="backgroundUrl" 
                value={backgroundUrl}
                onChange={(e) => setBackgroundUrl(e.target.value)}
                placeholder="https://imgur.com/seu-fundo.gif" 
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-blue-500/50 transition-all rounded-xl h-11 text-white placeholder-white/30 backdrop-blur-md" 
              />
              <div className="absolute inset-0 -z-10 bg-blue-500/0 rounded-xl blur-md group-focus-within:bg-blue-500/5 transition-all duration-300 pointer-events-none" />
            </div>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res?.[0]) {
                  setBackgroundUrl(res[0].url);
                  toast.success("Fundo enviado com sucesso!");
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Erro no upload: ${error.message}`);
              }}
              appearance={{
                button: "bg-white/5 text-white hover:bg-white/10 border border-white/10 text-sm h-11 px-5 rounded-xl transition-all font-medium active:scale-95 cursor-pointer",
                allowedContent: "hidden"
              }}
              content={{
                button: "Upload Fundo"
              }}
            />
          </div>
        </motion.div>

        {/* Audio URL */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center gap-2 text-white/90">
            <Music className="w-4 h-4 text-emerald-400" />
            <Label htmlFor="audioUrl" className="text-sm font-semibold tracking-wide uppercase">URL da Música de Fundo (.mp3)</Label>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 w-full group">
              <Input 
                id="audioUrl" 
                name="audioUrl" 
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://site.com/musica.mp3" 
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-emerald-500/50 transition-all rounded-xl h-11 text-white placeholder-white/30 backdrop-blur-md" 
              />
              <div className="absolute inset-0 -z-10 bg-emerald-500/0 rounded-xl blur-md group-focus-within:bg-emerald-500/5 transition-all duration-300 pointer-events-none" />
            </div>
            <UploadButton
              endpoint="audioUploader"
              onClientUploadComplete={(res) => {
                if (res?.[0]) {
                  setAudioUrl(res[0].url);
                  toast.success("Áudio enviado com sucesso!");
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Erro no upload: ${error.message}`);
              }}
              appearance={{
                button: "bg-white/5 text-white hover:bg-white/10 border border-white/10 text-sm h-11 px-5 rounded-xl transition-all font-medium active:scale-95 cursor-pointer",
                allowedContent: "hidden"
              }}
              content={{
                button: "Upload Áudio"
              }}
            />
          </div>
        </motion.div>

        {/* Particle Effect */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center gap-2 text-white/90">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <Label htmlFor="effect" className="text-sm font-semibold tracking-wide uppercase">Efeito de Partículas</Label>
          </div>
          <div className="relative group">
            <select 
              id="effect" 
              name="effect" 
              value={effect}
              onChange={(e) => setEffect(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-sm shadow-sm transition-all focus:outline-none focus:border-cyan-500/50 text-white backdrop-blur-md cursor-pointer appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat' }}
            >
              <option value="none" className="bg-[#0a0a0a] text-white">Nenhum</option>
              <option value="snow" className="bg-[#0a0a0a] text-white">Neve (Snow)</option>
              <option value="matrix" className="bg-[#0a0a0a] text-white">Matrix</option>
              <option value="fogo" className="bg-[#0a0a0a] text-white">Fogo</option>
              <option value="bolhas" className="bg-[#0a0a0a] text-white">Bolhas</option>
            </select>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div variants={itemVariants} className="pt-2">
          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl bg-white text-black hover:bg-white/90 font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 cursor-pointer" 
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Salvando...
              </div>
            ) : "Salvar Aparência"}
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
}
