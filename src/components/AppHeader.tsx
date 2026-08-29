import { ArrowCounterClockwise, GithubLogo, DotsThree, Moon, Play, Stop, Sun } from '@phosphor-icons/react';
import type { RunStatus } from '../types';
import { localeLabels, useI18n, type Locale } from '../lib/i18n';
import { useTheme } from '../lib/theme';

type AppHeaderProps = {
  status: RunStatus;
  runtimeVersion: string | null;
  primaryLabel: string;
  onRun: () => void;
  onStop: () => void;
  onReset: () => void;
  showPrimary?: boolean;
  onOpenTools?: () => void;
};

export function AppHeader({
  status,
  runtimeVersion,
  primaryLabel,
  onRun,
  onStop,
  onReset,
  showPrimary = true,
  onOpenTools,
}: AppHeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const running = status === 'running';
  const loading = status === 'loading';
  const { locale, setLocale, t } = useI18n();

  return (
    <header className="app-header">
      <div className="brand-lockup">
        <div className="brand-symbol" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <strong>AlgoScope</strong>
          <span>{t('appHeaderTagline')}</span>
        </div>
      </div>

      <div className="runtime-state" data-ready={Boolean(runtimeVersion)}>
        <span className="runtime-dot" />
        {runtimeVersion ? `Python ${runtimeVersion}` : t('loadingPython')}
      </div>

      <div className="header-actions">
        <button className="icon-button desktop-only" type="button" onClick={onReset} title={t('resetExample')}>
          <ArrowCounterClockwise size={17} />
        </button>
        <button className="icon-button" type="button" onClick={toggleTheme} title={t('toggleTheme')}>
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button
          className="locale-button"
          type="button"
          onClick={() => setLocale(locale === 'en' ? 'ru' : 'en')}
          title={t('toggleLanguage')}
          aria-label={t('toggleLanguage')}
        >
          {localeLabels[(locale === 'en' ? 'ru' : 'en') as Locale]}
        </button>
        {onOpenTools ? (
          <button className="icon-button" type="button" onClick={onOpenTools} title={t('toolsAccessibility')}>
            <DotsThree size={19} weight="bold" />
          </button>
        ) : null}
        <a
          className="icon-button desktop-only"
          href="https://github.com/kioshini/algoscope"
          target="_blank"
          rel="noreferrer"
          title="GitHub"
        >
          <GithubLogo size={18} />
        </a>
        {showPrimary && running ? (
          <button className="run-button stop-button" type="button" onClick={onStop}>
            <Stop weight="fill" size={14} /> {t('stop')}
          </button>
        ) : showPrimary ? (
          <button
            className="run-button"
            type="button"
            onClick={onRun}
            disabled={!runtimeVersion}
            title={`${primaryLabel} (Ctrl+Enter)`}
            aria-keyshortcuts="Control+Enter Meta+Enter"
          >
            <Play weight="fill" size={14} /> {loading ? t('loadingRun') : primaryLabel}
          </button>
        ) : null}
      </div>
    </header>
  );
}
