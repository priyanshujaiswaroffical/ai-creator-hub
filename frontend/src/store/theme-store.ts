/**
 * Theme Store — Zustand store for dark/light mode toggle.
 * Persists preference to localStorage. Applies data-theme attribute on <html>.
 */

import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('ch-theme', next);
      }
      return { theme: next };
    }),
  setTheme: (t: Theme) => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('ch-theme', t);
    }
    set({ theme: t });
  },
}));
