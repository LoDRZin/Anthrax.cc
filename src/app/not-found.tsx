"use client";

import Link from "next/link";
import MagneticButton from "@/components/public/MagneticButton";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [glitchText, setGlitchText] = useState("404");

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText((prev) => (Math.random() > 0.8 ? "ERROR" : "404"));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center relative overflow-hidden font-mono">
      {/* Background Matrix/Noise vibe */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="relative z-10 text-center flex flex-col items-center">
        <h1 className="text-9xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600 animate-pulse">
          {glitchText}
        </h1>
        <p className="text-xl text-white/50 mb-8 max-w-md">
          A página ou perfil que você está procurando foi engolido pelo vazio digital.
        </p>
        
        <MagneticButton className="w-auto">
          <Link href="/" className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform block">
            Voltar para a Home
          </Link>
        </MagneticButton>
      </div>
    </div>
  );
}
