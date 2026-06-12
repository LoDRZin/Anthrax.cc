"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Palette, Link as LinkIcon, Sparkles, BarChart3, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardStore } from "@/lib/dashboard-store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/settings", label: "Perfil", icon: User },
  { href: "/appearance", label: "Aparência", icon: Palette },
  { href: "/links", label: "Links", icon: LinkIcon },
  { href: "/appearance#effects", label: "Efeitos", icon: Sparkles },
  { href: "/dashboard", label: "Analytics", icon: BarChart3 },
];

interface MobileMenuProps {
  user?: {
    name: string;
    email: string;
    imageUrl?: string;
  };
}

export function MobileMenu({ user }: MobileMenuProps) {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useDashboardStore();

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 md:hidden"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-zinc-950/95 border-r border-white/5 backdrop-blur-2xl z-50 p-6 flex flex-col justify-between md:hidden"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <Link href="/dashboard" className="flex items-center gap-2 group" onClick={() => setSidebarOpen(false)}>
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    <span className="text-black font-black text-sm tracking-tighter">A</span>
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-white">
                    Anthrax<span className="text-purple-400 font-extralight">.cc</span>
                  </h1>
                </Link>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 hover:text-white transition-all duration-300"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "relative flex items-center gap-3.5 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group outline-none",
                        isActive ? "text-white bg-purple-500/10 border-l-4 border-purple-500" : "text-white/40 hover:text-white/80 hover:bg-white/5"
                      )}
                    >
                      <item.icon className={cn(
                        "h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-105",
                        isActive ? "text-purple-400" : "text-white/40 group-hover:text-white/70"
                      )} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer with User Card */}
            {user && (
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
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
