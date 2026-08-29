import { beforeEach, describe, expect, it } from 'vitest';
import { exportBenchmarkCsv, useBenchmarkSettings } from './benchmark-settings';

const storage = new Map<string, string>();
(globalThis as unknown as { localStorage: unknown }).localStorage = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
} as unknown as Record<string, unknown>;

describe('benchmark settings', () => {
  beforeEach(() => {
    storage.clear();
    useBenchmarkSettings.setState({ profiles: [] });
  });

  it('saves and deletes a profile', () => {
    useBenchmarkSettings.getState().saveProfile('Basic', ['quick', 'merge']);
    expect(useBenchmarkSettings.getState().profiles).toHaveLength(1);
    const id = useBenchmarkSettings.getState().profiles[0].id;
    useBenchmarkSettings.getState().deleteProfile(id);
    expect(useBenchmarkSettings.getState().profiles).toHaveLength(0);
  });

  it('persists profiles to storage', () => {
    useBenchmarkSettings.getState().saveProfile('Basic', ['quick', 'merge']);
    expect(JSON.parse(storage.get('algoscope:benchmark-profiles:v1') ?? '[]')).toHaveLength(1);
  });
});

describe('benchmark CSV export', () => {
  it('writes headers and quoted values', () => {
    const csv = exportBenchmarkCsv([
      { rank: 1, algorithm: 'Quick Sort', medianMs: 2.5, writes: 18 },
      { rank: 2, algorithm: 'Merge, "in place"', medianMs: 6.05, writes: 24 },
    ]);
    const lines = csv.split('\n');
    expect(lines[0]).toBe('rank,algorithm,medianMs,writes');
    expect(lines[1]).toBe('1,Quick Sort,2.5,18');
    expect(lines[2]).toBe('2,"Merge, ""in place""",6.05,24');
  });

  it('returns an empty string for no rows', () => {
    expect(exportBenchmarkCsv([])).toBe('');
  });
});
