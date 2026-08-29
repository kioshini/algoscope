import { create } from 'zustand';

const STORAGE_KEY = 'algoscope:favorites:v1';

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

type FavoritesState = {
  favorites: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

export const useFavorites = create<FavoritesState>((set, get) => ({
  favorites: loadFavorites(),
  toggle: (id) =>
    set((state) => {
      const has = state.favorites.includes(id);
      const next = has ? state.favorites.filter((item) => item !== id) : [...state.favorites, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage may be unavailable; keep the in-memory state.
      }
      return { favorites: next };
    }),
  isFavorite: (id) => get().favorites.includes(id),
}));

export function favoritesCount() {
  return useFavorites.getState().favorites.length;
}
