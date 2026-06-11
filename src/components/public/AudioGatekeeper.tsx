"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioStore } from "@/store/audioStore";

export default function AudioGatekeeper({ audioUrl, uiConfig }: { audioUrl?: string, uiConfig?: any }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Evita Hydration mismatch rodando lógica de hora apenas no client
  useEffect(() => setMounted(true), []);

  const getActiveAudioUrl = () => {
    if (uiConfig?.nightAudioUrl && mounted) {
      const hour = new Date().getHours();
      if (hour >= 18 || hour < 6) return uiConfig.nightAudioUrl;
    }
    return audioUrl;
  };
  const activeAudioUrl = getActiveAudioUrl();

  useEffect(() => {
    if (activeAudioUrl) {
      audioRef.current = new Audio(activeAudioUrl);
      audioRef.current.crossOrigin = "anonymous";
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) audioContextRef.current.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      useAudioStore.getState().setIsActive(false);
    };
  }, [activeAudioUrl]);

  const handleEnter = () => {
    setHasEntered(true);
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);

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
          if (analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            useAudioStore.getState().setFrequencyData(dataArray);
            
            const bass = useAudioStore.getState().getBassIntensity();
            document.documentElement.style.setProperty('--bass', bass.toString());
            
            animationRef.current = requestAnimationFrame(updateFrequencyData);
          }
        };
        updateFrequencyData();
        useAudioStore.getState().setIsActive(true);
      } else if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(console.error);
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const enterVariants = {
    fade: { opacity: 0 },
    zoom: { opacity: 0, scale: 1.5 },
    glitch: { opacity: 0, x: [0, -20, 20, -20, 20, 0], filter: "blur(20px)" }
  };

  let posClass = "top-4 right-4";
  if (uiConfig?.playerPosition === "bottom-center") posClass = "bottom-4 left-1/2 -translate-x-1/2";
  if (uiConfig?.playerPosition === "bottom-left") posClass = "bottom-4 left-4";

  let styleClass = "bg-black/40 backdrop-blur-md border border-white/10 rounded-full";
  if (uiConfig?.playerStyle === "neon") styleClass = "bg-black/80 border border-[var(--accent-color)] rounded-xl shadow-[0_0_15px_var(--accent-color)]";
  if (uiConfig?.playerStyle === "retro") styleClass = "bg-black border-2 border-white rounded-none font-mono";

  return (
    <>
      <AnimatePresence>
        {!hasEntered && (
          <motion.div 
            exit={(enterVariants as any)[uiConfig?.enterAnimation || "fade"] || enterVariants.fade}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg"
          >
            <button 
              onClick={handleEnter}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 animate-pulse"
              style={{ color: 'var(--accent-color, #ffffff)' }}
            >
              [ {uiConfig?.loadingText || "Clique para Entrar"} ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
