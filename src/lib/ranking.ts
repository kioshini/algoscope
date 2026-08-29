import type { CatalogAlgorithmDefinition } from '../algorithms/types';

export type ScenarioDef = {
  id: string;
  label: string;
  description: string;
  problem?: CatalogAlgorithmDefinition['problem'];
  contracts?: string[];
  requiredTags: string[];
  preferScale?: 'small' | 'large' | 'all';
  verdict: string;
};

export type RankBullet = {
  label: string;
  ok: boolean;
};

export type RankResult = {
  algorithm: CatalogAlgorithmDefinition;
  score: number;
  bullets: RankBullet[];
  verdict: string;
  whyScale?: string;
};

const weights = { contract: 0.5, tag: 0.3, complexity: 0.2 };

export const SCENARIOS: ScenarioDef[] = [
  {
    id: 'fast-search-sorted',
    label: 'Быстрый поиск в отсортированном массиве',
    description: 'Нужно искать элемент/позицию в упорядоченных данных как можно быстрее.',
    problem: 'Searching',
    requiredTags: ['sorted', 'logarithmic'],
    preferScale: 'all',
    verdict: 'Ищите за логарифмическое время в отсортированном входе.',
  },
  {
    id: 'sort-large',
    label: 'Сортировка большого набора данных',
    description: 'Отсортировать много элементов в памяти, важна скорость на больших объёмах.',
    problem: 'Sorting',
    requiredTags: ['large-data', 'fast-average', 'in-place'],
    preferScale: 'large',
    verdict: 'На больших объёмах выбирайте O(n log n) с низкими накладными расходами.',
  },
  {
    id: 'sort-nearly-sorted',
    label: 'Сортировка почти упорядоченных данных',
    description: 'Данные почти отсортированы и меняются редко, нужна адаптивность.',
    problem: 'Sorting',
    requiredTags: ['adaptive', 'nearly-sorted'],
    preferScale: 'all',
    verdict: 'Адаптивный алгоритм отработает почти линейно на почти готовых данных.',
  },
  {
    id: 'sort-small',
    label: 'Сортировка малого числа элементов',
    description: 'Небольшой массив (десятки элементов), важна низкая стоимость накладных расходов.',
    problem: 'Sorting',
    requiredTags: ['small-data', 'fast-small'],
    preferScale: 'small',
    verdict: 'На малых массивах простой алгоритм часто быстрее сложных.',
  },
  {
    id: 'shortest-paths',
    label: 'Кратчайшие пути в графе',
    description: 'Нужно вычислить кратчайшие расстояния между вершинами.',
    problem: 'Graph',
    requiredTags: ['shortest-path', 'weighted'],
    verdict: 'Выбор зависит от весов (отрицательные или нет) и числа пар вершин.',
  },
  {
    id: 'graph-traversal',
    label: 'Обход и анализ структуры графа',
    description: 'Нужно пройти по вершинам/рёбрам, найти компоненты или порядок обхода.',
    problem: 'Graph',
    requiredTags: ['traversal', 'connectivity'],
    verdict: 'Для обхода подойдут BFS/DFS, для компонент — соответствующие алгоритмы.',
  },
  {
    id: 'substring-search',
    label: 'Поиск подстроки в тексте',
    description: 'Найти вхождение шаблона в тексте, возможно много раз или несколько паттернов.',
    problem: 'String',
    requiredTags: ['substring', 'pattern'],
    verdict: 'Для одного паттерна — линейные алгоритмы, для многих — Aho-Corasick.',
  },
  {
    id: 'dp-optimization',
    label: 'Оптимизация/псевдополиномиальная задача',
    description: 'Задача выбора/распределения с ограничением ёмкости (рюкзак, размен, последовательности).',
    problem: 'Dynamic Programming',
    requiredTags: ['capacity', 'optimization', 'sequence'],
    verdict: 'Динамическое программирование даёт решение за псевдополиномиальное время.',
  },
];

function tagScore(candidate: string[], required: string[]): number {
  if (!required.length) return 0;
  const set = new Set(candidate);
  const matched = required.filter((tag) => set.has(tag)).length;
  return matched / required.length;
}

function complexityScore(algorithm: CatalogAlgorithmDefinition, preferScale?: 'small' | 'large' | 'all'): number {
  const suit = algorithm.scaleSuitability;
  if (!preferScale || preferScale === 'all' || suit === 'all') return 0.7;
  return suit === preferScale ? 1 : 0.2;
}

function contractMatches(algorithm: CatalogAlgorithmDefinition, scenario: ScenarioDef): boolean {
  if (scenario.problem && algorithm.problem !== scenario.problem) return false;
  if (scenario.contracts && !scenario.contracts.includes(algorithm.contract)) return false;
  return true;
}

const candidateTags = (algorithm: CatalogAlgorithmDefinition) => algorithm.tags;

const bulletsFor = (algorithm: CatalogAlgorithmDefinition, scenario: ScenarioDef): RankBullet[] => {
  const set = new Set<string>(candidateTags(algorithm));
  const contractOk = !scenario.problem || algorithm.problem === scenario.problem;
  const scaleOk =
    !scenario.preferScale ||
    scenario.preferScale === 'all' ||
    algorithm.scaleSuitability === 'all' ||
    algorithm.scaleSuitability === scenario.preferScale;

  const bullets: RankBullet[] = [{ label: `Решает задачу «${scenario.label}»`, ok: contractOk }];
  for (const tag of scenario.requiredTags.slice(0, 3)) {
    bullets.push({ label: `Подходит: ${tag}`, ok: set.has(tag) });
  }
  if (scenario.preferScale) {
    const scaleText = algorithm.scaleSuitability === 'all' ? 'любой' : algorithm.scaleSuitability;
    bullets.push({ label: `Масштаб: ${scaleText}`, ok: scaleOk });
  }
  return bullets;
};

const scaleVerdict = (algorithm: CatalogAlgorithmDefinition) => {
  const suit = algorithm.scaleSuitability;
  if (suit === 'large') return 'Выгоден на больших объёмах; на малых может уступать более простым алгоритмам.';
  if (suit === 'small') return 'Хорош на малых данных; на больших проигрывает из-за роста стоимости.';
  if (suit === 'all') return 'Работает на любом масштабе.';
  return 'Сбалансирован по масштабу.';
};

export function scoreAlgorithm(algorithm: CatalogAlgorithmDefinition, scenario: ScenarioDef): number {
  if (!contractMatches(algorithm, scenario)) return -1;
  const c = 1;
  const t = tagScore(candidateTags(algorithm), scenario.requiredTags);
  const x = complexityScore(algorithm, scenario.preferScale);
  return weights.contract * c + weights.tag * t + weights.complexity * x;
}

export function rankForScenario(scenario: ScenarioDef, algorithms: CatalogAlgorithmDefinition[]): RankResult[] {
  return algorithms
    .map((algorithm) => {
      const score = scoreAlgorithm(algorithm, scenario);
      if (score < 0) return null;
      const result: RankResult = {
        algorithm,
        score,
        bullets: bulletsFor(algorithm, scenario),
        verdict: scaleVerdict(algorithm),
      };
      if (algorithm.scaleSuitability === 'large') result.whyScale = 'Хорош на больших объёмах';
      return result;
    })
    .filter((result): result is RankResult => result !== null)
    .sort((a, b) => b.score - a.score);
}
