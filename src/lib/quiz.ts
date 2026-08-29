import type { CatalogAlgorithmDefinition } from '../algorithms/types';
import type { Locale } from './i18n';

export type LessonQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type Messages = {
  complexityPrompt: (name: string) => string;
  complexityExplanation: (label: string, name: string) => string;
  memoryPrompt: (name: string) => string;
  memoryExplanation: (label: string, name: string) => string;
  traitPrompt: (name: string) => string;
  traitExplanation: (label: string, name: string) => string;
  stable: string;
  inPlace: string;
  recursive: string;
};

const MESSAGE_SETS: Record<Locale, Messages> = {
  en: {
    complexityPrompt: (name) => `What is the average-case complexity of ${name}?`,
    complexityExplanation: (label, name) => `${name} averages ${label}.`,
    memoryPrompt: (name) => `How much extra space does ${name} need?`,
    memoryExplanation: (label, name) => `${name} needs ${label} of auxiliary space.`,
    traitPrompt: (name) => `Which property describes ${name}?`,
    traitExplanation: (label, name) => `${label} is one of ${name}'s defining traits.`,
    stable: 'Stable',
    inPlace: 'In place',
    recursive: 'Recursive',
  },
  ru: {
    complexityPrompt: (name) => `Какова средняя сложность алгоритма «${name}»?`,
    complexityExplanation: (label, name) => `«${name}» в среднем работает за ${label}.`,
    memoryPrompt: (name) => `Сколько дополнительной памяти требует «${name}»?`,
    memoryExplanation: (label, name) => `«${name}» требует ${label} дополнительной памяти.`,
    traitPrompt: (name) => `Какое свойство описывает «${name}»?`,
    traitExplanation: (label, name) => `${label} — одна из определяющих черт «${name}».`,
    stable: 'Устойчивость',
    inPlace: 'На месте',
    recursive: 'Рекурсивность',
  },
};

const COMPLEXITY_DISTRACTORS = ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)', 'O(n³)'];
const MEMORY_DISTRACTORS = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'];

function distinctOptions(correct: string, pool: readonly string[], seed: number): string[] {
  const uniques = [...new Set([...pool, correct])].filter((value) => value !== correct);
  const options = [...uniques, correct];
  return shuffle(options, seed);
}

/** Deterministic Fisher–Yates so tests never depend on Math.random. */
function shuffle<T>(items: readonly T[], seed: number): T[] {
  const array = [...items];
  let state = seed >>> 0 || 1;
  const rand = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
  for (let index = array.length - 1; index > 0; index -= 1) {
    const other = Math.floor(rand() * (index + 1));
    [array[index], array[other]] = [array[other], array[index]];
  }
  return array;
}

function hashSeed(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function correctIndexFor(options: readonly string[], correct: string): number {
  return options.indexOf(correct);
}

/**
 * Builds the metadata-derived quiz questions for an algorithm. The "predict the
 * next event" question is intentionally excluded: it depends on a live trace and
 * is generated at render time by the lesson UI.
 */
export function buildQuizQuestions(algorithm: CatalogAlgorithmDefinition, locale: Locale = 'en'): LessonQuestion[] {
  const messages = MESSAGE_SETS[locale];
  const questions: LessonQuestion[] = [];
  const baseSeed = hashSeed(algorithm.id);

  const average = algorithm.complexity.average;
  const avgOptions = distinctOptions(average, COMPLEXITY_DISTRACTORS, baseSeed);
  questions.push({
    id: `complexity-${algorithm.id}`,
    prompt: messages.complexityPrompt(algorithm.name),
    options: avgOptions,
    correctIndex: correctIndexFor(avgOptions, average),
    explanation: messages.complexityExplanation(average, algorithm.name),
  });

  const memory = algorithm.complexity.memory;
  const memOptions = distinctOptions(memory, MEMORY_DISTRACTORS, baseSeed + 1);
  questions.push({
    id: `memory-${algorithm.id}`,
    prompt: messages.memoryPrompt(algorithm.name),
    options: memOptions,
    correctIndex: correctIndexFor(memOptions, memory),
    explanation: messages.memoryExplanation(memory, algorithm.name),
  });

  if (algorithm.kind === 'sort') {
    const traits = [
      { label: messages.stable, value: algorithm.traits.stable, key: 'stable' },
      { label: messages.inPlace, value: algorithm.traits.inPlace, key: 'in-place' },
      { label: messages.recursive, value: algorithm.traits.recursive, key: 'recursive' },
    ];
    const correct = traits.find((trait) => trait.value);
    if (correct) {
      const options = distinctOptions(
        correct.label,
        traits.map((trait) => trait.label),
        baseSeed + 2,
      );
      questions.push({
        id: `trait-${algorithm.id}`,
        prompt: messages.traitPrompt(algorithm.name),
        options,
        correctIndex: correctIndexFor(options, correct.label),
        explanation: messages.traitExplanation(correct.label, algorithm.name),
      });
    }
  }

  return questions;
}
