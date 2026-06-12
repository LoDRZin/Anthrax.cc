import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Globe, Mail, ShoppingBag } from "lucide-react";
import { FaInstagram, FaTwitter, FaGithub, FaYoutube } from "react-icons/fa";
import dynamic from "next/dynamic";
import AudioGatekeeper from "@/components/public/AudioGatekeeper";
import BackgroundParticles from "@/components/public/BackgroundParticles";
import DiscordPresence from "@/components/public/DiscordPresence";
import MagneticButton from "@/components/public/MagneticButton";
import TiltCard from "@/components/public/TiltCard";
import TypewriterText from "@/components/public/TypewriterText";
import RotatingBio from "@/components/public/RotatingBio";
import ConfettiWrapper from "@/components/public/ConfettiWrapper";
import StaggerContainer from "@/components/public/StaggerContainer";
import EasterEggsEngine from "@/components/public/EasterEggsEngine";
import CustomContextMenu from "@/components/public/CustomContextMenu";
import ProfileActions from "@/components/public/ProfileActions";
import { DynamicWidget } from "@/components/widgets/DynamicWidget";
import CursorFollower from "@/components/public/CursorFollower";
import Guestbook from "@/components/public/Guestbook";
import ProfileRating from "@/components/public/ProfileRating";
import FocusModeToggle from "@/components/public/FocusModeToggle";
import VisitorThemeToggle from "@/components/public/VisitorThemeToggle";
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
      widgets: { where: { active: true }, orderBy: { order: "asc" } },
      guestbook: { orderBy: { createdAt: "desc" } },
      ratings: true
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

  const fontName = uiConfig.fontFamily || 'Inter';
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;

  return (
    <div 
      className={`min-h-screen bg-[#0a0a0a] text-white relative flex justify-center items-center overflow-hidden ${uiConfig.monoFont ? 'font-mono' : ''}`}
      style={{
        '--accent-color': uiConfig.accentColor || '#ffffff',
        '--border-radius': uiConfig.borderRadius || '12px',
        '--glass-intensity': uiConfig.glassIntensity || '10px',
        '--glow-color': uiConfig.glowColor || 'rgba(255,255,255,0.1)',
        fontFamily: uiConfig.monoFont ? undefined : `'${fontName}', sans-serif`,
        textShadow: uiConfig.textShadow || undefined,
        letterSpacing: uiConfig.letterSpacing !== "normal" ? uiConfig.letterSpacing : undefined,
        lineHeight: uiConfig.lineHeight || undefined,
        textAlign: uiConfig.textAlign || 'center',
        textTransform: uiConfig.textTransform !== "none" ? uiConfig.textTransform : undefined
      } as React.CSSProperties}
    >
      <link rel="stylesheet" href={fontUrl} />
      {uiConfig.customCss && <style dangerouslySetInnerHTML={{ __html: uiConfig.customCss }} />}
      {uiConfig.noiseOverlay && <NoiseOverlay />}
      <CursorFollower cursorStyle={uiConfig.cursorStyle || "default"} />
      <EasterEggsEngine />
      <CustomContextMenu profileUrl={`https://anthrax.cc/${profile.username}`} />
      <ProfileActions profileUrl={`https://anthrax.cc/${profile.username}`} />
      {uiConfig.enableFocusMode && <FocusModeToggle />}
      {uiConfig.enableVisitorThemes && <VisitorThemeToggle />}

      {profile.backgroundType === "webgl" ? (
        <ClientWebGL scene={profile.webglScene || "synthwave"} />
      ) : profile.backgroundType === "video" ? (
        <VideoBackground videoUrl={uiConfig.videoBgUrl} />
      ) : (
        <BackgroundParticles effect={profile.effect || "snow"} interact={!!uiConfig.particleInteraction} />
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
        <TiltCard enabled={!!uiConfig.enable3dTilt}>
          <ConfettiWrapper enabled={!!uiConfig.confettiEnabled}>
            <div 
              className={`w-28 h-28 rounded-full border-4 border-white/20 overflow-hidden mb-6 backdrop-blur-sm cursor-pointer ${
                uiConfig.glitchAvatar ? "hover:animate-pulse hover:mix-blend-difference" : ""
              } ${uiConfig.avatarPulse ? "animate-pulse" : ""} transition-all duration-300 hover:scale-105`}
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
          </ConfettiWrapper>
        </TiltCard>

        {/* Info */}
        <h1 
          className="text-3xl font-bold mb-2 tracking-tight drop-shadow-md text-center relative"
          style={uiConfig.textGradient ? {
            backgroundImage: uiConfig.textGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent"
          } : {}}
        >
          {uiConfig.manualStatus && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/10 text-white backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/10">
              {uiConfig.manualStatus}
            </div>
          )}
          {(() => {
            const hour = new Date().getHours();
            let greeting = "Bom dia";
            if (hour >= 12 && hour < 18) greeting = "Boa tarde";
            if (hour >= 18 || hour < 5) greeting = "Boa noite";
            return <span className="block text-sm text-white/50 mb-1 font-normal tracking-wider uppercase" style={{ WebkitTextFillColor: "initial", color: "inherit" }}>{greeting},</span>;
          })()}
          {profile.displayName || profile.username}
        </h1>
        {profile.bio && (
          <div className="text-white/80 mb-6 max-w-sm drop-shadow-sm font-medium" style={{ textAlign: uiConfig.textAlign || "center" }}>
            {uiConfig.rotatingBio ? (
              <RotatingBio bio={profile.bio} words={uiConfig.rotatingWords || ""} />
            ) : (
              <TypewriterText 
                text={profile.bio} 
                enabled={!!uiConfig.typewriterBio}
              />
            )}
          </div>
        )}

        {/* Discord Lanyard */}
        {profile.discordId && (
          <DiscordPresence discordId={profile.discordId} />
        )}

        {/* Lista de Links Dinâmica */}
        <StaggerContainer 
          enabled={!!uiConfig.staggeredEntry} 
          className={`w-full flex ${
            uiConfig.layout === "grid" ? "flex-row flex-wrap justify-center gap-4" : "flex-col space-y-4"
          }`}
        >
          {profile.links.map((link) => {
            
            // Lógica de Efeitos Hover
            let hoverClass = "group-hover:bg-white/10";
            if (uiConfig.linkHoverEffect === "glow") hoverClass = "group-hover:bg-[var(--accent-color)] group-hover:opacity-20";
            if (uiConfig.linkHoverEffect === "ripple") hoverClass = "group-active:bg-white/30 group-hover:bg-white/10";
            if (uiConfig.linkHoverEffect === "shake") hoverClass = "hover:animate-bounce group-hover:bg-white/10";

            return (
              <MagneticButton key={link.id} href={link.url} className={uiConfig.layout === "grid" ? "w-[47%]" : "w-full"}>
                <ConfettiWrapper enabled={!!uiConfig.confettiEnabled} className="w-full">
                  <div 
                    className={`group relative w-full overflow-hidden p-4 flex items-center justify-center transition-all duration-300 backdrop-blur-md ${
                      uiConfig.linkHoverEffect === "shake" ? "hover:animate-pulse" : ""
                    }`}
                    style={{ 
                      borderRadius: 'var(--border-radius)', 
                      boxShadow: '0 4px 20px var(--glow-color)',
                      backdropFilter: 'blur(var(--glass-intensity))',
                      WebkitBackdropFilter: 'blur(var(--glass-intensity))',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <div className={`absolute inset-0 bg-white/5 transition-all duration-300 ${hoverClass}`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative z-10 font-semibold text-lg drop-shadow-md flex items-center gap-3" style={{ color: 'var(--accent-color)' }}>
                      {link.icon === "Instagram" && <FaInstagram size={20} />}
                      {link.icon === "Twitter" && <FaTwitter size={20} />}
                      {link.icon === "Github" && <FaGithub size={20} />}
                      {link.icon === "Youtube" && <FaYoutube size={20} />}
                      {link.icon === "Globe" && <Globe size={20} />}
                      {link.icon === "Mail" && <Mail size={20} />}
                      {link.icon === "ShoppingBag" && <ShoppingBag size={20} />}
                      {link.title}
                    </span>
                  </div>
                </ConfettiWrapper>
              </MagneticButton>
            );
          })}
        </StaggerContainer>

        {/* Widgets Dinâmicos */}
        {profile.widgets && profile.widgets.length > 0 && (
          <div className="w-full mt-6 space-y-4 focus-mode-hide">
            {profile.widgets.map((widget) => (
              <DynamicWidget key={widget.id} widget={widget} />
            ))}
          </div>
        )}

        {/* Guestbook */}
        {uiConfig.enableGuestbook && (
          <div className="w-full focus-mode-hide">
            <Guestbook profileId={profile.id} entries={profile.guestbook} />
          </div>
        )}

        {/* Avaliação */}
        {uiConfig.enableRating && (
          <div className="w-full focus-mode-hide">
            <ProfileRating 
              profileId={profile.id} 
              totalRatings={profile.ratings.length}
              initialRating={
                profile.ratings.length > 0 
                  ? Math.round(profile.ratings.reduce((a: any, b: any) => a + b.rating, 0) / profile.ratings.length) 
                  : 0
              }
              hasRated={profile.ratings.some((r: any) => r.ipHash === ipHash)}
            />
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
