"use client";

import React, { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StyledButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children: React.ReactNode;
}

export function StyledButton({
  className,
  isLoading,
  variant = "primary",
  disabled,
  children,
  ...props
}: StyledButtonProps) {
  const isButtonDisabled = disabled || isLoading;

  const baseStyles =
    "relative inline-flex items-center justify-center font-bold text-sm h-11 px-6 rounded-xl transition-all select-none outline-none cursor-pointer overflow-hidden";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-purple-600 via-violet-600 to-blue-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] border-0",
    secondary:
      "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white/90 hover:text-white shadow-inner",
    danger:
      "bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300",
    ghost: "bg-transparent hover:bg-white/5 text-white/70 hover:text-white border-0",
  };

  return (
    <motion.button
      whileHover={isButtonDisabled ? undefined : { scale: 1.015 }}
      whileTap={isButtonDisabled ? undefined : { scale: 0.985 }}
      disabled={isButtonDisabled}
      className={cn(baseStyles, variantStyles[variant], "disabled:opacity-50 disabled:cursor-not-allowed", className)}
      {...props}
    >
      {/* Light shimmer swipe animation for primary button */}
      {variant === "primary" && !isButtonDisabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-[100%] hover:animate-shimmer pointer-events-none" />
      )}
      
      {isLoading ? (
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Carregando...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}
