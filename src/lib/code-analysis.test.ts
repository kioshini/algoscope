import { describe, expect, it } from 'vitest';
import { detectScenarioFromCode, scenarioFor } from './code-analysis';

describe('code analysis', () => {
  it('detects a binary-search-like routine', () => {
    const result = detectScenarioFromCode(
      'def search(values): low = 0; high = len(values) - 1; middle = (low + high) // 2; return middle',
    );
    expect(result).not.toBeNull();
    expect(result?.scenarioId).toBe('fast-search-sorted');
  });

  it('detects a sort routine', () => {
    const result = detectScenarioFromCode(
      'def sort(values):\n    pivot = values[0]\n    left = [x for x in values[1:] if x < pivot]\n    return values',
    );
    expect(result).not.toBeNull();
    expect(result?.matched.length).toBeGreaterThan(0);
  });

  it('detects graph traversal', () => {
    const result = detectScenarioFromCode(
      'def bfs(graph, start): queue = [start]; visited = set(); while queue: node = queue.pop(0); visited.add(node)',
    );
    expect(result?.scenarioId).toBe('graph-traversal');
  });

  it('returns null for code with no known signal', () => {
    expect(detectScenarioFromCode('def foo(x): return x + 1')).toBeNull();
  });

  it('resolves a scenario id to a def', () => {
    expect(scenarioFor('dp-optimization')?.id).toBe('dp-optimization');
  });
});
