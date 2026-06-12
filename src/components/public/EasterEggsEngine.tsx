"use client";

import { useEffect, useState } from "react";

export default function EasterEggsEngine() {
  const [bsod, setBsod] = useState(false);

  useEffect(() => {
    // 1. Console Message
    console.log(
      "%c Welcome to Anthrax.cc \n%c The Ultimate Link-in-Bio platform.",
      "color: #ff00ff; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 0 #00ffff;",
      "color: #00ffff; font-size: 14px;"
    );

    // 2. Keyboard listeners for Easter Eggs
    let konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let konamiIndex = 0;

    let matrixCode = ["m", "a", "t", "r", "i", "x"];
    let matrixIndex = 0;

    let bsodCode = ["b", "s", "o", "d"];
    let bsodIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar se o usuário estiver digitando em um input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Konami Code
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          document.body.style.filter = "invert(1) hue-rotate(180deg)";
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }

      // Matrix Code
      if (e.key === matrixCode[matrixIndex]) {
        matrixIndex++;
        if (matrixIndex === matrixCode.length) {
          // Fallback simple effect
          document.body.style.fontFamily = "monospace";
          document.body.style.color = "#00ff41";
          matrixIndex = 0;
        }
      } else {
        matrixIndex = 0;
      }

      // BSOD Code
      if (e.key === bsodCode[bsodIndex]) {
        bsodIndex++;
        if (bsodIndex === bsodCode.length) {
          setBsod(true);
          bsodIndex = 0;
        }
      } else {
        bsodIndex = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (bsod) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0000aa] text-white flex flex-col p-16 font-mono cursor-none" onClick={() => setBsod(false)}>
        <p className="bg-white text-[#0000aa] inline-block px-2 py-1 mb-8 w-max font-bold">Windows</p>
        <p className="mb-4 text-xl">A fatal exception 0E has occurred at 0157:BF7FF831. The current application will be terminated.</p>
        <ul className="list-none space-y-2 mb-8 ml-4">
          <li>* Press any key to terminate the current application.</li>
          <li>* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</li>
        </ul>
        <p className="text-center mt-auto mb-16">Press any key to continue _</p>
      </div>
    );
  }

  return null;
}
