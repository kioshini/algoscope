import type { GraphEdge, GraphNode, LabFrame, LabKind } from './labs/types';

export type AppMode = 'trace' | 'compare' | 'complexity' | 'library' | 'structures';
export type RunStatus = 'idle' | 'loading' | 'ready' | 'running' | 'error';
export type EventKind = 'line' | 'read' | 'compare' | 'write' | 'call' | 'return' | 'done';
export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export type TraceEvent = {
  seq: number;
  type: EventKind;
  line: number | null;
  values: number[];
  index?: number;
  leftIndex?: number | null;
  rightIndex?: number | null;
  leftValue?: number;
  rightValue?: number;
  op?: string;
  previous?: number;
  next?: number;
  function?: string;
  locals?: Record<string, unknown>;
  callDepth?: number;
  callStack?: string[];
};

export type TraceMetrics = {
  reads: number;
  writes: number;
  comparisons: number;
  calls: number;
  total: number;
};

export type TraceResult = {
  result: number[];
  expected: number[];
  correct: boolean;
  events: TraceEvent[];
  metrics: TraceMetrics;
  elapsedMs: number;
  lineOperationCounts?: Record<string, number>;
};

export type AnalysisPoint = TraceMetrics & {
  n: number;
  elapsedMs: number;
};

export type AnalysisCase = {
  name: string;
  points: AnalysisPoint[];
};

export type AnalysisResult = {
  cases: AnalysisCase[];
};

export type MeasureResult = {
  elapsedMs: number;
  samples: number[];
};

export type ExecuteResult = {
  result: JsonValue;
};

export type WorkerRequest =
  | {
      id: string;
      type: 'trace';
      source: string;
      values: number[];
      maxEvents: number;
      timeoutMs: number;
    }
  | {
      id: string;
      type: 'analyze';
      source: string;
      sizes: number[];
      patterns: string[];
      timeoutMs: number;
    }
  | {
      id: string;
      type: 'visualize-lab';
      lab: LabKind;
      source: string;
      initial?: number[];
      graph?: {
        nodes: GraphNode[];
        edges: GraphEdge[];
        start: string;
        directed: boolean;
      };
      timeoutMs: number;
    }
  | {
      id: string;
      type: 'measure';
      source: string;
      values: number[];
      repeats: number;
    }
  | {
      id: string;
      type: 'execute';
      source: string;
      data: JsonValue;
      timeoutMs: number;
    };

export type WorkerResponse =
  | { id: string; type: 'ready'; version: string }
  | ({ id: string; type: 'trace-result' } & TraceResult)
  | ({ id: string; type: 'analysis-result' } & AnalysisResult)
  | ({ id: string; type: 'measure-result' } & MeasureResult)
  | ({ id: string; type: 'execute-result' } & ExecuteResult)
  | { id: string; type: 'lab-result'; frames: LabFrame[] }
  | { id: string; type: 'error'; name: string; message: string };
