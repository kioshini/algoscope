import { ALGORITHMS } from './catalog';
import { DP_ALGORITHMS } from './packs/dynamic_programming';
import { GRAPH_ALGORITHMS } from './packs/graphs';
import { SEARCHING_ALGORITHMS } from './packs/searching';
import { STRING_ALGORITHMS } from './packs/strings';
import { USE_CASES } from './use-cases';
import { scaleForComplexity } from './scale';
import type { CatalogAlgorithmDefinition } from './types';

function withUseCases(algorithm: CatalogAlgorithmDefinition): CatalogAlgorithmDefinition {
  return {
    ...algorithm,
    useCases: USE_CASES[algorithm.id] ?? [],
    scaleSuitability: scaleForComplexity(algorithm.complexity),
  };
}

export const CATALOG_ALGORITHMS = [
  ...ALGORITHMS,
  ...SEARCHING_ALGORITHMS,
  ...GRAPH_ALGORITHMS,
  ...STRING_ALGORITHMS,
  ...DP_ALGORITHMS,
].map(withUseCases);

export const CATALOG_ALGORITHM_BY_ID = Object.fromEntries(
  CATALOG_ALGORITHMS.map((algorithm) => [algorithm.id, algorithm]),
) as Record<string, CatalogAlgorithmDefinition>;
