export type LabKind = 'stack' | 'heap' | 'graph';
export type GraphAlgorithm = 'bfs' | 'dfs' | 'dijkstra';

export type GraphNode = {
  id: string;
  x: number;
  y: number;
};

export type GraphEdge = {
  from: string;
  to: string;
  weight?: number;
};

export type GraphFrameState = {
  visited: string[];
  frontier: string[];
  current: string | null;
  traversedEdge: GraphEdge | null;
  distances?: Record<string, number | null>;
};

export type LabFrame = {
  id: number;
  domain: LabKind;
  action: string;
  message: string;
  stack?: number[];
  heap?: number[];
  activeIndices?: number[];
  graph?: GraphFrameState;
  line?: number | null;
};

export type LabEntry = {
  id: string;
  name: string;
  family: 'Data Structure' | 'Graph Algorithm';
  summary: string;
  lab: LabKind;
  preset: 'push' | 'extract' | 'heapify' | GraphAlgorithm;
};
