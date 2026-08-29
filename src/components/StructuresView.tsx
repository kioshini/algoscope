import {
  ArrowCounterClockwise,
  ArrowClockwise,
  CaretLeft,
  CaretRight,
  Eye,
  Minus,
  Pause,
  Play,
  Plus,
  TerminalWindow,
  Trash,
  TreeStructure,
} from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { algorithmWorker } from '../lib/worker-client';
import { parsePythonLine } from '../lib/errors';
import {
  extractHeap,
  heapify,
  initialHeapFrame,
  initialStackFrame,
  insertHeap,
  peekStack,
  popStack,
  pushStack,
  traverseGraph,
} from '../labs/lab-engine';
import { LAB_PYTHON_EXAMPLES } from '../labs/python-examples';
import type { GraphAlgorithm, GraphEdge, GraphNode, LabEntry, LabFrame, LabKind } from '../labs/types';
import { useI18n } from '../lib/i18n';
import { CodePanel } from './CodePanel';

type StructuresViewProps = {
  initialLab?: LabKind;
  initialPreset?: LabEntry['preset'];
};

const INITIAL_STACK = [4, 7, 2];
const INITIAL_HEAP = [1, 3, 6, 5, 9, 8];
const HEAPIFY_INPUT = [9, 4, 7, 1, 3, 6, 2];
const INITIAL_NODES: GraphNode[] = [
  { id: 'A', x: 300, y: 48 },
  { id: 'B', x: 145, y: 145 },
  { id: 'C', x: 455, y: 145 },
  { id: 'D', x: 70, y: 285 },
  { id: 'E', x: 220, y: 285 },
  { id: 'F', x: 380, y: 285 },
  { id: 'G', x: 530, y: 285 },
];
const INITIAL_EDGES: GraphEdge[] = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'D', weight: 3 },
  { from: 'B', to: 'E', weight: 2 },
  { from: 'C', to: 'F', weight: 4 },
  { from: 'C', to: 'G', weight: 7 },
  { from: 'E', to: 'F', weight: 1 },
];
const LAB_SOURCE_KEY = 'algoscope.labPythonSources.v1';
type GraphSnapshot = { nodes: GraphNode[]; edges: GraphEdge[] };

function storedLabSources() {
  try {
    const stored = JSON.parse(localStorage.getItem(LAB_SOURCE_KEY) || '{}') as Partial<Record<LabKind, string>>;
    return { ...LAB_PYTHON_EXAMPLES, ...stored };
  } catch {
    return { ...LAB_PYTHON_EXAMPLES };
  }
}

