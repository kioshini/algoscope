import type { CatalogAlgorithmDefinition } from '../algorithms/types';

export const LESSON_STEP_COUNT = 5;
export const LESSON_QUIZ_STEP = 3;
export const LESSON_PASS_THRESHOLD = 0.8;
export const LESSON_STORAGE_PREFIX = 'algoscope:lesson:';

export type LessonStepIndex = 0 | 1 | 2 | 3 | 4;

export type LessonAnswer = {
  questionId: string;
  chosen: string;
  correct: boolean;
};

export type LessonState = {
  algorithmId: string;
  step: LessonStepIndex;
  answers: LessonAnswer[];
  completed: number | null;
  visited: LessonStepIndex[];
  startedAt: number;
  updatedAt: number;
};

export type LessonStorageOptions = {
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null;
};

function storageFrom(options: LessonStorageOptions): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null {
  if ('storage' in options) return options.storage ?? null;
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export function lessonKey(algorithmId: string): string {
  return `${LESSON_STORAGE_PREFIX}${algorithmId}`;
}

export function isLessonComplete(algorithmId: string, options: LessonStorageOptions = {}): boolean {
  const state = readLesson(algorithmId, options);
  return state?.completed !== null && state?.completed !== undefined;
}

function clampStep(value: number): LessonStepIndex {
  const step = Math.floor(value);
  if (step < 0) return 0;
  if (step >= LESSON_STEP_COUNT) return (LESSON_STEP_COUNT - 1) as LessonStepIndex;
  return step as LessonStepIndex;
}

function isStepIndex(value: unknown): value is LessonStepIndex {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < LESSON_STEP_COUNT;
}

function isAnswer(value: unknown): value is LessonAnswer {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const answer = value as Record<string, unknown>;
  return (
    typeof answer.questionId === 'string' && typeof answer.chosen === 'string' && typeof answer.correct === 'boolean'
  );
}

export function isLessonState(value: unknown): value is LessonState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const state = value as Record<string, unknown>;
  return (
    typeof state.algorithmId === 'string' &&
    isStepIndex(state.step) &&
    Array.isArray(state.answers) &&
    state.answers.every(isAnswer) &&
    (state.completed === null || (typeof state.completed === 'number' && Number.isFinite(state.completed))) &&
    Array.isArray(state.visited) &&
    state.visited.every(isStepIndex) &&
    typeof state.startedAt === 'number' &&
    typeof state.updatedAt === 'number'
  );
}

export function startLesson(algorithmId: string, now = Date.now()): LessonState {
  return {
    algorithmId,
    step: 0,
    answers: [],
    completed: null,
    visited: [0],
    startedAt: now,
    updatedAt: now,
  };
}

export function goToStep(state: LessonState, step: number): LessonState {
  const next = clampStep(step);
  return {
    ...state,
    step: next,
    visited: state.visited.includes(next) ? state.visited : [...state.visited, next],
    updatedAt: Date.now(),
  };
}

export function nextStep(state: LessonState): LessonState {
  if (state.step >= LESSON_STEP_COUNT - 1) return state;
  return goToStep(state, state.step + 1);
}

export function previousStep(state: LessonState): LessonState {
  if (state.step <= 0) return state;
  return goToStep(state, state.step - 1);
}

/** Records one quiz answer without advancing. */
export function recordAnswer(state: LessonState, answer: LessonAnswer): LessonState {
  const filtered = state.answers.filter((item) => item.questionId !== answer.questionId);
  return {
    ...state,
    answers: [...filtered, answer],
    updatedAt: Date.now(),
  };
}

/** Share of correct answers among recorded quiz answers (0 when none). */
export function answerScore(state: LessonState): number {
  if (state.answers.length === 0) return 0;
  const correct = state.answers.reduce((total, answer) => total + (answer.correct ? 1 : 0), 0);
  return correct / state.answers.length;
}

/**
 * Whether the recorded answers clear the pass threshold. The quiz is only
 * gradable once every question has been answered; the caller supplies the
 * question count so the machine never hardcodes it.
 */
export function quizPassed(state: LessonState, questionCount: number): boolean {
  if (questionCount <= 0 || state.answers.length < questionCount) return false;
  return answerScore(state) >= LESSON_PASS_THRESHOLD;
}

export function completeLesson(state: LessonState, now = Date.now()): LessonState {
  return { ...state, completed: now, updatedAt: now };
}

export function readLesson(algorithmId: string, options: LessonStorageOptions = {}): LessonState | null {
  try {
    const raw = storageFrom(options)?.getItem(lessonKey(algorithmId));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isLessonState(parsed) && parsed.algorithmId === algorithmId ? parsed : null;
  } catch {
    return null;
  }
}

export function writeLesson(state: LessonState, options: LessonStorageOptions = {}): boolean {
  try {
    const storage = storageFrom(options);
    if (!storage) return false;
    storage.setItem(lessonKey(state.algorithmId), JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearLesson(algorithmId: string, options: LessonStorageOptions = {}): boolean {
  try {
    const storage = storageFrom(options);
    if (!storage) return false;
    storage.removeItem(lessonKey(algorithmId));
    return true;
  } catch {
    return false;
  }
}

/** Adapts any catalog definition to the subset a lesson renders. */
export function lessonMetadata(algorithm: CatalogAlgorithmDefinition) {
  return {
    id: algorithm.id,
    name: algorithm.name,
    summary: algorithm.summary,
    explanation: algorithm.explanation,
    limitation: algorithm.limitation,
    complexity: algorithm.complexity,
    traits: algorithm.kind === 'sort' ? algorithm.traits : undefined,
    examples: algorithm.kind === 'sort' ? algorithm.examples : undefined,
    useCases: algorithm.useCases,
  };
}
