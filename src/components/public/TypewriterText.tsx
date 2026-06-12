"use client";

import { motion } from "framer-motion";

export default function TypewriterText({ text, className = "", enabled = true }: { text: string, className?: string, enabled?: boolean }) {
  if (!enabled) {
    return <p className={className}>{text}</p>;
  }

  const words = text.split(" ");

  return (
    <p className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            delay: i * 0.1, // Stagger effect
          }}
          className="inline-block mr-1"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}
