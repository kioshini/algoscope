import { useState } from 'react';
import { useI18n, type TranslationKey } from '../lib/i18n';

type HintBannerProps = {
  id: string;
  text: TranslationKey;
};

export function HintBanner({ id, text }: HintBannerProps) {
  const { t } = useI18n();
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(`algoscope:hint:${id}`) === '1');

  if (dismissed) return null;

  function dismiss() {
    localStorage.setItem(`algoscope:hint:${id}`, '1');
    setDismissed(true);
  }

  return (
    <div className="hint-banner" role="status">
      <span className="hint-mark" aria-hidden="true">
        i
      </span>
      <p>{t(text)}</p>
      <button type="button" onClick={dismiss}>
        {t('hintClose')}
      </button>
    </div>
  );
}
