import { describe, expect, it } from 'vitest';
import type { AnalysisPoint } from '../types';
import { buildInsight } from './insight';

function makePoints(n: number, operations: number): AnalysisPoint[] {
  return [8, 16, 32, 64, 96].map((size) => ({
    n: size,
    comparisons: operations * size,
    reads: operations * size,
    writes: 0,
    calls: 0,
    total: operations * size,
    elapsedMs: size / 100,
  }));
}

describe('growth insight', () => {
  it('reports faster when the reference does more work', () => {
    const custom = makePoints(10, 1);
    const reference = makePoints(10, 3);
    expect(buildInsight(custom, reference).kind).toBe('faster');
  });

  it('reports slower when the reference does less work', () => {
    const custom = makePoints(10, 3);
    const reference = makePoints(10, 1);
    expect(buildInsight(custom, reference).kind).toBe('slower');
  });

  it('reports comparable when ratios are close', () => {
    const custom = makePoints(10, 2);
    const reference = makePoints(10, 2);
    expect(buildInsight(custom, reference).kind).toBe('matches');
  });

  it('reports insufficient when there is too little data', () => {
    expect(buildInsight([], []).kind).toBe('insufficient');
  });
});
