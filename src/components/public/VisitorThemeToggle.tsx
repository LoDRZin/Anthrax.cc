"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function VisitorThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    if (isLight) {
      document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
    } else {
      document.documentElement.style.filter = "none";
    }
    return () => {
      document.documentElement.style.filter = "none";
    };
  }, [isLight]);

  return (
    <button
      onClick={() => setIsLight(!isLight)}
      className="fixed top-6 right-6 z-50 w-10 h-10 rounded-full bg-black/50 border border-white/10 backdrop-blur-md flex items-center justify-center text-white/50 hover:text-white transition-all hover:scale-110 focus-mode-hide"
      title="Toggle Theme"
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
