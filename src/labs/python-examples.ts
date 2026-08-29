import type { LabKind } from './types';

export const LAB_PYTHON_EXAMPLES: Record<LabKind, string> = {
  stack: `def run(stack):
    stack.push(5)
    stack.peek()
    stack.push(9)
    stack.pop()
`,
  heap: `def run(heap):
    heap.insert(2)
    heap.insert(4)
    heap.extract_min()
`,
  graph: `def run(graph, start):
    queue = [start]
    seen = {start}
    graph.frontier(queue, "enqueue", start)

    while queue:
        node = queue.pop(0)
        graph.visit(node, queue)

        for neighbor in graph.neighbors(node):
            if neighbor not in seen:
                seen.add(neighbor)
                queue.append(neighbor)
                graph.frontier(queue, "enqueue", neighbor, node)
`,
};