export function StructuresView({ initialLab = 'stack', initialPreset = 'push' }: StructuresViewProps) {
  const { t, format } = useI18n();
  const [lab, setLab] = useState<LabKind>(initialLab);
  const [frames, setFrames] = useState<LabFrame[]>(() => initialFrames(initialLab, initialPreset));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [value, setValue] = useState(5);
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<GraphEdge[]>(INITIAL_EDGES);
  const [start, setStart] = useState('A');
  const [edgeFrom, setEdgeFrom] = useState('A');
  const [edgeTo, setEdgeTo] = useState('B');
  const [edgeWeight, setEdgeWeight] = useState(1);
  const [directed, setDirected] = useState(false);
  const [editHistory, setEditHistory] = useState<GraphSnapshot[]>([]);
  const dragSnapshot = useRef<GraphSnapshot | null>(null);
  const dragMoved = useRef(false);
  const [pythonMode, setPythonMode] = useState(false);
  const [sources, setSources] = useState<Record<LabKind, string>>(storedLabSources);
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'error'>('idle');
  const [runError, setRunError] = useState<string | null>(null);
  const [mobilePanel, setMobilePanel] = useState<'controls' | 'canvas' | 'events'>('canvas');
  const frame = frames[Math.min(step, frames.length - 1)] || frames[0];

  useEffect(() => {
    if (!playing || step >= frames.length - 1) {
      if (playing && step >= frames.length - 1) setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setStep((current) => current + 1), Math.max(90, 520 / speed));
    return () => window.clearTimeout(timer);
  }, [playing, step, frames.length, speed]);

  function switchLab(next: LabKind) {
    setLab(next);
    setFrames(initialFrames(next, next === 'graph' ? 'bfs' : 'push'));
    setStep(0);
    setPlaying(false);
    setRunError(null);
    setRunStatus('idle');
    setMobilePanel('canvas');
  }

  function changeSource(source: string) {
    const next = { ...sources, [lab]: source };
    setSources(next);
    try {
      localStorage.setItem(LAB_SOURCE_KEY, JSON.stringify(next));
    } catch {
      // The editor remains usable when storage is blocked or full.
    }
  }

  function restoreSource() {
    changeSource(LAB_PYTHON_EXAMPLES[lab]);
  }

  async function runPython() {
    setPlaying(false);
    setRunError(null);
    setRunStatus('running');
    try {
      const next = await algorithmWorker.visualizeLab(
        lab,
        sources[lab],
        lab === 'graph'
          ? { graph: { nodes, edges, start, directed } }
          : { initial: lab === 'stack' ? frame?.stack || INITIAL_STACK : frame?.heap || INITIAL_HEAP },
      );
      setFrames(next);
      setStep(0);
      setPlaying(next.length > 1);
      setRunStatus('idle');
      setMobilePanel('canvas');
    } catch (cause) {
      setRunStatus('error');
      setRunError(cause instanceof Error ? cause.message : String(cause));
    }
  }

  function appendFrames(next: LabFrame[]) {
    const prefix = frames.slice(0, step + 1);
    const numbered = next.map((item, index) => ({ ...item, id: prefix.length + index }));
    const combined = [...prefix, ...numbered];
    setFrames(combined);
    setStep(Math.min(prefix.length, combined.length - 1));
    setPlaying(next.length > 1);
    setMobilePanel('canvas');
  }

  function runStack(action: 'push' | 'pop' | 'peek') {
    const stack = frame.stack || [];
    if (action === 'push') appendFrames(pushStack(stack, value));
    if (action === 'pop') appendFrames(popStack(stack));
    if (action === 'peek') appendFrames(peekStack(stack));
  }

  function runHeap(action: 'insert' | 'extract' | 'heapify') {
    const heap = frame.heap || [];
    if (action === 'insert') appendFrames(insertHeap(heap, value));
    if (action === 'extract') appendFrames(extractHeap(heap));
    if (action === 'heapify') {
      const next = heapify(HEAPIFY_INPUT);
      setFrames(next);
      setStep(0);
      setPlaying(true);
      setMobilePanel('canvas');
    }
  }

  function runGraph(algorithm: GraphAlgorithm) {
    const next = traverseGraph(nodes, edges, start, algorithm, directed);
    setFrames(next);
    setStep(0);
    setPlaying(true);
    setMobilePanel('canvas');
  }

  function addNode() {
    if (nodes.length >= 10) return;
    rememberGraph();
    const id = String.fromCharCode(65 + nodes.length);
    const angle = (nodes.length / 10) * Math.PI * 2 - Math.PI / 2;
    const node = { id, x: 300 + Math.cos(angle) * 220, y: 185 + Math.sin(angle) * 135 };
    setNodes((current) => [...current, node]);
    setEdgeTo(id);
  }

  function addEdge() {
    const duplicate = edges.some(
      (edge) =>
        (edge.from === edgeFrom && edge.to === edgeTo) || (!directed && edge.from === edgeTo && edge.to === edgeFrom),
    );
    if (edgeFrom === edgeTo || duplicate) return;
    rememberGraph();
    setEdges((current) => [...current, { from: edgeFrom, to: edgeTo, weight: Math.max(0, edgeWeight) }]);
  }

  function deleteEdge(index: number) {
    rememberGraph();
    setEdges((current) => current.filter((_, edgeIndex) => edgeIndex !== index));
  }

  function rememberGraph(snapshot: GraphSnapshot = { nodes, edges }) {
    setEditHistory((current) => [
      ...current,
      {
        nodes: snapshot.nodes.map((node) => ({ ...node })),
        edges: snapshot.edges.map((edge) => ({ ...edge })),
      },
    ]);
  }

  function undoGraphEdit() {
    const previous = editHistory.at(-1);
    if (!previous) return;
    setNodes(previous.nodes);
    setEdges(previous.edges);
    setEditHistory((current) => current.slice(0, -1));
    setPlaying(false);
  }

  function beginNodeDrag() {
    dragSnapshot.current = { nodes, edges };
    dragMoved.current = false;
    setPlaying(false);
  }

  function moveNode(id: string, x: number, y: number) {
    dragMoved.current = true;
    setNodes((current) => current.map((node) => (node.id === id ? { ...node, x, y } : node)));
  }

  function endNodeDrag() {
    if (dragMoved.current && dragSnapshot.current) rememberGraph(dragSnapshot.current);
    dragSnapshot.current = null;
    dragMoved.current = false;
  }

  function resetGraph() {
    rememberGraph();
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setStart('A');
    setFrames(initialFrames('graph', 'bfs'));
    setStep(0);
    setPlaying(false);
  }

  return (
    <section className="structures-view panel">
      <div className="structures-heading">
        <div className="structure-tabs" aria-label={t('dataStructureLab')}>
          {(['stack', 'heap', 'graph'] as LabKind[]).map((item) => (
            <button key={item} type="button" className={lab === item ? 'active' : ''} onClick={() => switchLab(item)}>
              {item === 'heap' ? t('heapLabel') : item}
            </button>
          ))}
        </div>
        <div className="lab-mode-actions">
          <div className="lab-mode-switch" aria-label={t('labMode')}>
            <button
              type="button"
              className={!pythonMode ? 'active' : ''}
              onClick={() => {
                setPythonMode(false);
                setMobilePanel('controls');
              }}
            >
              {t('guided')}
            </button>
            <button
              type="button"
              className={pythonMode ? 'active' : ''}
              onClick={() => {
                setPythonMode(true);
                setMobilePanel('controls');
              }}
            >
              {t('python')}
            </button>
          </div>
          {pythonMode ? (
            <button className="run-lab-python" type="button" disabled={runStatus === 'running'} onClick={runPython}>
              <TerminalWindow size={14} />
              {runStatus === 'running' ? t('runningRun') : t('runPython')}
            </button>
          ) : null}
        </div>
      </div>

      <nav className="mobile-lab-nav" aria-label={t('mobileStructWorkspace')}>
        <button
          type="button"
          className={mobilePanel === 'controls' ? 'active' : ''}
          aria-pressed={mobilePanel === 'controls'}
          onClick={() => setMobilePanel('controls')}
        >
          {pythonMode ? t('mobileCode') : t('controls')}
        </button>
        <button
          type="button"
          className={mobilePanel === 'canvas' ? 'active' : ''}
          aria-pressed={mobilePanel === 'canvas'}
          onClick={() => setMobilePanel('canvas')}
        >
          {t('visual')}
        </button>
        <button
          type="button"
          className={mobilePanel === 'events' ? 'active' : ''}
          aria-pressed={mobilePanel === 'events'}
          onClick={() => setMobilePanel('events')}
        >
          {t('events')}
        </button>
      </nav>

      <div className={`structures-workspace${pythonMode ? ' python-mode' : ''} mobile-lab-${mobilePanel}`}>
        {pythonMode ? (
          <div className="lab-code-column">
            <CodePanel
              source={sources[lab]}
              currentLine={frame?.line || null}
              documentLabel={`${lab}.py`}
              libraryDocument={false}
              modified={sources[lab] !== LAB_PYTHON_EXAMPLES[lab]}
              signature={lab === 'graph' ? 'run(graph, start)' : `run(${lab})`}
              ariaLabel={`${lab} Python algorithm`}
              errorLine={pythonErrorLine(runError)}
              errorMessage={runError}
              onChange={changeSource}
              onRestoreDraft={restoreSource}
              onFork={() => undefined}
            />
            <div className="lab-code-actions">
              <span>{lab === 'graph' ? t('graphStateHint') : t('opsFramesHint')}</span>
              <button type="button" onClick={restoreSource}>
                {t('restore')}
              </button>
            </div>
            {runError ? (
              <div className="lab-runtime-error" role="alert">
                <strong>{t('pythonError')}</strong>
                <pre>{runError}</pre>
                <button type="button" onClick={() => setRunError(null)}>
                  {t('dismiss')}
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <aside className="lab-controls">
            <div className="panel-heading">
              <span>{t('controlsHeader')}</span>
              <span>{lab}</span>
            </div>
            {lab === 'stack' ? (
              <>
                <ControlValue value={value} onChange={setValue} />
                <div className="operation-list">
                  <button type="button" onClick={() => runStack('push')}>
                    <Plus size={15} />
                    <span>
                      <strong>{t('pushOp')}</strong>
                      <small>{t('pushHint')}</small>
                    </span>
                  </button>
                  <button type="button" onClick={() => runStack('pop')}>
                    <Minus size={15} />
                    <span>
                      <strong>{t('popOp')}</strong>
                      <small>{t('popHint')}</small>
                    </span>
                  </button>
                  <button type="button" onClick={() => runStack('peek')}>
                    <Eye size={15} />
                    <span>
                      <strong>{t('peekOp')}</strong>
                      <small>{t('peekHint')}</small>
                    </span>
                  </button>
                </div>
                <Invariant title={t('lifoInvariant')}>{t('lifoInvariantBody')}</Invariant>
              </>
            ) : null}

            {lab === 'heap' ? (
              <>
                <ControlValue value={value} onChange={setValue} />
                <div className="operation-list">
                  <button type="button" onClick={() => runHeap('insert')}>
                    <Plus size={15} />
                    <span>
                      <strong>{t('insertOp')}</strong>
                      <small>{t('insertHint')}</small>
                    </span>
                  </button>
                  <button type="button" onClick={() => runHeap('extract')}>
                    <Minus size={15} />
                    <span>
                      <strong>{t('extractMinOp')}</strong>
                      <small>{t('extractMinHint')}</small>
                    </span>
                  </button>
                  <button type="button" onClick={() => runHeap('heapify')}>
                    <TreeStructure size={15} />
                    <span>
                      <strong>{t('heapifyOp')}</strong>
                      <small>{t('heapifyHint')}</small>
                    </span>
                  </button>
                </div>
                <Invariant title={t('minHeapInvariant')}>{t('minHeapInvariantBody')}</Invariant>
              </>
            ) : null}

            {lab === 'graph' ? (
              <GraphControls
                nodes={nodes}
                start={start}
                edgeFrom={edgeFrom}
                edgeTo={edgeTo}
                edgeWeight={edgeWeight}
                edges={edges}
                directed={directed}
                onStart={setStart}
                onEdgeFrom={setEdgeFrom}
                onEdgeTo={setEdgeTo}
                onEdgeWeight={setEdgeWeight}
                onDirected={setDirected}
                onAddNode={addNode}
                onAddEdge={addEdge}
                onDeleteEdge={deleteEdge}
                onUndo={undoGraphEdit}
                canUndo={editHistory.length > 0}
                onReset={resetGraph}
                onRun={runGraph}
              />
            ) : null}
          </aside>
        )}

        <div className="lab-canvas">
          <div className="panel-heading">
            <span>{t('visualField')}</span>
            <span>{frame?.action || t('readyState')}</span>
          </div>
          {lab === 'stack' ? <StackCanvas stack={frame?.stack || []} action={frame?.action} /> : null}
          {lab === 'heap' ? <HeapCanvas heap={frame?.heap || []} active={frame?.activeIndices || []} /> : null}
          {lab === 'graph' ? (
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              state={frame?.graph}
              directed={directed}
              onDragStart={beginNodeDrag}
              onNodeMove={moveNode}
              onDragEnd={endNodeDrag}
            />
          ) : null}
        </div>

        <aside className="lab-inspector">
          <div className="panel-heading">
            <span>{t('eventStream')}</span>
            <span>{format('framesSuffix', { n: frames.length })}</span>
          </div>
          <div className="current-lab-event">
            <span>{String(step).padStart(3, '0')}</span>
            <strong>{frame?.action || t('readyState')}</strong>
            <p>{frame?.message}</p>
          </div>
          <div className="event-stream">
            {frames.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={step === index ? 'active' : ''}
                onClick={() => {
                  setStep(index);
                  setPlaying(false);
                }}
              >
                <span>{String(index).padStart(2, '0')}</span>
                <strong>{item.action}</strong>
                <small>{item.message}</small>
              </button>
            ))}
          </div>
          <div className="lab-state-summary">
            {lab === 'stack' ? (
              <>
                <span>{t('size')}</span>
                <strong>{frame?.stack?.length || 0}</strong>
                <small>
                  {t('topPrefix')} {frame?.stack?.at(-1) ?? t('emptyValue')}
                </small>
              </>
            ) : null}
            {lab === 'heap' ? (
              <>
                <span>{t('nodes')}</span>
                <strong>{frame?.heap?.length || 0}</strong>
                <small>
                  {t('minimumPrefix')} {frame?.heap?.[0] ?? t('emptyValue')}
                </small>
              </>
            ) : null}
            {lab === 'graph' ? (
              <>
                <span>{frame?.graph?.distances ? t('settled') : t('visited')}</span>
                <strong>{frame?.graph?.visited.length || 0}</strong>
                <small>
                  {frame?.graph?.distances
                    ? `${t('distancesPrefix')} ${formatDistances(frame.graph.distances)}`
                    : `${t('frontierPrefix')} ${frame?.graph?.frontier.join(', ') || t('emptyValue')}`}
                </small>
              </>
            ) : null}
          </div>
        </aside>
      </div>

      <LabTimeline
        step={step}
        maximum={Math.max(0, frames.length - 1)}
        playing={playing}
        speed={speed}
        onStep={setStep}
        onPlaying={setPlaying}
        onSpeed={setSpeed}
      />
    </section>
  );
}

