import { CaretLeft, CaretRight, Pause, Play, SkipBack, SkipForward } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { useI18n } from '../lib/i18n';

type PlaybackBarProps = {
  step: number;
  maximum: number;
  playing: boolean;
  speed: number;
  onStepChange: (step: number) => void;
  onPlayingChange: (playing: boolean) => void;
  onSpeedChange: (speed: number) => void;
};

export function PlaybackBar({
  step,
  maximum,
  playing,
  speed,
  onStepChange,
  onPlayingChange,
  onSpeedChange,
}: PlaybackBarProps) {
  const { t } = useI18n();
  useEffect(() => {
    function navigate(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      if (target.matches('input, textarea, select') || target.isContentEditable) return;
      if (event.key === 'ArrowLeft') onStepChange(Math.max(0, step - 1));
      else if (event.key === 'ArrowRight') onStepChange(Math.min(maximum, step + 1));
      else if (event.key === 'Home') onStepChange(0);
      else if (event.key === 'End') onStepChange(maximum);
      else return;
      event.preventDefault();
    }
    window.addEventListener('keydown', navigate);
    return () => window.removeEventListener('keydown', navigate);
  }, [step, maximum, onStepChange]);

  return (
    <div className="playback-bar">
      <div className="playback-buttons">
        <button type="button" onClick={() => onStepChange(0)} disabled={maximum === 0} title={t('playbackFirst')}>
          <SkipBack size={14} />
        </button>
        <button
          type="button"
          onClick={() => onStepChange(Math.max(0, step - 1))}
          disabled={maximum === 0}
          title={t('playbackPrevious')}
        >
          <CaretLeft size={16} weight="bold" />
        </button>
        <button
          className="play-toggle"
          type="button"
          onClick={() => onPlayingChange(!playing)}
          disabled={maximum === 0}
          title={t('playbackPlayPause')}
        >
          {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
        </button>
        <button
          type="button"
          onClick={() => onStepChange(Math.min(maximum, step + 1))}
          disabled={maximum === 0}
          title={t('playbackNext')}
        >
          <CaretRight size={16} weight="bold" />
        </button>
        <button type="button" onClick={() => onStepChange(maximum)} disabled={maximum === 0} title={t('playbackLast')}>
          <SkipForward size={14} />
        </button>
      </div>

      <span className="step-count">
        {String(step).padStart(3, '0')} / {String(maximum).padStart(3, '0')}
      </span>
      <input
        className="timeline"
        type="range"
        min="0"
        max={Math.max(0, maximum)}
        value={Math.min(step, maximum)}
        onChange={(event) => onStepChange(Number(event.target.value))}
        aria-label={t('tracePosition')}
      />
      <label className="speed-control">
        <span>{t('speed')}</span>
        <select value={speed} onChange={(event) => onSpeedChange(Number(event.target.value))}>
          {[0.5, 1, 2, 4, 8].map((value) => (
            <option key={value} value={value}>
              {value}x
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
