"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Globe, MessageSquare, Play, Star } from "lucide-react";
import { FaInstagram, FaGithub, FaTwitter } from "react-icons/fa";
import { useProfileStore } from "@/store/profile-store";
import { cn } from "@/lib/utils";

interface LiveProfilePreviewProps {
  avatarUrl?: string;
  backgroundUrl?: string;
  audioUrl?: string;
  effect?: string;
  displayName?: string;
  username?: string;
  bio?: string;
  config?: {
    layout: string;
    cursorStyle: string;
    borderRadius: string;
    glowColor: string;
    accentColor: string;
    glassIntensity: string;
    noiseOverlay: boolean;
    videoBgUrl: string;
    playerStyle: string;
    playerPosition: string;
    loadingText: string;
    manualStatus: string;
    fontFamily: string;
    textAlign: string;
    textShadow: string;
    letterSpacing: string;
    lineHeight: string;
    textGradient: string;
    monoFont: boolean;
    rotatingBio: boolean;
    rotatingWords: string;
    avatarPulse: boolean;
    glitchAvatar: boolean;
    enable3dTilt: boolean;
    enableGuestbook: boolean;
    enableRating: boolean;
  };
}

export function LiveProfilePreview(props: LiveProfilePreviewProps) {
  const [greeting, setGreeting] = useState("Boa noite");
  const store = useProfileStore();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Bom dia");
    else if (hour >= 12 && hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  // Use Zustand store if initialized, otherwise fallback to props
  const avatarUrl = store.isInitialized ? store.avatarUrl : (props.avatarUrl || "");
  const backgroundUrl = store.isInitialized ? store.backgroundUrl : (props.backgroundUrl || "");
  const audioUrl = store.isInitialized ? store.audioUrl : (props.audioUrl || "");
  const effect = store.isInitialized ? store.effect : (props.effect || "none");
  const displayName = store.isInitialized ? store.displayName : (props.displayName || "");
  const username = store.isInitialized ? store.username : (props.username || "");
  const bio = store.isInitialized ? store.bio : (props.bio || "");
  const config = store.isInitialized ? store.config : props.config;

  const fontName = config?.fontFamily || "Inter";
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@300;400;500;600;700&display=swap`;

  const getAlignmentClass = () => {
    if (config?.textAlign === "left") return "text-left items-start";
    if (config?.textAlign === "right") return "text-right items-end";
    return "text-center items-center";
  };

  return (
    <div className="w-full max-w-[340px] mx-auto select-none font-sans sticky top-24">
      {/* Google Font Preload inside Preview */}
      <link rel="stylesheet" href={fontUrl} />

      {/* Title */}
      <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 text-center">
        Preview em tempo real
      </h4>

      {/* Phone Frame */}
      <div className="relative w-full aspect-[9/18.5] bg-[#09090b] rounded-[40px] border-[6px] border-zinc-800 shadow-2xl overflow-hidden ring-4 ring-black/40 flex flex-col">
        {/* Phone Notch/Speaker */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-12 h-1 bg-zinc-800 rounded-full" />
        </div>

        {/* Inner Screen Viewport */}
        <div
          className={`flex-1 relative overflow-hidden flex flex-col p-4 pt-10 text-white ${
            config?.monoFont ? "font-mono" : ""
          }`}
          style={{
            fontFamily: config?.monoFont ? "monospace" : `'${fontName}', sans-serif`,
            lineHeight: config?.lineHeight || "1.5",
          }}
        >
          {/* Simulated Noise overlay */}
          {config?.noiseOverlay && (
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none z-20"
              style={{
                backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
              }}
            />
          )}

          {/* Background video simulation or image background */}
          {config?.videoBgUrl ? (
            <div className="absolute inset-0 bg-[#020202] z-0">
              <video
                src={config.videoBgUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-40 pointer-events-none"
              />
            </div>
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0 transition-all duration-500"
              style={{
                backgroundImage: backgroundUrl
                  ? `url(${backgroundUrl})`
                  : "url(https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070)",
              }}
            />
          )}
          
          {/* Soft background dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black z-0 pointer-events-none" />

          {/* Simulated Live Particles */}
          {effect !== "none" && (
            <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden opacity-60">
              {effect === "snow" &&
                Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-white rounded-full animate-pulse"
                    style={{
                      width: Math.random() * 3 + 1 + "px",
                      height: Math.random() * 3 + 1 + "px",
                      top: Math.random() * 100 + "%",
                      left: Math.random() * 100 + "%",
                    }}
                  />
                ))}
              {effect === "matrix" &&
                Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-[8px] text-green-500/80 font-mono"
                    style={{
                      top: Math.random() * 100 + "%",
                      left: Math.random() * 100 + "%",
                    }}
                  >
                    {Math.random() > 0.5 ? "1" : "0"}
                  </div>
                ))}
              {effect === "fogo" &&
                Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute bg-orange-500 rounded-full blur-[1px] opacity-70"
                    style={{
                      width: Math.random() * 6 + 2 + "px",
                      height: Math.random() * 6 + 2 + "px",
                      bottom: Math.random() * 40 + "%",
                      left: Math.random() * 100 + "%",
                    }}
                  />
                ))}
              {effect === "bolhas" &&
                Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute border border-blue-400/40 rounded-full"
                    style={{
                      width: Math.random() * 10 + 4 + "px",
                      height: Math.random() * 10 + 4 + "px",
                      bottom: Math.random() * 80 + "%",
                      left: Math.random() * 100 + "%",
                    }}
                  />
                ))}
            </div>
          )}

          {/* Profile Card Container */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-start overflow-y-auto scrollbar-none py-4">
            {/* Status Badge */}
            {config?.manualStatus && (
              <div className="bg-white/10 text-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold border border-white/10 mb-4 tracking-wide shadow-sm animate-bounce">
                {config.manualStatus}
              </div>
            )}

            {/* Avatar */}
            <div
              className={cn(
                "w-20 h-20 rounded-full border-2 border-white/20 overflow-hidden mb-4 backdrop-blur-sm shadow-xl transition-all duration-300",
                config?.avatarPulse ? "animate-pulse" : "",
                config?.glitchAvatar ? "hover:scale-105 active:skew-x-12" : ""
              )}
              style={{
                boxShadow: `0 0 20px ${config?.glowColor || "rgba(255,255,255,0.15)"}`,
              }}
            >
              <Image
                src={
                  avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || "preview"}`
                }
                alt="Avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>

            {/* Display Name */}
            <h1
              className="text-lg font-bold tracking-tight drop-shadow-md text-center transition-all"
              style={{
                textShadow: config?.textShadow || "none",
                letterSpacing:
                  config?.letterSpacing !== "normal" ? config?.letterSpacing : undefined,
              }}
            >
              <span className="block text-[9px] text-white/40 tracking-wider uppercase font-semibold">
                {greeting},
              </span>
              {config?.textGradient ? (
                <span
                  style={{
                    backgroundImage: config.textGradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  className="bg-cover"
                >
                  {displayName || username || "Seu Nome"}
                </span>
              ) : (
                <span className="text-white">{displayName || username || "Seu Nome"}</span>
              )}
            </h1>

            {/* Bio */}
            {bio && (
              <p
                className={cn(
                  "text-xs text-white/70 max-w-[240px] drop-shadow-sm font-medium mt-2",
                  getAlignmentClass()
                )}
              >
                {config?.rotatingBio && config?.rotatingWords ? (
                  <span>
                    {bio.replace(/\{.*\}/, config.rotatingWords.split(",")[0].trim())}
                  </span>
                ) : (
                  <span>{bio}</span>
                )}
              </p>
            )}

            {/* Mock Discord Widget */}
            <div className="w-full max-w-[260px] bg-zinc-950/40 border border-white/5 rounded-xl p-2.5 mt-4 flex items-center gap-3 backdrop-blur-md">
              <div className="w-7 h-7 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                <Globe size={14} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider">Discord</span>
                <span className="text-[10px] font-bold text-white/95 truncate">Online - Jogando VS Code</span>
              </div>
            </div>

            {/* Links List Preview */}
            <div
              className={cn(
                "w-full max-w-[260px] mt-4 flex",
                config?.layout === "grid"
                  ? "flex-row flex-wrap justify-between gap-2"
                  : "flex-col space-y-2.5"
              )}
            >
              {[
                { title: "Instagram", icon: FaInstagram },
                { title: "Github", icon: FaGithub },
                { title: "Twitter", icon: FaTwitter },
              ].map((link, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative overflow-hidden p-2.5 flex items-center justify-center border transition-all duration-300 backdrop-blur-md",
                    config?.layout === "grid" ? "w-[48%]" : "w-full"
                  )}
                  style={{
                    borderRadius: config?.borderRadius || "12px",
                    borderColor: "rgba(255,255,255,0.06)",
                    boxShadow: `0 2px 10px ${config?.glowColor || "rgba(255,255,255,0.05)"}`,
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <span
                    className="relative z-10 font-semibold text-xs flex items-center gap-2"
                    style={{ color: config?.accentColor || "#ffffff" }}
                  >
                    <link.icon size={13} />
                    <span>{link.title}</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Mock Guestbook Section */}
            {config?.enableGuestbook && (
              <div className="w-full max-w-[260px] bg-zinc-950/40 border border-white/5 rounded-xl p-3 mt-4 text-left backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-white/40 mb-2">
                  <MessageSquare size={10} />
                  <span className="text-[9px] uppercase tracking-wider font-semibold">Mural</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2 border border-white/5 text-[9px] text-white/70">
                  <span className="font-bold block text-white/90">anon:</span>
                  Site irado, muito lindo!
                </div>
              </div>
            )}

            {/* Mock Ratings Section */}
            {config?.enableRating && (
              <div className="w-full max-w-[260px] bg-zinc-950/40 border border-white/5 rounded-xl p-2.5 mt-4 flex items-center justify-between backdrop-blur-md">
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Avalie meu perfil</span>
                <div className="flex gap-0.5 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={10} fill="currentColor" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Mock Audio Player */}
          {audioUrl && (
            <div
              className={cn(
                "absolute z-30 p-2 border backdrop-blur-lg flex items-center gap-2",
                config?.playerPosition === "bottom-left"
                  ? "bottom-4 left-4 rounded-xl"
                  : config?.playerPosition === "top-right"
                  ? "top-14 right-4 rounded-xl"
                  : "bottom-4 left-1/2 -translate-x-1/2 rounded-full px-4"
              )}
              style={{
                borderRadius: config?.playerPosition === "bottom-center" ? "9999px" : "12px",
                background: "rgba(0,0,0,0.7)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-black">
                <Play size={10} fill="currentColor" />
              </div>
              <span className="text-[9px] font-semibold text-white/80 whitespace-nowrap">
                {config?.loadingText || "Play Music"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
