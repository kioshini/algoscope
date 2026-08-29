export type ShareState = {
  mode: string;
  source: string;
  input: string;
  reference: string;
  lab?: string;
};

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function isShareState(value: unknown): value is ShareState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const state = value as Record<string, unknown>;
  return (
    typeof state.mode === 'string' &&
    typeof state.source === 'string' &&
    typeof state.input === 'string' &&
    typeof state.reference === 'string' &&
    (state.lab === undefined || typeof state.lab === 'string')
  );
}

/** Serializes app state as unpadded Base64URL containing UTF-8 JSON. */
export function encodeShareState(state: ShareState): string {
  const base64 = bytesToBase64(new TextEncoder().encode(JSON.stringify(state)));
  return base64.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

/** Returns null for malformed, non-UTF-8, or structurally invalid state. */
export function decodeShareState(value: string): ShareState | null {
  try {
    if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
    const padding = '='.repeat((4 - (value.length % 4)) % 4);
    const bytes = base64ToBytes(value.replaceAll('-', '+').replaceAll('_', '/') + padding);
    const json = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    const state: unknown = JSON.parse(json);
    return isShareState(state) ? state : null;
  } catch {
    return null;
  }
}
