"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ExternalLink, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useDashboardStore } from "@/lib/dashboard-store";

const PATH_TITLES: Record<string, string> = {
  "/dashboard": "Visão Geral",
  "/links": "Seus Links",
  "/appearance": "Aparência",
  "/settings": "Configurações",
};

interface DashboardHeaderProps {
  username: string;
}

export function DashboardHeader({ username }: DashboardHeaderProps) {
  const pathname = usePathname();
  const currentTitle = PATH_TITLES[pathname] || "Dashboard";
  const { toggleSidebar } = useDashboardStore();

  return (
    <header className="h-20 border-b border-white/5 bg-zinc-950/40 backdrop-blur-md px-6 md:px-10 flex items-center justify-between z-20 relative select-none">
      {/* Left side: title + hamburger */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 hover:text-white transition-all duration-300 cursor-pointer active:scale-95"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={18} />
        </button>

        <motion.h1
          key={pathname}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-lg md:text-xl font-bold tracking-tight text-white/90 font-sans"
        >
          {currentTitle}
        </motion.h1>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {username && (
          <Link
            href={`/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs md:text-sm font-semibold text-white rounded-xl bg-gradient-to-br from-purple-600 via-violet-600 to-blue-500 hover:text-white focus:ring-2 focus:outline-none focus:ring-blue-800 transition-all duration-300 shadow-[0_0_15px_rgba(147,51,234,0.25)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] cursor-pointer"
          >
            <span className="relative px-3 py-1.5 md:px-4 md:py-2 transition-all ease-in duration-75 bg-zinc-950 rounded-[10px] group-hover:bg-opacity-0 flex items-center gap-2">
              <span>Ver Perfil</span>
              <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </Link>
        )}

        <div className="flex items-center gap-3 border-l border-white/10 pl-4">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 rounded-xl ring-2 ring-purple-500/20 hover:ring-purple-500/50 transition-all duration-300",
                userButtonPopoverCard: "bg-zinc-950/95 border border-white/10 backdrop-blur-xl shadow-2xl",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
