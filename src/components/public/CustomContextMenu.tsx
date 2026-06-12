"use client";

import { useEffect, useState } from "react";
import { Copy, Terminal, User, Code } from "lucide-react";
import { toast } from "sonner";

export default function CustomContextMenu({ profileUrl }: { profileUrl: string }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      if (visible) setVisible(false);
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div 
      className="fixed z-[9999] bg-[#111] border border-white/10 rounded-xl shadow-2xl p-2 w-56 flex flex-col gap-1 backdrop-blur-xl"
      style={{ left: position.x, top: position.y }}
    >
      <button 
        className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-white/80 transition-colors w-full text-left"
        onClick={() => {
          navigator.clipboard.writeText(profileUrl);
          toast.success("Link do perfil copiado!");
        }}
      >
        <Copy size={16} /> Copiar Link do Perfil
      </button>
      <button 
        className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-white/80 transition-colors w-full text-left"
        onClick={() => {
          window.location.href = "https://anthrax.cc";
        }}
      >
        <User size={16} /> Crie o seu Anthrax
      </button>
      <div className="h-px bg-white/10 my-1 w-full" />
      <button 
        className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-white/80 transition-colors w-full text-left"
        onClick={() => {
          document.body.style.fontFamily = "monospace";
          document.body.style.color = "#00ff41";
          toast("Modo Hacker ativado", { icon: "👾" });
        }}
      >
        <Terminal size={16} /> Modo Hacker
      </button>
      <button 
        className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg text-sm text-white/80 transition-colors w-full text-left opacity-50 cursor-not-allowed"
      >
        <Code size={16} /> Inspecionar (Bloqueado)
      </button>
    </div>
  );
}
