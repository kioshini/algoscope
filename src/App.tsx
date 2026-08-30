import { WarningCircle } from '@phosphor-icons/react';
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ALGORITHM_BY_ID } from './algorithms/catalog';
import { CATALOG_ALGORITHM_BY_ID } from './algorithms/full-catalog';
import type { AlgorithmDefinition, AlgorithmId, CatalogAlgorithmDefinition } from './algorithms/types';
import type { LabEntry } from './labs/types';
import { AlgorithmStage } from './components/AlgorithmStage';
import { BenchmarkView } from './components/BenchmarkView';
import { AppHeader } from './components/AppHeader';
import type { CommandAction } from './components/CommandPalette';
import { ControlBar } from './components/ControlBar';
import { MetricsPanel } from './components/MetricsPanel';
import { PlaybackBar } from './components/PlaybackBar';
import { DEFAULT_INPUT_TEXT, DEFAULT_INPUT_VALUES, parseInput } from './lib/input';
import { algorithmWorker } from './lib/worker-client';
import { REFERENCES, type ReferenceId } from './lib/references';
import { readRunHistory, type RunHistoryEntry } from './lib/run-history';
import { decodeShareState, encodeShareState } from './lib/share-state';
import { useI18n } from './lib/i18n';
import { useFocusTrap } from './lib/focus-trap';
import { detectScenarioFromCode, scenarioFor } from './lib/code-analysis';
import { significantEvents, significantFullIndex } from './lib/complexity';
import { SkeletonRows } from './components/Skeleton';
import { useAppStore } from './store/use-app-store';
import { useKeyboardShortcuts } from './hooks/use-keyboard-shortcuts';
import { useRunController, type RunControllerDeps } from './hooks/use-run-controller';
import type { AppMode, TraceResult } from './types';

const CodePanel = lazy(() => import('./components/CodePanel').then((module) => ({ default: module.CodePanel })));
const ComplexityView = lazy(() =>
  import('./components/ComplexityView').then((module) => ({ default: module.ComplexityView })),
);
const LibraryView = lazy(() =>
  import('./components/library/LibraryView').then((module) => ({ default: module.LibraryView })),
);
const StructuresView = lazy(() =>
  import('./components/StructuresView').then((module) => ({ default: module.StructuresView })),
);
const CommandPalette = lazy(() =>
  import('./components/CommandPalette').then((module) => ({ default: module.CommandPalette })),
);
const ShortcutsOverlay = lazy(() =>
  import('./components/ShortcutsOverlay').then((module) => ({ default: module.ShortcutsOverlay })),
);
const AdvisorPanel = lazy(() =>
  import('./components/AdvisorPanel').then((module) => ({ default: module.AdvisorPanel })),
);
type MobilePane = 'code' | 'visual' | 'metrics';

