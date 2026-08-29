import { describe, expect, it } from 'vitest';
import {
  generateRemovalCandidates,
  minimizeFailingInput,
  minimizeFailingInputAsync,
  shrinkInteger,
} from './counterexample';

describe('counterexample reduction', () => {
  it('generates deterministic chunk removals', () => {
    expect(generateRemovalCandidates([1, 2, 3, 4, 5], 2)).toEqual([
      [3, 4, 5],
      [1, 2],
    ]);
  });

  it('finds a deletion-minimal failing input without mutating the original', () => {
    const input = [9, 1, 7, 2, 3, 8];
    const isCorrect = (values: readonly number[]) => !(values.includes(7) && values.includes(3));

    const result = minimizeFailingInput(input, isCorrect);

    expect(result).toEqual([7, 3]);
    expect(input).toEqual([9, 1, 7, 2, 3, 8]);
    expect(result?.every((_, index) => isCorrect(result.filter((__, itemIndex) => itemIndex !== index)))).toBe(true);
  });

  it('returns null when the initial input is correct', () => {
    expect(minimizeFailingInput([1, 2, 3], () => true)).toBeNull();
  });

  it('shrinks values after reducing length', () => {
    const isCorrect = (values: readonly number[]) => !values.some((value) => value >= 4);
    expect(minimizeFailingInput([20, 2, 9], isCorrect, shrinkInteger)).toEqual([4]);
  });

  it('handles a failure caused by empty input', () => {
    const isCorrect = (values: readonly number[]) => values.length > 0;
    expect(minimizeFailingInput([], isCorrect)).toEqual([]);
  });

  it('reduces an async failing batch to a 1-minimal input', async () => {
    const isCorrect = async (values: readonly number[]) => !(values.includes(7) && values.includes(3));
    const result = await minimizeFailingInputAsync(
      [
        [9, 1, 7, 2, 3, 8],
        [1, 2],
      ],
      isCorrect,
    );
    expect(result).toEqual([7, 3]);
  });

  it('returns null from the async variant when nothing fails', async () => {
    expect(
      await minimizeFailingInputAsync(
        [
          [1, 2],
          [3, 4],
        ],
        async () => true,
      ),
    ).toBeNull();
  });
});
