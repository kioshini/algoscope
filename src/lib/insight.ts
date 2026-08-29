import type { AnalysisPoint } from '../types';

export type Insight = {
  kind: 'faster' | 'slower' | 'matches' | 'insufficient';
  ratio: number;
};

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function endpointOperations(points: AnalysisPoint[], metric: keyof AnalysisPoint) {
  if (points.length < 2) return null;
  return points.at(-1)?.[metric] ?? null;
}

export function buildInsight(custom: AnalysisPoint[], reference: AnalysisPoint[]): Insight {
  const customEnd = endpointOperations(custom, 'comparisons');
  const referenceEnd = endpointOperations(reference, 'comparisons');
  if (customEnd === null || referenceEnd === null || customEnd <= 0) return { kind: 'insufficient', ratio: 0 };

  const ratio = referenceEnd / customEnd;
  if (ratio > 1.15) return { kind: 'faster', ratio };
  if (ratio < 0.87) return { kind: 'slower', ratio };
  return { kind: 'matches', ratio };
}

export function averageRatio(
  custom: AnalysisPoint[],
  reference: AnalysisPoint[],
  metric: keyof AnalysisPoint = 'comparisons',
): number {
  const customMedian = median(custom.map((point) => point[metric] as number));
  const referenceMedian = median(reference.map((point) => point[metric] as number));
  if (!customMedian) return 0;
  return referenceMedian / customMedian;
}
