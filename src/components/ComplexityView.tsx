import { ChartLineUp, Info } from '@phosphor-icons/react';
import { scaleLinear } from 'd3-scale';
import { useState } from 'react';
import { estimateComplexity } from '../lib/complexity';
import { buildInsight } from '../lib/insight';
import { useI18n, type TranslationKey } from '../lib/i18n';
import { REFERENCES, type ReferenceId } from '../lib/references';
import { HintBanner } from './HintBanner';
import type { AnalysisPoint, AnalysisResult, TraceMetrics } from '../types';

type ComplexityViewProps = {
  analysis: AnalysisResult | null;
  referenceAnalysis: AnalysisResult | null;
  referenceId: ReferenceId;
  busy: boolean;
};

type ChartMetric = keyof TraceMetrics | 'elapsedMs';

const PATTERN_LABELS: Record<string, TranslationKey> = {
  random: 'patternRandom',
  sorted: 'patternSorted',
  reversed: 'patternReversed',
  nearly: 'patternNearly',
};

export function ComplexityView({ analysis, referenceAnalysis, referenceId, busy }: ComplexityViewProps) {
  const { t, format } = useI18n();
  const [pattern, setPattern] = useState('random');
  const [metric, setMetric] = useState<ChartMetric>('comparisons');
  const customPoints = analysis?.cases.find((item) => item.name === pattern)?.points ?? [];
  const referencePoints = referenceAnalysis?.cases.find((item) => item.name === pattern)?.points ?? [];
  const estimate = estimateComplexity(customPoints, metric === 'elapsedMs' ? 'comparisons' : metric);
  const insight = buildInsight(customPoints, referencePoints);
  const insightKey: TranslationKey =
    insight.kind === 'faster'
      ? 'insightFaster'
      : insight.kind === 'slower'
        ? 'insightSlower'
        : insight.kind === 'matches'
          ? 'insightMatches'
          : 'insightInsufficient';
  const insightBodyKey =
    insight.kind === 'faster'
      ? 'insightFasterBody'
      : insight.kind === 'slower'
        ? 'insightSlowerBody'
        : insight.kind === 'matches'
          ? 'insightMatchesBody'
          : undefined;

  return (
    <section className="complexity-view panel">
      <div className="panel-heading">
        <span>{t('growthTitle')}</span>
        <span>{t('empiricalEstimate')}</span>
      </div>

      <div className="analysis-toolbar">
        <div className="case-tabs">
          {Object.entries(PATTERN_LABELS).map(([id, label]) => (
            <button key={id} type="button" className={pattern === id ? 'active' : ''} onClick={() => setPattern(id)}>
              {t(label)}
            </button>
          ))}
        </div>
        <label>
          <span>{t('measure')}</span>
          <select value={metric} onChange={(event) => setMetric(event.target.value as ChartMetric)}>
            <option value="comparisons">{t('comparisons')}</option>
            <option value="total">{t('allOperations')}</option>
            <option value="writes">{t('arrayWrites')}</option>
            <option value="elapsedMs">{t('localTime')}</option>
          </select>
        </label>
      </div>

      <HintBanner id="growth" text="growthHint" />

      {customPoints.length ? (
        <>
          <ComplexityChart custom={customPoints} reference={referencePoints} metric={metric} />
          <div className="analysis-readout">
            <div className="complexity-estimate">
              <span>{t('observedGrowth')}</span>
              <strong>{estimate.label}</strong>
              <small>
                {estimate.confidence}% {t('modelFit')}
              </small>
            </div>
            <div className="complexity-insight">
              <span className={`insight-${insight.kind}`}>{t(insightKey)}</span>
              {insightBodyKey ? <p>{format(insightBodyKey, { ratio: insight.ratio.toFixed(1) })}</p> : null}
            </div>
            <div className="legend-block">
              <span>
                <i className="legend-custom" /> {t('yourAlgorithm')}
              </span>
              <span>
                <i className="legend-reference" /> {REFERENCES[referenceId].label}
              </span>
            </div>
            <div className="analysis-note">
              <Info size={18} />
              <p>{t('analysisNote')}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="analysis-empty">
          {busy ? <span className="loading-rule" /> : <ChartLineUp size={34} />}
          <strong>{busy ? t('runningExperiments') : t('noGrowthCurve')}</strong>
          <p>{busy ? t('analysisProcessing') : t('analysisPrompt')}</p>
        </div>
      )}
    </section>
  );
}

function ComplexityChart({
  custom,
  reference,
  metric,
}: {
  custom: AnalysisPoint[];
  reference: AnalysisPoint[];
  metric: ChartMetric;
}) {
  const { t } = useI18n();
  const width = 920;
  const height = 360;
  const margin = { top: 28, right: 30, bottom: 44, left: 62 };
  const values = [...custom, ...reference].map((point) => point[metric]);
  const x = scaleLinear()
    .domain([0, Math.max(...custom.map((point) => point.n))])
    .range([margin.left, width - margin.right]);
  const y = scaleLinear()
    .domain([0, Math.max(...values, 1) * 1.08])
    .nice()
    .range([height - margin.bottom, margin.top]);
  const yTicks = y.ticks(5);

  function path(points: AnalysisPoint[]) {
    return points
      .map((point, index) => `${index === 0 ? 'M' : 'L'}${x(point.n).toFixed(2)},${y(point[metric]).toFixed(2)}`)
      .join(' ');
  }

  return (
    <div className="chart-shell">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${metric} growth chart`}>
        {yTicks.map((tick) => (
          <g key={tick}>
            <line className="chart-grid" x1={margin.left} x2={width - margin.right} y1={y(tick)} y2={y(tick)} />
            <text className="axis-label" x={margin.left - 12} y={y(tick) + 4} textAnchor="end">
              {formatNumber(tick)}
            </text>
          </g>
        ))}
        {custom.map((point) => (
          <text className="axis-label" key={point.n} x={x(point.n)} y={height - 15} textAnchor="middle">
            {point.n}
          </text>
        ))}
        <path className="chart-reference" d={path(reference)} />
        <path className="chart-custom" d={path(custom)} />
        {custom.map((point) => (
          <circle className="point-custom" key={point.n} cx={x(point.n)} cy={y(point[metric])} r="4" />
        ))}
        {reference.map((point) => (
          <circle className="point-reference" key={point.n} cx={x(point.n)} cy={y(point[metric])} r="3" />
        ))}
        <text className="axis-title" x={margin.left} y={15}>
          {metric === 'elapsedMs' ? t('milliseconds') : metric}
        </text>
        <text className="axis-title" x={width - margin.right} y={height - 15} textAnchor="end">
          {t('inputSize')}
        </text>
      </svg>
    </div>
  );
}

function formatNumber(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  if (value < 1 && value > 0) return value.toFixed(2);
  return Math.round(value).toString();
}
