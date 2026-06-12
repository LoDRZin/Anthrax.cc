"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Palette, Link as LinkIcon, Sparkles, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/settings", label: "Perfil", icon: User },
  { href: "/appearance", label: "Aparência", icon: Palette },
  { href: "/links", label: "Links", icon: LinkIcon },
  { href: "/appearance#effects", label: "Efeitos", icon: Sparkles },
  { href: "/dashboard", label: "Analytics", icon: BarChart3 },
];

interface SidebarProps {
  username?: string;
  user?: {
    name: string;
    email: string;
    imageUrl?: string;
  };
}

export function Sidebar({ username, user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/5 bg-zinc-950/60 backdrop-blur-2xl hidden md:flex flex-col h-full select-none z-30 justify-between">
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-transform duration-300">
              <span className="text-black font-black text-sm tracking-tighter">A</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white transition-colors">
              Anthrax<span className="text-purple-400 font-extralight">.cc</span>
            </h1>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 py-8 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group outline-none",
                  isActive ? "text-white" : "text-white/40 hover:text-white/80 hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-sidebar-item"
                    className="absolute inset-0 bg-purple-500/10 border-l-4 border-purple-500 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                <item.icon className={cn(
                  "h-4.5 w-4.5 relative z-10 transition-transform duration-300 group-hover:scale-105",
                  isActive ? "text-purple-400" : "text-white/40 group-hover:text-white/70"
                )} />
                <span className="relative z-10 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Section with User Card */}
      {user && (
        <div className="p-4 border-t border-white/5">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">{user.name}</span>
              <span className="text-xs text-white/40 truncate">{user.email}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
