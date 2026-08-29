import type {
  AnalysisResult,
  ExecuteResult,
  JsonValue,
  MeasureResult,
  TraceResult,
  WorkerRequest,
  WorkerResponse,
} from '../types';
import type { GraphEdge, GraphNode, LabFrame, LabKind } from '../labs/types';

type WorkerResult = TraceResult | AnalysisResult | MeasureResult | ExecuteResult | { frames: LabFrame[] };

type PendingRequest = {
  resolve: (value: WorkerResult) => void;
  reject: (reason: Error) => void;
  timer: ReturnType<typeof setTimeout>;
};

class AlgorithmWorkerClient {
  private worker: Worker | null = null;
  private pending = new Map<string, PendingRequest>();
  private readyPromise: Promise<string> | null = null;
  private readyResolve: ((version: string) => void) | null = null;
  private readyReject: ((reason: Error) => void) | null = null;

  warmup() {
    this.ensureWorker();
    return this.readyPromise as Promise<string>;
  }

  trace(source: string, values: number[]) {
    return this.request<TraceResult>(
      {
        id: crypto.randomUUID(),
        type: 'trace',
        source,
        values,
        maxEvents: 30000,
        timeoutMs: 4000,
      },
      12000,
    );
  }

  analyze(source: string) {
    return this.request<AnalysisResult>(
      {
        id: crypto.randomUUID(),
        type: 'analyze',
        source,
        sizes: [8, 16, 32, 64, 96],
        patterns: ['random', 'sorted', 'reversed', 'nearly'],
        timeoutMs: 12000,
      },
      20000,
    );
  }

  measure(source: string, values: number[]) {
    return this.request<MeasureResult>(
      {
        id: crypto.randomUUID(),
        type: 'measure',
        source,
        values,
        repeats: 7,
      },
      12000,
    );
  }

  execute(source: string, data: JsonValue) {
    return this.request<ExecuteResult>(
      {
        id: crypto.randomUUID(),
        type: 'execute',
        source,
        data,
        timeoutMs: 4000,
      },
      12000,
    );
  }

  visualizeLab(
    lab: LabKind,
    source: string,
    options: {
      initial?: number[];
      graph?: {
        nodes: GraphNode[];
        edges: GraphEdge[];
        start: string;
        directed: boolean;
      };
    },
  ) {
    return this.request<{ frames: LabFrame[] }>(
      {
        id: crypto.randomUUID(),
        type: 'visualize-lab',
        lab,
        source,
        timeoutMs: 4000,
        ...options,
      },
      12000,
    ).then((result) => result.frames);
  }

  stop() {
    for (const request of this.pending.values()) {
      clearTimeout(request.timer);
      request.reject(new Error('Execution stopped.'));
    }
    this.pending.clear();
    this.worker?.terminate();
    this.worker = null;
    this.readyReject?.(new Error('Python runtime stopped.'));
    this.readyPromise = null;
    this.readyResolve = null;
    this.readyReject = null;
  }

  private ensureWorker() {
    if (this.worker) return;
    this.readyPromise = new Promise((resolve, reject) => {
      this.readyResolve = resolve;
      this.readyReject = reject;
    });
    this.worker = new Worker(new URL('../workers/algorithm.worker.ts', import.meta.url), { type: 'module' });
    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => this.handleMessage(event.data);
    this.worker.onerror = (event) => {
      const error = new Error(event.message || 'Algorithm worker failed.');
      this.readyReject?.(error);
      this.failAll(error);
    };
  }

  private async request<T extends WorkerResult>(request: WorkerRequest, hardTimeout: number) {
    this.ensureWorker();
    await this.readyPromise;
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.stop();
        reject(new Error('Execution timed out. The Python runtime was restarted.'));
      }, hardTimeout);
      this.pending.set(request.id, {
        resolve: resolve as (value: WorkerResult) => void,
        reject,
        timer,
      });
      this.worker?.postMessage(request);
    });
  }

  private handleMessage(response: WorkerResponse) {
    if (response.type === 'ready') {
      this.readyResolve?.(response.version);
      this.readyResolve = null;
      this.readyReject = null;
      return;
    }
    if (response.type === 'error' && response.id === 'startup') {
      this.readyReject?.(new Error(response.message));
      this.readyResolve = null;
      this.readyReject = null;
      return;
    }
    const request = this.pending.get(response.id);
    if (!request) return;
    clearTimeout(request.timer);
    this.pending.delete(response.id);
    if (response.type === 'error') {
      request.reject(new Error(response.message));
    } else {
      const { id, type, ...result } = response;
      void id;
      void type;
      request.resolve(result as WorkerResult);
    }
  }

  private failAll(error: Error) {
    for (const request of this.pending.values()) {
      clearTimeout(request.timer);
      request.reject(error);
    }
    this.pending.clear();
  }
}

export const algorithmWorker = new AlgorithmWorkerClient();
