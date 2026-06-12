import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  let username = "";

  if (userId) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
        select: { username: true },
      });
      username = profile?.username || "";
    } catch (error) {
      console.error("Error fetching user profile in layout:", error);
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#030303] text-white relative font-sans overflow-hidden">
      {/* Background Noise with low opacity */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-0" 
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} 
      />

      {/* Background Glow effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Sidebar Navigation */}
      <Sidebar username={username} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <DashboardHeader username={username} />
        
        <div className="flex-1 overflow-auto p-4 md:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
          {children}
        </div>
      </main>
    </div>
  );
}
