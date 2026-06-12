"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Link as LinkIcon, Palette, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/lib/dashboard-store";
import { useEffect } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/links", label: "Seus Links", icon: LinkIcon },
  { href: "/appearance", label: "Aparência", icon: Palette },
  { href: "/settings", label: "Configurações", icon: Settings },
];

interface SidebarProps {
  username?: string;
}

export function Sidebar({ username }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useDashboardStore();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  const sidebarContent = (
    <div className="flex flex-col h-full relative z-30 select-none overflow-hidden bg-black/40 backdrop-blur-3xl border-r border-white/5 w-64">
      {/* Top ambient glow */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-purple-500/5 blur-3xl rounded-full -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-blue-500/5 blur-3xl rounded-full translate-y-1/2 pointer-events-none" />

      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/5 z-10 relative">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.35)] group-hover:scale-105 transition-all duration-300">
            <span className="text-black font-black text-sm tracking-tighter">A</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white/95 group-hover:text-white transition-colors">
            anthrax<span className="text-purple-400 font-extralight">.cc</span>
          </h1>
        </Link>

        {/* Close Button - Mobile Only */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-8 space-y-2 z-10 relative overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/5 [&::-webkit-scrollbar-track]:bg-transparent">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group outline-none",
                isActive ? "text-white" : "text-white/40 hover:text-white/80"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-sidebar-nav"
                  className="absolute inset-0 bg-white/[0.03] border border-white/10 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_8px_32px_rgba(168,85,247,0.05)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {/* Highlight bar on the left */}
              {isActive && (
                <motion.div
                  layoutId="active-sidebar-bar"
                  className="absolute left-0 w-1 h-5 rounded-r-full bg-gradient-to-b from-purple-400 to-blue-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              
              <item.icon className={cn(
                "h-5 w-5 relative z-10 transition-all duration-300 group-hover:scale-110",
                isActive ? "text-purple-400 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "text-white/40 group-hover:text-white/70"
              )} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer Account Badge */}
      {username && (
        <div className="p-4 m-4 border border-white/5 bg-zinc-950/40 rounded-2xl flex items-center gap-3.5 z-10 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500/10 to-blue-500/10 border border-white/5 flex items-center justify-center relative overflow-hidden shadow-inner">
            <User className="w-5 h-5 text-white/50 group-hover:text-white/80 transition-colors" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">Conta</span>
            <span className="text-sm font-bold text-white/90 truncate">@{username}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="w-64 hidden md:flex flex-col h-full shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Floating Overlay) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-45 md:hidden"
            />
            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-64 z-50 md:hidden flex flex-col h-full"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
