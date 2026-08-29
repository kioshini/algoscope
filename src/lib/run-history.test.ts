import { describe, expect, it } from 'vitest';
import {
  addRunHistory,
  clearRunHistory,
  readRunHistory,
  writeRunHistory,
  type RunHistoryEntry,
  type StorageAdapter,
} from './run-history';

function entry(id: string): RunHistoryEntry {
  return { id, createdAt: Number(id), mode: 'trace', source: 'pass', input: id, reference: 'merge' };
}

function memoryStorage(): StorageAdapter {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
}

describe('run history', () => {
  it('prepends, deduplicates, and bounds entries', () => {
    const storage = memoryStorage();
    const options = { storage, limit: 2 };
    addRunHistory(entry('1'), options);
    addRunHistory(entry('2'), options);
    addRunHistory({ ...entry('1'), input: 'updated' }, options);
    addRunHistory(entry('3'), options);

    expect(readRunHistory(options).map((item) => item.id)).toEqual(['3', '1']);
    expect(readRunHistory(options)[1].input).toBe('updated');
  });

  it('ignores malformed persisted values and invalid entries', () => {
    const storage = memoryStorage();
    storage.setItem('history', JSON.stringify([entry('1'), { id: 2 }]));
    expect(readRunHistory({ storage, key: 'history' })).toEqual([entry('1')]);
    storage.setItem('history', 'not json');
    expect(readRunHistory({ storage, key: 'history' })).toEqual([]);
  });

  it('fails safely when storage operations throw', () => {
    const storage: StorageAdapter = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('full');
      },
      removeItem: () => {
        throw new Error('blocked');
      },
    };
    expect(readRunHistory({ storage })).toEqual([]);
    expect(writeRunHistory([entry('1')], { storage })).toBe(false);
    expect(clearRunHistory({ storage })).toBe(false);
    expect(addRunHistory(entry('1'), { storage })).toEqual([entry('1')]);
  });

  it('clears persisted history', () => {
    const storage = memoryStorage();
    expect(writeRunHistory([entry('1')], { storage })).toBe(true);
    expect(clearRunHistory({ storage })).toBe(true);
    expect(readRunHistory({ storage })).toEqual([]);
  });
});
