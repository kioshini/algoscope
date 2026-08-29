import { describe, expect, it } from 'vitest';
import { decodeShareState, encodeShareState, type ShareState } from './share-state';

describe('share state', () => {
  it('round-trips UTF-8 state using URL-safe characters', () => {
    const state: ShareState = {
      mode: 'trace',
      source: 'def sort(values):\n    # 東京 🚀\n    return values',
      input: '8, 3, -1',
      reference: 'merge',
      lab: 'heap',
    };

    const encoded = encodeShareState(state);

    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(encoded).not.toContain('=');
    expect(decodeShareState(encoded)).toEqual(state);
  });

  it('supports state without a lab marker', () => {
    const state = { mode: 'compare', source: 'pass', input: '1', reference: 'quick' };
    expect(decodeShareState(encodeShareState(state))).toEqual(state);
  });

  it('rejects malformed and structurally invalid payloads', () => {
    expect(decodeShareState('not+base64')).toBeNull();
    const invalid = btoa(JSON.stringify({ mode: 'trace', source: 'pass' }))
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replace(/=+$/, '');
    expect(decodeShareState(invalid)).toBeNull();
  });
});
