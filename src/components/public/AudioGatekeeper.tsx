"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioStore } from "@/store/audioStore";

export default function AudioGatekeeper({ audioUrl, uiConfig }: { audioUrl?: string; uiConfig?: any }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Evita Hydration mismatch rodando lógica de hora apenas no client
  useEffect(() => { setMounted(true); }, []);

  const activeAudioUrl = (() => {
    if (uiConfig?.nightAudioUrl && mounted) {
      const hour = new Date().getHours();
      if (hour >= 18 || hour < 6) return uiConfig.nightAudioUrl;
    }
    return audioUrl;
  })();

  // Setup do elemento de áudio
  useEffect(() => {
    if (activeAudioUrl) {
      const audio = new Audio(activeAudioUrl);
      audio.crossOrigin = "anonymous";
      audio.loop = true;
      audioRef.current = audio;
    }
    return () => {
      // Cleanup completo para evitar memory leak e page crash
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
        analyserRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      useAudioStore.getState().setIsActive(false);
    };
  }, [activeAudioUrl]);

  const startAudioContext = useCallback(() => {
    if (!audioRef.current) return;

    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;

      const source = ctx.createMediaElementSource(audioRef.current);

      if (uiConfig?.reverbEffect) {
        const convolver = ctx.createConvolver();
        const length = ctx.sampleRate * 2.5;
        const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
        for (let i = 0; i < 2; i++) {
          const channel = impulse.getChannelData(i);
          for (let j = 0; j < length; j++) {
            channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 2);
          }
        }
        convolver.buffer = impulse;
        source.connect(convolver);
        convolver.connect(analyser);
      } else {
        source.connect(analyser);
      }

      analyser.connect(ctx.destination);
      audioContextRef.current = ctx;
      analyserRef.current = analyser;

      const updateFrequencyData = () => {
        if (!analyserRef.current) return; // Para o loop se o analyser foi desconectado
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        useAudioStore.getState().setFrequencyData(dataArray);
        const bass = useAudioStore.getState().getBassIntensity();
        document.documentElement.style.setProperty("--bass", bass.toString());
        animationRef.current = requestAnimationFrame(updateFrequencyData);
      };
      updateFrequencyData();
      useAudioStore.getState().setIsActive(true);

    } else if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
  }, [uiConfig?.reverbEffect]);

  const handleEnter = useCallback(() => {
    // Inicia a transição cinemática de dissolução
    setHasEntered(true);

    // No ponto de inflexão da animação (400ms), dispara áudio e flash
    setTimeout(() => {
      setShowFlash(true);
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
        startAudioContext();
      }
      // Apaga o flash rápido (200ms)
      setTimeout(() => setShowFlash(false), 200);
    }, 400);
  }, [startAudioContext]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted((prev) => !prev);
  }, [isMuted]);

  const enterVariants = {
    fade: { opacity: 0 },
    zoom: { opacity: 0, scale: 2.5, filter: "blur(20px)" },
    glitch: { opacity: 0, x: [0, -20, 20, -20, 20, 0], filter: "blur(20px)" },
  };

  let posClass = "top-4 right-4";
  if (uiConfig?.playerPosition === "bottom-center") posClass = "bottom-4 left-1/2 -translate-x-1/2";
  if (uiConfig?.playerPosition === "bottom-left") posClass = "bottom-4 left-4";

  let styleClass = "bg-black/40 backdrop-blur-md border border-white/10 rounded-full";
  if (uiConfig?.playerStyle === "neon") styleClass = "bg-black/80 border border-[var(--accent-color)] rounded-xl shadow-[0_0_15px_var(--accent-color)]";
  if (uiConfig?.playerStyle === "retro") styleClass = "bg-black border-2 border-white rounded-none font-mono";

  return (
    <>
      {/* Flash Fotográfico Cinemático */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, backgroundColor: "#ffffff" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 z-[100] pointer-events-none mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      {/* Tela de entrada */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            exit={(enterVariants as any)[uiConfig?.enterAnimation || "zoom"] || enterVariants.zoom}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl"
          >
            <button
              onClick={handleEnter}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 animate-pulse"
              style={{ color: "var(--accent-color, #ffffff)" }}
            >
              [ {uiConfig?.loadingText || "Clique para Entrar"} ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player de música flutuante */}
      <AnimatePresence>
        {hasEntered && activeAudioUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed z-40 flex items-center gap-2 p-2 ${posClass} ${styleClass}`}
          >
            <button onClick={togglePlay} className="p-2 text-white/70 hover:text-white transition-colors">
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <div className="w-[1px] h-4 bg-white/20" />
            <button onClick={toggleMute} className="p-2 text-white/70 hover:text-white transition-colors">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
