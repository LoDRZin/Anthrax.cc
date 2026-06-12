import { create } from "zustand";

export interface ProfileConfig {
  layout: string;
  cursorStyle: string;
  borderRadius: string;
  glowColor: string;
  accentColor: string;
  glassIntensity: string;
  noiseOverlay: boolean;
  customCss: string;
  videoBgUrl: string;
  playerStyle: string;
  playerPosition: string;
  reverbEffect: boolean;
  nightAudioUrl: string;
  loadingText: string;
  enterAnimation: string;
  enable3dTilt: boolean;
  typewriterBio: boolean;
  glitchAvatar: boolean;
  avatarPulse: boolean;
  linkHoverEffect: string;
  particleInteraction: boolean;
  staggeredEntry: boolean;
  confettiEnabled: boolean;
  fontFamily: string;
  textShadow: string;
  letterSpacing: string;
  lineHeight: string;
  textAlign: string;
  textTransform: string;
  textGradient: string;
  rotatingBio: boolean;
  rotatingWords: string;
  monoFont: boolean;
  enableGuestbook: boolean;
  enableRating: boolean;
  enableVisitorThemes: boolean;
  enableFocusMode: boolean;
  manualStatus: string;
}

interface ProfileState {
  avatarUrl: string;
  backgroundUrl: string;
  audioUrl: string;
  effect: string;
  displayName: string;
  username: string;
  bio: string;
  config: ProfileConfig;
  isInitialized: boolean;
  
  setAvatarUrl: (url: string) => void;
  setBackgroundUrl: (url: string) => void;
  setAudioUrl: (url: string) => void;
  setEffect: (effect: string) => void;
  setDisplayName: (name: string) => void;
  setBio: (bio: string) => void;
  updateConfig: (field: keyof ProfileConfig, value: any) => void;
  initialize: (data: {
    avatarUrl: string;
    backgroundUrl: string;
    audioUrl: string;
    effect: string;
    displayName: string;
    username: string;
    bio: string;
    config: ProfileConfig;
  }) => void;
}

const DEFAULT_CONFIG: ProfileConfig = {
  layout: "default",
  cursorStyle: "default",
  borderRadius: "12px",
  glowColor: "rgba(255,255,255,0.15)",
  accentColor: "#ffffff",
  glassIntensity: "10px",
  noiseOverlay: false,
  customCss: "",
  videoBgUrl: "",
  playerStyle: "minimalist",
  playerPosition: "bottom-center",
  reverbEffect: false,
  nightAudioUrl: "",
  loadingText: "Click to Enter",
  enterAnimation: "fade",
  enable3dTilt: false,
  typewriterBio: false,
  glitchAvatar: false,
  avatarPulse: false,
  linkHoverEffect: "default",
  particleInteraction: false,
  staggeredEntry: false,
  confettiEnabled: true,
  fontFamily: "Inter",
  textShadow: "",
  letterSpacing: "normal",
  lineHeight: "1.5",
  textAlign: "center",
  textTransform: "none",
  textGradient: "",
  rotatingBio: false,
  rotatingWords: "Designer, Developer, Creator",
  monoFont: false,
  enableGuestbook: false,
  enableRating: false,
  enableVisitorThemes: false,
  enableFocusMode: false,
  manualStatus: "",
};

export const useProfileStore = create<ProfileState>((set) => ({
  avatarUrl: "",
  backgroundUrl: "",
  audioUrl: "",
  effect: "none",
  displayName: "",
  username: "",
  bio: "",
  config: DEFAULT_CONFIG,
  isInitialized: false,

  setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
  setBackgroundUrl: (backgroundUrl) => set({ backgroundUrl }),
  setAudioUrl: (audioUrl) => set({ audioUrl }),
  setEffect: (effect) => set({ effect }),
  setDisplayName: (displayName) => set({ displayName }),
  setBio: (bio) => set({ bio }),
  
  updateConfig: (field, value) =>
    set((state) => ({
      config: {
        ...state.config,
        [field]: value,
      },
    })),
    
  initialize: (data) =>
    set({
      avatarUrl: data.avatarUrl,
      backgroundUrl: data.backgroundUrl,
      audioUrl: data.audioUrl,
      effect: data.effect,
      displayName: data.displayName,
      username: data.username,
      bio: data.bio,
      config: { ...DEFAULT_CONFIG, ...data.config },
      isInitialized: true,
    }),
}));
