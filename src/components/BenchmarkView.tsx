import { ChartBar, DownloadSimple, FloppyDisk, Play, Plus, Trash, X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { ALGORITHMS, ALGORITHM_BY_ID } from '../algorithms/catalog';
import type { AlgorithmId } from '../algorithms/types';
import { algorithmWorker } from '../lib/worker-client';
import { useI18n } from '../lib/i18n';
import { downloadTextFile, exportBenchmarkCsv, useBenchmarkSettings } from '../lib/benchmark-settings';
import { HintBanner } from './HintBanner';
import type { TraceMetrics } from '../types';

type BenchmarkViewProps = {
  input: number[];
  initialId: AlgorithmId;
};

type BenchmarkRow = {
  id: AlgorithmId;
  elapsedMs: number;
  metrics: TraceMetrics;
};

const DEFAULT_SET: AlgorithmId[] = ['quick', 'merge', 'heap', 'binary-insertion'];

export function BenchmarkView({ input, initialId }: BenchmarkViewProps) {
  const { t } = useI18n();
  const settings = useBenchmarkSettings();
  const [selected, setSelected] = useState<AlgorithmId[]>(() => compatibleSet(initialId));
  const [candidate, setCandidate] = useState<AlgorithmId | null>(() =>
    nextCandidate(initialId, compatibleSet(initialId)),
  );
  const [rows, setRows] = useState<BenchmarkRow[]>([]);
  const [running, setRunning] = useState(false);
  const [activeId, setActiveId] = useState<AlgorithmId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const contract = ALGORITHM_BY_ID[initialId].contract;
  const compatibleAlgorithms = ALGORITHMS.filter((algorithm) => algorithm.contract === contract);

  useEffect(() => {
    const next = compatibleSet(initialId);
    setSelected(next);
    setCandidate(nextCandidate(initialId, next));
    setRows([]);
  }, [initialId]);

  useEffect(() => {
    setRows([]);
  }, [input]);

  useEffect(() => {
    if (candidate === null || selected.includes(candidate)) {
      const available = compatibleAlgorithms.find((algorithm) => !selected.includes(algorithm.id));
      setCandidate(available?.id ?? null);
    }
  }, [selected, candidate, contract]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  async function runBenchmark() {
    setRunning(true);
    setRows([]);
    setError(null);
    try {
      const next: BenchmarkRow[] = [];
      for (const id of selected) {
        setActiveId(id);
        const algorithm = ALGORITHM_BY_ID[id];
        const measurement = await algorithmWorker.measure(algorithm.source, input);
        const trace = await algorithmWorker.trace(algorithm.source, input);
        next.push({ id, elapsedMs: measurement.elapsedMs, metrics: trace.metrics });
        setRows([...next].sort((left, right) => left.elapsedMs - right.elapsedMs));
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setActiveId(null);
      setRunning(false);
    }
  }

  function addAlgorithm() {
    if (candidate === null || selected.includes(candidate) || selected.length >= 5) return;
    setSelected((current) => [...current, candidate]);
    setRows([]);
  }

  function removeAlgorithm(id: AlgorithmId) {
    if (selected.length <= 2) return;
    setSelected((current) => current.filter((item) => item !== id));
    setRows([]);
  }

  function exportCsv() {
    const data = rows.map((row, index) => {
      const algorithm = ALGORITHM_BY_ID[row.id];
      return {
        rank: index + 1,
        algorithm: algorithm.name,
        family: algorithm.family,
        median_ms: row.elapsedMs,
        operations: row.metrics.total,
        comparisons: row.metrics.comparisons,
        writes: row.metrics.writes,
        average_class: algorithm.complexity.average,
      };
    });
    if (!data.length) return;
    downloadTextFile(`algoscope-benchmark-${Date.now()}.csv`, exportBenchmarkCsv(data));
  }

  function saveProfile() {
    settings.saveProfile(profileName, selected);
    setProfileName('');
    setProfileOpen(false);
    setNotice(t('profileSaved'));
  }

  const currentContract = ALGORITHM_BY_ID[initialId].contract;
  const compatibleProfile = (ids: string[]) =>
    ids.filter((id) => (ALGORITHM_BY_ID[id as AlgorithmId]?.contract ?? 'sort-numeric-array') === currentContract);

  return (
    <section className="benchmark-view panel">
      <div className="panel-heading">
        <span>{t('benchmarkTitle')}</span>
        <span>{t('benchmarkSub')}</span>
      </div>
      <div className="benchmark-toolbar">
        <div className="benchmark-selection">
          {selected.map((id) => (
            <span key={id} className={activeId === id ? 'running' : ''}>
              {ALGORITHM_BY_ID[id].name}
              <button
                type="button"
                aria-label={`${t('removeAlgorithmPrefix')} ${ALGORITHM_BY_ID[id].name}`}
                disabled={selected.length <= 2 || running}
                onClick={() => removeAlgorithm(id)}
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
        <div className="benchmark-add">
          <select
            aria-label={t('algorithmToAdd')}
            value={candidate ?? ''}
            disabled={candidate === null}
            onChange={(event) => setCandidate(event.target.value as AlgorithmId)}
          >
            {candidate === null ? <option value="">{t('noMoreCompatible')}</option> : null}
            {compatibleAlgorithms
              .filter((algorithm) => !selected.includes(algorithm.id))
              .map((algorithm) => (
                <option key={algorithm.id} value={algorithm.id}>
                  {algorithm.name}
                </option>
              ))}
          </select>
          <button
            type="button"
            onClick={addAlgorithm}
            disabled={candidate === null || selected.length >= 5 || selected.includes(candidate)}
          >
            <Plus size={13} /> {t('add')}
          </button>
        </div>
        <button
          className="benchmark-run"
          type="button"
          onClick={runBenchmark}
          disabled={running || selected.length < 2}
        >
          <Play size={14} weight="fill" />
          {running ? `${t('measuring')} ${activeId ? ALGORITHM_BY_ID[activeId].name : '...'}` : t('runBenchmark')}
        </button>
      </div>

      <HintBanner id="benchmark" text="benchmarkHint" />

      <div className="benchmark-utility">
        <div className="benchmark-profile">
          <div className="benchmark-profile-head">
            <span>{t('savedProfiles')}</span>
            <button type="button" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen}>
              <FloppyDisk size={13} /> {t('saveProfile')} <Plus size={12} />
            </button>
          </div>
          {profileOpen ? (
            <div className="benchmark-profile-form">
              <input
                value={profileName}
                onChange={(event) => setProfileName(event.target.value)}
                placeholder={t('profileNameLabel')}
                aria-label={t('profileNameLabel')}
              />
              <button type="button" onClick={saveProfile}>
                {t('saveProfile')}
              </button>
            </div>
          ) : null}
          <div className="benchmark-profile-list">
            {settings.profiles.length ? (
              settings.profiles
                .slice(-6)
                .reverse()
                .map((profile) => (
                  <button
                    type="button"
                    key={profile.id}
                    className="benchmark-profile-item"
                    onClick={() => {
                      const ids = compatibleProfile(profile.algorithmIds).slice(0, 5) as AlgorithmId[];
                      setSelected(ids.length >= 2 ? ids : selected);
                      setRows([]);
                    }}
                  >
                    <span>{profile.name}</span>
                    <small>{profile.algorithmIds.length} algos</small>
                    <Trash
                      size={11}
                      aria-label={t('deleteProfile')}
                      role="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (confirm(t('confirmDeleteProfile'))) settings.deleteProfile(profile.id);
                      }}
                    />
                  </button>
                ))
            ) : (
              <span className="benchmark-profile-empty">{t('profileHold')}</span>
            )}
          </div>
        </div>
        {rows.length ? (
          <button className="benchmark-export" type="button" onClick={exportCsv}>
            <DownloadSimple size={14} /> {t('exportCsv')}
          </button>
        ) : null}
      </div>
      {notice ? (
        <div className="ux-notice" role="status">
          {notice}
        </div>
      ) : null}

      <div className="benchmark-context">
        <span>{ALGORITHM_BY_ID[initialId].problem} · n</span>
        <strong>{input.length}</strong>
        <code>[{input.join(', ')}]</code>
        <p>{t('benchmarkContextNote')}</p>
      </div>

      {error ? (
        <div className="benchmark-error" role="alert">
          {error}
        </div>
      ) : null}
      {rows.length ? (
        <div className="benchmark-table" role="table" aria-label={t('benchmarkResults')}>
          <div className="benchmark-row benchmark-header" role="row">
            <span>{t('rankAlgorithm')}</span>
            <span>{t('medianTime')}</span>
            <span>{t('operations')}</span>
            <span>{t('comparisons')}</span>
            <span>{t('writes')}</span>
            <span>{t('averageClass')}</span>
          </div>
          {rows.map((row, index) => {
            const algorithm = ALGORITHM_BY_ID[row.id];
            return (
              <div className="benchmark-row" role="row" key={row.id}>
                <span>
                  <i>{String(index + 1).padStart(2, '0')}</i>
                  <strong>{algorithm.name}</strong>
                  <small>{algorithm.family}</small>
                </span>
                <strong>{formatTime(row.elapsedMs)}</strong>
                <span>{row.metrics.total.toLocaleString()}</span>
                <span>{row.metrics.comparisons.toLocaleString()}</span>
                <span>{row.metrics.writes.toLocaleString()}</span>
                <code>{algorithm.complexity.average}</code>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="benchmark-empty">
          <ChartBar size={38} />
          <strong>{t('buildBenchmarkSet')}</strong>
          <p>{t('benchmarkEmptyHint')}</p>
        </div>
      )}
    </section>
  );
}

function compatibleSet(initialId: AlgorithmId) {
  const contract = ALGORITHM_BY_ID[initialId].contract;
  const compatibleIds = ALGORITHMS.filter((algorithm) => algorithm.contract === contract).map(
    (algorithm) => algorithm.id,
  );
  return [...new Set([initialId, ...DEFAULT_SET, ...compatibleIds])]
    .filter((id) => ALGORITHM_BY_ID[id].contract === contract)
    .slice(0, 5);
}

function nextCandidate(initialId: AlgorithmId, selected: AlgorithmId[]) {
  const contract = ALGORITHM_BY_ID[initialId].contract;
  return (
    ALGORITHMS.find((algorithm) => algorithm.contract === contract && !selected.includes(algorithm.id))?.id ?? null
  );
}

function formatTime(value: number) {
  if (value < 0.01) return `${(value * 1000).toFixed(2)} µs`;
  return `${value.toFixed(3)} ms`;
}
