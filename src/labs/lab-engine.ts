import type { GraphAlgorithm, GraphEdge, GraphFrameState, GraphNode, LabFrame } from './types';

function frameId(frames: LabFrame[]) {
  return frames.length;
}

export function initialStackFrame(stack: number[]): LabFrame {
  return { id: 0, domain: 'stack', action: 'ready', message: 'Stack ready for the next operation.', stack: [...stack] };
}

export function pushStack(stack: number[], value: number): LabFrame[] {
  const next = [...stack, value];
  return [{ id: 0, domain: 'stack', action: 'push', message: `Push ${value} onto the top.`, stack: next }];
}

export function popStack(stack: number[]): LabFrame[] {
  if (!stack.length)
    return [{ id: 0, domain: 'stack', action: 'underflow', message: 'Cannot pop from an empty stack.', stack: [] }];
  const value = stack[stack.length - 1];
  return [{ id: 0, domain: 'stack', action: 'pop', message: `Pop ${value} from the top.`, stack: stack.slice(0, -1) }];
}

export function peekStack(stack: number[]): LabFrame[] {
  const value = stack.at(-1);
  return [
    {
      id: 0,
      domain: 'stack',
      action: value === undefined ? 'underflow' : 'peek',
      message: value === undefined ? 'The stack is empty.' : `Peek returns ${value} without removing it.`,
      stack: [...stack],
    },
  ];
}

export function initialHeapFrame(heap: number[]): LabFrame {
  return { id: 0, domain: 'heap', action: 'ready', message: 'Min heap ready for the next operation.', heap: [...heap] };
}

export function insertHeap(heap: number[], value: number): LabFrame[] {
  const values = [...heap, value];
  const frames: LabFrame[] = [
    {
      id: 0,
      domain: 'heap',
      action: 'insert',
      message: `Append ${value} at index ${values.length - 1}.`,
      heap: [...values],
      activeIndices: [values.length - 1],
    },
  ];
  let index = values.length - 1;
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    frames.push({
      id: frameId(frames),
      domain: 'heap',
      action: 'compare',
      message: `Compare ${values[index]} with parent ${values[parent]}.`,
      heap: [...values],
      activeIndices: [parent, index],
    });
    if (values[parent] <= values[index]) break;
    [values[parent], values[index]] = [values[index], values[parent]];
    frames.push({
      id: frameId(frames),
      domain: 'heap',
      action: 'sift-up',
      message: `Swap indices ${parent} and ${index}.`,
      heap: [...values],
      activeIndices: [parent, index],
    });
    index = parent;
  }
  return frames;
}

function siftDown(values: number[], root: number, frames: LabFrame[], upper = values.length) {
  let index = root;
  while (index * 2 + 1 < upper) {
    let child = index * 2 + 1;
    if (child + 1 < upper && values[child + 1] < values[child]) child += 1;
    frames.push({
      id: frameId(frames),
      domain: 'heap',
      action: 'compare',
      message: `Compare parent ${values[index]} with child ${values[child]}.`,
      heap: [...values],
      activeIndices: [index, child],
    });
    if (values[index] <= values[child]) break;
    [values[index], values[child]] = [values[child], values[index]];
    frames.push({
      id: frameId(frames),
      domain: 'heap',
      action: 'sift-down',
      message: `Swap indices ${index} and ${child}.`,
      heap: [...values],
      activeIndices: [index, child],
    });
    index = child;
  }
}

export function extractHeap(heap: number[]): LabFrame[] {
  if (!heap.length)
    return [{ id: 0, domain: 'heap', action: 'underflow', message: 'Cannot extract from an empty heap.', heap: [] }];
  const values = [...heap];
  const minimum = values[0];
  const last = values.pop();
  const frames: LabFrame[] = [];
  if (values.length && last !== undefined) {
    values[0] = last;
    frames.push({
      id: 0,
      domain: 'heap',
      action: 'extract',
      message: `Extract ${minimum}; move ${last} to the root.`,
      heap: [...values],
      activeIndices: [0],
    });
    siftDown(values, 0, frames);
  } else {
    frames.push({ id: 0, domain: 'heap', action: 'extract', message: `Extract the only value, ${minimum}.`, heap: [] });
  }
  return frames;
}

export function heapify(values: number[]): LabFrame[] {
  const heap = [...values];
  const frames: LabFrame[] = [
    { id: 0, domain: 'heap', action: 'heapify', message: 'Start from the last internal node.', heap: [...heap] },
  ];
  for (let root = Math.floor(heap.length / 2) - 1; root >= 0; root -= 1) siftDown(heap, root, frames);
  frames.push({
    id: frameId(frames),
    domain: 'heap',
    action: 'done',
    message: 'Every parent is now no greater than its children.',
    heap: [...heap],
  });
  return frames;
}

