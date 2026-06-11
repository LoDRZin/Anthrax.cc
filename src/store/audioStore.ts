import { create } from "zustand";

interface AudioState {
  frequencyData: Uint8Array;
  isActive: boolean;
  setFrequencyData: (data: Uint8Array) => void;
  setIsActive: (active: boolean) => void;
  // A helper method to easily grab the latest "intensity" (0 to 1) based on low frequencies (bass)
  getBassIntensity: () => number;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  frequencyData: new Uint8Array(128), // Default empty array, 128 bins
  isActive: false,
  setFrequencyData: (data) => set({ frequencyData: data }),
  setIsActive: (active) => set({ isActive: active }),
  getBassIntensity: () => {
    const data = get().frequencyData;
    if (data.length === 0) return 0;
    
    // Average the first few bins for bass frequencies
    const bassBinsCount = Math.min(10, data.length);
    let sum = 0;
    for (let i = 0; i < bassBinsCount; i++) {
      sum += data[i];
    }
    
    // Normalize against max possible value (255)
    return (sum / bassBinsCount) / 255;
  }
}));
