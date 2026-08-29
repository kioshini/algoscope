import { describe, expect, it } from 'vitest';
import { ALGORITHMS, ALGORITHM_BY_ID } from './catalog';
import { CATALOG_ALGORITHMS, CATALOG_ALGORITHM_BY_ID } from './full-catalog';
import { LAB_ENTRIES } from '../labs/catalog';
import { LANGUAGE_LABELS, sourceForAlgorithm } from './language-sources';

describe('algorithm catalog', () => {
  it('contains thirty complete and unique definitions', () => {
    expect(ALGORITHMS).toHaveLength(30);
    expect(new Set(ALGORITHMS.map((algorithm) => algorithm.id)).size).toBe(ALGORITHMS.length);
    expect(new Set(ALGORITHMS.map((algorithm) => algorithm.name)).size).toBe(ALGORITHMS.length);

    for (const algorithm of ALGORITHMS) {
      expect(algorithm.source).toContain('def sort(values):');
      expect(algorithm.explanation).toHaveLength(3);
      expect(algorithm.examples.default.length).toBeGreaterThan(0);
      expect(ALGORITHM_BY_ID[algorithm.id]).toBe(algorithm);
    }
  });

  it('separates integer-only distribution sorts from numeric sorting', () => {
    const integerOnly = ALGORITHMS.filter((algorithm) => algorithm.contract === 'sort-integer-array');
    expect(integerOnly.map((algorithm) => algorithm.id).sort()).toEqual(['counting', 'radix-lsd']);
  });

  it('contains eighty executable catalog entries across five problems', () => {
    expect(CATALOG_ALGORITHMS).toHaveLength(80);
    expect(new Set(CATALOG_ALGORITHMS.map((algorithm) => algorithm.id)).size).toBe(80);
    expect(new Set(CATALOG_ALGORITHMS.map((algorithm) => algorithm.name)).size).toBe(80);
    expect(new Set(CATALOG_ALGORITHMS.map((algorithm) => algorithm.problem))).toEqual(
      new Set(['Sorting', 'Searching', 'Graph', 'String', 'Dynamic Programming']),
    );
    expect(
      Object.fromEntries(
        ['Sorting', 'Searching', 'Graph', 'String', 'Dynamic Programming'].map((problem) => [
          problem,
          CATALOG_ALGORITHMS.filter((algorithm) => algorithm.problem === problem).length,
        ]),
      ),
    ).toEqual({ Sorting: 30, Searching: 10, Graph: 15, String: 12, 'Dynamic Programming': 13 });

    const solutions = CATALOG_ALGORITHMS.filter((algorithm) => algorithm.kind === 'solve');
    expect(solutions).toHaveLength(50);
    for (const algorithm of solutions) {
      expect(algorithm.source).toContain('def solve(data):');
      expect(algorithm.contract.length).toBeGreaterThan(0);
      expect(() => JSON.stringify(algorithm.demo)).not.toThrow();
      expect(CATALOG_ALGORITHM_BY_ID[algorithm.id]).toBe(algorithm);
    }
  });

  it('provides distinct learning cases when the algorithm has an adaptive path', () => {
    const adaptive = ALGORITHMS.filter((algorithm) => algorithm.complexity.best !== algorithm.complexity.worst);
    for (const algorithm of adaptive) {
      expect(algorithm.examples.bestCase).not.toEqual(algorithm.examples.worstCase);
    }
  });

  it('links six unique interactive structure labs', () => {
    expect(LAB_ENTRIES).toHaveLength(7);
    expect(new Set(LAB_ENTRIES.map((entry) => entry.id)).size).toBe(7);
  });

  it('exposes cross-language source availability for every catalog algorithm', () => {
    expect(Object.keys(LANGUAGE_LABELS)).toHaveLength(6);
    const languages = Object.keys(LANGUAGE_LABELS).filter((language) => language !== 'python') as Array<
      Exclude<keyof typeof LANGUAGE_LABELS, 'python'>
    >;
    for (const language of languages) {
      for (const algorithm of CATALOG_ALGORITHMS) {
        const source = sourceForAlgorithm(algorithm.id, algorithm.source, language);
        expect(source.available, `${algorithm.id} / ${language}`).toBe(true);
        expect(source.source.length).toBeGreaterThan(40);
      }
    }
  });

  it('enriches every catalog algorithm with three use cases and a scale flag', () => {
    for (const algorithm of CATALOG_ALGORITHMS) {
      expect(algorithm.useCases, `${algorithm.id} useCases`).toBeDefined();
      expect(algorithm.useCases?.length, `${algorithm.id} useCases length`).toBe(3);
      for (const useCase of algorithm.useCases ?? []) {
        expect(useCase.title.length).toBeGreaterThan(4);
        expect(useCase.context.length).toBeGreaterThan(20);
        expect(useCase.tags.length).toBeGreaterThan(0);
      }
      expect(['small', 'medium', 'large', 'all'], `${algorithm.id} scale`).toContain(algorithm.scaleSuitability);
    }
  });
});
