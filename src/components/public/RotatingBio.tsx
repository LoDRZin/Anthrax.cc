"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RotatingBio({ bio, words }: { bio: string; words: string }) {
  const wordsArray = words.split(",").map((w) => w.trim()).filter((w) => w.length > 0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (wordsArray.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % wordsArray.length);
    }, 2000); // Mudar a cada 2 segundos
    return () => clearInterval(interval);
  }, [wordsArray.length]);

  if (!bio.includes("{}") || wordsArray.length === 0) {
    return <span>{bio}</span>;
  }

  const parts = bio.split("{}");

  return (
    <span>
      {parts[0]}
      <span className="inline-block relative overflow-hidden" style={{ width: "max-content", minWidth: "100px", verticalAlign: "bottom" }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-block text-[var(--accent-color)] font-bold absolute left-0"
            style={{ whiteSpace: "nowrap" }}
          >
            {wordsArray[index]}
          </motion.span>
        </AnimatePresence>
        <span className="invisible whitespace-nowrap px-1">
          {wordsArray.reduce((a, b) => a.length > b.length ? a : b, "")}
        </span>
      </span>
      {parts[1]}
    </span>
  );
}
