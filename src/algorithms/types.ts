import type { JsonValue } from '../types';

export type AlgorithmId =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'cocktail'
  | 'gnome'
  | 'shell'
  | 'merge'
  | 'quick'
  | 'heap'
  | 'cycle'
  | 'comb'
  | 'odd-even'
  | 'pancake'
  | 'binary-insertion'
  | 'three-way-quick'
  | 'natural-merge'
  | 'hoare-quick'
  | 'dual-pivot-quick'
  | 'median-three-quick'
  | 'bottom-up-merge'
  | 'in-place-merge'
  | 'intro'
  | 'tim'
  | 'tournament'
  | 'patience'
  | 'tree'
  | 'strand'
  | 'counting'
  | 'radix-lsd'
  | 'bucket';

export type AlgorithmFamily =
  'Exchange' | 'Selection' | 'Insertion' | 'Divide & Conquer' | 'Heap' | 'Hybrid' | 'Distribution' | 'Tree';
export type AlgorithmLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type AlgorithmProblem = 'Sorting' | 'Searching' | 'Graph' | 'String' | 'Dynamic Programming';
export type AlgorithmContract = 'sort-numeric-array' | 'sort-integer-array';

export type AlgorithmUseCase = {
  title: string;
  context: string;
  tags: string[];
};

export type ScaleSuitability = 'small' | 'medium' | 'large' | 'all';

export type AlgorithmDefinition = {
  kind: 'sort';
  id: AlgorithmId;
  problem: AlgorithmProblem;
  contract: AlgorithmContract;
  name: string;
  family: AlgorithmFamily;
  level: AlgorithmLevel;
  summary: string;
  explanation: [string, string, string];
  limitation: string;
  complexity: {
    best: string;
    average: string;
    worst: string;
    memory: string;
    note?: string;
  };
  traits: {
    stable: boolean;
    inPlace: boolean;
    recursive: boolean;
  };
  source: string;
  examples: {
    default: number[];
    bestCase: number[];
    worstCase: number[];
  };
  tags: string[];
  useCases?: AlgorithmUseCase[];
};

export type SolveAlgorithmDefinition = {
  kind: 'solve';
  id: string;
  problem: Exclude<AlgorithmProblem, 'Sorting'>;
  contract: string;
  name: string;
  family: string;
  level: AlgorithmLevel;
  summary: string;
  explanation: [string, string, string];
  limitation: string;
  complexity: AlgorithmDefinition['complexity'];
  source: string;
  demo: {
    input: JsonValue;
    expected: JsonValue;
  };
  tags: string[];
  useCases?: AlgorithmUseCase[];
};

export type CatalogAlgorithmDefinition = (AlgorithmDefinition | SolveAlgorithmDefinition) & {
  useCases?: AlgorithmUseCase[];
  scaleSuitability?: ScaleSuitability;
};
export type CatalogAlgorithmId = CatalogAlgorithmDefinition['id'];
