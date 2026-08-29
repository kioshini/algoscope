import { create } from 'zustand';

const STORAGE_KEY = 'algoscope:benchmark-profiles:v1';

export type BenchmarkProfile = {
  id: string;
  name: string;
  algorithmIds: string[];
  createdAt: number;
};

function loadProfiles(): BenchmarkProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isProfile).slice(0, 12) : [];
  } catch {
    return [];
  }
}

function isProfile(value: unknown): value is BenchmarkProfile {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<BenchmarkProfile>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    Array.isArray(candidate.algorithmIds) &&
    typeof candidate.createdAt === 'number'
  );
}

type BenchmarkSettingsState = {
  profiles: BenchmarkProfile[];
  saveProfile: (name: string, algorithmIds: string[]) => void;
  deleteProfile: (id: string) => void;
};

export const useBenchmarkSettings = create<BenchmarkSettingsState>((set) => ({
  profiles: loadProfiles(),
  saveProfile: (name, algorithmIds) =>
    set((state) => {
      const id = crypto.randomUUID();
      const profile: BenchmarkProfile = { id, name: name.trim() || 'Untitled', algorithmIds, createdAt: Date.now() };
      const next = [...state.profiles, profile].slice(-12);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage may be unavailable; keep in-memory state.
      }
      return { profiles: next };
    }),
  deleteProfile: (id) =>
    set((state) => {
      const next = state.profiles.filter((profile) => profile.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage may be unavailable; keep in-memory state.
      }
      return { profiles: next };
    }),
}));

export function exportBenchmarkCsv(rows: Array<Record<string, string | number>>): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number) => {
    const text = String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [headers, ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\n');
}

export function downloadTextFile(filename: string, content: string, type = 'text/csv') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
