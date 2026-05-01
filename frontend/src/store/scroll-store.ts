/**
 * Zustand store for scroll & 3D scene state.
 * Tracks scroll progress and mouse position for 3D interactions.
 */

import { create } from 'zustand';

interface ScrollState {
  scrollProgress: number;
  activeSection: string;
  mousePosition: { x: number; y: number };

  setScrollProgress: (progress: number) => void;
  setActiveSection: (section: string) => void;
  setMousePosition: (x: number, y: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  scrollProgress: 0,
  activeSection: 'hero',
  mousePosition: { x: 0, y: 0 },

  setScrollProgress: (progress: number) => set({ scrollProgress: progress }),
  setActiveSection: (section: string) => set({ activeSection: section }),
  setMousePosition: (x: number, y: number) =>
    set({ mousePosition: { x, y } }),
}));
