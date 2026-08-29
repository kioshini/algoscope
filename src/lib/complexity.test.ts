import { describe, expect, it } from 'vitest';
import { estimateComplexity, metricsAt } from './complexity';
import type { AnalysisPoint, TraceEvent } from '../types';

function point(n: number, comparisons: number): AnalysisPoint {
  return { n, comparisons, reads: 0, writes: 0, calls: 0, total: comparisons, elapsedMs: 0 };
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
  it('counts semantic events through a selected step', () => {
    const base = { line: 1, values: [2, 1] };
    const events: TraceEvent[] = [
      { ...base, seq: 0, type: 'line' },
      { ...base, seq: 1, type: 'read', index: 0 },
      { ...base, seq: 2, type: 'compare', leftValue: 2, rightValue: 1 },
      { ...base, seq: 3, type: 'write', index: 0 },
    ];

    expect(metricsAt(events, 2)).toMatchObject({ reads: 1, comparisons: 1, writes: 0, total: 2 });
  });
});
