import { ALGORITHMS, DEFAULT_SOURCE } from '../algorithms/catalog';
import type { AlgorithmId } from '../algorithms/types';

export const REFERENCES = Object.fromEntries(
  ALGORITHMS.map((algorithm) => [
    algorithm.id,
    {
      label: algorithm.name,
      complexity: algorithm.complexity.average,
      source: algorithm.source,
    },
  ]),
) as Record<AlgorithmId, { label: string; complexity: string; source: string }>;

export type ReferenceId = AlgorithmId;
export { DEFAULT_SOURCE };
