import { ArrowRight, MagnifyingGlass, Play, Star, X } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import { CATALOG_ALGORITHMS } from '../algorithms/full-catalog';
import type { CatalogAlgorithmDefinition } from '../algorithms/types';
import { localizeAlgorithm, useI18n, type TranslationKey } from '../lib/i18n';
import { useFavorites } from '../lib/favorites';

export type CommandAction = 'library' | 'visualize' | 'demo';

type CommandPaletteProps = {
  onSelect: (id: string, action: CommandAction) => void;
  onClose: () => void;
};

function actionFor(algorithm: CatalogAlgorithmDefinition): CommandAction {
  return algorithm.kind === 'sort' ? 'visualize' : 'demo';
}

function actionLabel(algorithm: CatalogAlgorithmDefinition): TranslationKey {
  return algorithm.kind === 'sort' ? 'visualize' : 'commandRunDemo';
}

export function CommandPalette({ onSelect, onClose }: CommandPaletteProps) {
  const { locale, t } = useI18n();
  const favorites = useFavorites();
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = CATALOG_ALGORITHMS.filter((algorithm) => {
    const subject =
      `${algorithm.name} ${algorithm.problem} ${algorithm.family} ${algorithm.tags.join(' ')}`.toLowerCase();
    return subject.includes(query.trim().toLowerCase());
  }).slice(0, 12);

  useEffect(() => {
    inputRef.current?.focus();
    setIndex(0);
  }, []);

  useEffect(() => {
    function handleGlobalKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [onClose]);

  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(0, results.length - 1)));
  }, [results.length]);

  if (!results.length) {
    return null;
  }

  function run(action: CommandAction, id: string) {
    onSelect(id, action);
    onClose();
  }

  return (
    <div
      className="command-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="command-palette" role="dialog" aria-modal="true" aria-label={t('commandSearch')}>
        <div className="command-input">
          <MagnifyingGlass size={16} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('commandSearch')}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setIndex((current) => Math.min(results.length - 1, current + 1));
              } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setIndex((current) => Math.max(0, current - 1));
              } else if (event.key === 'Enter') {
                const item = results[index];
                if (item) run(actionFor(item), item.id);
              } else if (event.key === 'Escape') onClose();
            }}
            spellCheck={false}
          />
          <button type="button" onClick={onClose} title={t('close')}>
            <X size={15} />
          </button>
        </div>
        <div className="command-list" role="listbox">
          {results.map((algorithm, resultIndex) => {
            const isActive = resultIndex === index;
            const isFavorite = favorites.favorites.includes(algorithm.id);
            return (
              <div className="command-list-row" key={algorithm.id} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  className={isActive ? 'active' : ''}
                  onMouseEnter={() => setIndex(resultIndex)}
                  onClick={() => run(actionFor(algorithm), algorithm.id)}
                >
                  <span className="command-algorithm-name">
                    <strong>{localizeAlgorithm(algorithm, locale).name}</strong>
                    <small>
                      {localizeAlgorithm(algorithm, locale).family} · {algorithm.problem}
                    </small>
                  </span>
                  <span className="command-action">
                    <Play size={11} weight="fill" /> {t(actionLabel(algorithm))}
                    <ArrowRight size={12} />
                  </span>
                </button>
                <button
                  type="button"
                  className={`command-favorite ${isFavorite ? 'active' : ''}`}
                  title={isFavorite ? t('removeFavorite') : t('addFavorite')}
                  aria-label={isFavorite ? t('removeFavorite') : t('addFavorite')}
                  aria-pressed={isFavorite}
                  onClick={() => favorites.toggle(algorithm.id)}
                >
                  <Star size={12} weight={isFavorite ? 'fill' : 'regular'} />
                </button>
              </div>
            );
          })}
        </div>
        <div className="command-footer">
          <span>{t('commandHint')}</span>
          <span>
            {results.length} / {CATALOG_ALGORITHMS.length}
          </span>
        </div>
      </div>
    </div>
  );
}
