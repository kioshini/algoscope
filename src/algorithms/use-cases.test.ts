import { describe, expect, it } from 'vitest';
import { USE_CASES, useCasesFor } from './use-cases';
import { scaleForComplexity } from './scale';

describe('use cases', () => {
  it('provides three use cases for a known algorithm', () => {
    expect(USE_CASES.quick).toHaveLength(3);
    for (const useCase of USE_CASES.quick ?? []) {
      expect(useCase.title.length).toBeGreaterThan(4);
      expect(useCase.context.length).toBeGreaterThan(20);
      expect(useCase.tags.length).toBeGreaterThan(0);
    }
  });

  it('returns an empty array for an unknown algorithm', () => {
    expect(useCasesFor('does-not-exist')).toEqual([]);
  });
});

describe('scale suitability', () => {
  it('fits sub-quadratic to large', () => {
    expect(scaleForComplexity({ average: 'O(n log n)', worst: 'O(n log n)' })).toBe('large');
  });

  it('fits logarithmic to all', () => {
    expect(scaleForComplexity({ average: 'O(log n)', worst: 'O(log n)' })).toBe('all');
  });

  it('fits quadratic to small', () => {
    expect(scaleForComplexity({ average: 'O(n²)', worst: 'O(n²)' })).toBe('small');
  });

  it('fits linear to medium', () => {
    expect(scaleForComplexity({ average: 'O(n)', worst: 'O(n)' })).toBe('medium');
  });
});
