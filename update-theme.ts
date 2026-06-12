import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function main() {
  const profile = await prisma.profile.findFirst();
  if (!profile) {
    console.log("Nenhum perfil encontrado!");
    return;
  }

  console.log("Perfil atual:", profile.username);

  // Epic Dark Theme Settings
  const uiConfig = {
    layout: "list",
    borderRadius: "16px",
    glowColor: "#ff003c", // Cyberpunk Neon Red
    glassIntensity: "8px",
    cursorStyle: "crosshair",
    accentColor: "#ff003c",
    hideLogo: false,
    visitorThemes: false,
    noiseOverlay: true, // Dark aesthetic grain
    bassReverb: false,
    reverbEffect: false,
    nightAudioUrl: "https://files.catbox.moe/k3bxm7.mp3", // Some aesthetic dark audio (just placeholder if needed)
    loadingText: "INITIALIZING ANTHRAX.CC...",
    enterAnimation: "matrix", // Matrix glitch enter
    enable3dTilt: true,
    typewriterBio: false,
    glitchAvatar: true,
    avatarPulse: true,
    linkHoverEffect: "glow",
    particleInteraction: true,
    staggeredEntry: true,
    confettiEnabled: false, // Too happy for dark theme
    fontFamily: "Space Grotesk", // Monospace/Tech vibe
    textShadow: "0 0 10px #ff003c, 0 0 20px #ff003c", // Glowing red text shadow
    letterSpacing: "0.1em",
    lineHeight: "1.5",
    textAlign: "center",
    textTransform: "uppercase",
    textGradient: "linear-gradient(to right, #fff, #ff003c)", // White to red gradient
    rotatingBio: true,
    rotatingWords: "HACKER, CREATOR, GHOST",
    monoFont: true,
    enableGuestbook: true,
    enableRating: true,
    enableVisitorThemes: false, // Don't let them ruin the dark theme
    enableFocusMode: true,
    manualStatus: "🌙 DO NOT DISTURB"
  };

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      backgroundType: "webgl",
      webglScene: "matrix", // Let's try matrix for a dark aesthetic or just a black color
      uiConfig: JSON.stringify(uiConfig)
    }
  });

  console.log("Perfil atualizado para o estilo Dark Premium!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