export default function App() {
  const store = useAppStore();
  const { t, format } = useI18n();
  const [labLaunch, setLabLaunch] = useState<Pick<LabEntry, 'lab' | 'preset'>>({ lab: 'stack', preset: 'push' });
  const [benchmarkSeed, setBenchmarkSeed] = useState<AlgorithmId>('quick');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [advisorScenario, setAdvisorScenario] = useState<string | null>(null);
  const [advisorMatch, setAdvisorMatch] = useState<string | null>(null);
  const [libraryFocus, setLibraryFocus] = useState<{ id: string; nonce: number } | null>(null);
  const [mobilePane, setMobilePane] = useState<MobilePane>('visual');
  const [resultStale, setResultStale] = useState(false);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [runHistory, setRunHistory] = useState<RunHistoryEntry[]>(readRunHistory);
  const [notice, setNotice] = useState<string | null>(null);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => localStorage.getItem('algoscope:onboarded') !== '1');
  const toolsRef = useRef<HTMLElement>(null);
  useFocusTrap(toolsRef, toolsOpen, () => setToolsOpen(false));
  const input = safeParseInput(store.inputText);
  const traceVisualCount = useMemo(() => significantEvents(store.trace?.events ?? []).length, [store.trace]);
  const referenceVisualCount = useMemo(
    () => significantEvents(store.referenceTrace?.events ?? []).length,
    [store.referenceTrace],
  );
  const traceEvent = store.trace?.events[significantFullIndex(store.trace.events, store.currentStep)] ?? null;
  const maximumStep =
    store.mode === 'compare' ? Math.max(traceVisualCount, referenceVisualCount) - 1 : (traceVisualCount || 1) - 1;
  const metricsStep = store.trace ? significantFullIndex(store.trace.events, store.currentStep) : store.currentStep;
  const busy = store.status === 'running' || store.status === 'loading';
  const executing = store.status === 'running';

  useEffect(() => {
    store.setStatus('loading');
    algorithmWorker
      .warmup()
      .then(store.setRuntimeVersion)
      .catch((error: Error) => {
        store.setStatus('error');
        store.setError(error.message);
      });
  }, []);

  useEffect(() => {
    function applyLocation() {
      const [route, query = ''] = location.hash.replace(/^#\/?/, '').split('?');
      const shared = new URLSearchParams(query).get('s');
      if (shared) {
        const state = decodeShareState(shared);
        if (state && isAppMode(state.mode) && state.reference in REFERENCES) {
          store.restoreCustomDraft();
          store.setSource(state.source);
          store.setInputText(state.input);
          store.setReferenceId(state.reference as ReferenceId);
          store.setMode(state.mode);
          if (state.lab === 'stack' || state.lab === 'heap' || state.lab === 'graph')
            setLabLaunch({ lab: state.lab, preset: state.lab === 'graph' ? 'bfs' : 'push' });
          setResultStale(false);
          return;
        }
      }
      if (isAppMode(route)) store.setMode(route);
    }
    applyLocation();
    window.addEventListener('hashchange', applyLocation);
    return () => window.removeEventListener('hashchange', applyLocation);
  }, []);

  useEffect(() => {
    if (!store.playing || maximumStep <= 0) return;
    const timer = window.setInterval(
      () => {
        store.setCurrentStep((current) => {
          if (current >= maximumStep) {
            store.setPlaying(false);
            return maximumStep;
          }
          return current + 1;
        });
      },
      Math.max(45, 360 / store.speed),
    );
    return () => window.clearInterval(timer);
  }, [store.playing, store.speed, maximumStep]);

  useEffect(() => {
    setMobilePane(store.mode === 'trace' ? 'visual' : 'metrics');
  }, [store.mode]);

  const runControllerDeps: RunControllerDeps = {
    t,
    format,
    changeMode,
    changeInput,
    setErrorLine,
    setMobilePane,
    setResultStale,
    setRunHistory,
    setNotice,
    setToolsOpen,
    dismissOnboarding,
  };
  const { runCurrentMode, findCounterexample, stopExecution, analyzeFromLibrary } = useRunController(runControllerDeps);

  useKeyboardShortcuts({
    onRun: () => void runCurrentMode(),
    onTogglePalette: () => setPaletteOpen((open) => !open),
    onToggleShortcuts: () => setShortcutsOpen((open) => !open),
  });

  function changeMode(mode: AppMode) {
    store.setMode(mode);
    history.pushState(null, '', `#/${mode}`);
  }

  function changeSource(source: string) {
    store.setSource(source);
    setErrorLine(null);
    if (store.trace || store.analysis) setResultStale(true);
  }

  function changeInput(inputText: string) {
    store.setInputText(inputText);
    if (store.trace || store.analysis) setResultStale(true);
  }

  function changeReference(reference: ReferenceId) {
    store.setReferenceId(reference);
    if (store.referenceTrace || store.referenceAnalysis) setResultStale(true);
  }

  async function shareCurrent() {
    const encoded = encodeShareState({
      mode: store.mode,
      source: store.source,
      input: store.inputText,
      reference: store.referenceId,
      lab: store.mode === 'structures' ? labLaunch.lab : undefined,
    });
    const url = `${location.origin}${location.pathname}#/${store.mode}?s=${encoded}`;
    await navigator.clipboard.writeText(url);
    setNotice(t('shareLinkCopied'));
    window.setTimeout(() => setNotice(null), 2200);
  }

  function restoreRun(entry: RunHistoryEntry) {
    store.restoreCustomDraft();
    store.setSource(entry.source);
    store.setInputText(entry.input);
    if (entry.reference in REFERENCES) store.setReferenceId(entry.reference as ReferenceId);
    if (isAppMode(entry.mode)) changeMode(entry.mode);
    setToolsOpen(false);
    setResultStale(true);
  }

  function dismissOnboarding() {
    localStorage.setItem('algoscope:onboarded', '1');
    setShowOnboarding(false);
  }

  function handlePaletteSelect(id: string, action: CommandAction) {
    const algorithm = CATALOG_ALGORITHM_BY_ID[id];
    if (action === 'library') {
      setLibraryFocus({ id, nonce: Date.now() });
      changeMode('library');
      return;
    }
    if (algorithm.kind === 'sort') {
      if (action === 'visualize') openFromLibrary(algorithm as AlgorithmDefinition);
      else if (action === 'demo') setBenchmarkSeed(algorithm.id as AlgorithmId);
    } else {
      setLibraryFocus({ id, nonce: Date.now() });
      changeMode('library');
    }
  }

  function suggestSimilar() {
    const detection = detectScenarioFromCode(store.source);
    setAdvisorScenario(detection?.scenarioId ?? null);
    setAdvisorMatch(detection ? (scenarioFor(detection.scenarioId)?.label ?? null) : null);
    setAdvisorOpen(true);
  }

  function openAdvisorAlgorithm(algorithm: CatalogAlgorithmDefinition) {
    setAdvisorOpen(false);
    if (algorithm.kind === 'sort') openFromLibrary(algorithm);
    else {
      setLibraryFocus({ id: algorithm.id, nonce: Date.now() });
      changeMode('library');
    }
  }

  function resetExample() {
    store.resetCustomDraft();
    store.setInputText(DEFAULT_INPUT_TEXT);
    setResultStale(false);
    setErrorLine(null);
  }

  function openFromLibrary(algorithm: AlgorithmDefinition, values?: number[]) {
    changeMode('trace');
    store.openAlgorithm(algorithm.id, values);
  }

  function compareWithMine(algorithm: AlgorithmDefinition) {
    setBenchmarkSeed(algorithm.id);
    store.setInputText(algorithm.examples.default.join(', '));
    changeMode('compare');
  }

  function openStructureLab(entry: LabEntry) {
    setLabLaunch({ lab: entry.lab, preset: entry.preset });
    changeMode('structures');
  }

  return (
    <div className={`app-shell ${store.mode === 'trace' ? '' : 'no-playback'}`}>
      <a className="skip-link" href="#workspace">
        {t('skipToWorkspace')}
      </a>
      <AppHeader
        status={store.status}
        runtimeVersion={store.runtimeVersion}
        primaryLabel={store.mode === 'complexity' ? t('analyzeRun') : t('run')}
        onRun={runCurrentMode}
        onStop={stopExecution}
        onReset={resetExample}
        showPrimary={store.mode !== 'library' && store.mode !== 'structures' && store.mode !== 'compare'}
        onOpenTools={() => setToolsOpen((open) => !open)}
      />
      <ControlBar
        mode={store.mode}
        inputText={store.inputText}
        referenceId={store.referenceId}
        onModeChange={changeMode}
        onInputChange={changeInput}
        onReferenceChange={changeReference}
      />

      {store.mode !== 'library' && store.mode !== 'structures' ? (
        <MobileWorkspaceNav mode={store.mode} pane={mobilePane} onPane={setMobilePane} />
      ) : null}

      {toolsOpen ? (
        <aside className="tools-popover" ref={toolsRef} aria-label={t('workspaceTools')}>
          <div className="tools-heading">
            <strong>{t('workspaceTools')}</strong>
            <button type="button" onClick={() => setToolsOpen(false)}>
              {t('close')}
            </button>
          </div>
          <div className="tool-actions">
            <button type="button" onClick={shareCurrent}>
              {t('copyShareLink')}
            </button>
            <button
              type="button"
              onClick={findCounterexample}
              disabled={store.mode === 'library' || store.mode === 'structures' || store.mode === 'compare'}
            >
              {t('findCounterexample')}
            </button>
            <button
              type="button"
              onClick={() => {
                setChallengeOpen(true);
                setToolsOpen(false);
              }}
              disabled={!store.trace}
            >
              {t('challengeMe')}
            </button>
          </div>
          <div className="accessibility-tools">
            <span>{t('accessibility')}</span>
            <button type="button" onClick={() => toggleDataset('contrast', 'high')}>
              {t('highContrast')}
            </button>
            <button type="button" onClick={() => toggleDataset('text', 'large')}>
              {t('largerText')}
            </button>
            <button type="button" onClick={() => toggleDataset('motion', 'reduced')}>
              {t('reduceMotion')}
            </button>
          </div>
          <div className="run-history-list">
            <span>{t('recentRuns')}</span>
            {runHistory.slice(0, 5).map((entry) => (
              <button type="button" key={entry.id} onClick={() => restoreRun(entry)}>
                <strong>{entry.mode}</strong>
                <small>
                  {new Date(entry.createdAt).toLocaleTimeString()} ·{' '}
                  {entry.correct === false ? t('failed') : t('completed')}
                </small>
              </button>
            ))}
            {!runHistory.length ? (
              <div className="run-history-empty">
                <small>{t('noRuns')}</small>
                <button
                  type="button"
                  onClick={() => {
                    setToolsOpen(false);
                    runCurrentMode();
                  }}
                >
                  {t('run')}
                </button>
              </div>
            ) : null}
          </div>
        </aside>
      ) : null}

      {showOnboarding && store.mode === 'trace' ? (
        <aside className="onboarding-card">
          <span>{t('firstTrace')}</span>
          <strong>{t('editRunInspect')}</strong>
          <p>{t('onboardingBody')}</p>
          <button type="button" onClick={dismissOnboarding}>
            {t('startExploring')}
          </button>
        </aside>
      ) : null}
      {notice ? (
        <div className="ux-notice" role="status">
          {notice}
        </div>
      ) : null}
      {resultStale && store.mode !== 'library' && store.mode !== 'structures' && store.mode !== 'compare' ? (
        <button className="stale-result" type="button" onClick={runCurrentMode}>
          {t('resultOutdated')}
        </button>
      ) : null}
      {challengeOpen && store.trace ? (
        <ChallengeCard
          trace={store.trace}
          step={store.currentStep}
          onClose={() => setChallengeOpen(false)}
          onAdvance={() => store.setCurrentStep(Math.min(maximumStep, store.currentStep + 1))}
        />
      ) : null}

      {store.error ? (
        <div className="error-banner" role="alert">
          <WarningCircle size={18} weight="fill" />
          <pre>{store.error}</pre>
          <button type="button" onClick={() => store.setError(null)}>
            {t('dismiss')}
          </button>
        </div>
      ) : null}

      <main
        id="workspace"
        className={`workspace mode-${store.mode} mobile-pane-${mobilePane}${resultStale ? ' result-stale' : ''}`}
      >
        {store.mode === 'library' ? (
          <Suspense fallback={<PanelLoading label={t('loadingLibrary')} />}>
            <LibraryView
              key={libraryFocus?.nonce ?? 'default'}
              initialId={libraryFocus?.id}
              onOpen={openFromLibrary}
              onCompare={compareWithMine}
              onAnalyze={analyzeFromLibrary}
              onOpenLab={openStructureLab}
            />
          </Suspense>
        ) : store.mode === 'structures' ? (
          <Suspense fallback={<PanelLoading label={t('loadingStructures')} variant="board" />}>
            <StructuresView
              key={`${labLaunch.lab}-${labLaunch.preset}`}
              initialLab={labLaunch.lab}
              initialPreset={labLaunch.preset}
            />
          </Suspense>
        ) : store.mode === 'compare' ? (
          <BenchmarkView input={input} initialId={benchmarkSeed} />
        ) : (
          <>
            <Suspense fallback={<PanelLoading label={t('loadingEditor')} />}>
              <CodePanel
                source={store.source}
                currentLine={traceEvent?.line ?? null}
                documentLabel={store.sourceOrigin === 'custom' ? t('draft') : ALGORITHM_BY_ID[store.sourceOrigin].name}
                libraryDocument={store.sourceOrigin !== 'custom'}
                modified={store.sourceOrigin !== 'custom' && store.documentModified}
                onChange={changeSource}
                onRestoreDraft={() => {
                  store.restoreCustomDraft();
                  setResultStale(Boolean(store.trace || store.analysis));
                }}
                onFork={() => {
                  store.forkAlgorithm();
                  setResultStale(Boolean(store.trace || store.analysis));
                }}
                errorLine={errorLine}
                errorMessage={store.error}
                lineCounts={store.trace?.lineOperationCounts}
                onSuggest={suggestSimilar}
              />
            </Suspense>

            {store.mode === 'trace' ? (
              <>
                <section className="panel visualization-panel">
                  <div className="panel-heading">
                    <span>{t('executionField')}</span>
                    <span>{t('arrayState')}</span>
                  </div>
                  <AlgorithmStage
                    title={t('yourAlgorithm')}
                    subtitle={t('liveTrace')}
                    event={traceEvent}
                    initialValues={input}
                    running={executing}
                  />
                </section>
                <MetricsPanel trace={store.trace} step={metricsStep} />
              </>
            ) : null}

            {store.mode === 'complexity' ? (
              <Suspense fallback={<PanelLoading label={t('loadingTools')} />}>
                <ComplexityView
                  analysis={store.analysis}
                  referenceAnalysis={store.referenceAnalysis}
                  referenceId={store.referenceId}
                  busy={busy}
                />
              </Suspense>
            ) : null}
          </>
        )}
      </main>

      {store.mode === 'trace' ? (
        <PlaybackBar
          step={store.currentStep}
          maximum={Math.max(0, maximumStep)}
          playing={store.playing}
          speed={store.speed}
          onStepChange={store.setCurrentStep}
          onPlayingChange={store.setPlaying}
          onSpeedChange={store.setSpeed}
        />
      ) : null}

      {paletteOpen ? (
        <Suspense fallback={null}>
          <CommandPalette onSelect={handlePaletteSelect} onClose={() => setPaletteOpen(false)} />
        </Suspense>
      ) : null}
      {shortcutsOpen ? (
        <Suspense fallback={null}>
          <ShortcutsOverlay onClose={() => setShortcutsOpen(false)} />
        </Suspense>
      ) : null}
      {advisorOpen ? (
        <Suspense fallback={null}>
          <AdvisorPanel
            initialScenarioId={advisorScenario}
            matchLabel={advisorMatch}
            onOpen={openAdvisorAlgorithm}
            onClose={() => setAdvisorOpen(false)}
          />
        </Suspense>
      ) : null}
    </div>
  );
}

