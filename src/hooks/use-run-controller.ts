import { useAppStore } from '../store/use-app-store';
import { algorithmWorker } from '../lib/worker-client';
import { parseInput } from '../lib/input';
import { REFERENCES } from '../lib/references';
import { addRunHistory, type RunHistoryEntry } from '../lib/run-history';
import { minimizeFailingInputAsync } from '../lib/counterexample';
import { parsePythonLine } from '../lib/errors';
import type { AlgorithmDefinition } from '../algorithms/types';
import type { TranslationKey } from '../lib/i18n';
import type { AppMode } from '../types';

type MobilePane = 'code' | 'visual' | 'metrics';

export type RunControllerDeps = {
  t: (key: TranslationKey) => string;
  format: (key: TranslationKey, params: Record<string, string | number>) => string;
  changeMode: (mode: AppMode) => void;
  changeInput: (input: string) => void;
  setErrorLine: (line: number | null) => void;
  setMobilePane: (pane: MobilePane) => void;
  setResultStale: (stale: boolean) => void;
  setRunHistory: (entries: RunHistoryEntry[]) => void;
  setNotice: (notice: string | null) => void;
  setToolsOpen: (open: boolean) => void;
  dismissOnboarding: () => void;
};

export function useRunController(deps: RunControllerDeps) {
  const store = useAppStore();

  async function runCurrentMode() {
    const runMode = store.mode;
    store.setError(null);
    deps.setErrorLine(null);
    deps.setResultStale(false);
    store.setStatus('running');
    store.setPlaying(false);
    if (runMode === 'trace') {
      store.setTrace(null);
      deps.setMobilePane('visual');
    } else if (runMode === 'compare') {
      store.setTrace(null);
      store.setReferenceTrace(null);
      deps.setMobilePane('metrics');
    } else if (runMode === 'complexity') {
      store.setAnalysis(null);
      store.setReferenceAnalysis(null);
      deps.setMobilePane('metrics');
    }
    try {
      const values = parseInput(store.inputText);
      if (runMode === 'trace') {
        store.setTrace(await algorithmWorker.trace(store.source, values));
      } else if (runMode === 'compare') {
        const custom = await algorithmWorker.trace(store.source, values);
        store.setTrace(custom);
        const reference = await algorithmWorker.trace(REFERENCES[store.referenceId].source, values);
        store.setReferenceTrace(reference);
      } else if (runMode === 'complexity') {
        const custom = await algorithmWorker.analyze(store.source);
        store.setAnalysis(custom);
        const reference = await algorithmWorker.analyze(REFERENCES[store.referenceId].source);
        store.setReferenceAnalysis(reference);
      } else {
        store.setStatus('ready');
        return;
      }
      store.setStatus('ready');
      if (runMode === 'trace' || runMode === 'compare') store.setPlaying(true);
      const latestTrace = useAppStore.getState().trace;
      const entry: RunHistoryEntry = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        mode: runMode,
        source: store.source,
        input: store.inputText,
        reference: store.referenceId,
        correct: latestTrace?.correct,
        elapsedMs: latestTrace?.elapsedMs,
      };
      deps.setRunHistory(addRunHistory(entry));
      deps.dismissOnboarding();
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      store.setStatus('error');
      store.setError(error.message);
      deps.setErrorLine(parsePythonLine(error.message));
    }
  }

  async function findCounterexample() {
    deps.setToolsOpen(false);
    store.setStatus('running');
    try {
      const reduced = await minimizeFailingInputAsync(
        [
          [2, 1],
          [3, 1, 2],
          [1, 1, 0],
          [0, -1, 2],
          [5, 4, 3, 2, 1],
          [2, 1, 2, 0],
        ],
        async (candidate) => (await algorithmWorker.trace(store.source, [...candidate])).correct,
      );
      if (reduced) {
        deps.changeInput(reduced.join(', '));
        deps.setNotice(deps.format('counterexampleFound', { input: `[${reduced.join(', ')}]` }));
      } else deps.setNotice(deps.t('counterexampleNone'));
      store.setStatus('ready');
    } catch (cause) {
      store.setStatus('error');
      store.setError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  function stopExecution() {
    algorithmWorker.stop();
    store.setStatus('loading');
    store.setError(deps.t('executionRestarting'));
    algorithmWorker
      .warmup()
      .then(store.setRuntimeVersion)
      .catch((error: Error) => store.setError(error.message));
  }

  async function analyzeFromLibrary(algorithm: AlgorithmDefinition) {
    const referenceId = algorithm.id === 'merge' ? 'quick' : 'merge';
    deps.changeMode('complexity');
    store.openAlgorithm(algorithm.id);
    store.setReferenceId(referenceId);
    store.setStatus('running');
    try {
      store.setAnalysis(await algorithmWorker.analyze(algorithm.source));
      store.setReferenceAnalysis(await algorithmWorker.analyze(REFERENCES[referenceId].source));
      store.setStatus('ready');
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      store.setStatus('error');
      store.setError(error.message);
    }
  }

  return { runCurrentMode, findCounterexample, stopExecution, analyzeFromLibrary };
}