function pythonErrorLine(message: string | null) {
  return parsePythonLine(message);
}

function initialFrames(lab: LabKind, preset: LabEntry['preset']): LabFrame[] {
  if (lab === 'stack') return [initialStackFrame(INITIAL_STACK)];
  if (lab === 'heap') {
    if (preset === 'heapify') return heapify(HEAPIFY_INPUT);
    if (preset === 'extract')
      return [
        initialHeapFrame(INITIAL_HEAP),
        ...extractHeap(INITIAL_HEAP).map((frame, index) => ({ ...frame, id: index + 1 })),
      ];
    return [initialHeapFrame(INITIAL_HEAP)];
  }
  const algorithm: GraphAlgorithm = preset === 'dfs' || preset === 'dijkstra' ? preset : 'bfs';
  return traverseGraph(INITIAL_NODES, INITIAL_EDGES, 'A', algorithm, false);
}

function ControlValue({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const { t } = useI18n();
  return (
    <label className="lab-value-control">
      <span>{t('operationValue')}</span>
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Invariant({ title, children }: { title: string; children: string }) {
  return (
    <div className="invariant-note">
      <span>{title}</span>
      <p>{children}</p>
    </div>
  );
}

function StackCanvas({ stack, action }: { stack: number[]; action?: string }) {
  const { t } = useI18n();
  return (
    <div className="stack-canvas">
      <span className="stack-top-label">{t('stackTop')}</span>
      <div className="stack-items">
        {[...stack].reverse().map((value, index) => (
          <div key={`${stack.length - index}-${value}`} className={index === 0 ? 'top' : ''}>
            <span>{value}</span>
            <small>
              {t('indexLabel')} {stack.length - index - 1}
            </small>
          </div>
        ))}
        {!stack.length ? <div className="empty-structure">{t('emptyStack')}</div> : null}
      </div>
      <div className="stack-base">
        <span>{t('lifoSuffix')}</span>
        <small>
          {action === 'push' ? t('topMovedUp') : action === 'pop' ? t('topMovedDown') : t('constantAccess')}
        </small>
      </div>
    </div>
  );
}

function heapPosition(index: number) {
  const level = Math.floor(Math.log2(index + 1));
  const first = 2 ** level - 1;
  const position = index - first;
  return { x: ((position + 1) / (2 ** level + 1)) * 720, y: 45 + level * 82 };
}

function HeapCanvas({ heap, active }: { heap: number[]; active: number[] }) {
  const { format } = useI18n();
  return (
    <div className="heap-canvas">
      <svg viewBox="0 0 720 330" role="img" aria-label={format('minHeapAria', { heap: heap.join(', ') })}>
        {heap.map((_, index) => {
          if (index === 0) return null;
          const child = heapPosition(index);
          const parent = heapPosition(Math.floor((index - 1) / 2));
          return <line key={`edge-${index}`} x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} />;
        })}
        {heap.map((value, index) => {
          const position = heapPosition(index);
          return (
            <g
              key={index}
              className={active.includes(index) ? 'active' : ''}
              transform={`translate(${position.x} ${position.y})`}
            >
              <circle r="24" />
              <text textAnchor="middle" dy="5">
                {value}
              </text>
              <text className="heap-node-index" textAnchor="middle" dy="41">
                {index}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="heap-array">
        {heap.map((value, index) => (
          <div key={index} className={active.includes(index) ? 'active' : ''}>
            <span>{value}</span>
            <small>{index}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDistances(distances: Record<string, number | null>) {
  return Object.entries(distances)
    .map(([id, distance]) => `${id}:${distance ?? '∞'}`)
    .join(' ');
}

function GraphCanvas({
  nodes,
  edges,
  state,
  directed,
  onDragStart,
  onNodeMove,
  onDragEnd,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  state?: LabFrame['graph'];
  directed: boolean;
  onDragStart: () => void;
  onNodeMove: (id: string, x: number, y: number) => void;
  onDragEnd: () => void;
}) {
  const { t } = useI18n();
  const visited = new Set(state?.visited || []);
  const frontier = new Set(state?.frontier || []);
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  return (
    <div className="graph-canvas">
      <svg viewBox="0 0 600 370" role="img" aria-label={t('interactiveGraph')}>
        <defs>
          <marker id="graph-arrow" markerWidth="7" markerHeight="7" refX="20" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" />
          </marker>
        </defs>
        {edges.map((edge, index) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;
          const traversed =
            (state?.traversedEdge?.from === edge.from && state.traversedEdge?.to === edge.to) ||
            (!directed && state?.traversedEdge?.from === edge.to && state.traversedEdge?.to === edge.from);
          const middleX = (from.x + to.x) / 2;
          const middleY = (from.y + to.y) / 2;
          return (
            <g key={index} className={`graph-edge${traversed ? ' traversed' : ''}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                markerEnd={directed ? 'url(#graph-arrow)' : undefined}
              />
              <circle className="edge-weight-bg" cx={middleX} cy={middleY} r="10" />
              <text className="edge-weight" x={middleX} y={middleY} textAnchor="middle" dy="3">
                {edge.weight ?? 1}
              </text>
            </g>
          );
        })}
        {nodes.map((node) => {
          const className =
            state?.current === node.id
              ? 'current'
              : visited.has(node.id)
                ? 'visited'
                : frontier.has(node.id)
                  ? 'frontier'
                  : '';
          const distance = state?.distances?.[node.id];
          return (
            <g
              key={node.id}
              className={`graph-node ${className}`}
              transform={`translate(${node.x} ${node.y})`}
              onPointerDown={(event) => {
                event.preventDefault();
                event.currentTarget.setPointerCapture(event.pointerId);
                onDragStart();
              }}
              onPointerMove={(event) => moveGraphPointer(event, node.id, onNodeMove)}
              onPointerUp={(event) => {
                event.currentTarget.releasePointerCapture(event.pointerId);
                onDragEnd();
              }}
              onPointerCancel={onDragEnd}
            >
              <circle r="25" />
              <text textAnchor="middle" dy="5">
                {node.id}
              </text>
              {state?.distances ? (
                <text className="node-distance" textAnchor="middle" dy="42">
                  {distance ?? '∞'}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <div className="graph-frontier">
        <span>{state?.distances ? t('priorityQueue') : t('frontier')}</span>
        <strong>{state?.frontier.join('  →  ') || t('emptyValue')}</strong>
      </div>
    </div>
  );
}

function moveGraphPointer(
  event: ReactPointerEvent<SVGGElement>,
  id: string,
  onNodeMove: (id: string, x: number, y: number) => void,
) {
  if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
  const svg = event.currentTarget.ownerSVGElement;
  if (!svg) return;
  const transform = svg.getScreenCTM();
  if (!transform) return;
  const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(transform.inverse());
  onNodeMove(id, Math.min(575, Math.max(25, point.x)), Math.min(345, Math.max(25, point.y)));
}

function GraphControls(props: {
  nodes: GraphNode[];
  start: string;
  edgeFrom: string;
  edgeTo: string;
  edgeWeight: number;
  edges: GraphEdge[];
  directed: boolean;
  onStart: (value: string) => void;
  onEdgeFrom: (value: string) => void;
  onEdgeTo: (value: string) => void;
  onEdgeWeight: (value: number) => void;
  onDirected: (value: boolean) => void;
  onAddNode: () => void;
  onAddEdge: () => void;
  onDeleteEdge: (index: number) => void;
  onUndo: () => void;
  canUndo: boolean;
  onReset: () => void;
  onRun: (algorithm: GraphAlgorithm) => void;
}) {
  const { t, format } = useI18n();
  return (
    <div className="graph-controls">
      <label>
        <span>{t('startNode')}</span>
        <select value={props.start} onChange={(event) => props.onStart(event.target.value)}>
          {props.nodes.map((node) => (
            <option key={node.id}>{node.id}</option>
          ))}
        </select>
      </label>
      <div className="graph-run-buttons">
        <button type="button" onClick={() => props.onRun('bfs')}>
          {t('runBfs')}
        </button>
        <button type="button" onClick={() => props.onRun('dfs')}>
          {t('runDfs')}
        </button>
        <button type="button" onClick={() => props.onRun('dijkstra')}>
          {t('runDijkstra')}
        </button>
      </div>
      <span className="control-section-label">{t('editGraph')}</span>
      <div className="edge-builder">
        <select value={props.edgeFrom} onChange={(event) => props.onEdgeFrom(event.target.value)}>
          {props.nodes.map((node) => (
            <option key={node.id}>{node.id}</option>
          ))}
        </select>
        <span>→</span>
        <select value={props.edgeTo} onChange={(event) => props.onEdgeTo(event.target.value)}>
          {props.nodes.map((node) => (
            <option key={node.id}>{node.id}</option>
          ))}
        </select>
        <input
          aria-label={t('edgeWeight')}
          title={t('edgeWeight')}
          type="number"
          min="0"
          step="1"
          value={props.edgeWeight}
          onChange={(event) => props.onEdgeWeight(Math.max(0, Number(event.target.value) || 0))}
        />
        <button type="button" onClick={props.onAddEdge}>
          {t('add')}
        </button>
      </div>
      <div className="graph-edge-list" aria-label={t('graphEdges')}>
        {props.edges.map((edge, index) => (
          <div key={`${edge.from}-${edge.to}-${index}`}>
            <span>
              {edge.from} → {edge.to}
            </span>
            <strong>{edge.weight ?? 1}</strong>
            <button
              type="button"
              aria-label={format('deleteEdgeAria', { from: edge.from, to: edge.to })}
              onClick={() => props.onDeleteEdge(index)}
            >
              <Trash size={12} />
            </button>
          </div>
        ))}
      </div>
      <label className="directed-toggle">
        <input type="checkbox" checked={props.directed} onChange={(event) => props.onDirected(event.target.checked)} />
        <span>{t('directedEdges')}</span>
      </label>
      <div className="graph-edit-actions">
        <button type="button" onClick={props.onAddNode}>
          <Plus size={13} /> {t('nodeOp')}
        </button>
        <button type="button" disabled={!props.canUndo} onClick={props.onUndo}>
          <ArrowCounterClockwise size={13} /> {t('undoOp')}
        </button>
        <button type="button" onClick={props.onReset}>
          <ArrowClockwise size={13} /> {t('resetOp')}
        </button>
      </div>
      <Invariant title={t('graphInvariant')}>{t('graphInvariantBody')}</Invariant>
    </div>
  );
}

function LabTimeline(props: {
  step: number;
  maximum: number;
  playing: boolean;
  speed: number;
  onStep: (step: number) => void;
  onPlaying: (playing: boolean) => void;
  onSpeed: (speed: number) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="lab-timeline">
      <button type="button" onClick={() => props.onStep(Math.max(0, props.step - 1))}>
        <CaretLeft size={15} />
      </button>
      <button className="lab-play" type="button" onClick={() => props.onPlaying(!props.playing)}>
        {props.playing ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
      </button>
      <button type="button" onClick={() => props.onStep(Math.min(props.maximum, props.step + 1))}>
        <CaretRight size={15} />
      </button>
      <span>
        {String(props.step).padStart(3, '0')} / {String(props.maximum).padStart(3, '0')}
      </span>
      <input
        type="range"
        min="0"
        max={props.maximum}
        value={props.step}
        onChange={(event) => props.onStep(Number(event.target.value))}
        aria-label={t('structureTimeline')}
      />
      <select value={props.speed} onChange={(event) => props.onSpeed(Number(event.target.value))}>
        {[0.5, 1, 2, 4].map((value) => (
          <option key={value} value={value}>
            {value}x
          </option>
        ))}
      </select>
    </div>
  );
}
