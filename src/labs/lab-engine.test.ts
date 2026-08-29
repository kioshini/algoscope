import { describe, expect, it } from 'vitest';
import { extractHeap, heapify, insertHeap, popStack, pushStack, traverseGraph } from './lab-engine';
import type { GraphEdge, GraphNode } from './types';

function expectMinHeap(values: number[]) {
  for (let index = 1; index < values.length; index += 1) {
    const parent = Math.floor((index - 1) / 2);
    expect(values[parent]).toBeLessThanOrEqual(values[index]);
  }
}

describe('stack frames', () => {
  it('records push and pop states without mutating the input', () => {
    const stack = [1, 2];
    expect(pushStack(stack, 3).at(-1)?.stack).toEqual([1, 2, 3]);
    expect(popStack(stack).at(-1)?.stack).toEqual([1]);
    expect(stack).toEqual([1, 2]);
  });
});

describe('min heap frames', () => {
  it('preserves the heap invariant after insert and extract', () => {
    const inserted = insertHeap([1, 4, 3, 9, 7], 0).at(-1)?.heap || [];
    expectMinHeap(inserted);
    expect(inserted[0]).toBe(0);

    const extracted = extractHeap(inserted).at(-1)?.heap || [];
    expectMinHeap(extracted);
    expect(extracted).not.toContain(0);
  });

  it('heapifies an arbitrary array bottom-up', () => {
    const result = heapify([9, 4, 7, 1, 3, 6, 2]).at(-1)?.heap || [];
    expectMinHeap(result);
    expect(result[0]).toBe(1);
  });
});

describe('graph traversal frames', () => {
  const nodes: GraphNode[] = ['A', 'B', 'C', 'D'].map((id, index) => ({ id, x: index, y: 0 }));
  const edges: GraphEdge[] = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
  ];

  it('produces deterministic BFS and DFS visit orders', () => {
    const bfs = traverseGraph(nodes, edges, 'A', 'bfs', false).filter((frame) => frame.action === 'visit');
    const dfs = traverseGraph(nodes, edges, 'A', 'dfs', false).filter((frame) => frame.action === 'visit');

    expect(bfs.map((frame) => frame.graph?.current)).toEqual(['A', 'B', 'C', 'D']);
    expect(dfs.map((frame) => frame.graph?.current)).toEqual(['A', 'B', 'D', 'C']);
    expect(new Set(bfs.map((frame) => frame.graph?.current)).size).toBe(4);
  });

  it('respects directed edges', () => {
    const directed = traverseGraph(nodes, [{ from: 'A', to: 'B' }], 'B', 'bfs', true).filter(
      (frame) => frame.action === 'visit',
    );
    const undirected = traverseGraph(nodes, [{ from: 'A', to: 'B' }], 'B', 'bfs', false).filter(
      (frame) => frame.action === 'visit',
    );

    expect(directed.map((frame) => frame.graph?.current)).toEqual(['B']);
    expect(undirected.map((frame) => frame.graph?.current)).toEqual(['B', 'A']);
  });
});

describe('Dijkstra frames', () => {
  const nodes: GraphNode[] = ['A', 'B', 'C', 'D', 'E'].map((id, index) => ({ id, x: index, y: 0 }));
  const edges: GraphEdge[] = [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 1 },
    { from: 'C', to: 'B', weight: 2 },
    { from: 'B', to: 'D', weight: 1 },
    { from: 'C', to: 'D', weight: 5 },
  ];

  it('settles nodes deterministically and records shortest distances', () => {
    const frames = traverseGraph(nodes, edges, 'A', 'dijkstra', true);
    const settled = frames.filter((frame) => frame.action === 'settle');

    expect(settled.map((frame) => frame.graph?.current)).toEqual(['A', 'C', 'B', 'D']);
    expect(frames.at(-1)?.graph?.distances).toEqual({ A: 0, B: 3, C: 1, D: 4, E: null });
    expect(frames.map((frame) => frame.id)).toEqual(frames.map((_, index) => index));
  });

  it('defaults omitted weights to one and resolves equal distances by node ID', () => {
    const frames = traverseGraph(
      nodes.slice(0, 4),
      [
        { from: 'A', to: 'C' },
        { from: 'A', to: 'B' },
      ],
      'A',
      'dijkstra',
      false,
    );

    expect(frames.filter((frame) => frame.action === 'settle').map((frame) => frame.graph?.current)).toEqual([
      'A',
      'B',
      'C',
    ]);
    expect(frames.at(-1)?.graph?.distances).toEqual({ A: 0, B: 1, C: 1, D: null });
  });

  it('rejects negative weights', () => {
    expect(() => traverseGraph(nodes, [{ from: 'A', to: 'B', weight: -1 }], 'A', 'dijkstra', true)).toThrow(
      /non-negative/,
    );
  });
});
