import { UserButton } from "@clerk/nextjs";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-black">
      {/* Dynamic Background Noise */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="h-16 flex items-center justify-end px-6 border-b border-white/5 md:hidden backdrop-blur-xl bg-black/50">
           <UserButton />
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
          {children}
        </div>
      </main>
    </div>
  );
}
