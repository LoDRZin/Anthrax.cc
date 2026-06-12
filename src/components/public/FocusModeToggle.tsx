"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function FocusModeToggle() {
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    if (focus) {
      document.body.classList.add("focus-mode");
    } else {
      document.body.classList.remove("focus-mode");
    }
    return () => {
      document.body.classList.remove("focus-mode");
    };
  }, [focus]);

  return (
    <button
      onClick={() => setFocus(!focus)}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-black/50 border border-white/10 backdrop-blur-md flex items-center justify-center text-white/50 hover:text-white transition-all hover:scale-110"
      title="Toggle Focus Mode"
    >
      {focus ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  );
}
