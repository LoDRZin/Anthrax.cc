"use client";

import React, { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
}

export const StyledInput = React.forwardRef<HTMLInputElement, StyledInputProps>(
  ({ className, label, icon: Icon, error, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-2 select-none">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-bold uppercase tracking-widest text-white/60 block"
          >
            {label}
          </label>
        )}
        <div className="relative group/input flex items-center">
          {Icon && (
            <div className="absolute left-4 text-white/40 group-focus-within/input:text-purple-400 transition-colors duration-300 pointer-events-none">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={cn(
              "w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-sm text-white placeholder-white/30 backdrop-blur-md outline-none transition-all duration-300",
              Icon ? "pl-11" : "pl-4",
              error
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                : "hover:border-white/20 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          {/* Subtle glow container */}
          <div
            className={cn(
              "absolute inset-0 -z-10 rounded-xl blur-md transition-all duration-300 pointer-events-none opacity-0 group-focus-within/input:opacity-100",
              error ? "bg-red-500/5" : "bg-purple-500/5"
            )}
          />
        </div>
        {error && (
          <span className="text-xs font-medium text-red-400 block animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
);

StyledInput.displayName = "StyledInput";
