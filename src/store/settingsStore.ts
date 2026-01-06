// ============================================
// Settings Store - User Preferences
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIProvider } from '../types/api';

interface SettingsStore {
  // Audio
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;

  // AI
  aiProvider: AIProvider;

  // Display
  showTutorialHints: boolean;
  animationsEnabled: boolean;

  // Actions
  toggleSound: () => void;
  toggleMusic: () => void;
  setSoundVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setAIProvider: (provider: AIProvider) => void;
  toggleTutorialHints: () => void;
  toggleAnimations: () => void;
  resetToDefaults: () => void;
}

const defaultSettings = {
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 0.7,
  musicVolume: 0.5,
  aiProvider: 'mock' as AIProvider,
  showTutorialHints: true,
  animationsEnabled: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Initial State
      ...defaultSettings,

      // Actions
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),

      setSoundVolume: (volume) => set({ soundVolume: Math.max(0, Math.min(1, volume)) }),

      setMusicVolume: (volume) => set({ musicVolume: Math.max(0, Math.min(1, volume)) }),

      setAIProvider: (provider) => set({ aiProvider: provider }),

      toggleTutorialHints: () => set((state) => ({ showTutorialHints: !state.showTutorialHints })),

      toggleAnimations: () => set((state) => ({ animationsEnabled: !state.animationsEnabled })),

      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'conflict-settings',
    }
  )
);
