import { ArrowRight, Check, X } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { CATALOG_ALGORITHMS } from '../algorithms/full-catalog';
import { SCENARIOS, rankForScenario } from '../lib/ranking';
import { localizeAlgorithm, useI18n, type TranslationKey } from '../lib/i18n';
import type { CatalogAlgorithmDefinition } from '../algorithms/types';

type AdvisorPanelProps = {
  onOpen: (algorithm: CatalogAlgorithmDefinition, opts?: { lesson?: boolean }) => void;
  onClose: () => void;
  initialScenarioId?: string | null;
  matchLabel?: string | null;
};

export function AdvisorPanel({ onOpen, onClose, initialScenarioId = null, matchLabel = null }: AdvisorPanelProps) {
  const { t, locale } = useI18n();
  const [scenarioId, setScenarioId] = useState<string | null>(initialScenarioId);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);
  const results = useMemo(() => {
    return scenario ? rankForScenario(scenario, CATALOG_ALGORITHMS).slice(0, 5) : [];
  }, [scenario]);

  return (
    <div
      className="command-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="advisor-panel" role="dialog" aria-modal="true" aria-label={t('advisorTitle')}>
        <div className="advisor-head">
          <div>
            <strong>{t('advisorTitle')}</strong>
            <span>{matchLabel ? `${t('foundSimilar')} ${matchLabel}` : t('advisorIntro')}</span>
          </div>
          <button type="button" onClick={onClose} title={t('close')}>
            <X size={15} />
          </button>
        </div>

        <div className="advisor-body">
          <div className="advisor-scenarios">
            <span className="advisor-label">{t('advisorChoose')}</span>
            {SCENARIOS.map((scenario) => (
              <button
                type="button"
                key={scenario.id}
                className={scenarioId === scenario.id ? 'active' : ''}
                onClick={() => setScenarioId(scenario.id)}
              >
                <strong>{scenario.label}</strong>
                <small>{scenario.description}</small>
              </button>
            ))}
          </div>

          <div className="advisor-results">
            {results.length ? (
              <div className="advisor-list">
                <span className="advisor-label">{t('advisorTop')}</span>
                {results.map((result, index) => {
                  const algorithm = localizeAlgorithm(result.algorithm, locale);
                  return (
                    <div className="rank-item" key={algorithm.id}>
                      <div className="rank-item-head">
                        <i>{String(index + 1).padStart(2, '0')}</i>
                        <span className="rank-item-name">
                          <strong>{algorithm.name}</strong>
                          <small>
                            {algorithm.family} ·{' '}
                            {t(
                              `scale${algorithm.scaleSuitability === 'large' ? 'Large' : algorithm.scaleSuitability === 'small' ? 'Small' : 'All'}` as TranslationKey,
                            )}
                          </small>
                        </span>
                        <button type="button" onClick={() => onOpen(result.algorithm as CatalogAlgorithmDefinition)}>
                          Open <ArrowRight size={12} />
                        </button>
                        {scenario?.lesson ? (
                          <button
                            type="button"
                            onClick={() => onOpen(result.algorithm as CatalogAlgorithmDefinition, { lesson: true })}
                          >
                            {t('lessonStart')} <ArrowRight size={12} />
                          </button>
                        ) : null}
                      </div>
                      <div className="rank-item-body">
                        <p>{result.verdict}</p>
                        <div className="rank-bullets">
                          {result.bullets.map((bullet, bIndex) => (
                            <span key={bIndex} className={bullet.ok ? 'ok' : 'no'}>
                              <Check size={11} weight={bullet.ok ? 'bold' : 'regular'} /> {bullet.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="advisor-empty">
                <strong>{t('advisorEmpty')}</strong>
                <p>{t('advisorChoose')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
