export const RUN_HISTORY_STORAGE_KEY = 'algoscope:run-history:v1';
export const DEFAULT_RUN_HISTORY_LIMIT = 25;

export type RunHistoryEntry = {
  id: string;
  createdAt: number;
  mode: string;
  source: string;
  input: string;
  reference: string;
  lab?: string;
  correct?: boolean;
  elapsedMs?: number;
};

export type StorageAdapter = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type RunHistoryOptions = {
  storage?: StorageAdapter | null;
  key?: string;
  limit?: number;
};

function storageFrom(options: RunHistoryOptions): StorageAdapter | null {
  if ('storage' in options) return options.storage ?? null;
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

function limitFrom(value: number | undefined): number {
  if (value === undefined) return DEFAULT_RUN_HISTORY_LIMIT;
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : DEFAULT_RUN_HISTORY_LIMIT;
}

function isEntry(value: unknown): value is RunHistoryEntry {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.createdAt === 'number' &&
    Number.isFinite(entry.createdAt) &&
    typeof entry.mode === 'string' &&
    typeof entry.source === 'string' &&
    typeof entry.input === 'string' &&
    typeof entry.reference === 'string' &&
    (entry.lab === undefined || typeof entry.lab === 'string') &&
    (entry.correct === undefined || typeof entry.correct === 'boolean') &&
    (entry.elapsedMs === undefined || (typeof entry.elapsedMs === 'number' && Number.isFinite(entry.elapsedMs)))
  );
}

export function readRunHistory(options: RunHistoryOptions = {}): RunHistoryEntry[] {
  try {
    const raw = storageFrom(options)?.getItem(options.key ?? RUN_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isEntry).slice(0, limitFrom(options.limit));
  } catch {
    return [];
  }
}

export function writeRunHistory(entries: readonly RunHistoryEntry[], options: RunHistoryOptions = {}): boolean {
  try {
    const storage = storageFrom(options);
    if (!storage) return false;
    const bounded = entries.filter(isEntry).slice(0, limitFrom(options.limit));
    storage.setItem(options.key ?? RUN_HISTORY_STORAGE_KEY, JSON.stringify(bounded));
    return true;
  } catch {
    return false;
  }
}

/** Prepends a run, replacing an existing entry with the same id. */
export function addRunHistory(entry: RunHistoryEntry, options: RunHistoryOptions = {}): RunHistoryEntry[] {
  const history = [entry, ...readRunHistory(options).filter((item) => item.id !== entry.id)].slice(
    0,
    limitFrom(options.limit),
  );
  writeRunHistory(history, options);
  return history;
}

export function clearRunHistory(options: RunHistoryOptions = {}): boolean {
  try {
    const storage = storageFrom(options);
    if (!storage) return false;
    storage.removeItem(options.key ?? RUN_HISTORY_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
