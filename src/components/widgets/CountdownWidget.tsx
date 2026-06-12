"use client";

import { useEffect, useState } from "react";

export default function CountdownWidget({ config }: { config: any }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (!config?.targetDate) return;
    
    const target = new Date(config.targetDate).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      setTimeLeft({
        d: Math.floor(distance / (1000 * 60 * 60 * 24)),
        h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config?.targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="w-full flex justify-center my-2">
      <div className="w-full max-w-sm rounded-xl overflow-hidden backdrop-blur-md bg-black/40 border border-white/10 flex flex-col p-4 items-center">
        {config.title && <h3 className="text-sm font-bold text-white mb-3">{config.title}</h3>}
        <div className="flex gap-4 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[var(--accent-color)]">{timeLeft.d}</span>
            <span className="text-[10px] uppercase text-white/50 tracking-wider">Dias</span>
          </div>
          <span className="text-2xl text-white/20 font-light">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[var(--accent-color)]">{timeLeft.h.toString().padStart(2, '0')}</span>
            <span className="text-[10px] uppercase text-white/50 tracking-wider">Hrs</span>
          </div>
          <span className="text-2xl text-white/20 font-light">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[var(--accent-color)]">{timeLeft.m.toString().padStart(2, '0')}</span>
            <span className="text-[10px] uppercase text-white/50 tracking-wider">Min</span>
          </div>
          <span className="text-2xl text-white/20 font-light">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-[var(--accent-color)] animate-pulse">{timeLeft.s.toString().padStart(2, '0')}</span>
            <span className="text-[10px] uppercase text-white/50 tracking-wider">Seg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
