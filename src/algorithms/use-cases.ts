import type { AlgorithmUseCase } from './types';
import { SORTING_USE_CASES } from './use-cases-sorting';
import { SEARCHING_USE_CASES } from './use-cases-searching';
import { GRAPH_USE_CASES } from './use-cases-graph';
import { STRING_USE_CASES } from './use-cases-string';
import { DP_USE_CASES } from './use-cases-dp';

export const USE_CASES: Record<string, AlgorithmUseCase[]> = {
  ...SORTING_USE_CASES,
  ...SEARCHING_USE_CASES,
  ...GRAPH_USE_CASES,
  ...STRING_USE_CASES,
  ...DP_USE_CASES,
};

export function useCasesFor(id: string): AlgorithmUseCase[] {
  return USE_CASES[id] ?? [];
}
