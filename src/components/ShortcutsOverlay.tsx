import { X } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';
import { useI18n, type TranslationKey } from '../lib/i18n';

type ShortcutsOverlayProps = {
  onClose: () => void;
};

const SHORTCUTS: Array<{ keys: string[]; label: TranslationKey }> = [
  { keys: ['Ctrl', 'K'], label: 'shortcutOpenPalette' },
  { keys: ['Ctrl', 'Enter'], label: 'shortcutRun' },
  { keys: ['←'], label: 'shortcutPrev' },
  { keys: ['→'], label: 'shortcutNext' },
  { keys: ['Home'], label: 'shortcutHome' },
  { keys: ['End'], label: 'shortcutEnd' },
];

export function ShortcutsOverlay({ onClose }: ShortcutsOverlayProps) {
  const { t } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      else if (event.key === '?') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="command-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="shortcuts-panel" role="dialog" aria-modal="true" aria-label={t('shortcutsTitle')}>
        <div className="shortcuts-heading">
          <strong>{t('shortcutsTitle')}</strong>
          <button ref={closeRef} type="button" onClick={onClose} title={t('close')}>
            <X size={15} />
          </button>
        </div>
        <div className="shortcuts-list">
          {SHORTCUTS.map((shortcut) => (
            <div key={shortcut.label} className="shortcut-row">
              <span>{t(shortcut.label)}</span>
              <span className="shortcut-keys">
                {shortcut.keys.map((key, index) => (
                  <kbd key={index}>{key}</kbd>
                ))}
              </span>
            </div>
          ))}
        </div>
        <div className="shortcuts-footer">{t('shortcutHint')}</div>
      </div>
    </div>
  );
}
