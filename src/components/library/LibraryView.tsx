import {
  ArrowLeft,
  ArrowRight,
  ChartLineUp,
  Check,
  Compass,
  Copy,
  DownloadSimple,
  Flask,
  GitDiff,
  MagnifyingGlass,
  Play,
  Star,
  X,
} from '@phosphor-icons/react';
import { useDeferredValue, useMemo, useState } from 'react';
import { CATALOG_ALGORITHMS, CATALOG_ALGORITHM_BY_ID } from '../../algorithms/full-catalog';
import type {
  AlgorithmDefinition,
  AlgorithmProblem,
  CatalogAlgorithmDefinition,
  SolveAlgorithmDefinition,
} from '../../algorithms/types';
import { LANGUAGE_LABELS, sourceForAlgorithm, type SupportedLanguage } from '../../algorithms/language-sources';
import { algorithmWorker } from '../../lib/worker-client';
import { downloadTextFile } from '../../lib/benchmark-settings';
import { LessonView } from '../lesson/LessonView';
import type { JsonValue } from '../../types';
import { localizeAlgorithm, localizeLab, useI18n, type TranslationKey } from '../../lib/i18n';
import { useFavorites } from '../../lib/favorites';
import { AdvisorPanel } from '../AdvisorPanel';
import { LAB_ENTRIES } from '../../labs/catalog';
import type { LabEntry } from '../../labs/types';

type LibraryViewProps = {
  onOpen: (algorithm: AlgorithmDefinition, values?: number[]) => void;
  onCompare: (algorithm: AlgorithmDefinition) => void;
  onAnalyze: (algorithm: AlgorithmDefinition) => void;
  onOpenLab: (entry: LabEntry) => void;
  initialId?: string;
};

type ProblemFilter = 'All' | AlgorithmProblem;
type TraitFilter = 'all' | 'stable' | 'in-place';

const PROBLEMS: ProblemFilter[] = ['All', 'Sorting', 'Searching', 'Graph', 'String', 'Dynamic Programming'];

