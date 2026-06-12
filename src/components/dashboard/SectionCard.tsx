"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface SectionCardProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function SectionCard({
  title,
  description,
  icon: Icon,
  children,
  className,
  delay = 0,
}: SectionCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className={cn(
        "relative rounded-2xl bg-black/40 border border-white/5 backdrop-blur-3xl shadow-2xl p-6 md:p-8 overflow-hidden group/card transition-all duration-500 hover:border-white/10",
        className
      )}
    >
      {/* Border glow gradient on card hover */}
      <div className="absolute -inset-px bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-blue-500/0 group-hover/card:from-purple-500/10 group-hover/card:via-transparent group-hover/card:to-blue-500/10 transition-all duration-700 rounded-2xl pointer-events-none z-0" />
      
      {/* Soft inner ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/2 opacity-0 group-hover/card:opacity-100 blur-2xl rounded-full transition-opacity duration-700 pointer-events-none z-0" />

      {/* Card Header */}
      {(title || description) && (
        <div className="mb-6 flex flex-col gap-1.5 relative z-10 select-none">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-purple-400 group-hover/card:text-purple-300 group-hover/card:scale-105 transition-all duration-300">
                <Icon className="w-4.5 h-4.5" />
              </div>
            )}
            {title && (
              <h3 className="text-base font-bold text-white tracking-tight md:text-lg">
                {title}
              </h3>
            )}
          </div>
          {description && (
            <p className="text-xs text-white/50 leading-relaxed font-sans font-light md:text-sm">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10 w-full">{children}</div>
    </motion.section>
  );
}
