import { useEffect, useState } from 'react';

const STORAGE_KEY = 'algoscope:theme';

export type ResolvedTheme = 'dark' | 'light';

function systemTheme(): ResolvedTheme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return 'dark';
}

function readStoredTheme(): ResolvedTheme | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : null;
}

export function resolveTheme(): ResolvedTheme {
  return readStoredTheme() ?? systemTheme();
}

export function applyTheme(theme: ResolvedTheme) {
  document.documentElement.dataset.theme = theme;
}

/** Initialize the document theme before first render (no flicker). */
export function initTheme() {
  applyTheme(resolveTheme());
  if (!readStoredTheme()) {
    window.matchMedia?.('(prefers-color-scheme: light)').addEventListener?.('change', (event) => {
      applyTheme(event.matches ? 'light' : 'dark');
    });
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<ResolvedTheme>(resolveTheme);

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: light)');
    if (!media) return;
    const onChange = (event: MediaQueryListEvent) => {
      if (!readStoredTheme()) {
        setThemeState(event.matches ? 'light' : 'dark');
        applyTheme(event.matches ? 'light' : 'dark');
      }
    };
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);

  function toggleTheme() {
    const next: ResolvedTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
    applyTheme(next);
  }

  return { theme, isDark: theme === 'dark', toggleTheme };
}
