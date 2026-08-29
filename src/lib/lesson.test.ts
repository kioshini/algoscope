import { describe, expect, it } from 'vitest';
import {
  LESSON_PASS_THRESHOLD,
  answerScore,
  clearLesson,
  completeLesson,
  goToStep,
  isLessonComplete,
  isLessonState,
  lessonKey,
  nextStep,
  previousStep,
  quizPassed,
  readLesson,
  recordAnswer,
  startLesson,
  writeLesson,
} from './lesson';

function memoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
}

describe('lesson state machine', () => {
  it('starts at step 0 with no answers', () => {
    const state = startLesson('bubble', 1000);
    expect(state.step).toBe(0);
    expect(state.answers).toEqual([]);
    expect(state.completed).toBeNull();
    expect(state.visited).toEqual([0]);
    expect(state.startedAt).toBe(1000);
  });

  it('clamps step navigation to the valid range', () => {
    let state = startLesson('bubble');
    state = previousStep(state);
    expect(state.step).toBe(0);
    state = goToStep(state, 99);
    expect(state.step).toBe(4);
    state = goToStep(state, -5);
    expect(state.step).toBe(0);
  });

  it('nextStep does not advance past the last step', () => {
    let state = startLesson('bubble');
    for (let index = 0; index < 10; index += 1) state = nextStep(state);
    expect(state.step).toBe(4);
  });

  it('records visited steps only once', () => {
    let state = goToStep(startLesson('bubble'), 2);
    state = goToStep(state, 1);
    state = goToStep(state, 2);
    expect(state.visited).toEqual([0, 2, 1]);
  });

  it('recordAnswer replaces an answer for the same question id', () => {
    const first = recordAnswer(startLesson('bubble'), { questionId: 'q1', chosen: 'a', correct: true });
    const second = recordAnswer(first, { questionId: 'q1', chosen: 'b', correct: false });
    expect(second.answers).toHaveLength(1);
    expect(second.answers[0]).toEqual({ questionId: 'q1', chosen: 'b', correct: false });
  });

  it('scores zero with no answers and the share correct otherwise', () => {
    expect(answerScore(startLesson('bubble'))).toBe(0);
    const partial = recordAnswer(startLesson('bubble'), { questionId: 'q1', chosen: 'a', correct: true });
    const scored = recordAnswer(partial, { questionId: 'q2', chosen: 'a', correct: false });
    expect(answerScore(scored)).toBe(0.5);
  });

  it('quizPassed requires every question answered', () => {
    const partial = recordAnswer(startLesson('bubble'), { questionId: 'q1', chosen: 'a', correct: true });
    expect(quizPassed(partial, 4)).toBe(false);
    const full = [0, 1, 2, 3].reduce(
      (state, index) => recordAnswer(state, { questionId: `q${index}`, chosen: 'x', correct: index < 4 }),
      startLesson('bubble'),
    );
    expect(quizPassed(full, 4)).toBe(true);
  });

  it('threshold is 80% of correct answers', () => {
    expect(LESSON_PASS_THRESHOLD).toBe(0.8);
    const threeOfFour = [0, 1, 2, 3].reduce(
      (state, index) => recordAnswer(state, { questionId: `q${index}`, chosen: 'x', correct: index < 3 }),
      startLesson('bubble'),
    );
    // 3/4 = 0.75, below the 0.8 threshold, so it must not pass.
    expect(quizPassed(threeOfFour, 4)).toBe(false);
    expect(answerScore(threeOfFour)).toBe(0.75);
    const fourOfFour = [0, 1, 2, 3].reduce(
      (state, index) => recordAnswer(state, { questionId: `q${index}`, chosen: 'x', correct: true }),
      startLesson('bubble'),
    );
    expect(quizPassed(fourOfFour, 4)).toBe(true);
  });

  it('completeLesson stamps a completion time', () => {
    const completed = completeLesson(startLesson('bubble'), 5000);
    expect(completed.completed).toBe(5000);
    expect(isLessonState(completed)).toBe(true);
  });

  it('persists and reloads a lesson round-trip', () => {
    const storage = memoryStorage();
    let state = startLesson('bubble');
    state = nextStep(state);
    state = recordAnswer(state, { questionId: 'q1', chosen: 'a', correct: true });
    expect(writeLesson(state, { storage })).toBe(true);
    const loaded = readLesson('bubble', { storage });
    expect(loaded).toEqual(state);
    expect(isLessonComplete('bubble', { storage })).toBe(false);
  });

  it('rejects malformed persisted state', () => {
    const storage = memoryStorage();
    storage.setItem(lessonKey('bubble'), JSON.stringify({ step: 99 }));
    expect(readLesson('bubble', { storage })).toBeNull();
  });

  it('rejects state that does not match the requested algorithm id', () => {
    const storage = memoryStorage();
    storage.setItem(lessonKey('quick'), JSON.stringify(startLesson('merge')));
    expect(readLesson('quick', { storage })).toBeNull();
  });

  it('clearLesson removes the stored state', () => {
    const storage = memoryStorage();
    writeLesson(startLesson('bubble'), { storage });
    expect(clearLesson('bubble', { storage })).toBe(true);
    expect(readLesson('bubble', { storage })).toBeNull();
  });
});