export function LibraryView({ onOpen, onCompare, onAnalyze, onOpenLab, initialId }: LibraryViewProps) {
  const { locale, t } = useI18n();
  const favorites = useFavorites();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const [problem, setProblem] = useState<ProblemFilter>('All');
  const [trait, setTrait] = useState<TraitFilter>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(initialId && CATALOG_ALGORITHM_BY_ID[initialId] ? initialId : 'bubble');
  const [mobileDetail, setMobileDetail] = useState(Boolean(initialId && CATALOG_ALGORITHM_BY_ID[initialId]));
  const [lessonFor, setLessonFor] = useState<string | null>(null);
  const selected = localizeAlgorithm(CATALOG_ALGORITHM_BY_ID[selectedId], locale);
  const localized = useMemo(() => {
    const byId = new Map<string, ReturnType<typeof localizeAlgorithm>>();
    for (const algorithm of CATALOG_ALGORITHMS) byId.set(algorithm.id, localizeAlgorithm(algorithm, locale));
    const labs = new Map<string, ReturnType<typeof localizeLab>>();
    for (const entry of LAB_ENTRIES) labs.set(entry.id, localizeLab(entry, locale));
    return { byId, labs };
  }, [locale]);
  const filtered = CATALOG_ALGORITHMS.filter((algorithm) => {
    const matchesProblem = problem === 'All' || algorithm.problem === problem;
    const matchesFavorite = !onlyFavorites || favorites.favorites.includes(algorithm.id);
    const matchesTrait =
      trait === 'all' ||
      (algorithm.kind === 'sort' && trait === 'stable' && algorithm.traits.stable) ||
      (algorithm.kind === 'sort' && trait === 'in-place' && algorithm.traits.inPlace);
    const searchable =
      `${algorithm.name} ${algorithm.problem} ${algorithm.family} ${algorithm.contract} ${algorithm.summary} ${algorithm.tags.join(' ')}`.toLowerCase();
    return matchesProblem && matchesFavorite && matchesTrait && searchable.includes(deferredQuery);
  });

  function selectAlgorithm(id: string) {
    setSelectedId(id);
    setMobileDetail(true);
    return id;
  }

  return (
    <section className={`library-view panel ${mobileDetail ? 'show-detail' : ''}`}>
      <div className="library-toolbar">
        <label className="library-search">
          <MagnifyingGlass size={16} />
          <span className="sr-only">{t('searchPlaceholder')}</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && filtered.length) {
                event.preventDefault();
                selectAlgorithm(filtered[0].id);
              }
            }}
            placeholder={t('searchPlaceholder')}
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} title={t('clearSearch')}>
              <X size={14} />
            </button>
          ) : (
            <span className="search-enter-hint">↵</span>
          )}
        </label>
        <div className="trait-filter" aria-label={t('algorithmProperties')}>
          <button
            type="button"
            className={advisorOpen ? 'active' : ''}
            onClick={() => setAdvisorOpen(true)}
            title={t('advisorTitle')}
          >
            <Compass size={12} /> {t('advisorTitle')}
          </button>
          <button
            type="button"
            className={onlyFavorites ? 'active' : ''}
            onClick={() => setOnlyFavorites((value) => !value)}
            aria-pressed={onlyFavorites}
            title={t('favorites')}
          >
            <Star size={12} weight={onlyFavorites ? 'fill' : 'regular'} /> {t('favorites')}
          </button>
          {(['all', 'stable', 'in-place'] as TraitFilter[]).map((value) => (
            <button
              key={value}
              type="button"
              className={trait === value ? 'active' : ''}
              onClick={() => setTrait(value)}
            >
              {value === 'all' ? t('allProperties') : value === 'stable' ? t('stable') : t('inPlace')}
            </button>
          ))}
        </div>
        <span className="library-count">
          {filtered.length.toString().padStart(2, '0')} / {CATALOG_ALGORITHMS.length}
        </span>
      </div>

      <div className="library-body">
        <aside className="family-index">
          <span className="library-label">{t('problems')}</span>
          {PROBLEMS.map((item) => {
            const count =
              item === 'All'
                ? CATALOG_ALGORITHMS.length
                : CATALOG_ALGORITHMS.filter((algorithm) => algorithm.problem === item).length;
            return (
              <button
                key={item}
                type="button"
                className={problem === item ? 'active' : ''}
                onClick={() => setProblem(item)}
              >
                <span>{t(problemKey(item))}</span>
                <small>{count.toString().padStart(2, '0')}</small>
              </button>
            );
          })}
          <div className="library-lab-links">
            <span className="library-label">{t('interactiveLabs')}</span>
            {LAB_ENTRIES.map((entry) => {
              const lab = localized.labs.get(entry.id);
              return (
                <button key={entry.id} type="button" onClick={() => onOpenLab(lab!)}>
                  <span>{lab!.name}</span>
                  <small>{entry.family === 'Graph Algorithm' ? t('graphBadge') : t('dataStructureBadge')}</small>
                </button>
              );
            })}
          </div>
          <div className="family-note">
            <Flask size={17} />
            <p>{t('libraryNote')}</p>
          </div>
        </aside>

        <div className="algorithm-index" aria-label={t('algorithmIndex')}>
          <div className="algorithm-index-heading">
            <span>{t('algorithm')}</span>
            <span>{t('observedClass')}</span>
          </div>
          {filtered.length ? (
            filtered.map((algorithm) => {
              const isFavorite = favorites.favorites.includes(algorithm.id);
              const item = localized.byId.get(algorithm.id)!;
              return (
                <div className="algorithm-list-row" key={algorithm.id}>
                  <button
                    type="button"
                    className={selectedId === algorithm.id ? 'active' : ''}
                    onClick={() => selectAlgorithm(algorithm.id)}
                  >
                    <span className="algorithm-number">
                      {String(CATALOG_ALGORITHMS.indexOf(algorithm) + 1).padStart(2, '0')}
                    </span>
                    <span className="algorithm-list-name">
                      <strong>{item.name}</strong>
                      <small>
                        {item.family} · {item.level}
                      </small>
                    </span>
                    <span className="algorithm-list-complexity">{algorithm.complexity.average}</span>
                    <ArrowRight className="algorithm-list-arrow" size={14} />
                  </button>
                  <button
                    type="button"
                    className={`favorite-toggle ${isFavorite ? 'active' : ''}`}
                    title={isFavorite ? t('removeFavorite') : t('addFavorite')}
                    aria-label={isFavorite ? t('removeFavorite') : t('addFavorite')}
                    aria-pressed={isFavorite}
                    onClick={() => favorites.toggle(algorithm.id)}
                  >
                    <Star size={13} weight={isFavorite ? 'fill' : 'regular'} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="library-empty">
              <strong>{t('noMatching')}</strong>
              <span>{t('changeQuery')}</span>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setProblem('All');
                  setTrait('all');
                  setOnlyFavorites(false);
                }}
              >
                {t('resetFilters')}
              </button>
            </div>
          )}
        </div>

        <AlgorithmDetail
          key={selected.id}
          algorithm={selected}
          isFavorite={favorites.favorites.includes(selected.id)}
          onToggleFavorite={() => favorites.toggle(selected.id)}
          onBack={() => setMobileDetail(false)}
          onOpen={onOpen}
          onCompare={onCompare}
          onAnalyze={onAnalyze}
          lessonOpen={lessonFor === selected.id}
          onLessonOpen={() => setLessonFor(selected.id)}
          onLessonClose={() => setLessonFor(null)}
        />
      </div>
      {advisorOpen ? (
        <AdvisorPanel
          onOpen={(algorithm, opts) => {
            selectAlgorithm(algorithm.id);
            setAdvisorOpen(false);
            setMobileDetail(true);
            if (opts?.lesson) setLessonFor(algorithm.id);
          }}
          onClose={() => setAdvisorOpen(false)}
        />
      ) : null}
    </section>
  );
}

