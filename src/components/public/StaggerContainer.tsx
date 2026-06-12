"use client";

import React from "react";
import { motion } from "framer-motion";

export default function StaggerContainer({ children, enabled = true, className = "" }: { children: React.ReactNode, enabled?: boolean, className?: string }) {
  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.15 }
        }
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
          }}
          className={child && (child as any).props.className?.includes("w-[47%]") ? "w-[47%]" : "w-full"}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
