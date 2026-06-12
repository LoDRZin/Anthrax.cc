import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MobileMenu } from "@/components/dashboard/MobileMenu";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  let username = "";
  let userDetails: { name: string; email: string; imageUrl?: string } | undefined = undefined;

  if (userId) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
        select: { username: true },
      });
      username = profile?.username || "";
      
      const user = await currentUser();
      if (user) {
        userDetails = {
          name: user.fullName || user.firstName || user.username || "Usuário",
          email: user.emailAddresses[0]?.emailAddress || "",
          imageUrl: user.imageUrl || "",
        };
      }
    } catch (error) {
      console.error("Error fetching user profile in layout:", error);
    }
  }

  return (
    <ClerkProvider localization={ptBR}>
      <div className="flex h-screen w-full bg-[#030303] text-white relative font-sans overflow-hidden">
        {/* Background Noise overlay */}
        <div 
          className="fixed inset-0 opacity-[0.015] pointer-events-none z-0" 
          style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} 
        />

        {/* Background Glow effects */}
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

        {/* Sidebar Navigation (always visible on desktop, hidden on mobile) */}
        <Sidebar username={username} user={userDetails} />

        {/* Mobile Menu Drawer (drawer panel that opens via isSidebarOpen) */}
        <MobileMenu user={userDetails} />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
          <DashboardHeader username={username} />
          
          {/* Main scrollable body */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
            {children}
          </div>
        </main>
      </div>
    </ClerkProvider>
  );
}
