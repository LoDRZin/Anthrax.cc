"use client";

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { updateAppearance, updateAdvancedStyling } from "@/server/actions/appearance";
import "@uploadthing/react/styles.css";
import { motion } from "framer-motion";
import {
  Sparkles,
  Image as ImageIcon,
  Music,
  User,
  Wand2,
  Palette,
  Type,
  Layout,
  Layers,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

// Components
import { SectionCard } from "@/components/dashboard/SectionCard";
import { StyledInput } from "@/components/dashboard/StyledInput";
import { StyledButton } from "@/components/dashboard/StyledButton";
import { ToggleSwitch } from "@/components/dashboard/ToggleSwitch";
import { LiveProfilePreview } from "@/components/dashboard/LiveProfilePreview";

type ProfileData = {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  backgroundUrl: string;
  audioUrl: string;
  effect: string;
  uiConfig: string;
};

const FONT_OPTIONS = [
  "Inter",
  "Roboto",
  "Playfair Display",
  "Outfit",
  "Fira Code",
  "Space Grotesk",
  "Syne",
];

const CURSOR_STYLES = [
  { value: "default", label: "Padrão" },
  { value: "glow", label: "Glow Follower" },
  { value: "ring", label: "Anel Dinâmico" },
];

const LAYOUT_OPTIONS = [
  { value: "default", label: "Lista Vertical" },
  { value: "grid", label: "Grid (Lado a Lado)" },
];

const HOVER_EFFECTS = [
  { value: "default", label: "Magnético (Padrão)" },
  { value: "glow", label: "Glow Intensivo" },
  { value: "ripple", label: "Ripple (Ondas)" },
  { value: "shake", label: "Tremor (Shake)" },
];

const PLAYER_STYLES = [
  { value: "minimalist", label: "Minimalista" },
  { value: "neon", label: "Neon (Glow)" },
  { value: "retro", label: "Retrô (Pixel)" },
];

const PLAYER_POSITIONS = [
  { value: "bottom-center", label: "Inferior Central" },
  { value: "bottom-left", label: "Inferior Esquerdo" },
  { value: "top-right", label: "Superior Direito" },
];

export default function AppearanceForm({ profile }: { profile: ProfileData }) {
  // Tabs: 'media' | 'styling' | 'effects' | 'extras'
  const [activeTab, setActiveTab] = useState<"media" | "styling" | "effects" | "extras">("media");
  
  // Basic attributes state
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [backgroundUrl, setBackgroundUrl] = useState(profile.backgroundUrl);
  const [audioUrl, setAudioUrl] = useState(profile.audioUrl);
  const [effect, setEffect] = useState(profile.effect);
  const [isSaving, setIsSaving] = useState(false);

  // AI Prompt Generator
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Parse config safely
  const [config, setConfig] = useState(() => {
    const defaultConfigs = {
      layout: "default",
      cursorStyle: "default",
      borderRadius: "12px",
      glowColor: "rgba(255,255,255,0.15)",
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
      enable3dTilt: false,
      typewriterBio: false,
      glitchAvatar: false,
      avatarPulse: false,
      linkHoverEffect: "default",
      particleInteraction: false,
      staggeredEntry: false,
      confettiEnabled: true,
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
      enableGuestbook: false,
      enableRating: false,
      enableVisitorThemes: false,
      enableFocusMode: false,
      manualStatus: "",
    };

    try {
      if (profile.uiConfig) {
        const parsed = JSON.parse(profile.uiConfig);
        return { ...defaultConfigs, ...parsed };
      }
    } catch {}
    return defaultConfigs;
  });

  const updateConfig = (field: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleGenerateAiAvatar = () => {
    if (!aiPrompt) return;
    setIsGeneratingAi(true);
    const encodedPrompt = encodeURIComponent(aiPrompt);
    const randomSeed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${randomSeed}`;

    const img = new globalThis.Image();
    img.src = url;
    img.onload = () => {
      setAvatarUrl(url);
      setIsGeneratingAi(false);
      toast.success("Avatar gerado com IA carregado com sucesso!");
    };
    img.onerror = () => {
      setIsGeneratingAi(false);
      toast.error("Erro ao carregar imagem gerada por IA.");
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Save Basic appearance
      await updateAppearance({
        avatarUrl,
        backgroundUrl,
        audioUrl,
        effect,
      });

      // 2. Save UI configs
      await updateAdvancedStyling(JSON.stringify(config));

      toast.success("Todas as configurações salvas com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar configurações de aparência.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "media", label: "Mídias", icon: ImageIcon },
    { id: "styling", label: "Layout & Cores", icon: Palette },
    { id: "effects", label: "Tipografia & Efeitos", icon: Type },
    { id: "extras", label: "Extras & CSS", icon: Settings },
  ] as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
      {/* Left Workspace Panel (Forms) */}
      <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6 w-full pb-20">
        
        {/* Elegant Glassmorphic Tab Bar Navigation */}
        <div className="flex border border-white/5 bg-[#070707]/30 backdrop-blur-xl p-1.5 rounded-2xl gap-1 select-none overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer whitespace-nowrap outline-none ${
                  isTabActive ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {isTabActive && (
                  <motion.div
                    layoutId="active-editor-tab"
                    className="absolute inset-0 bg-white/[0.03] border border-white/10 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon size={16} className={isTabActive ? "text-purple-400" : ""} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab contents with Framer Motion animations */}
        <div className="space-y-6">
          
          {/* TAB 1: MEDIA SETTINGS */}
          {activeTab === "media" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <SectionCard title="Foto de Perfil (Avatar)" icon={User} description="Insira a URL ou faça upload do seu avatar.">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    <div className="flex-1 w-full">
                      <StyledInput
                        label="URL da Imagem"
                        placeholder="https://imgur.com/sua-imagem.png"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                      />
                    </div>
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          setAvatarUrl(res[0].url);
                          toast.success("Foto carregada com sucesso!");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Falha no upload: ${error.message}`);
                      }}
                      appearance={{
                        button: "bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 text-xs h-11 px-5 rounded-xl transition-all duration-300 cursor-pointer",
                        allowedContent: "hidden",
                      }}
                      content={{ button: "Upload Imagem" }}
                    />
                  </div>

                  {/* IA generator box */}
                  <div className="p-4 border border-purple-500/10 rounded-2xl bg-purple-950/5 relative overflow-hidden group select-none">
                    <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full pointer-events-none" />
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                        Gerador de Avatar IA 🪄
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="ex: cyberpunk hacker anime girl, neon lights, 8k"
                        className="flex-1 h-10 bg-black/40 border border-white/5 rounded-xl px-4 text-xs text-white placeholder-white/30 outline-none focus:border-purple-500/50 transition-all duration-300"
                      />
                      <StyledButton
                        type="button"
                        onClick={handleGenerateAiAvatar}
                        disabled={isGeneratingAi || !aiPrompt}
                        className="h-10 text-xs px-5 bg-purple-600 hover:bg-purple-700"
                      >
                        {isGeneratingAi ? "Gerando..." : "Gerar"}
                      </StyledButton>
                    </div>
                    <p className="text-[10px] text-purple-400/50 mt-2 font-mono">
                      Gerador de alta velocidade integrado via Pollinations.ai
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Plano de Fundo (Background)" icon={ImageIcon} description="URL ou arquivo do seu fundo.">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    <div className="flex-1 w-full">
                      <StyledInput
                        label="URL do Plano de Fundo"
                        placeholder="https://imgur.com/seu-fundo.gif"
                        value={backgroundUrl}
                        onChange={(e) => setBackgroundUrl(e.target.value)}
                      />
                    </div>
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          setBackgroundUrl(res[0].url);
                          toast.success("Plano de fundo carregado com sucesso!");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Falha no upload: ${error.message}`);
                      }}
                      appearance={{
                        button: "bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 text-xs h-11 px-5 rounded-xl transition-all duration-300 cursor-pointer",
                        allowedContent: "hidden",
                      }}
                      content={{ button: "Upload Imagem" }}
                    />
                  </div>

                  <div className="w-full">
                    <StyledInput
                      label="Ou URL de Vídeo de Fundo (.mp4)"
                      placeholder="https://sua-url.com/video.mp4"
                      value={config.videoBgUrl || ""}
                      onChange={(e) => updateConfig("videoBgUrl", e.target.value)}
                    />
                    <p className="text-[10px] text-white/30 mt-1 select-none">
                      Vídeos em loop de alta definição substituem o plano de fundo estático.
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Música e Áudio" icon={Music} description="Coloque um arquivo .mp3 para tocar em seu perfil.">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    <div className="flex-1 w-full">
                      <StyledInput
                        label="URL da Música de Fundo"
                        placeholder="https://site.com/musica.mp3"
                        value={audioUrl}
                        onChange={(e) => setAudioUrl(e.target.value)}
                      />
                    </div>
                    <UploadButton
                      endpoint="audioUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          setAudioUrl(res[0].url);
                          toast.success("Música carregada com sucesso!");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Falha no upload: ${error.message}`);
                      }}
                      appearance={{
                        button: "bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 text-xs h-11 px-5 rounded-xl transition-all duration-300 cursor-pointer",
                        allowedContent: "hidden",
                      }}
                      content={{ button: "Upload Áudio" }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StyledInput
                      label="Música Noturna (18h-6h) - Opcional"
                      placeholder="https://site.com/musica-night.mp3"
                      value={config.nightAudioUrl || ""}
                      onChange={(e) => updateConfig("nightAudioUrl", e.target.value)}
                    />
                    <StyledInput
                      label="Texto do Botão Player"
                      placeholder="Click to Enter"
                      value={config.loadingText || ""}
                      onChange={(e) => updateConfig("loadingText", e.target.value)}
                    />
                  </div>

                  <ToggleSwitch
                    label="Efeito de Áudio Reverb 3D (Catedral)"
                    description="Simula eco e profundidade usando a Web Audio API no navegador."
                    checked={!!config.reverbEffect}
                    onChange={(checked) => updateConfig("reverbEffect", checked)}
                  />
                </div>
              </SectionCard>
            </motion.div>
          )}

          {/* TAB 2: STYLING & CORES */}
          {activeTab === "styling" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <SectionCard title="Configurações de Cores" icon={Palette} description="Defina a paleta visual dos elementos do perfil.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Accent Color picker */}
                  <div className="space-y-2 select-none">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/60">
                      Cor de Destaque (Accent)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.accentColor || "#ffffff"}
                        onChange={(e) => updateConfig("accentColor", e.target.value)}
                        className="w-12 h-11 bg-black/40 border border-white/10 rounded-xl cursor-pointer p-1"
                      />
                      <StyledInput
                        placeholder="#ffffff"
                        value={config.accentColor || ""}
                        onChange={(e) => updateConfig("accentColor", e.target.value)}
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Glow Color picker */}
                  <div className="space-y-2 select-none">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/60">
                      Cor das Sombras (Glow)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={
                          config.glowColor?.startsWith("#")
                            ? config.glowColor
                            : "#a855f7"
                        }
                        onChange={(e) => updateConfig("glowColor", e.target.value)}
                        className="w-12 h-11 bg-black/40 border border-white/10 rounded-xl cursor-pointer p-1"
                      />
                      <StyledInput
                        placeholder="rgba(168,85,247,0.15)"
                        value={config.glowColor || ""}
                        onChange={(e) => updateConfig("glowColor", e.target.value)}
                        className="font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Layout & Vidro (Glassmorphism)" icon={Layout} description="Controle bordas, sombras e efeitos translúcidos.">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/60">
                        Layout dos Links
                      </label>
                      <select
                        value={config.layout || "default"}
                        onChange={(e) => updateConfig("layout", e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm focus:outline-none focus:border-purple-500/50 text-white backdrop-blur-md cursor-pointer"
                      >
                        {LAYOUT_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#0a0a0a]">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/60">
                        Efeito Cursor
                      </label>
                      <select
                        value={config.cursorStyle || "default"}
                        onChange={(e) => updateConfig("cursorStyle", e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm focus:outline-none focus:border-purple-500/50 text-white backdrop-blur-md cursor-pointer"
                      >
                        {CURSOR_STYLES.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[#0a0a0a]">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StyledInput
                      label="Arredondamento das Bordas (Border Radius)"
                      placeholder="12px ou 24px"
                      value={config.borderRadius || ""}
                      onChange={(e) => updateConfig("borderRadius", e.target.value)}
                    />
                    <StyledInput
                      label="Força do Vidro (Blur Intensity)"
                      placeholder="10px ou 20px"
                      value={config.glassIntensity || ""}
                      onChange={(e) => updateConfig("glassIntensity", e.target.value)}
                    />
                  </div>

                  <ToggleSwitch
                    label="VHS Noise Overlay"
                    description="Aplica uma textura estática granulada sutil sobre a página."
                    checked={!!config.noiseOverlay}
                    onChange={(checked) => updateConfig("noiseOverlay", checked)}
                  />
                </div>
              </SectionCard>
            </motion.div>
          )}

          {/* TAB 3: TYPOGRAPHY & EFFECTS */}
          {activeTab === "effects" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <SectionCard title="Efeitos do Cursor & Animações" icon={Layers} description="Animações extras nos cartões e hover de links.">
                <div className="space-y-4 select-none">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/60">
                      Estilo do Hover de Links
                    </label>
                    <select
                      value={config.linkHoverEffect || "default"}
                      onChange={(e) => updateConfig("linkHoverEffect", e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm focus:outline-none focus:border-purple-500/50 text-white backdrop-blur-md cursor-pointer"
                    >
                      {HOVER_EFFECTS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#0a0a0a]">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ToggleSwitch
                      label="Tilt 3D no Hover"
                      description="O cartão principal do perfil se inclina na direção do cursor."
                      checked={!!config.enable3dTilt}
                      onChange={(checked) => updateConfig("enable3dTilt", checked)}
                    />
                    <ToggleSwitch
                      label="Explosão de Confete"
                      description="Dispara confete colorido quando os botões de links são clicados."
                      checked={!!config.confettiEnabled}
                      onChange={(checked) => updateConfig("confettiEnabled", checked)}
                    />
                    <ToggleSwitch
                      label="Avatar Pulsante"
                      description="Faz a borda do seu avatar respirar com uma animação pulsante."
                      checked={!!config.avatarPulse}
                      onChange={(checked) => updateConfig("avatarPulse", checked)}
                    />
                    <ToggleSwitch
                      label="Avatar Glitch Hover"
                      description="Simula um efeito glitch no avatar ao passar o mouse."
                      checked={!!config.glitchAvatar}
                      onChange={(checked) => updateConfig("glitchAvatar", checked)}
                    />
                    <ToggleSwitch
                      label="Entrada em Cascata (Stagger)"
                      description="Os links surgem em sequência com uma transição suave."
                      checked={!!config.staggeredEntry}
                      onChange={(checked) => updateConfig("staggeredEntry", checked)}
                    />
                    <ToggleSwitch
                      label="Interação de Partículas"
                      description="Partículas de fundo fogem do cursor do mouse."
                      checked={!!config.particleInteraction}
                      onChange={(checked) => updateConfig("particleInteraction", checked)}
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Partículas de Fundo" icon={Sparkles} description="Selecione o efeito que será renderizado no fundo do perfil.">
                <div className="space-y-2 select-none">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/60">
                    Efeitos Visuais
                  </label>
                  <select
                    value={effect}
                    onChange={(e) => setEffect(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm focus:outline-none focus:border-purple-500/50 text-white backdrop-blur-md cursor-pointer"
                  >
                    <option value="none" className="bg-[#0a0a0a]">Nenhum</option>
                    <option value="snow" className="bg-[#0a0a0a]">Neve (Snow)</option>
                    <option value="matrix" className="bg-[#0a0a0a]">Matrix Rain</option>
                    <option value="fogo" className="bg-[#0a0a0a]">Chamas de Fogo</option>
                    <option value="bolhas" className="bg-[#0a0a0a]">Bolhas Flutuantes</option>
                  </select>
                </div>
              </SectionCard>

              <SectionCard title="Configurações de Fontes" icon={Type} description="Ajuste a tipografia e formatação do texto.">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/60">
                        Família de Fonte (Google Fonts)
                      </label>
                      <select
                        value={config.fontFamily || "Inter"}
                        onChange={(e) => updateConfig("fontFamily", e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm focus:outline-none focus:border-purple-500/50 text-white backdrop-blur-md cursor-pointer"
                      >
                        {FONT_OPTIONS.map((font) => (
                          <option key={font} value={font} className="bg-[#0a0a0a]">
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/60">
                        Alinhamento do Texto
                      </label>
                      <select
                        value={config.textAlign || "center"}
                        onChange={(e) => updateConfig("textAlign", e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-white/10 bg-black/40 px-3 text-sm focus:outline-none focus:border-purple-500/50 text-white backdrop-blur-md cursor-pointer"
                      >
                        <option value="center" className="bg-[#0a0a0a]">Centralizado</option>
                        <option value="left" className="bg-[#0a0a0a]">Esquerda</option>
                        <option value="right" className="bg-[#0a0a0a]">Direita</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StyledInput
                      label="Sombra do Texto (Text Shadow)"
                      placeholder="0 0 10px rgba(255,255,255,0.4)"
                      value={config.textShadow || ""}
                      onChange={(e) => updateConfig("textShadow", e.target.value)}
                    />
                    <StyledInput
                      label="Gradiente de Cores no Nome"
                      placeholder="linear-gradient(to right, #a855f7, #3b82f6)"
                      value={config.textGradient || ""}
                      onChange={(e) => updateConfig("textGradient", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StyledInput
                      label="Espaçamento de Letras (Letter Spacing)"
                      placeholder="normal ou 1px"
                      value={config.letterSpacing || ""}
                      onChange={(e) => updateConfig("letterSpacing", e.target.value)}
                    />
                    <StyledInput
                      label="Altura da Linha (Line Height)"
                      placeholder="1.5 ou 1.8"
                      value={config.lineHeight || ""}
                      onChange={(e) => updateConfig("lineHeight", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ToggleSwitch
                      label="Texto Bio com Digitação (Typewriter)"
                      description="Digita a bio letra por letra gradualmente."
                      checked={!!config.typewriterBio}
                      onChange={(checked) => updateConfig("typewriterBio", checked)}
                    />
                    <ToggleSwitch
                      label="Forçar Fonte Monoespaçada"
                      description="Aplica estilo de código em toda a página do perfil."
                      checked={!!config.monoFont}
                      onChange={(checked) => updateConfig("monoFont", checked)}
                    />
                  </div>
                </div>
              </SectionCard>
            </motion.div>
          )}

          {/* TAB 4: EXTRAS & CUSTOM CSS */}
          {activeTab === "extras" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <SectionCard title="Configurações Adicionais" icon={Settings} description="Widgets de interação e status manuais.">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <StyledInput
                      label="Status Manual (Badge)"
                      placeholder="🌙 Codando, 💻 Dormindo, 🎮 Jogando"
                      value={config.manualStatus || ""}
                      onChange={(e) => updateConfig("manualStatus", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ToggleSwitch
                      label="Mural de Recados (Guestbook)"
                      description="Permite que visitantes assinem e deixem recados públicos em seu perfil."
                      checked={!!config.enableGuestbook}
                      onChange={(checked) => updateConfig("enableGuestbook", checked)}
                    />
                    <ToggleSwitch
                      label="Sistema de Avaliação"
                      description="Exibe um widget para receber classificações de 5 estrelas dos visitantes."
                      checked={!!config.enableRating}
                      onChange={(checked) => updateConfig("enableRating", checked)}
                    />
                    <ToggleSwitch
                      label="Modo Foco (Zen)"
                      description="Exibe opção para o usuário desativar efeitos sonoros e visuais pesados."
                      checked={!!config.enableFocusMode}
                      onChange={(checked) => updateConfig("enableFocusMode", checked)}
                    />
                    <ToggleSwitch
                      label="Tema Alternativo do Visitante"
                      description="Botão de sol/lua permitindo que os visitantes invertam as cores."
                      checked={!!config.enableVisitorThemes}
                      onChange={(checked) => updateConfig("enableVisitorThemes", checked)}
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Bio rotativa */}
              <SectionCard title="Palavras Rotativas na Bio" icon={Sparkles} description="Gire palavras dinamicamente no seu perfil.">
                <div className="space-y-4">
                  <ToggleSwitch
                    label="Ativar Bio Rotativa"
                    description="Substitui um trecho da sua bio por termos pré-definidos que mudam em loop."
                    checked={!!config.rotatingBio}
                    onChange={(checked) => updateConfig("rotatingBio", checked)}
                  />
                  {config.rotatingBio && (
                    <StyledInput
                      label="Palavras rotativas (separadas por vírgula)"
                      placeholder="Developer, Designer, Creator"
                      value={config.rotatingWords || ""}
                      onChange={(e) => updateConfig("rotatingWords", e.target.value)}
                    />
                  )}
                </div>
              </SectionCard>

              {/* Custom CSS */}
              <SectionCard title="CSS Personalizado (Avançado)" icon={Palette} description="Controle total sobre o design do seu perfil usando folha de estilos.">
                <div className="space-y-2 select-none">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/60">
                    Estilos CSS Personalizados
                  </label>
                  <textarea
                    value={config.customCss || ""}
                    onChange={(e) => updateConfig("customCss", e.target.value)}
                    placeholder="/* Exemplo */&#10;.card-perfil { border-color: cyan; }"
                    className="w-full min-h-[140px] bg-black/40 border border-white/10 rounded-xl p-4 font-mono text-xs text-white placeholder-white/20 focus:border-purple-500/50 outline-none transition-all duration-300"
                  />
                </div>
              </SectionCard>
            </motion.div>
          )}

        </div>

        {/* Global Save Button */}
        <StyledButton
          type="submit"
          isLoading={isSaving}
          className="w-full text-base py-6 bg-gradient-to-r from-purple-600 via-violet-600 to-blue-500"
        >
          Salvar Todas as Alterações
        </StyledButton>

      </form>

      {/* Right Visual Preview Panel (Sticky Desktop Phone) */}
      <div className="lg:col-span-4 sticky top-24 hidden lg:block select-none z-20">
        <LiveProfilePreview
          avatarUrl={avatarUrl}
          backgroundUrl={backgroundUrl}
          audioUrl={audioUrl}
          effect={effect}
          displayName={profile.displayName}
          username={profile.username}
          bio={profile.bio}
          config={config}
        />
      </div>
    </div>
  );
}
