import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { CSSProperties } from 'react';
import { useI18n } from '../lib/i18n';
import type { TraceEvent } from '../types';

type AlgorithmStageProps = {
  title: string;
  subtitle?: string;
  event: TraceEvent | null;
  initialValues: number[];
  compact?: boolean;
  running?: boolean;
};

function eventDescription(
  event: TraceEvent | null,
  running: boolean,
  t: ReturnType<typeof useI18n>['t'],
  format: ReturnType<typeof useI18n>['format'],
) {
  if (running) return t('traceRecording');
  if (!event) return t('tracePressRun');
  if (event.type === 'compare')
    return format('traceCompare', {
      left: event.leftValue ?? '?',
      op: event.op ?? '?',
      right: event.rightValue ?? '?',
    });
  if (event.type === 'read') return format('traceRead', { index: event.index ?? '?' });
  if (event.type === 'write') return format('traceWrite', { value: event.next ?? '?', index: event.index ?? '?' });
  if (event.type === 'call') return format('traceEnter', { fn: event.function ?? '?' });
  if (event.type === 'return') return format('traceReturn', { fn: event.function ?? '?' });
  if (event.type === 'done') return t('traceComplete');
  return event.line ? format('traceExecuteLine', { line: event.line }) : t('traceNextOperation');
}

export function AlgorithmStage({
  title,
  subtitle,
  event,
  initialValues,
  compact = false,
  running = false,
}: AlgorithmStageProps) {
  const { t, format } = useI18n();
  const reduceMotion = useReducedMotion();
  const values = event?.values.length ? event.values : initialValues;
  const minimum = Math.min(...values, 0);
  const maximum = Math.max(...values, 1);
  const range = Math.max(1, maximum - minimum);
  const active = new Set<number>();
  if (typeof event?.index === 'number') active.add(event.index);
  if (typeof event?.leftIndex === 'number') active.add(event.leftIndex);
  if (typeof event?.rightIndex === 'number') active.add(event.rightIndex);

  return (
    <section
      className={`algorithm-stage ${compact ? 'compact' : ''}${running ? ' is-running' : ''}`}
      aria-busy={running}
    >
      <div className="stage-title">
        <div>
          <span>{title}</span>
          {subtitle ? <small>{subtitle}</small> : null}
        </div>
        <span className={`event-chip event-${running ? 'running' : event?.type || 'idle'}`}>
          {running ? t('eventRunning') : event?.type || t('eventWaiting')}
        </span>
      </div>

      <div className="bars" aria-label={`Current values: ${values.join(', ')}`}>
        {values.map((value, index) => {
          const height = 18 + ((value - minimum) / range) * 72;
          return (
            <motion.div
              className={`bar-column ${active.has(index) ? 'active' : ''}`}
              key={`${index}`}
              style={{ '--bar-height': `${height}%` } as CSSProperties}
              layout={!reduceMotion}
              transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            >
              <span className="bar-value">{value}</span>
              <motion.div
                className="bar"
                animate={{ height: `${height}%` }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.22 }}
              />
              <span className="bar-index">{index}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="event-description" aria-live="polite">
        <span>{event?.seq !== undefined ? String(event.seq + 1).padStart(3, '0') : '000'}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`${event?.seq ?? 'empty'}-${event?.type ?? 'idle'}`}
            initial={reduceMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
          >
            {eventDescription(event, running, t, format)}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  );
}
