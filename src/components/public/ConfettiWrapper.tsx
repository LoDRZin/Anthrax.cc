"use client";

import React from "react";
import confetti from "canvas-confetti";

export default function ConfettiWrapper({ children, enabled = true, className = "" }: { children: React.ReactNode, enabled?: boolean, className?: string }) {
  const handleClick = (e: React.MouseEvent) => {
    if (enabled) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x, y },
        colors: ["#ff00ff", "#00ffff", "#ffffff"]
      });
    }
  };

  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
}
