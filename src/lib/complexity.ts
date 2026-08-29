import type { AnalysisPoint, TraceEvent, TraceMetrics } from '../types';

const MODELS = [
  { label: 'O(log n)', evaluate: (n: number) => Math.log2(Math.max(n, 2)) },
  { label: 'O(n)', evaluate: (n: number) => n },
  { label: 'O(n log n)', evaluate: (n: number) => n * Math.log2(Math.max(n, 2)) },
  { label: 'O(n²)', evaluate: (n: number) => n * n },
  { label: 'O(n³)', evaluate: (n: number) => n * n * n },
] as const;

export function metricsAt(events: TraceEvent[], step = events.length - 1): TraceMetrics {
  const metrics: TraceMetrics = { reads: 0, writes: 0, comparisons: 0, calls: 0, total: 0 };
  const last = Math.min(step, events.length - 1);

  for (let index = 0; index <= last; index += 1) {
    const type = events[index]?.type;
    if (type === 'read') metrics.reads += 1;
    if (type === 'write') metrics.writes += 1;
    if (type === 'compare') metrics.comparisons += 1;
    if (type === 'call') metrics.calls += 1;
    if (type !== 'line' && type !== 'done') metrics.total += 1;
  }

  return metrics;
}

export function estimateComplexity(points: AnalysisPoint[], metric: keyof TraceMetrics = 'comparisons') {
  const usable = points.filter((point) => point.n > 1 && point[metric] > 0);
  if (usable.length < 3) return { label: 'Not enough data', confidence: 0 };

  const mean = usable.reduce((sum, point) => sum + point[metric], 0) / usable.length;
  const variance = usable.reduce((sum, point) => sum + (point[metric] - mean) ** 2, 0);
  let best = { label: 'Unknown', error: Number.POSITIVE_INFINITY, confidence: 0 };

  for (const model of MODELS) {
    const x = usable.map((point) => model.evaluate(point.n));
    const y = usable.map((point) => point[metric]);
    const xMean = x.reduce((sum, value) => sum + value, 0) / x.length;
    const yMean = y.reduce((sum, value) => sum + value, 0) / y.length;
    let numerator = 0;
    let denominator = 0;

    for (let index = 0; index < x.length; index += 1) {
      numerator += (x[index] - xMean) * (y[index] - yMean);
      denominator += (x[index] - xMean) ** 2;
    }

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = yMean - slope * xMean;
    const squaredError = x.reduce((sum, value, index) => {
      const predicted = intercept + slope * value;
      return sum + (y[index] - predicted) ** 2;
    }, 0);
    const normalizedError = variance === 0 ? squaredError : squaredError / variance;

    if (normalizedError < best.error) {
      best = {
        label: model.label,
        error: normalizedError,
        confidence: Math.max(0, Math.min(99, Math.round((1 - normalizedError) * 100))),
      };
    }
  }

  return { label: best.label, confidence: best.confidence };
}
