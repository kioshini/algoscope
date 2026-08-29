export type InputPattern = 'random' | 'reversed' | 'sorted' | 'nearly' | 'duplicates';

export const DEFAULT_INPUT_TEXT = '8, 3, 6, 2, 7, 1, 5, 4';
export const DEFAULT_INPUT_VALUES = [8, 3, 6, 2, 7, 1, 5, 4];

export function createInput(pattern: InputPattern, size = 10): number[] {
  const sorted = Array.from({ length: size }, (_, index) => index + 1);
  if (pattern === 'sorted') return sorted;
  if (pattern === 'reversed') return sorted.reverse();
  if (pattern === 'duplicates') return sorted.map((value) => (value % 4) + 1);
  if (pattern === 'nearly') {
    if (size > 3) [sorted[1], sorted[size - 2]] = [sorted[size - 2], sorted[1]];
    return sorted;
  }

  const values = [...sorted];
  for (let index = values.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [values[index], values[target]] = [values[target], values[index]];
  }
  return values;
}

export function parseInput(value: string): number[] {
  const values = value
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map(Number);

  if (values.length === 0) throw new Error('Enter at least one number.');
  if (values.length > 40) throw new Error('Trace mode supports up to 40 values.');
  if (values.some((item) => !Number.isFinite(item))) throw new Error('Input must contain numbers only.');
  return values;
}
