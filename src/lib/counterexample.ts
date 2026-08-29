export type CorrectnessPredicate<T> = (input: readonly T[]) => boolean;
export type ValueShrinker<T> = (value: T) => Iterable<T>;

/** Generates deterministic candidates by deleting each chunk at the requested granularity. */
export function generateRemovalCandidates<T>(input: readonly T[], parts: number): T[][] {
  if (input.length === 0) return [];
  const count = Math.min(input.length, Math.max(1, Math.floor(parts)));
  const candidates: T[][] = [];
  for (let part = 0; part < count; part += 1) {
    const start = Math.floor((part * input.length) / count);
    const end = Math.floor(((part + 1) * input.length) / count);
    candidates.push([...input.slice(0, start), ...input.slice(end)]);
  }
  return candidates;
}

/**
 * Delta-debug a failing array. The result is deterministic and 1-minimal for
 * deletion; optional value shrinking runs to a fixed point afterward.
 */
export function minimizeFailingInput<T>(
  input: readonly T[],
  isCorrect: CorrectnessPredicate<T>,
  shrinkValue?: ValueShrinker<T>,
): T[] | null {
  if (isCorrect(input)) return null;

  let current = [...input];
  let parts = 2;
  while (current.length > 0) {
    const candidate = generateRemovalCandidates(current, parts).find((reduced) => !isCorrect(reduced));
    if (candidate) {
      current = candidate;
      parts = Math.max(2, parts - 1);
    } else if (parts < current.length) {
      parts = Math.min(current.length, parts * 2);
    } else {
      break;
    }
  }

  if (!shrinkValue) return current;
  let changed = true;
  while (changed) {
    changed = false;
    for (let index = 0; index < current.length; index += 1) {
      for (const value of shrinkValue(current[index])) {
        if (Object.is(value, current[index])) continue;
        const candidate = [...current];
        candidate[index] = value;
        if (!isCorrect(candidate)) {
          current = candidate;
          changed = true;
          break;
        }
      }
    }
  }
  return current;
}

/** Finite integer candidates ordered toward zero. */
export function shrinkInteger(value: number): number[] {
  if (!Number.isSafeInteger(value) || value === 0) return [];
  const candidates = [0];
  let magnitude = Math.abs(value);
  while (magnitude > 1) {
    magnitude = Math.floor(magnitude / 2);
    candidates.push(Math.sign(value) * magnitude);
  }
  return [...new Set(candidates)];
}

export type AsyncCorrectnessPredicate<T> = (input: readonly T[]) => Promise<boolean>;

/**
 * Async delta-deb g used from the UI so the correctness check can run through
 * the Python Worker. Returns the minimal failing input or null when the batch
 * never fails.
 */
export async function minimizeFailingInputAsync<T>(
  inputs: readonly (readonly T[])[],
  isCorrect: AsyncCorrectnessPredicate<T>,
): Promise<readonly T[] | null> {
  let failing: readonly T[] | null = null;
  for (const candidate of inputs) {
    if (!(await isCorrect(candidate))) {
      failing = candidate;
      break;
    }
  }
  if (!failing) return null;

  let current = [...failing];
  for (let index = current.length - 1; index >= 0 && current.length > 1; index -= 1) {
    const candidate = current.filter((_, item) => item !== index);
    if (!(await isCorrect(candidate))) current = candidate;
  }
  return current;
}
