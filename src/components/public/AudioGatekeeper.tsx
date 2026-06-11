"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioStore } from "@/store/audioStore";

export default function AudioGatekeeper({ audioUrl }: { audioUrl?: string }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.crossOrigin = "anonymous"; // Essential for CORS Web Audio API
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      useAudioStore.getState().setIsActive(false);
    };
  }, [audioUrl]);

  const handleEnter = () => {
    setHasEntered(true);
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);

      // Initialize Web Audio API on user gesture
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256; // 128 data bins
        
        const source = ctx.createMediaElementSource(audioRef.current);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        
        audioContextRef.current = ctx;
        analyserRef.current = analyser;

        const updateFrequencyData = () => {
          if (analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            useAudioStore.getState().setFrequencyData(dataArray);
            
            // Inject bass intensity into CSS globally
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
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!hasEntered) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity">
        <button 
          onClick={handleEnter}
          className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 animate-pulse"
        >
          [ Clique para Entrar ]
        </button>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {hasEntered && audioUrl && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 right-4 z-40 flex items-center gap-2 p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full"
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