function problemKey(problem: ProblemFilter): TranslationKey {
  return problem === 'All'
    ? 'all'
    : problem === 'Dynamic Programming'
      ? 'dynamicProgramming'
      : (problem.toLowerCase() as TranslationKey);
}

function AlgorithmDetail({
  algorithm,
  isFavorite,
  onToggleFavorite,
  onBack,
  onOpen,
  onCompare,
  onAnalyze,
  lessonOpen,
  onLessonOpen,
  onLessonClose,
}: {
  algorithm: CatalogAlgorithmDefinition;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onOpen: LibraryViewProps['onOpen'];
  onCompare: LibraryViewProps['onCompare'];
  onAnalyze: LibraryViewProps['onAnalyze'];
  lessonOpen: boolean;
  onLessonOpen: () => void;
  onLessonClose: () => void;
}) {
  const { t } = useI18n();
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const sourceInfo = sourceForAlgorithm(algorithm.id, algorithm.source, language);
  return (
    <article className="algorithm-detail">
      {lessonOpen ? (
        <LessonView algorithm={algorithm} onClose={onLessonClose} />
      ) : (
        <>
          <button className="library-back" type="button" onClick={onBack}>
            <ArrowLeft size={15} /> {t('backToLibrary')}
          </button>
          <header className="algorithm-detail-header">
            <div>
              <span>
                {algorithm.family} / {algorithm.level}
              </span>
              <h2>{algorithm.name}</h2>
              <p>{algorithm.summary}</p>
            </div>
            <div className="algorithm-detail-media">
              {algorithm.kind === 'sort' ? (
                <Miniature values={algorithm.examples.default} />
              ) : (
                <ContractMark algorithm={algorithm} />
              )}
              <button
                type="button"
                className={`favorite-toggle detail ${isFavorite ? 'active' : ''}`}
                title={isFavorite ? t('removeFavorite') : t('addFavorite')}
                aria-label={isFavorite ? t('removeFavorite') : t('addFavorite')}
                aria-pressed={isFavorite}
                onClick={onToggleFavorite}
              >
                <Star size={14} weight={isFavorite ? 'fill' : 'regular'} />
              </button>
            </div>
          </header>

          <div className="complexity-specs">
            <Spec label={t('best')} value={algorithm.complexity.best} />
            <Spec label={t('average')} value={algorithm.complexity.average} accent />
            <Spec label={t('worst')} value={algorithm.complexity.worst} />
            <Spec label={t('memory')} value={algorithm.complexity.memory} />
          </div>
          {algorithm.complexity.note ? <p className="complexity-caveat">{algorithm.complexity.note}</p> : null}

          {algorithm.kind === 'sort' ? (
            <div className="trait-row">
              <Trait label={t('stableTrait')} enabled={algorithm.traits.stable} />
              <Trait label={t('inPlaceTrait')} enabled={algorithm.traits.inPlace} />
              <Trait label={t('recursiveTrait')} enabled={algorithm.traits.recursive} />
            </div>
          ) : null}

          {algorithm.useCases?.length ? (
            <div className="use-cases-block">
              <div className="use-cases-head">
                <span className="library-label">{t('useCasesTitle')}</span>
                {algorithm.scaleSuitability ? (
                  <span className={`scale-badge scale-${algorithm.scaleSuitability}`}>
                    {scaleLabel(algorithm.scaleSuitability, t)}
                  </span>
                ) : null}
              </div>
              {algorithm.useCases.map((useCase, index) => (
                <div className="use-case" key={index}>
                  <strong>{useCase.title}</strong>
                  <p>{useCase.context}</p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="algorithm-explanation">
            <span className="library-label">{t('howItWorks')}</span>
            {algorithm.explanation.map((step, index) => (
              <div key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <div className="algorithm-limitation">
            <span>{t('tradeOff')}</span>
            <p>{algorithm.limitation}</p>
          </div>

          <div className="lesson-launch">
            <button type="button" onClick={onLessonOpen}>
              <Compass size={15} /> {t('lessonStart')}
            </button>
          </div>

          {algorithm.kind === 'sort' ? (
            <div className="algorithm-actions">
              <button className="primary-library-action" type="button" onClick={() => onOpen(algorithm)}>
                {t('visualize')} <ArrowRight size={15} />
              </button>
              <button type="button" onClick={() => onCompare(algorithm)}>
                <GitDiff size={15} /> {t('addBenchmark')}
              </button>
              <button type="button" onClick={() => onOpen(algorithm, algorithm.examples.worstCase)}>
                <Flask size={15} /> {t('tryWorst')}
              </button>
              <button type="button" onClick={() => onAnalyze(algorithm)}>
                <ChartLineUp size={15} /> {t('analyze')}
              </button>
            </div>
          ) : (
            <DemoRunner key={algorithm.id} algorithm={algorithm} language={language} onLanguageChange={setLanguage} />
          )}
          {algorithm.kind === 'sort' ? (
            <LanguageSource language={language} onLanguageChange={setLanguage} sourceInfo={sourceInfo} />
          ) : null}
        </>
      )}
    </article>
  );
}

function ContractMark({ algorithm }: { algorithm: SolveAlgorithmDefinition }) {
  return (
    <div className="algorithm-contract-mark" aria-label={`${algorithm.problem} contract`}>
      <span>{algorithm.problem}</span>
      <code>{algorithm.contract}</code>
    </div>
  );
}

function DemoRunner({
  algorithm,
  language,
  onLanguageChange,
}: {
  algorithm: SolveAlgorithmDefinition;
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}) {
  const { t } = useI18n();
  const [input, setInput] = useState(() => JSON.stringify(algorithm.demo.input, null, 2));
  const [result, setResult] = useState<JsonValue | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const expected = algorithm.demo.expected;
  const matches = result !== undefined && !error && resultEqual(result, expected);

  async function run() {
    setRunning(true);
    setError(null);
    setResult(undefined);
    try {
      const data = JSON.parse(input) as JsonValue;
      const response = await algorithmWorker.execute(algorithm.source, data);
      setResult(response.result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="catalog-demo">
      <div className="catalog-demo-heading">
        <span>{t('executableExample')}</span>
        <code>solve(data)</code>
      </div>
      <div className="catalog-demo-grid">
        <label>
          <span>{t('jsonInput')}</span>
          <textarea
            aria-label={t('jsonInput')}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
          />
        </label>
        <div className="catalog-demo-output">
          <span>{t('output')}</span>
          <pre>{error ?? (result === undefined ? t('runExample') : JSON.stringify(result, null, 2))}</pre>
          <small>
            {t('expected')}: {JSON.stringify(expected)}
          </small>
          {result !== undefined && !error ? (
            <em className={matches ? 'diff-match' : 'diff-mismatch'}>
              {matches ? `✓ ${t('resultMatches')}` : `✕ ${t('resultMismatch')}`}
            </em>
          ) : null}
        </div>
      </div>
      <button className="primary-library-action" type="button" onClick={run} disabled={running}>
        <Play size={15} weight="fill" /> {running ? t('running') : t('runExample')}
      </button>
      <LanguageSource
        language={language}
        onLanguageChange={onLanguageChange}
        sourceInfo={sourceForAlgorithm(algorithm.id, algorithm.source, language)}
      />
    </div>
  );
}

function resultEqual(actual: JsonValue, expected: JsonValue): boolean {
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  return a === b;
}

function LanguageSource({
  language,
  onLanguageChange,
  sourceInfo,
}: {
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  sourceInfo: { available: boolean; source: string };
}) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const sourceLabel = sourceInfo.available
    ? `${t('implementationPrefix')} ${LANGUAGE_LABELS[language]}`
    : `${t('sourcePendingPrefix')} ${LANGUAGE_LABELS[language]}`;
  async function copySource() {
    try {
      await navigator.clipboard.writeText(sourceInfo.source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable; fall through silently.
    }
  }
  function downloadSource() {
    const extension =
      language === 'csharp'
        ? 'cs'
        : language === 'cpp'
          ? 'cpp'
          : language === 'java'
            ? 'java'
            : language === 'go'
              ? 'go'
              : 'c';
    downloadTextFile(`algoscope-${extension}`, sourceInfo.source, 'text/plain');
  }
  return (
    <div className="language-source">
      <div className="language-tabs" role="tablist" aria-label={t('implementationLanguage')}>
        {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={language === item}
            className={language === item ? 'active' : ''}
            onClick={() => onLanguageChange(item)}
          >
            {LANGUAGE_LABELS[item]}
          </button>
        ))}
      </div>
      <div className={`language-source-panel ${sourceInfo.available ? 'available' : 'unavailable'}`}>
        <div className="language-source-tools">
          <span>{sourceLabel}</span>
          <code>{sourceInfo.available ? t('implementationReady') : t('notExecutable')}</code>
          {sourceInfo.available ? (
            <div className="language-source-actions">
              <button type="button" onClick={copySource} title={t('copySource')}>
                {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
                {copied ? t('sourceCopied') : t('copySource')}
              </button>
              <button type="button" onClick={downloadSource} title={t('downloadSource')}>
                <DownloadSimple size={12} /> {t('downloadSource')}
              </button>
            </div>
          ) : (
            <span className="language-source-tooltip" title={t('notRunnableHint')}>
              <span aria-hidden="true">i</span>
            </span>
          )}
        </div>
        <pre>{sourceInfo.source}</pre>
      </div>
    </div>
  );
}

function Spec({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={accent ? 'accent' : ''}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Trait({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <span className={enabled ? 'enabled' : 'disabled'}>
      {enabled ? <Check size={12} weight="bold" /> : <X size={12} />} {label}
    </span>
  );
}

function Miniature({ values }: { values: number[] }) {
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const span = maximum - minimum || 1;
  return (
    <div className="algorithm-miniature" aria-hidden="true">
      {values.map((value, index) => (
        <i key={index} style={{ height: `${18 + ((value - minimum) / span) * 76}%` }} />
      ))}
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function scaleLabel(value: string, t: ReturnType<typeof useI18n>['t']) {
  return t(`scale${capitalize(value)}` as TranslationKey);
}
