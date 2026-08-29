import { csharpSources } from './languages/csharp';
import { javaSources } from './languages/java';
import { cppSources } from './languages/cpp';
import { cSources } from './languages/c';
import { goSources } from './languages/go';

export type SupportedLanguage = 'python' | 'csharp' | 'java' | 'cpp' | 'c' | 'go';

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  python: 'Python',
  csharp: 'C#',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  go: 'Go',
};

const LANGUAGE_SOURCES: Record<Exclude<SupportedLanguage, 'python'>, Record<string, string>> = {
  csharp: csharpSources,
  java: javaSources,
  cpp: cppSources,
  c: cSources,
  go: goSources,
};

export function sourceForAlgorithm(
  id: string,
  pythonSource: string,
  language: SupportedLanguage,
): { available: boolean; source: string } {
  if (language === 'python') return { available: true, source: pythonSource };
  const source = LANGUAGE_SOURCES[language][id];
  return source
    ? { available: true, source }
    : { available: false, source: `// ${LANGUAGE_LABELS[language]} implementation is not available yet.` };
}
