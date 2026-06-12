"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "@/store/audioStore";

export default function BackgroundParticles({ effect, interact = false }: { effect?: string, interact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number | null, y: number | null }>({ x: null, y: null });

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

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    if (interact) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseleave", onMouseLeave);
    }

    type Particle = {
      x: number;
      y: number;
      size: number;
      baseSize: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
      life?: number;
      angle?: number;
    };

    const count = effect === "fogo" ? 150 : effect === "bolhas" ? 50 : 80;
    const particles: Particle[] = [];

    const createParticle = (): Particle => {
      let speedX = (Math.random() - 0.5) * 0.3;
      let speedY = (Math.random() - 0.5) * 0.5;
      let color = "#ffffff";
      let size = Math.random() * 2 + 1;
      let life = undefined;
      let angle = undefined;

      if (effect === "matrix") {
        speedX = (Math.random() - 0.5) * 0.5;
        color = "#00ff41";
      } else if (effect === "snow") {
        speedY = Math.random() * 1 + 0.3;
      } else if (effect === "fogo") {
        speedX = (Math.random() - 0.5) * 1;
        speedY = -(Math.random() * 2 + 1); // Upwards
        const colors = ["#ff4500", "#ff8c00", "#ffd700", "#ff0000"];
        color = colors[Math.floor(Math.random() * colors.length)];
        size = Math.random() * 4 + 2;
        life = 1.0;
      } else if (effect === "bolhas") {
        speedY = -(Math.random() * 1 + 0.5); // Upwards
        size = Math.random() * 6 + 2;
        angle = Math.random() * Math.PI * 2;
      }

      return {
        x: Math.random() * width,
        y: effect === "fogo" ? height + 10 : Math.random() * height,
        size,
        baseSize: size,
        speedX,
        speedY,
        opacity: Math.random() * 0.5 + 0.2,
        color,
        life,
        angle
      };
    };

    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }

    const drawConnections = (p: Particle) => {
      for (const other of particles) {
        const dx = p.x - other.x;
        const dy = p.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = effect === "matrix" 
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
      const sizeMultiplier = 1 + bassIntensity * 2;
      const speedMultiplier = 1 + bassIntensity * 1.5;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (effect === "bolhas" && p.angle !== undefined) {
          p.x += Math.sin(p.angle) * 0.5;
          p.angle += 0.05;
        } else {
          p.x += p.speedX * speedMultiplier;
        }
        
        p.y += p.speedY * speedMultiplier;

        if (effect === "fogo" && p.life !== undefined) {
          p.life -= 0.01;
          p.size = p.baseSize * p.life;
          p.opacity = p.life;
          if (p.life <= 0) particles[i] = createParticle();
        } else {
          if (p.y > height + 20) p.y = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.x < -20) p.x = width + 20;
        }

        // Interação com o mouse (Repulsão)
        if (interact && mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            p.x += dx * force * 0.5;
            p.y += dy * force * 0.5;
          }
        }

        const currentSize = p.size * (effect === "fogo" ? 1 : sizeMultiplier);

        ctx.beginPath();
        if (effect === "matrix") {
          ctx.fillStyle = `rgba(0,255,65,${p.opacity})`;
          ctx.fillRect(p.x, p.y, currentSize, currentSize);
        } else if (effect === "bolhas") {
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,255,255,${p.opacity})`;
          ctx.stroke();
        } else {
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }

        if (effect !== "fogo" && effect !== "bolhas") {
          drawConnections(p);
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", onResize);
      if (interact) {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseleave", onMouseLeave);
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [effect, interact]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-70" />;
}
