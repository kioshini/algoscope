import type { ScenarioDef } from './ranking';
import { SCENARIOS } from './ranking';

export type CodeSignal = {
  scenarioId: string;
  confidence: number;
  matched: string[];
};

const SIGNALS: Array<{ scenarioId: string; patterns: string[] }> = [
  { scenarioId: 'fast-search-sorted', patterns: ['low', 'high', 'middle', 'mid', 'binary'] },
  { scenarioId: 'sort-large', patterns: ['def sort', 'values', 'swap', 'pivot', 'partition', 'merge'] },
  { scenarioId: 'sort-nearly-sorted', patterns: ['insertion', 'shift', 'while', 'position', 'already'] },
  { scenarioId: 'sort-small', patterns: ['for end in range', 'bubble', 'selection', 'minimum', 'if values'] },
  { scenarioId: 'shortest-paths', patterns: ['graph', 'edges', 'weights', 'dijkstra', 'relax', 'dist'] },
  {
    scenarioId: 'graph-traversal',
    patterns: ['graph', 'visited', 'queue', 'stack', 'neighbors', 'adjacency', 'frontier'],
  },
  { scenarioId: 'substring-search', patterns: ['text', 'pattern', 'prefix', 'compare', 'match', 'needle'] },
  {
    scenarioId: 'dp-optimization',
    patterns: ['dp', 'memo', 'capacity', 'knapsack', 'coins', 'weight', 'subsequence', 'table'],
  },
];

export function detectScenarioFromCode(code: string): CodeSignal | null {
  const normalized = code.toLowerCase();
  let best: CodeSignal | null = null;
  for (const signal of SIGNALS) {
    const matched = signal.patterns.filter((pattern) => normalized.includes(pattern));
    if (!matched.length) continue;
    const confidence = Math.min(1, matched.length / signal.patterns.length);
    if (
      !best ||
      confidence > best.confidence ||
      (confidence === best.confidence && best.scenarioId !== signal.scenarioId && matched.length > 0)
    ) {
      best = { scenarioId: signal.scenarioId, confidence, matched: matched.slice(0, 4) };
    }
  }
  return best;
}

export function scenarioFor(id: string): ScenarioDef | undefined {
  return SCENARIOS.find((scenario) => scenario.id === id);
}
