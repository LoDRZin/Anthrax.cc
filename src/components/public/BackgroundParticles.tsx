"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "@/store/audioStore";

export default function BackgroundParticles({ effect }: { effect?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!effect || effect === "none") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    type Particle = {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    };

    const particles: Particle[] = [];
    const count = 80;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: effect === "matrix" ? (Math.random() - 0.5) * 0.5 : (Math.random() - 0.5) * 0.3,
        speedY: effect === "snow" ? Math.random() * 1 + 0.3 : (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: effect === "matrix" ? "#00ff41" : "#ffffff",
      });
    }

    const drawConnections = (p: Particle) => {
      for (const other of particles) {
        const dx = p.x - other.x;
        const dy = p.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle =
            effect === "matrix"
              ? `rgba(0,255,65,${0.2 * (1 - dist / 150)})`
              : `rgba(255,255,255,${0.15 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const bassIntensity = useAudioStore.getState().getBassIntensity();
      const sizeMultiplier = 1 + bassIntensity * 2; // Partículas até 3x maiores na batida
      const speedMultiplier = 1 + bassIntensity * 1.5; // Até 2.5x mais rápidas

      for (const p of particles) {
        p.x += p.speedX * speedMultiplier;
        p.y += p.speedY * speedMultiplier;

        // Wrap particles
        if (p.y > height) p.y = 0;
        if (p.y < 0) p.y = height;
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        const currentSize = p.size * sizeMultiplier;

        ctx.beginPath();
        if (effect === "matrix") {
          ctx.fillStyle = `rgba(0,255,65,${p.opacity})`;
          ctx.fillRect(p.x, p.y, currentSize, currentSize);
        } else {
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
          ctx.fill();
        }

        if (effect === "matrix" || effect === "snow") {
          drawConnections(p);
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [effect]);

  if (!effect || effect === "none") return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
