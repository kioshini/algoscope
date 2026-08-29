import { python } from '@codemirror/lang-python';
import { StateField } from '@codemirror/state';
import { Decoration, EditorView, type DecorationSet } from '@codemirror/view';
import CodeMirror, { type ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useEffect, useRef } from 'react';
import { Sparkle } from '@phosphor-icons/react';
import { useI18n } from '../lib/i18n';

type CodePanelProps = {
  source: string;
  currentLine: number | null;
  documentLabel: string;
  libraryDocument: boolean;
  modified: boolean;
  signature?: string;
  panelIndex?: string;
  ariaLabel?: string;
  errorLine?: number | null;
  errorMessage?: string | null;
  lineCounts?: Record<string, number>;
  onChange: (source: string) => void;
  onRestoreDraft: () => void;
  onFork: () => void;
  onSuggest?: () => void;
};

const editorTheme = EditorView.theme({
  '&': { height: '100%', background: 'transparent' },
  '.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.72' },
  '.cm-content': { padding: '18px 0 60px' },
  '.cm-gutters': { background: 'transparent', border: '0', color: 'var(--ink-faint)' },
  '.cm-activeLine': { background: 'var(--accent-soft)' },
  '.cm-activeLineGutter': { background: 'var(--accent-soft)', color: 'var(--accent)' },
  '.cm-cursor': { borderLeftColor: 'var(--accent)' },
  '&.cm-focused': { outline: 'none' },
});

export function CodePanel({
  source,
  currentLine,
  documentLabel,
  libraryDocument,
  modified,
  signature = 'sort(values)',
  panelIndex = '01',
  ariaLabel = 'Python algorithm',
  errorLine = null,
  errorMessage = null,
  lineCounts,
  onChange,
  onRestoreDraft,
  onFork,
  onSuggest,
}: CodePanelProps) {
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const { t } = useI18n();

  useEffect(() => {
    const view = editorRef.current?.view;
    const targetLine = errorLine || currentLine;
    if (!view || !targetLine || targetLine > view.state.doc.lines) return;
    const anchor = view.state.doc.line(targetLine).from;
    view.dispatch({ selection: { anchor }, scrollIntoView: true });
  }, [currentLine, errorLine]);

  return (
    <section className={`panel code-panel${errorLine ? ' has-error' : ''}`} aria-label={t('pythonEditor')}>
      <div className="panel-heading">
        <span>
          {panelIndex} / {documentLabel}
          {modified ? ' *' : ''}
        </span>
        {libraryDocument ? (
          <span className="document-actions">
            <button type="button" onClick={onRestoreDraft}>
              {t('myCode')}
            </button>
            <button type="button" onClick={onFork}>
              {t('saveCopy')}
            </button>
          </span>
        ) : (
          <span>{currentLine ? `${t('lineLabel')} ${currentLine}` : signature}</span>
        )}
        {onSuggest ? (
          <button className="suggest-button" type="button" onClick={onSuggest}>
            <Sparkle size={12} weight="fill" /> {t('suggestSimilar')}
          </button>
        ) : null}
      </div>
      <div className="editor-shell">
        <CodeMirror
          ref={editorRef}
          value={source}
          height="100%"
          extensions={[python(), editorTheme, lineDecorations(errorLine, lineCounts)]}
          onChange={onChange}
          basicSetup={{
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
          }}
          aria-label={ariaLabel}
        />
      </div>
      {errorMessage ? (
        <div className="code-error-note" role="alert">
          <strong>{errorLine ? `${t('lineLabel')} ${errorLine}` : t('pythonError')}</strong>
          <span>{errorMessage}</span>
        </div>
      ) : null}
    </section>
  );
}

function lineDecorations(errorLine: number | null, lineCounts?: Record<string, number>) {
  return StateField.define<DecorationSet>({
    create(state) {
      const ranges = [];
      const maximum = Math.max(1, ...Object.values(lineCounts || {}));
      for (const [key, count] of Object.entries(lineCounts || {})) {
        const line = Number(key);
        if (line > 0 && line <= state.doc.lines) {
          const strength = Math.round(5 + (count / maximum) * 17);
          ranges.push(
            Decoration.line({
              attributes: { style: `background: color-mix(in srgb, var(--accent) ${strength}%, transparent)` },
            }).range(state.doc.line(line).from),
          );
        }
      }
      if (errorLine && errorLine <= state.doc.lines)
        ranges.push(Decoration.line({ class: 'cm-error-line' }).range(state.doc.line(errorLine).from));
      return Decoration.set(ranges, true);
    },
    update(decorations, transaction) {
      return transaction.docChanged ? decorations.map(transaction.changes) : decorations;
    },
  });
}
