import { CheckCircle, Warning } from '@phosphor-icons/react';
import { metricsAt } from '../lib/complexity';
import { useI18n } from '../lib/i18n';
import type { TraceResult } from '../types';

type MetricsPanelProps = {
  trace: TraceResult | null;
  /** Full-stream index already resolved from the visual step by the caller. */
  step: number;
};

export function MetricsPanel({ trace, step }: MetricsPanelProps) {
  const { t } = useI18n();
  const metrics = trace ? metricsAt(trace.events, step) : null;
  const event = trace?.events[Math.min(step, Math.max(0, trace.events.length - 1))];
  const hotLines = Object.entries(trace?.lineOperationCounts || {})
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4);

  return (
    <aside className="panel metrics-panel">
      <div className="panel-heading">
        <span>{t('inspectorTitle')}</span>
        <span>{t('liveCount')}</span>
      </div>

      <div className="metric-list">
        <Metric label={t('comparisons')} value={metrics?.comparisons ?? 0} highlight />
        <Metric label={t('arrayReads')} value={metrics?.reads ?? 0} />
        <Metric label={t('arrayWrites')} value={metrics?.writes ?? 0} />
        <Metric label={t('functionCalls')} value={metrics?.calls ?? 0} />
      </div>

      <div className="result-check">
        {trace ? (
          trace.correct ? (
            <>
              <CheckCircle size={19} weight="fill" />
              <div>
                <strong>{t('correctOutput')}</strong>
                <span>{trace.result.join(', ')}</span>
              </div>
            </>
          ) : (
            <>
              <Warning size={19} weight="fill" />
              <div>
                <strong>{t('incorrectOutput')}</strong>
                <span>
                  {t('expectedPrefix')} {trace.expected.join(', ')}
                </span>
              </div>
            </>
          )
        ) : (
          <div>
            <strong>{t('noTraceYet')}</strong>
            <span>{t('runToInspect')}</span>
          </div>
        )}
      </div>

      <div className="measurement-note">
        <span>{t('traceTime')}</span>
        <strong>{trace ? `${trace.elapsedMs.toFixed(2)} ms` : '-'}</strong>
        <p>{t('tracingNote')}</p>
        {event?.callStack?.length || event?.locals ? (
          <div className="trace-context">
            <span>{t('callStack')}</span>
            <strong>{event.callStack?.join(' → ') || 'sort'}</strong>
            <span>{t('variables')}</span>
            <code>{formatLocals(event.locals, t)}</code>
          </div>
        ) : null}
        {hotLines.length ? (
          <div className="hot-lines">
            <span>{t('hotLines')}</span>
            {hotLines.map(([line, count]) => (
              <code key={line}>
                L{line} <b>{count}</b>
              </code>
            ))}
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function formatLocals(locals?: Record<string, unknown>, t?: ReturnType<typeof useI18n>['t']) {
  if (!locals) return t?.('noCapturedLocals') ?? 'No captured locals';
  return Object.entries(locals)
    .slice(0, 6)
    .map(([name, value]) => `${name}=${JSON.stringify(value)}`)
    .join(' · ');
}

function Metric({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={highlight ? 'metric-row highlight' : 'metric-row'}>
      <span>{label}</span>
      <strong>{value.toLocaleString()}</strong>
    </div>
  );
}
