"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import WebGLBackground from "@/components/public/WebGLBackground";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-[#030303] text-white overflow-hidden font-sans select-none">
      
      {/* 3D WebGL Background (Stars Scene) */}
      <WebGLBackground scene="stars" />

      {/* Gradient overlay to soften WebGL */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#030303]/60 to-[#030303] z-1 pointer-events-none" />

      {/* Background Noise */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none z-1" 
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} 
      />

      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 h-20 px-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <span className="text-black font-black text-sm tracking-tighter">A</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Anthrax<span className="text-purple-400 font-extralight">.cc</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors cursor-pointer bg-transparent border-0 outline-none">
                Entrar
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 text-sm font-bold bg-white text-black hover:bg-neutral-200 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer active:scale-95 border-0 outline-none">
                Criar Conta
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard">
              <button className="px-4 py-2 text-sm font-semibold border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer mr-4 text-white outline-none">
                Ir para o Dashboard
              </button>
            </Link>
            <UserButton />
          </Show>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative text-center max-w-3xl z-10 mt-20 flex flex-col items-center">
        
        {/* Sparkle Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Sparkles size={12} className="animate-pulse" />
          <span>O Link in Bio Gamer Definitivo</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.1]"
        >
          Seu Link in Bio, <br />
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
            Evoluído.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-base md:text-xl text-white/50 max-w-xl mb-10 leading-relaxed font-light animate-fade-in"
        >
          Anthrax.cc é a plataforma definitiva para agrupar seus links, redes sociais e widgets interativos com uma estética gamer e cyberpunk premium.
        </motion.p>
        
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <button className="group relative inline-flex items-center justify-center p-0.5 overflow-hidden text-base font-bold text-white rounded-2xl bg-gradient-to-br from-purple-600 via-violet-600 to-blue-500 hover:text-white transition-all duration-300 shadow-[0_0_25px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] cursor-pointer active:scale-[0.98] border-0 outline-none">
                <span className="relative px-8 py-4 bg-zinc-950 rounded-[14px] group-hover:bg-opacity-0 flex items-center gap-2.5 transition-all">
                  <span>Começar Agora</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
             <Link href="/dashboard">
               <button className="group relative inline-flex items-center justify-center p-0.5 overflow-hidden text-base font-bold text-white rounded-2xl bg-gradient-to-br from-purple-600 via-violet-600 to-blue-500 hover:text-white transition-all duration-300 shadow-[0_0_25px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] cursor-pointer active:scale-[0.98] border-0 outline-none">
                 <span className="relative px-8 py-4 bg-zinc-950 rounded-[14px] group-hover:bg-opacity-0 flex items-center gap-2.5 transition-all">
                   <span>Acessar Meu Painel</span>
                   <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </span>
               </button>
             </Link>
          </Show>
        </motion.div>
      </main>
    </div>
  );
}
