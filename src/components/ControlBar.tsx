import { ArrowsClockwise } from '@phosphor-icons/react';
import { createInput, type InputPattern } from '../lib/input';
import { REFERENCES, type ReferenceId } from '../lib/references';
import type { AppMode } from '../types';
import { useI18n, type TranslationKey } from '../lib/i18n';

type ControlBarProps = {
  mode: AppMode;
  inputText: string;
  referenceId: ReferenceId;
  onModeChange: (mode: AppMode) => void;
  onInputChange: (value: string) => void;
  onReferenceChange: (reference: ReferenceId) => void;
};

const MODES: { id: AppMode; label: string }[] = [
  { id: 'library', label: 'library' },
  { id: 'compare', label: 'benchmarks' },
  { id: 'complexity', label: 'growth' },
  { id: 'trace', label: 'myLab' },
  { id: 'structures', label: 'structures' },
];

export function ControlBar({
  mode,
  inputText,
  referenceId,
  onModeChange,
  onInputChange,
  onReferenceChange,
}: ControlBarProps) {
  const { t } = useI18n();
  function applyPattern(pattern: InputPattern) {
    onInputChange(createInput(pattern, 10).join(', '));
  }

  return (
    <div
      className={`control-bar ${mode === 'library' || mode === 'structures' ? 'library-active' : ''}${mode === 'compare' ? ' benchmark-active' : ''}`}
    >
      <nav className="mode-tabs" aria-label={t('analysisMode')}>
        {MODES.map((item) => (
          <button
            type="button"
            key={item.id}
            className={mode === item.id ? 'active' : ''}
            onClick={() => onModeChange(item.id)}
          >
            {t(item.label as TranslationKey)}
          </button>
        ))}
      </nav>

      {mode === 'library' || mode === 'structures' ? (
        <div className="library-control-summary">
          <span>{mode === 'library' ? t('curated') : t('visualLab')}</span>
          <strong>{mode === 'library' ? t('algorithmsSummary') : t('structuresSummary')}</strong>
          <small>{mode === 'library' ? t('problemsSummary') : t('structuresDetail')}</small>
        </div>
      ) : (
        <>
          <div className="input-control">
            <label htmlFor="algorithm-input">{t('jsonInput')}</label>
            <input
              id="algorithm-input"
              value={inputText}
              onChange={(event) => onInputChange(event.target.value)}
              spellCheck={false}
              aria-describedby="input-hint"
            />
            <span id="input-hint" className="sr-only">
              {t('inputHint')}
            </span>
            <button
              type="button"
              className="shuffle-button"
              onClick={() => applyPattern('random')}
              title={t('shuffleInput')}
            >
              <ArrowsClockwise size={15} />
            </button>
          </div>

          <div className="pattern-controls desktop-only" aria-label={t('inputPatterns')}>
            <button type="button" onClick={() => applyPattern('sorted')}>
              {t('sorted')}
            </button>
            <button type="button" onClick={() => applyPattern('reversed')}>
              {t('reversed')}
            </button>
            <button type="button" onClick={() => applyPattern('nearly')}>
              {t('nearly')}
            </button>
          </div>

          {mode !== 'compare' ? (
            <label className="reference-control">
              <span>{t('against')}</span>
              <select value={referenceId} onChange={(event) => onReferenceChange(event.target.value as ReferenceId)}>
                {Object.entries(REFERENCES).map(([id, reference]) => (
                  <option key={id} value={id}>
                    {reference.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </>
      )}
    </div>
  );
}