export function traverseGraph(
  nodes: GraphNode[],
  edges: GraphEdge[],
  start: string,
  algorithm: GraphAlgorithm,
  directed: boolean,
): LabFrame[] {
  const nodeIds = new Set(nodes.map((node) => node.id));
  if (!nodeIds.has(start)) return [];
  if (algorithm === 'dijkstra') return dijkstraGraph(nodes, edges, start, directed);
  const adjacency = new Map(nodes.map((node) => [node.id, [] as string[]]));
  for (const edge of edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) continue;
    adjacency.get(edge.from)?.push(edge.to);
    if (!directed) adjacency.get(edge.to)?.push(edge.from);
  }
  for (const neighbors of adjacency.values()) neighbors.sort();

  const frames: LabFrame[] = [];
  const visited = new Set<string>([start]);
  const visitedOrder: string[] = [];
  const frontier = [start];
  const emit = (action: string, message: string, current: string | null, edge: GraphEdge | null = null) => {
    const graph: GraphFrameState = {
      visited: [...visitedOrder],
      frontier: [...frontier],
      current,
      traversedEdge: edge,
    };
    frames.push({ id: frameId(frames), domain: 'graph', action, message, graph });
  };

  emit(algorithm === 'bfs' ? 'enqueue' : 'push', `Start at node ${start}.`, start);
  while (frontier.length) {
    const current = algorithm === 'bfs' ? frontier.shift()! : frontier.pop()!;
    visitedOrder.push(current);
    emit('visit', `Visit node ${current}.`, current);
    const neighbors = adjacency.get(current) || [];
    const orderedNeighbors = algorithm === 'dfs' ? [...neighbors].reverse() : neighbors;
    for (const neighbor of orderedNeighbors) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      frontier.push(neighbor);
      emit(
        algorithm === 'bfs' ? 'enqueue' : 'push',
        `${algorithm === 'bfs' ? 'Enqueue' : 'Push'} ${neighbor} from ${current}.`,
        current,
        { from: current, to: neighbor },
      );
    }
  }
  emit('done', `${algorithm.toUpperCase()} visited ${visitedOrder.length} nodes.`, null);
  return frames;
}

function dijkstraGraph(nodes: GraphNode[], edges: GraphEdge[], start: string, directed: boolean): LabFrame[] {
  type Neighbor = { id: string; weight: number };
  const nodeIds = new Set(nodes.map((node) => node.id));
  const adjacency = new Map(nodes.map((node) => [node.id, [] as Neighbor[]]));
  for (const edge of edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) continue;
    const weight = edge.weight ?? 1;
    if (!Number.isFinite(weight) || weight < 0)
      throw new RangeError('Dijkstra requires finite, non-negative edge weights.');
    adjacency.get(edge.from)?.push({ id: edge.to, weight });
    if (!directed) adjacency.get(edge.to)?.push({ id: edge.from, weight });
  }
  for (const neighbors of adjacency.values())
    neighbors.sort((left, right) => left.id.localeCompare(right.id) || left.weight - right.weight);

  const frames: LabFrame[] = [];
  const distances = Object.fromEntries(nodes.map((node) => [node.id, null])) as Record<string, number | null>;
  const settled = new Set<string>();
  const visited: string[] = [];
  distances[start] = 0;

  const frontier = () =>
    nodes
      .map((node) => node.id)
      .filter((id) => !settled.has(id) && distances[id] !== null)
      .sort((left, right) => distances[left]! - distances[right]! || left.localeCompare(right));
  const emit = (action: string, message: string, current: string | null, traversedEdge: GraphEdge | null = null) => {
    const graph: GraphFrameState = {
      visited: [...visited],
      frontier: frontier(),
      current,
      traversedEdge,
      distances: { ...distances },
    };
    frames.push({ id: frameId(frames), domain: 'graph', action, message, graph });
  };

  emit('distance', `Set the distance to ${start} to 0.`, start);
  while (frontier().length) {
    const current = frontier()[0];
    const currentDistance = distances[current]!;
    settled.add(current);
    visited.push(current);
    emit('settle', `Settle ${current} at distance ${currentDistance}.`, current);

    for (const neighbor of adjacency.get(current) || []) {
      if (settled.has(neighbor.id)) continue;
      const candidate = currentDistance + neighbor.weight;
      const previous = distances[neighbor.id];
      if (previous === null || candidate < previous) {
        distances[neighbor.id] = candidate;
        emit(
          'relax',
          `Update ${neighbor.id}: ${previous === null ? '∞' : previous} → ${candidate} via ${current}.`,
          current,
          {
            from: current,
            to: neighbor.id,
            weight: neighbor.weight,
          },
        );
      } else {
        emit('compare', `Keep ${neighbor.id} at ${previous}; ${candidate} via ${current} is not shorter.`, current, {
          from: current,
          to: neighbor.id,
          weight: neighbor.weight,
        });
      }
    }
  }
  emit('done', `Dijkstra settled ${visited.length} reachable nodes.`, null);
  return frames;
}
