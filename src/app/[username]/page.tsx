import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import AudioGatekeeper from "@/components/public/AudioGatekeeper";
import BackgroundParticles from "@/components/public/BackgroundParticles";
import DiscordPresence from "@/components/public/DiscordPresence";
import MagneticButton from "@/components/public/MagneticButton";
import { DynamicWidget } from "@/components/widgets/DynamicWidget";
import CursorFollower from "@/components/public/CursorFollower";
import VideoBackground from "@/components/public/VideoBackground";
import NoiseOverlay from "@/components/public/NoiseOverlay";
import { headers } from "next/headers";
import { createHash } from "crypto";
import ClientWebGL from "@/components/public/ClientWebGL";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const p = await params;
  const profile = await prisma.profile.findUnique({ where: { username: p.username } });
  
  if (!profile) return { title: "Perfil não encontrado" };

  return {
    title: `${profile.displayName || profile.username} | Anthrax.cc`,
    description: profile.bio || "Confira meus links!",
    openGraph: {
      title: `${profile.displayName || profile.username} | Anthrax.cc`,
      description: profile.bio || "Confira meus links!",
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
    },
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const p = await params;
  const profile = await prisma.profile.findUnique({ 
    where: { username: p.username },
    include: { 
      links: { orderBy: { order: "asc" } },
      widgets: { where: { active: true }, orderBy: { order: "asc" } }
    }
  });

  if (!profile) {
    notFound();
  }

  // Registra a view com IP real hasheado para evitar inflação por F5
  const headersList = await headers();
  const rawIp = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
  const ip = rawIp.split(",")[0].trim();
  const ipHash = createHash("sha256").update(ip + profile.id).digest("hex");

  // Verifica se esse IP já viu hoje (anti-spam de F5)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const alreadyViewed = await prisma.pageView.findFirst({
    where: { profileId: profile.id, ipHash, createdAt: { gte: today } },
  });

  if (!alreadyViewed) {
    await Promise.all([
      prisma.pageView.create({ data: { profileId: profile.id, ipHash } }),
      prisma.profile.update({ where: { id: profile.id }, data: { views: { increment: 1 } } }),
    ]);
  }

  // Pega o total real de views
  const updatedProfile = await prisma.profile.findUnique({ where: { id: profile.id }, select: { views: true } });

  // Parse das configurações estéticas avançadas (Parte 1)
  let uiConfig: any = {};
  try {
    if (profile.uiConfig) uiConfig = JSON.parse(profile.uiConfig);
  } catch (e) {}

  return (
    <div 
      className="min-h-screen bg-[#0a0a0a] text-white relative flex justify-center items-center overflow-hidden"
      style={{
        '--accent-color': uiConfig.accentColor || '#ffffff',
        '--border-radius': uiConfig.borderRadius || '12px',
        '--glass-intensity': uiConfig.glassIntensity || '10px',
        '--glow-color': uiConfig.glowColor || 'rgba(255,255,255,0.1)'
      } as React.CSSProperties}
    >
      {uiConfig.customCss && <style dangerouslySetInnerHTML={{ __html: uiConfig.customCss }} />}
      {uiConfig.noiseOverlay && <NoiseOverlay />}
      <CursorFollower cursorStyle={uiConfig.cursorStyle || "default"} />

      {profile.backgroundType === "webgl" ? (
        <ClientWebGL scene={profile.webglScene || "synthwave"} />
      ) : profile.backgroundType === "video" ? (
        <VideoBackground videoUrl={uiConfig.videoBgUrl} />
      ) : (
        <BackgroundParticles effect={profile.effect || "snow"} />
      )}
      
      <AudioGatekeeper audioUrl={profile.audioUrl || undefined} />
      
      {/* Imagem de Fundo (Simulada para agora) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" 
        style={{ backgroundImage: profile.backgroundUrl ? `url(${profile.backgroundUrl})` : 'url(https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* Container Principal Glassmorphism */}
      <div className="relative z-10 w-full max-w-lg mx-auto p-6 flex flex-col items-center">
        {/* Avatar */}
        <div 
          className="w-28 h-28 rounded-full border-4 border-white/20 overflow-hidden mb-6 backdrop-blur-sm"
          style={{ boxShadow: '0 0 calc(30px + var(--bass, 0) * 150px) rgba(255,255,255,0.3)' }}
        >
          <Image 
            src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
            alt={profile.displayName || profile.username}
            width={112}
            height={112}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Info */}
        <h1 className="text-3xl font-bold mb-2 tracking-tight drop-shadow-md text-center">
          {profile.displayName || profile.username}
        </h1>
        {profile.bio && (
          <p className="text-white/80 text-center mb-6 max-w-sm drop-shadow-sm font-medium">
            {profile.bio}
          </p>
        )}

        {/* Discord Lanyard */}
        {profile.discordId && (
          <DiscordPresence discordId={profile.discordId} />
        )}

        {/* Lista de Links Dinâmica */}
        <div className={`w-full flex ${
          uiConfig.layout === "grid" ? "flex-row flex-wrap justify-center gap-4" : "flex-col space-y-4"
        }`}>
          {profile.links.map((link) => (
            <MagneticButton key={link.id} href={link.url} className={uiConfig.layout === "grid" ? "w-[47%]" : "w-full"}>
              <div 
                className="group relative w-full overflow-hidden p-4 flex items-center justify-center transition-all duration-300 backdrop-blur-md"
                style={{ 
                  borderRadius: 'var(--border-radius)', 
                  boxShadow: '0 4px 20px var(--glow-color)',
                  backdropFilter: 'blur(var(--glass-intensity))',
                  WebkitBackdropFilter: 'blur(var(--glass-intensity))',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10 font-semibold text-lg drop-shadow-md" style={{ color: 'var(--accent-color)' }}>{link.title}</span>
              </div>
            </MagneticButton>
          ))}
        </div>

        {/* Widgets Dinâmicos */}
        {profile.widgets && profile.widgets.length > 0 && (
          <div className="w-full mt-6 space-y-4">
            {profile.widgets.map((widget) => (
              <DynamicWidget key={widget.id} widget={widget} />
            ))}
          </div>
        )}

        {/* Views & Marca D'água */}
        <div className="mt-16 mb-4 flex flex-col items-center gap-2">
          <p className="text-white/30 text-xs font-mono">{updatedProfile?.views ?? profile.views} views</p>
          <Link href="/" className="text-white/40 hover:text-white/80 transition-colors text-sm font-bold tracking-widest uppercase">
            Anthrax<span className="text-primary">.cc</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
