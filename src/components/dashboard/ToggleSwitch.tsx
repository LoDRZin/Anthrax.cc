"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled,
}: ToggleSwitchProps) {
  const handleToggle = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <div
      onClick={handleToggle}
      className={cn(
        "flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300 select-none",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {(label || description) && (
        <div className="flex flex-col gap-0.5 max-w-[80%] pr-4">
          {label && (
            <span className="text-sm font-semibold text-white/95">{label}</span>
          )}
          {description && (
            <span className="text-xs text-white/50 leading-relaxed font-light">
              {description}
            </span>
          )}
        </div>
      )}

      {/* Switch Pill */}
      <div
        className={cn(
          "w-11 h-6 rounded-full p-0.5 transition-colors duration-300 relative border shrink-0",
          checked
            ? "bg-purple-600/20 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
            : "bg-black/60 border-white/10"
        )}
      >
        <motion.div
          className={cn(
            "w-4.5 h-4.5 rounded-full shadow-md relative z-10",
            checked
              ? "bg-gradient-to-tr from-purple-400 to-blue-400"
              : "bg-white/40"
          )}
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        {/* Glow indicator inside switch */}
        {checked && (
          <div className="absolute inset-0 bg-purple-500/10 blur-sm rounded-full pointer-events-none" />
        )}
      </div>
    </div>
  );
}
