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
      videoBgUrl: ""
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
      </div>

      <Button type="submit" className="w-full sm:w-auto" disabled={isSaving}>
        {isSaving ? "Salvando..." : "Salvar Estilos Avançados"}
      </Button>
    </form>
  );
}
