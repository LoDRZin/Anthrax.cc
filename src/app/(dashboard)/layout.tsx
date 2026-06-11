import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, Settings, Link as LinkIcon, Palette } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <h1 className="text-xl font-bold font-mono tracking-tighter">Anthrax<span className="text-primary">.cc</span></h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-md transition-colors">
            <LayoutDashboard className="h-4 w-4" />
            Visão Geral
          </Link>
          <Link href="/links" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-md transition-colors">
            <LinkIcon className="h-4 w-4" />
            Seus Links
          </Link>
          <Link href="/appearance" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-md transition-colors">
            <Palette className="h-4 w-4" />
            Aparência
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-md transition-colors">
            <Settings className="h-4 w-4" />
            Configurações
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <UserButton />
          <span className="text-sm font-medium text-muted-foreground">Minha Conta</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-black/95">
        <header className="h-16 flex items-center justify-end px-6 border-b border-white/10 md:hidden">
           <UserButton />
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
