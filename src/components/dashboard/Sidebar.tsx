"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Link as LinkIcon, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
  { href: "/links", label: "Seus Links", icon: LinkIcon },
  { href: "/appearance", label: "Aparência", icon: Palette },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/5 bg-black/60 backdrop-blur-2xl hidden md:flex flex-col relative overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-white/5 blur-3xl rounded-full -translate-y-1/2 pointer-events-none" />

      <div className="h-16 flex items-center px-6 border-b border-white/5 z-10">
        <h1 className="text-xl font-bold font-mono tracking-tighter drop-shadow-md">
          Anthrax<span className="text-white/40">.cc</span>
        </h1>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 z-10 relative">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                isActive ? "text-white" : "text-white/50 hover:text-white/90"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-white/10 border border-white/10 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon className="h-4 w-4 relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 flex items-center gap-3 z-10 bg-black/20">
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8 rounded-md ring-1 ring-white/10",
              userButtonPopoverCard: "bg-black/90 border border-white/10 backdrop-blur-xl",
            }
          }}
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white/90">Minha Conta</span>
          <span className="text-xs text-white/40">Configurar Perfil</span>
        </div>
      </div>
    </aside>
  );
}
