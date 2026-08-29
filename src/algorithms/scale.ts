import type { ScaleSuitability } from './types';

/**
 * Semi-automatic suitability: derived from the average/worst complexity, but
 * refined for the practical recommendation labels. Returns the best fit for
 * the given average growth class.
 */
export function scaleForComplexity(complexity: { average: string; worst: string }): ScaleSuitability {
  const avg = complexity.average.toLowerCase();

  if (avg.includes('n log n') || avg.includes('n*logn') || avg.includes('n log')) return 'large';
  if (avg.includes('n²') || avg.includes('n^2') || avg.includes('n*n') || avg.includes('n2')) return 'small';
  if (avg.includes('log')) return 'all';

  // Any other average that is at worst O(n).
  if (avg.includes('n') && !avg.includes('n²') && !avg.includes('n^2')) return 'medium';
  return 'all';
}
