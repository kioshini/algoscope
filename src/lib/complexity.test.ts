import { describe, expect, it } from 'vitest';
import {
  estimateComplexity,
  isSignificant,
  metricsAt,
  significantEvents,
  significantFullIndex,
  significantIndexes,
} from './complexity';
import type { AnalysisPoint, TraceEvent } from '../types';

function point(n: number, comparisons: number): AnalysisPoint {
  return { n, comparisons, reads: 0, writes: 0, calls: 0, total: comparisons, elapsedMs: 0 };
}

function events(): TraceEvent[] {
  const base = { line: 1, values: [2, 1] };
  return [
    { ...base, seq: 0, type: 'line' },
    { ...base, seq: 1, type: 'read', index: 0 },
    { ...base, seq: 2, type: 'compare', leftValue: 2, rightValue: 1 },
    { ...base, seq: 3, type: 'write', index: 0 },
    { ...base, seq: 4, type: 'line' },
    { ...base, seq: 5, type: 'read', index: 1 },
    { ...base, seq: 6, type: 'call', function: 'sort' },
    { ...base, seq: 7, type: 'return', function: 'sort' },
    { ...base, seq: 8, type: 'done' },
  ];
}

describe('estimateComplexity', () => {
  it('recognizes quadratic growth', () => {
    const result = estimateComplexity([point(8, 64), point(16, 256), point(32, 1024), point(64, 4096)]);

    expect(result.label).toBe('O(n²)');
    expect(result.confidence).toBeGreaterThan(95);
  });

  it('recognizes n log n growth', () => {
    const points = [8, 16, 32, 64, 128].map((n) => point(n, n * Math.log2(n)));

    expect(estimateComplexity(points).label).toBe('O(n log n)');
  });
});

describe('metricsAt', () => {
  it('counts semantic events through a selected full-step', () => {
    const base = { line: 1, values: [2, 1] };
    const list: TraceEvent[] = [
      { ...base, seq: 0, type: 'line' },
      { ...base, seq: 1, type: 'read', index: 0 },
      { ...base, seq: 2, type: 'compare', leftValue: 2, rightValue: 1 },
      { ...base, seq: 3, type: 'write', index: 0 },
    ];

    expect(metricsAt(list, 2)).toMatchObject({ reads: 1, comparisons: 1, writes: 0, total: 2 });
  });
});

describe('isSignificant', () => {
  it('excludes line and read events', () => {
    expect(isSignificant({ type: 'line' })).toBe(false);
    expect(isSignificant({ type: 'read' })).toBe(false);
    for (const type of ['compare', 'write', 'call', 'return', 'done'] as const) {
      expect(isSignificant({ type })).toBe(true);
    }
  });
});

describe('significantIndexes / significantEvents', () => {
  it('keeps only the full-stream indexes of significant events, in order', () => {
    expect(significantIndexes(events())).toEqual([2, 3, 6, 7, 8]);
    expect(significantEvents(events()).map((event) => event.type)).toEqual([
      'compare',
      'write',
      'call',
      'return',
      'done',
    ]);
  });

  it('returns an empty list for an empty event stream', () => {
    expect(significantIndexes([])).toEqual([]);
    expect(significantEvents([])).toEqual([]);
  });
});

describe('significantFullIndex', () => {
  const stream = events();

  it('maps a visual step to the corresponding full-stream index', () => {
    expect(significantFullIndex(stream, 0)).toBe(2);
    expect(significantFullIndex(stream, 2)).toBe(6);
    expect(significantFullIndex(stream, 4)).toBe(8);
  });

  it('clamps out-of-range visual steps', () => {
    expect(significantFullIndex(stream, -5)).toBe(2);
    expect(significantFullIndex(stream, 99)).toBe(8);
  });

  it('falls back to the raw stream when there are no significant events', () => {
    const allLines: TraceEvent[] = [
      { line: 1, values: [], seq: 0, type: 'line' },
      { line: 2, values: [], seq: 1, type: 'line' },
    ];
    expect(significantFullIndex(allLines, 1)).toBe(1);
    expect(significantFullIndex([], 0)).toBe(0);
  });
});
