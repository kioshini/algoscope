import { describe, expect, it } from 'vitest';
import { CATALOG_ALGORITHMS } from '../algorithms/full-catalog';
import { SCENARIOS, rankForScenario, scoreAlgorithm } from './ranking';

describe('ranking engine', () => {
  it('provides scenario cards', () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(6);
    for (const scenario of SCENARIOS) {
      expect(scenario.id.length).toBeGreaterThan(0);
      expect(scenario.requiredTags.length).toBeGreaterThan(0);
    }
  });

  it('ranks algorithms for a scenario with a non-empty, sorted result', () => {
    const scenario = SCENARIOS.find((s) => s.id === 'fast-search-sorted')!;
    const ranked = rankForScenario(scenario, CATALOG_ALGORITHMS);
    expect(ranked.length).toBeGreaterThan(0);
    const scores = ranked.map((r) => r.score);
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);
    expect(ranked[0].bullets.length).toBeGreaterThan(0);
    expect(ranked[0].verdict.length).toBeGreaterThan(0);
  });

  it('excludes algorithms from a different problem for a scenario', () => {
    const scenario = SCENARIOS.find((s) => s.id === 'sort-large')!;
    const ranked = rankForScenario(scenario, CATALOG_ALGORITHMS);
    for (const result of ranked) {
      expect(result.algorithm.problem).toBe('Sorting');
    }
  });

  it('assigns a negative score to incompatible algorithms', () => {
    const scenario = SCENARIOS.find((s) => s.id === 'shortest-paths')!;
    const incompatible = CATALOG_ALGORITHMS.find((a) => a.problem === 'Sorting')!;
    expect(scoreAlgorithm(incompatible, scenario)).toBe(-1);
  });

  it('ranks binary search above jump search for the sorted-search scenario', () => {
    const scenario = SCENARIOS.find((s) => s.id === 'fast-search-sorted')!;
    const ranked = rankForScenario(scenario, CATALOG_ALGORITHMS);
    const binaryIndex = ranked.findIndex((r) => r.algorithm.id === 'search-binary-first');
    const jumpIndex = ranked.findIndex((r) => r.algorithm.id === 'search-jump-first');
    expect(binaryIndex).toBeGreaterThanOrEqual(0);
    expect(jumpIndex).toBeGreaterThan(binaryIndex);
    expect(ranked[binaryIndex].bullets.find((b) => b.label.includes('logarithmic'))?.ok).toBe(true);
  });
});
