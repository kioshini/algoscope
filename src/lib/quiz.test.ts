import { describe, expect, it } from 'vitest';
import { buildQuizQuestions } from './quiz';
import { CATALOG_ALGORITHMS } from '../algorithms/full-catalog';
import type { CatalogAlgorithmDefinition } from '../algorithms/types';

const byId = (id: string): CatalogAlgorithmDefinition => {
  const found = CATALOG_ALGORITHMS.find((algorithm) => algorithm.id === id);
  if (!found) throw new Error(`Missing test algorithm: ${id}`);
  return found;
};

describe('buildQuizQuestions', () => {
  it('always produces the complexity and memory questions', () => {
    const questions = buildQuizQuestions(byId('bubble'), 'en');
    expect(questions.map((question) => question.id)).toEqual(
      expect.arrayContaining(['complexity-bubble', 'memory-bubble']),
    );
  });

  it('adds a trait question for sort algorithms', () => {
    const questions = buildQuizQuestions(byId('bubble'), 'en');
    expect(questions.some((question) => question.id === 'trait-bubble')).toBe(true);
  });

  it('omits the trait question for non-sort algorithms', () => {
    const questions = buildQuizQuestions(byId('search-binary-first'), 'en');
    expect(questions.some((question) => question.id.startsWith('trait-'))).toBe(false);
  });

  it('marks the correct complexity option', () => {
    const quiz = buildQuizQuestions(byId('bubble'), 'en');
    const complexity = quiz.find((question) => question.id === 'complexity-bubble')!;
    expect(complexity.options[complexity.correctIndex]).toBe('O(n²)');
  });

  it('keeps options unique', () => {
    const quiz = buildQuizQuestions(byId('heap'), 'en');
    for (const question of quiz) {
      expect(new Set(question.options).size).toBe(question.options.length);
    }
  });

  it('produces a stable order for the same algorithm id', () => {
    const first = buildQuizQuestions(byId('merge'), 'ru');
    const second = buildQuizQuestions(byId('merge'), 'ru');
    expect(first).toEqual(second);
  });

  it('localizes prompts by locale', () => {
    const en = buildQuizQuestions(byId('bubble'), 'en')[0];
    const ru = buildQuizQuestions(byId('bubble'), 'ru')[0];
    expect(en.prompt).not.toBe(ru.prompt);
  });

  it('never emits a question without a correct option present', () => {
    for (const algorithm of CATALOG_ALGORITHMS) {
      for (const question of buildQuizQuestions(algorithm, 'en')) {
        expect(question.correctIndex).toBeGreaterThanOrEqual(0);
        expect(question.correctIndex).toBeLessThan(question.options.length);
      }
    }
  });
});
