import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/use-app-store';

export function useKeyboardShortcuts(handlers: {
  onRun: () => void;
  onTogglePalette: () => void;
  onToggleShortcuts: () => void;
}) {
  const handlersRef = useRef(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const mode = useAppStore((state) => state.mode);
  const runtimeVersion = useAppStore((state) => state.runtimeVersion);
  const status = useAppStore((state) => state.status);
  const source = useAppStore((state) => state.source);
  const inputText = useAppStore((state) => state.inputText);
  const referenceId = useAppStore((state) => state.referenceId);

  useEffect(() => {
    function handleRunShortcut(event: KeyboardEvent) {
      if (!(event.ctrlKey || event.metaKey) || event.key !== 'Enter') return;
      if (!runtimeVersion || status === 'running' || mode === 'library' || mode === 'structures' || mode === 'compare')
        return;
      event.preventDefault();
      handlersRef.current.onRun();
    }
    window.addEventListener('keydown', handleRunShortcut);
    return () => window.removeEventListener('keydown', handleRunShortcut);
  }, [mode, runtimeVersion, status, source, inputText, referenceId]);

  useEffect(() => {
    function handlePaletteShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        handlersRef.current.onTogglePalette();
        return;
      }
      if (event.key === '?' || (event.shiftKey && event.key === '/')) {
        const target = event.target as HTMLElement;
        if (target.matches('input, textarea, select') || target.isContentEditable) return;
        event.preventDefault();
        handlersRef.current.onToggleShortcuts();
      }
    }
    window.addEventListener('keydown', handlePaletteShortcut);
    return () => window.removeEventListener('keydown', handlePaletteShortcut);
  }, []);
}
