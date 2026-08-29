import { create } from 'zustand';
import { ALGORITHM_BY_ID } from '../algorithms/catalog';
import type { AlgorithmId } from '../algorithms/types';
import { DEFAULT_SOURCE, type ReferenceId } from '../lib/references';
import { DEFAULT_INPUT_TEXT } from '../lib/input';
import type { AnalysisResult, AppMode, RunStatus, TraceResult } from '../types';

const STORAGE_KEY = 'algoscope:draft:v2';
const LEGACY_STORAGE_KEY = 'algoscope:draft:v1';

function loadDraft() {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) return JSON.parse(current).customDraft || DEFAULT_SOURCE;
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      persistDraft(legacy);
      return legacy;
    }
    return DEFAULT_SOURCE;
  } catch {
    return DEFAULT_SOURCE;
  }
}

function persistDraft(customDraft: string) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ customDraft }));
  } catch {
    // Editing remains available when storage is blocked.
  }
}

const initialDraft = loadDraft();

function resultReset(): Partial<AppState> {
  return {
    trace: null,
    referenceTrace: null,
    analysis: null,
    referenceAnalysis: null,
    currentStep: 0,
    playing: false,
  };
}

type AppState = {
  mode: AppMode;
  source: string;
  customDraft: string;
  sourceOrigin: 'custom' | AlgorithmId;
  documentModified: boolean;
  inputText: string;
  referenceId: ReferenceId;
  status: RunStatus;
  runtimeVersion: string | null;
  error: string | null;
  trace: TraceResult | null;
  referenceTrace: TraceResult | null;
  analysis: AnalysisResult | null;
  referenceAnalysis: AnalysisResult | null;
  currentStep: number;
  playing: boolean;
  speed: number;
  setMode: (mode: AppMode) => void;
  setSource: (source: string) => void;
  openAlgorithm: (algorithmId: AlgorithmId, input?: number[]) => void;
  restoreCustomDraft: () => void;
  forkAlgorithm: () => void;
  resetCustomDraft: () => void;
  setInputText: (inputText: string) => void;
  setReferenceId: (referenceId: ReferenceId) => void;
  setStatus: (status: RunStatus) => void;
  setRuntimeVersion: (runtimeVersion: string) => void;
  setError: (error: string | null) => void;
  setTrace: (trace: TraceResult | null) => void;
  setReferenceTrace: (trace: TraceResult | null) => void;
  setAnalysis: (analysis: AnalysisResult | null) => void;
  setReferenceAnalysis: (analysis: AnalysisResult | null) => void;
  setCurrentStep: (step: number | ((current: number) => number)) => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
};

export const useAppStore = create<AppState>((set) => ({
  mode: 'library',
  source: initialDraft,
  customDraft: initialDraft,
  sourceOrigin: 'custom',
  documentModified: false,
  inputText: DEFAULT_INPUT_TEXT,
  referenceId: 'merge',
  status: 'idle',
  runtimeVersion: null,
  error: null,
  trace: null,
  referenceTrace: null,
  analysis: null,
  referenceAnalysis: null,
  currentStep: 0,
  playing: false,
  speed: 1,
  setMode: (mode) => set({ mode, currentStep: 0, playing: false, error: null }),
  setSource: (source) =>
    set((state) => {
      if (state.sourceOrigin === 'custom') {
        persistDraft(source);
        return { source, customDraft: source, documentModified: true };
      }
      return { source, documentModified: true };
    }),
  openAlgorithm: (algorithmId, input) => {
    const algorithm = ALGORITHM_BY_ID[algorithmId];
    set({
      source: algorithm.source,
      sourceOrigin: algorithmId,
      documentModified: false,
      inputText: (input || algorithm.examples.default).join(', '),
      error: null,
      ...resultReset(),
    });
  },
  restoreCustomDraft: () =>
    set((state) => ({
      source: state.customDraft,
      sourceOrigin: 'custom',
      documentModified: false,
      ...resultReset(),
    })),
  forkAlgorithm: () =>
    set((state) => {
      persistDraft(state.source);
      return { customDraft: state.source, sourceOrigin: 'custom', documentModified: false };
    }),
  resetCustomDraft: () => {
    persistDraft(DEFAULT_SOURCE);
    set({
      source: DEFAULT_SOURCE,
      customDraft: DEFAULT_SOURCE,
      sourceOrigin: 'custom',
      documentModified: false,
      error: null,
      ...resultReset(),
    });
  },
  setInputText: (inputText) => set({ inputText }),
  setReferenceId: (referenceId) => set({ referenceId }),
  setStatus: (status) => set({ status }),
  setRuntimeVersion: (runtimeVersion) => set({ runtimeVersion, status: 'ready' }),
  setError: (error) => set({ error }),
  setTrace: (trace) => set({ trace, currentStep: 0, playing: false }),
  setReferenceTrace: (referenceTrace) => set({ referenceTrace }),
  setAnalysis: (analysis) => set({ analysis }),
  setReferenceAnalysis: (referenceAnalysis) => set({ referenceAnalysis }),
  setCurrentStep: (step) =>
    set((state) => ({
      currentStep: typeof step === 'function' ? step(state.currentStep) : step,
    })),
  setPlaying: (playing) => set({ playing }),
  setSpeed: (speed) => set({ speed }),
}));
