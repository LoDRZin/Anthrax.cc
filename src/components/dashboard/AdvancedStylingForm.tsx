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
      monoFont: false
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Layout */}
        <div className="space-y-3">
          <Label>Layout dos Links</Label>
          <Select value={config.layout || "default"} onValueChange={(val) => updateField("layout", val)}>
            <SelectTrigger className="bg-black/50 border-white/10">
              <SelectValue placeholder="Selecione o layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Lista Vertical</SelectItem>
              <SelectItem value="grid">Grid (Lado a Lado)</SelectItem>
              <SelectItem value="masonry">Masonry</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cursor */}
        <div className="space-y-3">
          <Label>Estilo do Cursor</Label>
          <Select value={config.cursorStyle || "default"} onValueChange={(val) => updateField("cursorStyle", val)}>
            <SelectTrigger className="bg-black/50 border-white/10">
              <SelectValue placeholder="Selecione o cursor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Padrão</SelectItem>
              <SelectItem value="glow">Glow Follower</SelectItem>
              <SelectItem value="ring">Anel Dinâmico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Accent Color */}
        <div className="space-y-3">
          <Label>Cor de Destaque (Accent)</Label>
          <div className="flex gap-3">
            <Input 
              type="color" 
              value={config.accentColor || "#ffffff"} 
              onChange={(e) => updateField("accentColor", e.target.value)}
              className="w-16 h-10 p-1 bg-black/50 border-white/10"
            />
            <Input 
              value={config.accentColor || "#ffffff"} 
              onChange={(e) => updateField("accentColor", e.target.value)}
              className="flex-1 bg-black/50 border-white/10"
            />
          </div>
        </div>

        {/* Glow Color */}
        <div className="space-y-3">
          <Label>Cor da Sombra (Glow)</Label>
          <Input 
            value={config.glowColor || "rgba(255,255,255,0.1)"} 
            onChange={(e) => updateField("glowColor", e.target.value)}
            className="bg-black/50 border-white/10"
            placeholder="rgba(255,255,255,0.1) ou #ff00ff"
          />
        </div>

        {/* Border Radius */}
        <div className="space-y-3">
          <Label>Arredondamento das Bordas</Label>
          <Input 
            value={config.borderRadius || "12px"} 
            onChange={(e) => updateField("borderRadius", e.target.value)}
            className="bg-black/50 border-white/10"
            placeholder="Ex: 0px, 12px, 9999px"
          />
        </div>

        {/* Glass Intensity */}
        <div className="space-y-3">
          <Label>Intensidade do Vidro (Blur)</Label>
          <Input 
            value={config.glassIntensity || "10px"} 
            onChange={(e) => updateField("glassIntensity", e.target.value)}
            className="bg-black/50 border-white/10"
            placeholder="Ex: 10px"
          />
        </div>

        {/* Video Background */}
        <div className="space-y-3 sm:col-span-2">
          <Label>Fundo em Vídeo (URL)</Label>
          <Input 
            value={config.videoBgUrl || ""} 
            onChange={(e) => updateField("videoBgUrl", e.target.value)}
            className="bg-black/50 border-white/10"
            placeholder="https://..."
          />
          <p className="text-xs text-white/50">Se preenchido e configurado na aba de Mídias como Vídeo, rodará em loop.</p>
        </div>

        {/* Custom CSS */}
        <div className="space-y-3 sm:col-span-2">
          <Label>CSS Customizado (Pro)</Label>
          <Textarea 
            value={config.customCss || ""} 
            onChange={(e) => updateField("customCss", e.target.value)}
            className="bg-black/50 border-white/10 font-mono text-sm min-h-[120px]"
            placeholder=".meu-botao { color: red; }"
          />
        </div>

        {/* Noise Overlay */}
        <div className="space-y-3 sm:col-span-2 flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
          <div>
            <Label className="text-base font-semibold">Filtro de Ruído (VHS Noise)</Label>
            <p className="text-sm text-white/60">Adiciona uma textura granulada por cima do perfil.</p>
          </div>
          <Switch 
            checked={!!config.noiseOverlay}
            onCheckedChange={(checked) => updateField("noiseOverlay", checked)}
          />
        </div>

        {/* --- SESSÃO DE ÁUDIO E MULTIMÍDIA --- */}
        <div className="col-span-1 sm:col-span-2 pt-6 border-t border-white/10 mt-2">
          <h3 className="text-lg font-bold mb-4">🎵 Áudio e Player (Parte 2)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Player Style */}
            <div className="space-y-3">
              <Label>Estilo do Player</Label>
              <Select value={config.playerStyle || "minimalist"} onValueChange={(val) => updateField("playerStyle", val)}>
                <SelectTrigger className="bg-black/50 border-white/10">
                  <SelectValue placeholder="Selecione o estilo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimalist">Minimalista</SelectItem>
                  <SelectItem value="neon">Neon (Glow)</SelectItem>
                  <SelectItem value="retro">Retrô (Pixel)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Player Position */}
            <div className="space-y-3">
              <Label>Posição do Player</Label>
              <Select value={config.playerPosition || "bottom-center"} onValueChange={(val) => updateField("playerPosition", val)}>
                <SelectTrigger className="bg-black/50 border-white/10">
                  <SelectValue placeholder="Selecione a posição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom-center">Inferior Central</SelectItem>
                  <SelectItem value="bottom-left">Inferior Esquerdo</SelectItem>
                  <SelectItem value="top-right">Superior Direito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading Text */}
            <div className="space-y-3">
              <Label>Texto de Entrada</Label>
              <Input 
                value={config.loadingText || "Click to Enter"} 
                onChange={(e) => updateField("loadingText", e.target.value)}
                className="bg-black/50 border-white/10"
                placeholder="Ex: Click to Enter"
              />
            </div>

            {/* Enter Animation */}
            <div className="space-y-3">
              <Label>Animação de Entrada</Label>
              <Select value={config.enterAnimation || "fade"} onValueChange={(val) => updateField("enterAnimation", val)}>
                <SelectTrigger className="bg-black/50 border-white/10">
                  <SelectValue placeholder="Selecione a animação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fade">Fade Suave</SelectItem>
                  <SelectItem value="zoom">Zoom Out</SelectItem>
                  <SelectItem value="glitch">Glitch Attack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Night Audio */}
            <div className="space-y-3 sm:col-span-2">
              <Label>Música Noturna (URL - Opcional)</Label>
              <Input 
                value={config.nightAudioUrl || ""} 
                onChange={(e) => updateField("nightAudioUrl", e.target.value)}
                className="bg-black/50 border-white/10"
                placeholder="https://..."
              />
              <p className="text-xs text-white/50">Se preenchido, o site tocará essa música de noite (18h-06h) em vez da música principal.</p>
            </div>

            {/* Reverb Toggle */}
            <div className="space-y-3 sm:col-span-2 flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
              <div>
                <Label className="text-base font-semibold">Efeito de Áudio 3D (Reverb/Catedral)</Label>
                <p className="text-sm text-white/60">Aplica eco ao áudio de fundo usando Web Audio API.</p>
              </div>
              <Switch 
                checked={!!config.reverbEffect}
                onCheckedChange={(checked) => updateField("reverbEffect", checked)}
              />
            </div>

          </div>
        </div>

        {/* --- SESSÃO DE INTERATIVIDADE (PARTE 3) --- */}
        <div className="col-span-1 sm:col-span-2 pt-6 border-t border-white/10 mt-2">
          <h3 className="text-lg font-bold mb-4">✨ Interatividade e Animações (Parte 3)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Link Hover Effect */}
            <div className="space-y-3">
              <Label>Efeito Hover nos Links</Label>
              <Select value={config.linkHoverEffect || "default"} onValueChange={(val) => updateField("linkHoverEffect", val)}>
                <SelectTrigger className="bg-black/50 border-white/10">
                  <SelectValue placeholder="Selecione o efeito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Magnético (Padrão)</SelectItem>
                  <SelectItem value="glow">Glow Intensivo</SelectItem>
                  <SelectItem value="ripple">Ripple (Ondas)</SelectItem>
                  <SelectItem value="shake">Tremor (Shake)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tilt 3D */}
            <div className="space-y-3 flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
              <div>
                <Label className="font-semibold">Tilt 3D no Hover</Label>
                <p className="text-xs text-white/60">O card se inclina com o mouse.</p>
              </div>
              <Switch checked={!!config.enable3dTilt} onCheckedChange={(val) => updateField("enable3dTilt", val)} />
            </div>

            {/* Typewriter Bio */}
            <div className="space-y-3 flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
              <div>
                <Label className="font-semibold">Bio Digitada (Typewriter)</Label>
                <p className="text-xs text-white/60">Digita a bio letra por letra.</p>
              </div>
              <Switch checked={!!config.typewriterBio} onCheckedChange={(val) => updateField("typewriterBio", val)} />
            </div>

            {/* Avatar Pulse */}
            <div className="space-y-3 flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
              <div>
                <Label className="font-semibold">Avatar Pulsante</Label>
                <p className="text-xs text-white/60">Borda respira suavemente.</p>
              </div>
              <Switch checked={!!config.avatarPulse} onCheckedChange={(val) => updateField("avatarPulse", val)} />
            </div>

            {/* Avatar Glitch */}
            <div className="space-y-3 flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
              <div>
                <Label className="font-semibold">Avatar Glitch Hover</Label>
                <p className="text-xs text-white/60">Falha digital no mouse.</p>
              </div>
              <Switch checked={!!config.glitchAvatar} onCheckedChange={(val) => updateField("glitchAvatar", val)} />
            </div>

            {/* Staggered Entry */}
            <div className="space-y-3 flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
              <div>
                <Label className="font-semibold">Entrada em Cascata</Label>
                <p className="text-xs text-white/60">Links entram um por um.</p>
              </div>
              <Switch checked={!!config.staggeredEntry} onCheckedChange={(val) => updateField("staggeredEntry", val)} />
            </div>

            {/* Confetti */}
            <div className="space-y-3 flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
              <div>
                <Label className="font-semibold">Explosão de Confete</Label>
                <p className="text-xs text-white/60">Ao clicar em botões no perfil.</p>
              </div>
              <Switch checked={!!config.confettiEnabled} onCheckedChange={(val) => updateField("confettiEnabled", val)} />
            </div>

            {/* Particle Interaction */}
            <div className="space-y-3 flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
              <div>
                <Label className="font-semibold">Partículas Repelidas</Label>
                <p className="text-xs text-white/60">Neve/Matrix fogem do cursor.</p>
              </div>
              <Switch checked={!!config.particleInteraction} onCheckedChange={(val) => updateField("particleInteraction", val)} />
            </div>

          </div>
        </div>

      </div>

      {/* --- SESSÃO DE TIPOGRAFIA E TEXTO (PARTE 6) --- */}
      <div className="col-span-1 sm:col-span-2 pt-6 border-t border-white/10 mt-2">
        <h3 className="text-lg font-bold mb-4">🔤 Tipografia e Texto (Parte 6)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Font Family */}
          <div className="space-y-3">
            <Label>Fonte Principal (Google Fonts)</Label>
            <Select value={config.fontFamily || "Inter"} onValueChange={(val) => updateField("fontFamily", val)}>
              <SelectTrigger className="bg-black/50 border-white/10">
                <SelectValue placeholder="Selecione a fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inter">Inter (Padrão)</SelectItem>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Playfair Display">Playfair Display (Elegante)</SelectItem>
                <SelectItem value="Outfit">Outfit (Moderna)</SelectItem>
                <SelectItem value="Fira Code">Fira Code (Dev)</SelectItem>
                <SelectItem value="Space Grotesk">Space Grotesk</SelectItem>
                <SelectItem value="Syne">Syne (Arrojada)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Text Alignment */}
          <div className="space-y-3">
            <Label>Alinhamento do Texto</Label>
            <Select value={config.textAlign || "center"} onValueChange={(val) => updateField("textAlign", val)}>
              <SelectTrigger className="bg-black/50 border-white/10">
                <SelectValue placeholder="Alinhamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Letter Spacing */}
          <div className="space-y-3">
            <Label>Espaçamento de Letras (Tracking)</Label>
            <Input 
              value={config.letterSpacing || "normal"} 
              onChange={(e) => updateField("letterSpacing", e.target.value)}
              className="bg-black/50 border-white/10"
              placeholder="ex: normal, 1px, 0.1em"
            />
          </div>

          {/* Line Height */}
          <div className="space-y-3">
            <Label>Altura da Linha (Line-height)</Label>
            <Input 
              value={config.lineHeight || "1.5"} 
              onChange={(e) => updateField("lineHeight", e.target.value)}
              className="bg-black/50 border-white/10"
              placeholder="ex: 1.5, 2, 150%"
            />
          </div>

          {/* Text Transform */}
          <div className="space-y-3">
            <Label>Caixa do Texto</Label>
            <Select value={config.textTransform || "none"} onValueChange={(val) => updateField("textTransform", val)}>
              <SelectTrigger className="bg-black/50 border-white/10">
                <SelectValue placeholder="Caixa do texto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Padrão</SelectItem>
                <SelectItem value="uppercase">TUDO MAIÚSCULO</SelectItem>
                <SelectItem value="lowercase">tudo minúsculo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Text Gradient */}
          <div className="space-y-3">
            <Label>Gradiente no Nome (Opcional)</Label>
            <Input 
              value={config.textGradient || ""} 
              onChange={(e) => updateField("textGradient", e.target.value)}
              className="bg-black/50 border-white/10"
              placeholder="ex: linear-gradient(to right, #ff0000, #00ff00)"
            />
          </div>

          {/* Text Shadow */}
          <div className="space-y-3 sm:col-span-2">
            <Label>Sombra/Brilho no Texto (Text Shadow)</Label>
            <Input 
              value={config.textShadow || ""} 
              onChange={(e) => updateField("textShadow", e.target.value)}
              className="bg-black/50 border-white/10"
              placeholder="ex: 0 0 10px rgba(255,255,255,0.5)"
            />
          </div>

          {/* Mono Font Toggle */}
          <div className="space-y-3 flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
            <div>
              <Label className="font-semibold">Forçar Fonte Monoespaçada</Label>
              <p className="text-xs text-white/60">Aplica estilo de código em tudo.</p>
            </div>
            <Switch checked={!!config.monoFont} onCheckedChange={(val) => updateField("monoFont", val)} />
          </div>

          {/* Rotating Bio Toggle */}
          <div className="space-y-3 flex items-center justify-between p-4 border border-white/10 rounded-xl bg-white/5">
            <div>
              <Label className="font-semibold">Bio com Palavras Rotativas</Label>
              <p className="text-xs text-white/60">Gira palavras pré-definidas na sua bio.</p>
            </div>
            <Switch checked={!!config.rotatingBio} onCheckedChange={(val) => updateField("rotatingBio", val)} />
          </div>

          {/* Rotating Words List */}
          {config.rotatingBio && (
            <div className="space-y-3 sm:col-span-2">
              <Label>Palavras Rotativas (separadas por vírgula)</Label>
              <Input 
                value={config.rotatingWords || ""} 
                onChange={(e) => updateField("rotatingWords", e.target.value)}
                className="bg-black/50 border-white/10"
                placeholder="ex: Designer, Developer, Creator"
              />
              <p className="text-xs text-white/50">Coloque um par de chaves {'{}'} na sua Bio real onde as palavras devem aparecer!</p>
            </div>
          )}

        </div>
      </div>

      <Button type="submit" className="w-full sm:w-auto mt-6" disabled={isSaving}>
        {isSaving ? "Salvando..." : "Salvar Estilos Avançados"}
      </Button>
    </form>
  );
}
