"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateAdvancedStyling } from "@/server/actions/appearance";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Palette, Volume2, Sparkles, Type, Beaker } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
};

export default function AdvancedStylingForm({ uiConfigStr }: { uiConfigStr: string | null }) {
  const [config, setConfig] = useState(() => {
    try {
      if (uiConfigStr) return JSON.parse(uiConfigStr);
    } catch {}
    return {
      layout: "default",
      cursorStyle: "default",
      borderRadius: "12px",
      glowColor: "rgba(255,255,255,0.1)",
      accentColor: "#ffffff",
      glassIntensity: "10px",
      noiseOverlay: false,
      customCss: "",
      videoBgUrl: "",
      playerStyle: "minimalist",
      playerPosition: "bottom-center",
      reverbEffect: false,
      nightAudioUrl: "",
      loadingText: "Click to Enter",
      enterAnimation: "fade",
      // Part 3
      enable3dTilt: false,
      typewriterBio: false,
      glitchAvatar: false,
      avatarPulse: false,
      linkHoverEffect: "default",
      particleInteraction: false,
      staggeredEntry: false,
      confettiEnabled: true,
      // Part 6
      fontFamily: "Inter",
      textShadow: "",
      letterSpacing: "normal",
      lineHeight: "1.5",
      textAlign: "center",
      textTransform: "none",
      textGradient: "",
      rotatingBio: false,
      rotatingWords: "Designer, Developer, Creator",
      monoFont: false,
      // Part 7
      enableGuestbook: false,
      enableRating: false,
      enableVisitorThemes: false,
      enableFocusMode: false,
      manualStatus: ""
    };
  });

  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateAdvancedStyling(JSON.stringify(config));
      toast.success("Estilos avançados salvos com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar estilos avançados");
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
        className="space-y-10"
      >
        {/* 1. ESTILOS VISUAIS */}
        <motion.div variants={itemVariants} className="p-6 border border-white/5 bg-white/[0.02] rounded-2xl space-y-6 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 opacity-60" />
          
          <div className="flex items-center gap-2 mb-2 text-white">
            <Palette className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold tracking-wide">1. Estilos Visuais</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Layout dos Links</Label>
              <Select value={config.layout || "default"} onValueChange={(val) => updateField("layout", val)}>
                <SelectTrigger className="bg-black/40 border-white/10 hover:border-white/20 focus:border-purple-500/50 rounded-xl h-11 text-white">
                  <SelectValue placeholder="Selecione o layout" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                  <SelectItem value="default" className="focus:bg-white/10 focus:text-white cursor-pointer">Lista Vertical</SelectItem>
                  <SelectItem value="grid" className="focus:bg-white/10 focus:text-white cursor-pointer">Grid (Lado a Lado)</SelectItem>
                  <SelectItem value="masonry" className="focus:bg-white/10 focus:text-white cursor-pointer">Masonry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Estilo do Cursor</Label>
              <Select value={config.cursorStyle || "default"} onValueChange={(val) => updateField("cursorStyle", val)}>
                <SelectTrigger className="bg-black/40 border-white/10 hover:border-white/20 focus:border-purple-500/50 rounded-xl h-11 text-white">
                  <SelectValue placeholder="Selecione o cursor" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                  <SelectItem value="default" className="focus:bg-white/10 focus:text-white cursor-pointer">Padrão</SelectItem>
                  <SelectItem value="glow" className="focus:bg-white/10 focus:text-white cursor-pointer">Glow Follower</SelectItem>
                  <SelectItem value="ring" className="focus:bg-white/10 focus:text-white cursor-pointer">Anel Dinâmico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Cor de Destaque (Accent)</Label>
              <div className="flex gap-3">
                <Input 
                  type="color" 
                  value={config.accentColor || "#ffffff"} 
                  onChange={(e) => updateField("accentColor", e.target.value)}
                  className="w-14 h-11 p-1 bg-black/40 border-white/10 rounded-xl cursor-pointer"
                />
                <Input 
                  value={config.accentColor || "#ffffff"} 
                  onChange={(e) => updateField("accentColor", e.target.value)}
                  className="flex-1 bg-black/40 border-white/10 hover:border-white/20 focus:border-purple-500/50 rounded-xl h-11 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Cor da Sombra (Glow)</Label>
              <Input 
                value={config.glowColor || "rgba(255,255,255,0.1)"} 
                onChange={(e) => updateField("glowColor", e.target.value)}
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-purple-500/50 rounded-xl h-11 text-white font-mono"
                placeholder="rgba(255,255,255,0.1) ou #ff00ff"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Arredondamento das Bordas</Label>
              <Input 
                value={config.borderRadius || "12px"} 
                onChange={(e) => updateField("borderRadius", e.target.value)}
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-purple-500/50 rounded-xl h-11 text-white font-mono"
                placeholder="Ex: 0px, 12px, 9999px"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Intensidade do Vidro (Blur)</Label>
              <Input 
                value={config.glassIntensity || "10px"} 
                onChange={(e) => updateField("glassIntensity", e.target.value)}
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-purple-500/50 rounded-xl h-11 text-white font-mono"
                placeholder="Ex: 10px"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-white/80 font-medium">Fundo em Vídeo (URL)</Label>
              <Input 
                value={config.videoBgUrl || ""} 
                onChange={(e) => updateField("videoBgUrl", e.target.value)}
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-purple-500/50 rounded-xl h-11 text-white"
                placeholder="https://..."
              />
              <p className="text-xs text-white/45">Para rodar em loop no fundo da sua página.</p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-white/80 font-medium">CSS Customizado (Pro)</Label>
              <Textarea 
                value={config.customCss || ""} 
                onChange={(e) => updateField("customCss", e.target.value)}
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-purple-500/50 rounded-xl font-mono text-sm min-h-[110px] text-white"
                placeholder=".meu-botao { color: red; }"
              />
            </div>

            <div className="space-y-2 sm:col-span-2 flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Filtro de Ruído (VHS Noise)</Label>
                <p className="text-xs text-white/50">Adiciona uma textura granulada por cima do perfil.</p>
              </div>
              <Switch 
                checked={!!config.noiseOverlay}
                onCheckedChange={(checked) => updateField("noiseOverlay", checked)}
              />
            </div>
          </div>
        </motion.div>

        {/* 2. ÁUDIO E PLAYER */}
        <motion.div variants={itemVariants} className="p-6 border border-white/5 bg-white/[0.02] rounded-2xl space-y-6 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500 opacity-60" />

          <div className="flex items-center gap-2 mb-2 text-white">
            <Volume2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold tracking-wide">2. Áudio e Player</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Estilo do Player</Label>
              <Select value={config.playerStyle || "minimalist"} onValueChange={(val) => updateField("playerStyle", val)}>
                <SelectTrigger className="bg-black/40 border-white/10 hover:border-white/20 focus:border-cyan-500/50 rounded-xl h-11 text-white">
                  <SelectValue placeholder="Selecione o estilo" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                  <SelectItem value="minimalist" className="focus:bg-white/10 focus:text-white cursor-pointer">Minimalista</SelectItem>
                  <SelectItem value="neon" className="focus:bg-white/10 focus:text-white cursor-pointer">Neon (Glow)</SelectItem>
                  <SelectItem value="retro" className="focus:bg-white/10 focus:text-white cursor-pointer">Retrô (Pixel)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Posição do Player</Label>
              <Select value={config.playerPosition || "bottom-center"} onValueChange={(val) => updateField("playerPosition", val)}>
                <SelectTrigger className="bg-black/40 border-white/10 hover:border-white/20 focus:border-cyan-500/50 rounded-xl h-11 text-white">
                  <SelectValue placeholder="Selecione a posição" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                  <SelectItem value="bottom-center" className="focus:bg-white/10 focus:text-white cursor-pointer">Inferior Central</SelectItem>
                  <SelectItem value="bottom-left" className="focus:bg-white/10 focus:text-white cursor-pointer">Inferior Esquerdo</SelectItem>
                  <SelectItem value="top-right" className="focus:bg-white/10 focus:text-white cursor-pointer">Superior Direito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Texto de Entrada</Label>
              <Input 
                value={config.loadingText || "Click to Enter"} 
                onChange={(e) => updateField("loadingText", e.target.value)}
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-cyan-500/50 rounded-xl h-11 text-white"
                placeholder="Ex: Click to Enter"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Animação de Entrada</Label>
              <Select value={config.enterAnimation || "fade"} onValueChange={(val) => updateField("enterAnimation", val)}>
                <SelectTrigger className="bg-black/40 border-white/10 hover:border-white/20 focus:border-cyan-500/50 rounded-xl h-11 text-white">
                  <SelectValue placeholder="Selecione a animação" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                  <SelectItem value="fade" className="focus:bg-white/10 focus:text-white cursor-pointer">Fade Suave</SelectItem>
                  <SelectItem value="zoom" className="focus:bg-white/10 focus:text-white cursor-pointer">Zoom Out</SelectItem>
                  <SelectItem value="glitch" className="focus:bg-white/10 focus:text-white cursor-pointer">Glitch Attack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-white/80 font-medium">Música Noturna (URL - Opcional)</Label>
              <Input 
                value={config.nightAudioUrl || ""} 
                onChange={(e) => updateField("nightAudioUrl", e.target.value)}
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-cyan-500/50 rounded-xl h-11 text-white"
                placeholder="https://..."
              />
              <p className="text-xs text-white/45">Se preenchido, o site tocará essa música de noite (18h-06h) em vez da música principal.</p>
            </div>

            <div className="space-y-2 sm:col-span-2 flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Efeito de Áudio 3D (Reverb/Catedral)</Label>
                <p className="text-xs text-white/50">Aplica eco ao áudio de fundo usando Web Audio API.</p>
              </div>
              <Switch 
                checked={!!config.reverbEffect}
                onCheckedChange={(checked) => updateField("reverbEffect", checked)}
              />
            </div>
          </div>
        </motion.div>

        {/* 3. INTERATIVIDADE E ANIMAÇÕES */}
        <motion.div variants={itemVariants} className="p-6 border border-white/5 bg-white/[0.02] rounded-2xl space-y-6 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60" />

          <div className="flex items-center gap-2 mb-2 text-white">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold tracking-wide">3. Interatividade e Animações</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-white/80 font-medium">Efeito Hover nos Links</Label>
              <Select value={config.linkHoverEffect || "default"} onValueChange={(val) => updateField("linkHoverEffect", val)}>
                <SelectTrigger className="bg-black/40 border-white/10 hover:border-white/20 focus:border-emerald-500/50 rounded-xl h-11 text-white">
                  <SelectValue placeholder="Selecione o efeito" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                  <SelectItem value="default" className="focus:bg-white/10 focus:text-white cursor-pointer">Magnético (Padrão)</SelectItem>
                  <SelectItem value="glow" className="focus:bg-white/10 focus:text-white cursor-pointer">Glow Intensivo</SelectItem>
                  <SelectItem value="ripple" className="focus:bg-white/10 focus:text-white cursor-pointer">Ripple (Ondas)</SelectItem>
                  <SelectItem value="shake" className="focus:bg-white/10 focus:text-white cursor-pointer">Tremor (Shake)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Tilt 3D no Hover</Label>
                <p className="text-xs text-white/50">O card do perfil se inclina com o mouse.</p>
              </div>
              <Switch checked={!!config.enable3dTilt} onCheckedChange={(val) => updateField("enable3dTilt", val)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Bio Digitada (Typewriter)</Label>
                <p className="text-xs text-white/50">Digita a bio letra por letra.</p>
              </div>
              <Switch checked={!!config.typewriterBio} onCheckedChange={(val) => updateField("typewriterBio", val)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Avatar Pulsante</Label>
                <p className="text-xs text-white/50">Borda respira suavemente.</p>
              </div>
              <Switch checked={!!config.avatarPulse} onCheckedChange={(val) => updateField("avatarPulse", val)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Avatar Glitch Hover</Label>
                <p className="text-xs text-white/50">Efeito de falha digital no mouse.</p>
              </div>
              <Switch checked={!!config.glitchAvatar} onCheckedChange={(val) => updateField("glitchAvatar", val)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Entrada em Cascata</Label>
                <p className="text-xs text-white/50">Links entram um por um.</p>
              </div>
              <Switch checked={!!config.staggeredEntry} onCheckedChange={(val) => updateField("staggeredEntry", val)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Explosão de Confete</Label>
                <p className="text-xs text-white/50">Ao clicar em botões no perfil.</p>
              </div>
              <Switch checked={!!config.confettiEnabled} onCheckedChange={(val) => updateField("confettiEnabled", val)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors sm:col-span-2">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Partículas Repelidas</Label>
                <p className="text-xs text-white/50">Neve/Matrix fogem do cursor do mouse.</p>
              </div>
              <Switch checked={!!config.particleInteraction} onCheckedChange={(val) => updateField("particleInteraction", val)} />
            </div>
          </div>
        </motion.div>

        {/* 4. TIPOGRAFIA E TEXTO */}
        <motion.div variants={itemVariants} className="p-6 border border-white/5 bg-white/[0.02] rounded-2xl space-y-6 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500 to-red-500 opacity-60" />

          <div className="flex items-center gap-2 mb-2 text-white">
            <Type className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-bold tracking-wide">4. Tipografia e Texto</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Fonte Principal (Google Fonts)</Label>
              <Select value={config.fontFamily || "Inter"} onValueChange={(val) => updateField("fontFamily", val)}>
                <SelectTrigger className="bg-black/40 border-white/10 hover:border-white/20 focus:border-orange-500/50 rounded-xl h-11 text-white">
                  <SelectValue placeholder="Selecione a fonte" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                  <SelectItem value="Inter" className="focus:bg-white/10 focus:text-white cursor-pointer">Inter (Padrão)</SelectItem>
                  <SelectItem value="Roboto" className="focus:bg-white/10 focus:text-white cursor-pointer">Roboto</SelectItem>
                  <SelectItem value="Playfair Display" className="focus:bg-white/10 focus:text-white cursor-pointer">Playfair Display (Elegante)</SelectItem>
                  <SelectItem value="Outfit" className="focus:bg-white/10 focus:text-white cursor-pointer">Outfit (Moderna)</SelectItem>
                  <SelectItem value="Fira Code" className="focus:bg-white/10 focus:text-white cursor-pointer">Fira Code (Dev)</SelectItem>
                  <SelectItem value="Space Grotesk" className="focus:bg-white/10 focus:text-white cursor-pointer">Space Grotesk</SelectItem>
                  <SelectItem value="Syne" className="focus:bg-white/10 focus:text-white cursor-pointer">Syne (Arrojada)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Alinhamento do Texto</Label>
              <Select value={config.textAlign || "center"} onValueChange={(val) => updateField("textAlign", val)}>
                <SelectTrigger className="bg-black/40 border-white/10 hover:border-white/20 focus:border-orange-500/50 rounded-xl h-11 text-white">
                  <SelectValue placeholder="Alinhamento" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                  <SelectItem value="left" className="focus:bg-white/10 focus:text-white cursor-pointer">Esquerda</SelectItem>
                  <SelectItem value="center" className="focus:bg-white/10 focus:text-white cursor-pointer">Centro</SelectItem>
                  <SelectItem value="right" className="focus:bg-white/10 focus:text-white cursor-pointer">Direita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Espaçamento de Letras (Tracking)</Label>
              <Input 
                value={config.letterSpacing || "normal"} 
                onChange={(e) => updateField("letterSpacing", e.target.value)}
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-orange-500/50 rounded-xl h-11 text-white font-mono"
                placeholder="ex: normal, 1px, 0.1em"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Altura da Linha (Line-height)</Label>
              <Input 
                value={config.lineHeight || "1.5"} 
                onChange={(e) => updateField("lineHeight", e.target.value)}
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-orange-500/50 rounded-xl h-11 text-white font-mono"
                placeholder="ex: 1.5, 2, 150%"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Caixa do Texto</Label>
              <Select value={config.textTransform || "none"} onValueChange={(val) => updateField("textTransform", val)}>
                <SelectTrigger className="bg-black/40 border-white/10 hover:border-white/20 focus:border-orange-500/50 rounded-xl h-11 text-white">
                  <SelectValue placeholder="Caixa do texto" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-white/10 text-white backdrop-blur-xl">
                  <SelectItem value="none" className="focus:bg-white/10 focus:text-white cursor-pointer">Padrão</SelectItem>
                  <SelectItem value="uppercase" className="focus:bg-white/10 focus:text-white cursor-pointer">TUDO MAIÚSCULO</SelectItem>
                  <SelectItem value="lowercase" className="focus:bg-white/10 focus:text-white cursor-pointer">tudo minúsculo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80 font-medium">Gradiente no Nome (Opcional)</Label>
              <Input 
                value={config.textGradient || ""} 
                onChange={(e) => updateField("textGradient", e.target.value)}
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-orange-500/50 rounded-xl h-11 text-white"
                placeholder="ex: linear-gradient(to right, #ff0000, #00ff00)"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label className="text-white/80 font-medium">Sombra/Brilho no Texto (Text Shadow)</Label>
              <Input 
                value={config.textShadow || ""} 
                onChange={(e) => updateField("textShadow", e.target.value)}
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-orange-500/50 rounded-xl h-11 text-white font-mono"
                placeholder="ex: 0 0 10px rgba(255,255,255,0.5)"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Forçar Fonte Monoespaçada</Label>
                <p className="text-xs text-white/50">Aplica estilo de código em toda a página.</p>
              </div>
              <Switch checked={!!config.monoFont} onCheckedChange={(val) => updateField("monoFont", val)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Bio com Palavras Rotativas</Label>
                <p className="text-xs text-white/50">Gira palavras pré-definidas na sua bio.</p>
              </div>
              <Switch checked={!!config.rotatingBio} onCheckedChange={(val) => updateField("rotatingBio", val)} />
            </div>

            {config.rotatingBio && (
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-white/80 font-medium">Palavras Rotativas (separadas por vírgula)</Label>
                <Input 
                  value={config.rotatingWords || ""} 
                  onChange={(e) => updateField("rotatingWords", e.target.value)}
                  className="bg-black/40 border-white/10 hover:border-white/20 focus:border-orange-500/50 rounded-xl h-11 text-white"
                  placeholder="ex: Designer, Developer, Creator"
                />
                <p className="text-xs text-white/45">Coloque um par de chaves {'{}'} na sua Bio real onde as palavras devem aparecer!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* 5. EXPERIMENTAL */}
        <motion.div variants={itemVariants} className="p-6 border border-white/5 bg-white/[0.02] rounded-2xl space-y-6 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-500 to-amber-500 opacity-60" />

          <div className="flex items-center gap-2 mb-2 text-white">
            <Beaker className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold tracking-wide">5. Experimental</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-white/80 font-medium">Status Manual (Aparece no topo do perfil)</Label>
              <Input 
                value={config.manualStatus || ""} 
                onChange={(e) => updateField("manualStatus", e.target.value)}
                className="bg-black/40 border-white/10 hover:border-white/20 focus:border-yellow-500/50 rounded-xl h-11 text-white"
                placeholder="ex: 🌙 Dormindo, 💻 Codando, 🎮 Jogando Valorant"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Mural de Recados (Guestbook)</Label>
                <p className="text-xs text-white/50">Permitir que visitantes deixem mensagens públicas.</p>
              </div>
              <Switch checked={!!config.enableGuestbook} onCheckedChange={(val) => updateField("enableGuestbook", val)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Sistema de Avaliação</Label>
                <p className="text-xs text-white/50">Visitantes podem avaliar com 5 estrelas.</p>
              </div>
              <Switch checked={!!config.enableRating} onCheckedChange={(val) => updateField("enableRating", val)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Temas do Visitante</Label>
                <p className="text-xs text-white/50">Mostra o botão Sol/Lua para inverter as cores.</p>
              </div>
              <Switch checked={!!config.enableVisitorThemes} onCheckedChange={(val) => updateField("enableVisitorThemes", val)} />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
              <div>
                <Label className="text-white/90 font-semibold cursor-pointer">Modo Foco (Zen)</Label>
                <p className="text-xs text-white/50">Permitir esconder animações e widgets pesados.</p>
              </div>
              <Switch checked={!!config.enableFocusMode} onCheckedChange={(val) => updateField("enableFocusMode", val)} />
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div variants={itemVariants} className="pt-4">
          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl bg-white text-black hover:bg-white/90 font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 cursor-pointer"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Salvando Estilos...
              </div>
            ) : "Salvar Estilos Avançados"}
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
}
