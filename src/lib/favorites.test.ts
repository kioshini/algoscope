import { beforeEach, describe, expect, it } from 'vitest';
import { useFavorites } from './favorites';

const storage = new Map<string, string>();

const localStorageMock = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
};

(globalThis as unknown as { localStorage: unknown }).localStorage = localStorageMock;

describe('favorites store', () => {
  beforeEach(() => {
    storage.clear();
    useFavorites.setState({ favorites: [] });
  });

  it('starts empty and toggles a favorite on and off', () => {
    useFavorites.getState().toggle('bubble');
    expect(useFavorites.getState().favorites).toEqual(['bubble']);
    useFavorites.getState().toggle('bubble');
    expect(useFavorites.getState().favorites).toEqual([]);
  });

  it('persists to localStorage on toggle', () => {
    useFavorites.getState().toggle('quick');
    expect(JSON.parse(storage.get('algoscope:favorites:v1') ?? '[]')).toEqual(['quick']);
  });

  it('reports isFavorite correctly', () => {
    useFavorites.getState().toggle('merge');
    expect(useFavorites.getState().isFavorite('merge')).toBe(true);
    expect(useFavorites.getState().isFavorite('heap')).toBe(false);
  });
});