function MobileWorkspaceNav({
  mode,
  pane,
  onPane,
}: {
  mode: AppMode;
  pane: MobilePane;
  onPane: (pane: MobilePane) => void;
}) {
  const { t } = useI18n();
  const panes: Array<{ id: MobilePane; label: string }> =
    mode === 'trace'
      ? [
          { id: 'code', label: t('mobileCode') },
          { id: 'visual', label: t('mobileVisual') },
          { id: 'metrics', label: t('mobileMetrics') },
        ]
      : mode === 'compare'
        ? [{ id: 'metrics', label: t('mobileBenchmark') }]
        : [
            { id: 'code', label: t('mobileCode') },
            { id: 'metrics', label: t('mobileAnalysis') },
          ];

  return (
    <nav className="mobile-workspace-nav" aria-label={t('mobileWorkspace')}>
      {panes.map((item) => (
        <button
          key={item.id}
          type="button"
          className={pane === item.id ? 'active' : ''}
          aria-pressed={pane === item.id}
          onClick={() => onPane(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function ChallengeCard({
  trace,
  step,
  onClose,
  onAdvance,
}: {
  trace: TraceResult;
  step: number;
  onClose: () => void;
  onAdvance: () => void;
}) {
  const { t, format } = useI18n();
  const [answer, setAnswer] = useState<string | null>(null);
  const next = significantEvents(trace.events)[Math.min(step + 1, significantEvents(trace.events).length - 1)];
  const expected = next?.type || 'done';
  const choices = [...new Set([expected, 'compare', 'write', 'call', 'return'])].slice(0, 4);
  return (
    <aside className="challenge-card">
      <span>{t('challengeTitle')}</span>
      <strong>{format('challengeProgress', { step: step + 1 })}</strong>
      <div>
        {choices.map((choice) => (
          <button
            type="button"
            key={choice}
            className={answer === choice ? (choice === expected ? 'correct' : 'wrong') : ''}
            onClick={() => setAnswer(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      {answer ? (
        <p>{answer === expected ? t('challengeCorrect') : format('challengeWrong', { event: expected })}</p>
      ) : null}
      <footer>
        <button type="button" onClick={onClose}>
          {t('close')}
        </button>
        <button
          type="button"
          disabled={answer !== expected}
          onClick={() => {
            onAdvance();
            setAnswer(null);
          }}
        >
          {t('nextStep')}
        </button>
      </footer>
    </aside>
  );
}

function isAppMode(value: string): value is AppMode {
  return ['trace', 'compare', 'complexity', 'library', 'structures'].includes(value);
}

function toggleDataset(key: 'contrast' | 'text' | 'motion', value: string) {
  const root = document.documentElement;
  if (root.dataset[key] === value) delete root.dataset[key];
  else root.dataset[key] = value;
}

function PanelLoading({ label, variant = 'list' }: { label: string; variant?: 'list' | 'board' }) {
  return (
    <section className="panel panel-loading" aria-live="polite">
      <span className="loading-rule" />
      <span>{label}</span>
      {variant === 'list' ? <SkeletonRows rows={7} /> : <SkeletonRows rows={4} />}
    </section>
  );
}

function safeParseInput(value: string) {
  try {
    return parseInput(value);
  } catch {
    return DEFAULT_INPUT_VALUES;
  }
}
