import json
import math
import random
import statistics
import sys
import time


MAX_LOCAL_VARIABLES = 40
MAX_LOCAL_DEPTH = 4
MAX_LOCAL_ITEMS = 50
MAX_LOCAL_STRING_LENGTH = 200


class TraceTimeout(Exception):
    pass


class TraceLimit(Exception):
    pass


class Recorder:
    def __init__(self, timeout_ms=3000, max_events=30000, capture=True):
        self.events = []
        self.counts = {"reads": 0, "writes": 0, "comparisons": 0, "calls": 0, "total": 0}
        self.values = None
        self.current_line = None
        self.capture = capture
        self.enabled = True
        self.deadline = time.perf_counter() + timeout_ms / 1000
        self.max_events = max_events
        self.operation_count = 0
        self.call_stack = []
        self.line_operation_counts = {}

    def check(self):
        if time.perf_counter() > self.deadline:
            raise TraceTimeout("Execution exceeded the time limit.")
        if self.operation_count >= self.max_events:
            raise TraceLimit("Execution produced too many operations.")

    def snapshot(self):
        if self.values is None:
            return []
        return [unwrap(item) for item in list.__iter__(self.values)]

    def position(self, item):
        if self.values is None or item is None:
            return None
        for index, candidate in enumerate(list.__iter__(self.values)):
            if candidate is item:
                return index
        return None

    def emit(self, event_type, **data):
        if not self.enabled:
            return
        self.check()
        if event_type == "read":
            self.counts["reads"] += 1
        elif event_type == "write":
            self.counts["writes"] += 1
        elif event_type == "compare":
            self.counts["comparisons"] += 1
        elif event_type == "call":
            self.counts["calls"] += 1
        if event_type not in ("line", "done", "return"):
            self.counts["total"] += 1
            self.operation_count += 1
        if self.capture:
            self.events.append({
                "seq": len(self.events),
                "type": event_type,
                "line": data.pop("line", self.current_line),
                "values": self.snapshot(),
                "callDepth": len(self.call_stack),
                "callStack": [name for _, name in self.call_stack],
                **data,
            })

    def enter_call(self, frame):
        self.call_stack.append((frame, frame.f_code.co_name))

    def leave_call(self, frame):
        for index in range(len(self.call_stack) - 1, -1, -1):
            if self.call_stack[index][0] is frame:
                del self.call_stack[index:]
                break

    def record_line(self, line):
        self.line_operation_counts[line] = self.line_operation_counts.get(line, 0) + 1


class TrackedValue:
    __slots__ = ("value", "recorder")

    def __init__(self, value, recorder):
        self.value = value
        self.recorder = recorder

    def compare(self, other, op, function):
        other_value = unwrap(other)
        self.recorder.emit(
            "compare",
            op=op,
            leftIndex=self.recorder.position(self),
            rightIndex=self.recorder.position(other) if isinstance(other, TrackedValue) else None,
            leftValue=self.value,
            rightValue=other_value,
        )
        return function(self.value, other_value)

    def calculate(self, other, function):
        return function(self.value, unwrap(other))

    def __lt__(self, other):
        return self.compare(other, "<", lambda left, right: left < right)

    def __le__(self, other):
        return self.compare(other, "<=", lambda left, right: left <= right)

    def __gt__(self, other):
        return self.compare(other, ">", lambda left, right: left > right)

    def __ge__(self, other):
        return self.compare(other, ">=", lambda left, right: left >= right)

    def __eq__(self, other):
        return self.compare(other, "==", lambda left, right: left == right)

    def __ne__(self, other):
        return self.compare(other, "!=", lambda left, right: left != right)

    def __add__(self, other):
        return self.calculate(other, lambda left, right: left + right)

    def __radd__(self, other):
        return self.calculate(other, lambda right, left: left + right)

    def __sub__(self, other):
        return self.calculate(other, lambda left, right: left - right)

    def __rsub__(self, other):
        return self.calculate(other, lambda right, left: left - right)

    def __mul__(self, other):
        return self.calculate(other, lambda left, right: left * right)

    def __rmul__(self, other):
        return self.calculate(other, lambda right, left: left * right)

    def __truediv__(self, other):
        return self.calculate(other, lambda left, right: left / right)

    def __rtruediv__(self, other):
        return self.calculate(other, lambda right, left: left / right)

    def __floordiv__(self, other):
        return self.calculate(other, lambda left, right: left // right)

    def __rfloordiv__(self, other):
        return self.calculate(other, lambda right, left: left // right)

    def __mod__(self, other):
        return self.calculate(other, lambda left, right: left % right)

    def __rmod__(self, other):
        return self.calculate(other, lambda right, left: left % right)

    def __neg__(self):
        return -self.value

    def __abs__(self):
        return abs(self.value)

    def __index__(self):
        if isinstance(self.value, bool) or not isinstance(self.value, int):
            raise TypeError("value is not an integer")
        return self.value

    def __int__(self):
        return int(self.value)

    def __float__(self):
        return float(self.value)

    def __repr__(self):
        return repr(self.value)


class TrackedList(list):
    def __init__(self, values, recorder):
        super().__init__(TrackedValue(value, recorder) for value in values)
        self.recorder = recorder
        recorder.values = self

    def normalize_index(self, index):
        return index if index >= 0 else len(self) + index

    def tracked(self, value):
        return value if isinstance(value, TrackedValue) else TrackedValue(value, self.recorder)

    def __getitem__(self, index):
        if isinstance(index, slice):
            result = []
            for current in range(*index.indices(len(self))):
                result.append(self[current])
            return result
        current = self.normalize_index(index)
        item = list.__getitem__(self, index)
        self.recorder.emit("read", index=current)
        return item

    def __setitem__(self, index, value):
        if isinstance(index, slice):
            raise TypeError("Slice assignment is not supported in trace mode.")
        current = self.normalize_index(index)
        previous = unwrap(list.__getitem__(self, index))
        item = self.tracked(value)
        list.__setitem__(self, index, item)
        self.recorder.emit("write", index=current, previous=previous, next=unwrap(item))

    def __iter__(self):
        for index in range(len(self)):
            yield self[index]


def unwrap(value):
    return value.value if isinstance(value, TrackedValue) else value


def json_safe_value(value, depth=0, seen=None):
    if value is None or isinstance(value, (bool, int)):
        return value
    if isinstance(value, float):
        return value if math.isfinite(value) else repr(value)
    if isinstance(value, str):
        if len(value) <= MAX_LOCAL_STRING_LENGTH:
            return value
        return value[:MAX_LOCAL_STRING_LENGTH] + "..."
    if isinstance(value, TrackedValue):
        return json_safe_value(value.value, depth, seen)
    if depth >= MAX_LOCAL_DEPTH:
        return f"<{type(value).__name__}>"

    seen = set() if seen is None else seen
    identity = id(value)
    if identity in seen:
        return f"<recursive {type(value).__name__}>"

    if isinstance(value, (list, tuple, set, frozenset, range)):
        seen.add(identity)
        try:
            if isinstance(value, list):
                iterator = list.__iter__(value)
            elif isinstance(value, tuple):
                iterator = tuple.__iter__(value)
            elif isinstance(value, (set, frozenset)):
                iterator = iter(value)
            else:
                iterator = iter(value)
            result = []
            for index, item in enumerate(iterator):
                if index >= MAX_LOCAL_ITEMS:
                    result.append("<truncated>")
                    break
                result.append(json_safe_value(item, depth + 1, seen))
            return result
        except Exception:
            return f"<{type(value).__name__}>"
        finally:
            seen.discard(identity)

    if isinstance(value, dict):
        seen.add(identity)
        try:
            result = {}
            for index, (key, item) in enumerate(dict.items(value)):
                if index >= MAX_LOCAL_ITEMS:
                    result["<truncated>"] = True
                    break
                safe_key = key if isinstance(key, str) else json_safe_repr(key)
                result[safe_key[:MAX_LOCAL_STRING_LENGTH]] = json_safe_value(item, depth + 1, seen)
            return result
        except Exception:
            return f"<{type(value).__name__}>"
        finally:
            seen.discard(identity)

    return json_safe_repr(value)


def json_safe_repr(value):
    try:
        result = repr(value)
    except Exception:
        result = f"<{type(value).__name__}>"
    if len(result) > MAX_LOCAL_STRING_LENGTH:
        return result[:MAX_LOCAL_STRING_LENGTH] + "..."
    return result


def snapshot_locals(frame):
    result = {}
    try:
        local_items = frame.f_locals.items()
    except Exception:
        return result
    captured = 0
    for name, value in local_items:
        if name == "__builtins__":
            continue
        if captured >= MAX_LOCAL_VARIABLES:
            result["<truncated>"] = True
            break
        try:
            result[str(name)] = json_safe_value(value)
        except Exception:
            result[str(name)] = f"<{type(value).__name__}>"
        captured += 1
    return result


def raw_sequence(value):
    return [unwrap(item) for item in list.__iter__(value) if True] if isinstance(value, TrackedList) else [unwrap(item) for item in value]


def load_function(source, recorder=None):
    namespace = {"__name__": "__algoscope_user__"}
    code = compile(source, "user_code.py", "exec")

    def trace(frame, event, arg):
        if frame.f_code.co_filename != "user_code.py":
            return trace
        recorder.check()
        recorder.current_line = frame.f_lineno
        if event == "line":
            recorder.record_line(frame.f_lineno)
            recorder.emit(
                "line",
                line=frame.f_lineno,
                locals=snapshot_locals(frame) if recorder.capture else {},
            )
        elif event == "call" and frame.f_code.co_name != "<module>":
            recorder.enter_call(frame)
            recorder.emit(
                "call",
                line=frame.f_lineno,
                function=frame.f_code.co_name,
                locals=snapshot_locals(frame) if recorder.capture else {},
            )
        elif event == "return" and frame.f_code.co_name != "<module>":
            try:
                recorder.emit(
                    "return",
                    line=frame.f_lineno,
                    function=frame.f_code.co_name,
                    locals=snapshot_locals(frame) if recorder.capture else {},
                )
            finally:
                recorder.leave_call(frame)
        return trace

    if recorder:
        sys.settrace(trace)
    try:
        exec(code, namespace, namespace)
    finally:
        sys.settrace(None)
    function = namespace.get("sort")
    if not callable(function):
        raise TypeError("Define a function named sort(values).")
    return function, trace if recorder else None


def execute_solution(source, data, timeout_ms=4000):
    namespace = {"__name__": "__algoscope_solution__"}
    code = compile(source, "user_code.py", "exec")
    deadline = time.perf_counter() + timeout_ms / 1000

    def trace(frame, event, arg):
        if frame.f_code.co_filename == "user_code.py" and time.perf_counter() > deadline:
            raise TraceTimeout("Execution exceeded the time limit.")
        return trace

    sys.settrace(trace)
    try:
        exec(code, namespace, namespace)
        function = namespace.get("solve")
        if not callable(function):
            raise TypeError("Define a function named solve(data).")
        return function(data)
    finally:
        sys.settrace(None)


def run_instrumented(source, values, timeout_ms=3000, max_events=30000, capture=True):
    recorder = Recorder(timeout_ms, max_events, capture)
    tracked = TrackedList(values, recorder)
    function, trace = load_function(source, recorder)
    started = time.perf_counter()
    sys.settrace(trace)
    try:
        returned = function(tracked)
    finally:
        sys.settrace(None)
    elapsed_ms = (time.perf_counter() - started) * 1000
    recorder.enabled = False
    output = tracked if returned is None else returned
    result = raw_sequence(output)
    expected = sorted(values)
    if capture:
        recorder.enabled = True
        recorder.emit("done", line=None)
        recorder.enabled = False
    return {
        "result": result,
        "expected": expected,
        "correct": result == expected,
        "events": recorder.events,
        "metrics": recorder.counts,
        "lineOperationCounts": recorder.line_operation_counts,
        "elapsedMs": elapsed_ms,
    }


def generate_values(pattern, size, seed):
    values = list(range(1, size + 1))
    if pattern == "reversed":
        return list(reversed(values))
    if pattern == "sorted":
        return values
    if pattern == "duplicates":
        return [(value % max(2, size // 4)) + 1 for value in values]
    if pattern == "nearly":
        if size > 3:
            values[1], values[-2] = values[-2], values[1]
        return values
    random.Random(seed).shuffle(values)
    return values


def benchmark_once(source, values):
    function, _ = load_function(source)
    iterations = 1
    while True:
        sample = []
        returned = None
        started = time.perf_counter()
        for _ in range(iterations):
            sample = list(values)
            returned = function(sample)
        elapsed_ms = (time.perf_counter() - started) * 1000
        result = sample if returned is None else list(returned)
        if result != sorted(values):
            raise ValueError(f"Incorrect result for input size {len(values)}.")
        if elapsed_ms >= 8 or iterations >= 4096:
            return elapsed_ms / iterations
        iterations *= 2


class LabRecorder:
    def __init__(self, domain, timeout_ms=3000, max_events=10000):
        self.domain = domain
        self.frames = []
        self.current_line = None
        self.deadline = time.perf_counter() + timeout_ms / 1000
        self.max_events = max_events

    def check(self):
        if time.perf_counter() > self.deadline:
            raise TraceTimeout("Execution exceeded the time limit.")
        if len(self.frames) >= self.max_events:
            raise TraceLimit("Execution produced too many operations.")

    def emit(self, action, message, **state):
        self.check()
        self.frames.append({
            "id": len(self.frames),
            "domain": self.domain,
            "action": action,
            "message": message,
            "line": self.current_line,
            **state,
        })


class TrackedStack:
    def __init__(self, values, recorder):
        self._values = [int(value) for value in values]
        self._recorder = recorder
        recorder.emit("initial", "Initial stack", stack=list(self._values))

    def push(self, value):
        value = int(value)
        self._values.append(value)
        self._recorder.emit("push", f"Push {value} onto the top", stack=list(self._values))

    def pop(self):
        if not self._values:
            self._recorder.emit("underflow", "Cannot pop: the stack is empty", stack=[])
            return None
        value = self._values.pop()
        self._recorder.emit("pop", f"Pop {value} from the top", stack=list(self._values))
        return value

    def peek(self):
        if not self._values:
            self._recorder.emit("underflow", "Cannot peek: the stack is empty", stack=[])
            return None
        value = self._values[-1]
        self._recorder.emit("peek", f"Peek returns {value}", stack=list(self._values))
        return value

    def __len__(self):
        return len(self._values)


class TrackedMinHeap:
    def __init__(self, values, recorder):
        self._values = []
        self._recorder = recorder
        for value in values:
            self._values.append(int(value))
        self._heapify(capture=False)
        recorder.emit("initial", "Initial min heap", heap=list(self._values))

    def _swap(self, left, right, action, message):
        self._values[left], self._values[right] = self._values[right], self._values[left]
        self._recorder.emit(
            action,
            message,
            heap=list(self._values),
            activeIndices=[left, right],
        )

    def _sift_down(self, index, capture=True):
        while True:
            smallest = index
            left = index * 2 + 1
            right = left + 1
            if left < len(self._values) and self._values[left] < self._values[smallest]:
                smallest = left
            if right < len(self._values) and self._values[right] < self._values[smallest]:
                smallest = right
            if smallest == index:
                return
            if capture:
                self._swap(index, smallest, "sift-down", f"Swap indices {index} and {smallest}")
            else:
                self._values[index], self._values[smallest] = self._values[smallest], self._values[index]
            index = smallest

    def _heapify(self, capture=True):
        if capture:
            self._recorder.emit("heapify", "Start bottom-up heapify", heap=list(self._values))
        for index in range(len(self._values) // 2 - 1, -1, -1):
            self._sift_down(index, capture)
        if capture:
            self._recorder.emit("heapified", "Heap invariant restored", heap=list(self._values))

    def insert(self, value):
        value = int(value)
        self._values.append(value)
        index = len(self._values) - 1
        self._recorder.emit("insert", f"Append {value} at index {index}", heap=list(self._values), activeIndices=[index])
        while index > 0:
            parent = (index - 1) // 2
            if self._values[parent] <= self._values[index]:
                break
            self._swap(parent, index, "sift-up", f"Swap {self._values[index]} with parent {self._values[parent]}")
            index = parent

    def extract_min(self):
        if not self._values:
            self._recorder.emit("underflow", "Cannot extract: the heap is empty", heap=[])
            return None
        minimum = self._values[0]
        tail = self._values.pop()
        if self._values:
            self._values[0] = tail
            self._recorder.emit("extract", f"Extract {minimum}; move {tail} to the root", heap=list(self._values), activeIndices=[0])
            self._sift_down(0)
        else:
            self._recorder.emit("extract", f"Extract the final value {minimum}", heap=[])
        return minimum

    def heapify(self, values=None):
        if values is not None:
            self._values = [int(value) for value in values]
        self._heapify()

    def __len__(self):
        return len(self._values)


class TrackedGraph:
    def __init__(self, nodes, edges, start, directed, recorder):
        self._nodes = [str(node["id"]) for node in nodes]
        self._edges = [{"from": str(edge["from"]), "to": str(edge["to"])} for edge in edges]
        self._start = str(start)
        self._directed = bool(directed)
        self._visited = []
        self._recorder = recorder
        self._emit("initial", f"Ready at start vertex {self._start}", [], None, None)

    @property
    def start(self):
        return self._start

    def nodes(self):
        return list(self._nodes)

    def neighbors(self, node):
        node = str(node)
        result = []
        for edge in self._edges:
            if edge["from"] == node:
                result.append(edge["to"])
            elif not self._directed and edge["to"] == node:
                result.append(edge["from"])
        return result

    def _edge(self, from_node, to_node):
        if from_node is None or to_node is None:
            return None
        return {"from": str(from_node), "to": str(to_node)}

    def _emit(self, action, message, frontier, current, edge):
        self._recorder.emit(action, message, graph={
            "visited": list(self._visited),
            "frontier": [str(node) for node in frontier],
            "current": None if current is None else str(current),
            "traversedEdge": edge,
        })

    def visit(self, node, frontier=(), from_node=None):
        node = str(node)
        if node not in self._nodes:
            raise ValueError(f"Unknown graph vertex: {node}")
        if node not in self._visited:
            self._visited.append(node)
        self._emit("visit", f"Visit vertex {node}", frontier, node, self._edge(from_node, node))

    def frontier(self, values, action="frontier", current=None, from_node=None):
        current = None if current is None else str(current)
        label = "Update frontier" if current is None else f"Add {current} to the frontier"
        self._emit(str(action), label, values, current, self._edge(from_node, current))


def load_lab_function(source, recorder):
    namespace = {"__name__": "__algoscope_user__"}
    code = compile(source, "user_code.py", "exec")

    def trace(frame, event, arg):
        if frame.f_code.co_filename == "user_code.py":
            recorder.check()
            recorder.current_line = frame.f_lineno
        return trace

    sys.settrace(trace)
    try:
        exec(code, namespace, namespace)
    finally:
        sys.settrace(None)
    function = namespace.get("run")
    if not callable(function):
        raise TypeError("Define a function named run(...).")
    return function, trace


def __algoscope_visualize_lab(request_json):
    request = json.loads(request_json)
    domain = request["lab"]
    timeout_ms = min(int(request.get("timeoutMs", 3000)), 10000)
    recorder = LabRecorder(domain, timeout_ms)
    function, trace = load_lab_function(request["source"], recorder)
    if domain == "stack":
        argument = TrackedStack(request.get("initial", []), recorder)
        arguments = (argument,)
    elif domain == "heap":
        argument = TrackedMinHeap(request.get("initial", []), recorder)
        arguments = (argument,)
    elif domain == "graph":
        graph = request.get("graph") or {}
        argument = TrackedGraph(
            graph.get("nodes", []),
            graph.get("edges", []),
            graph.get("start", ""),
            graph.get("directed", False),
            recorder,
        )
        arguments = (argument, argument.start)
    else:
        raise ValueError(f"Unknown lab domain: {domain}")
    sys.settrace(trace)
    try:
        function(*arguments)
    finally:
        sys.settrace(None)
    return json.dumps({"type": "lab-result", "frames": recorder.frames}, allow_nan=False)


def __algoscope_trace(request_json):
    request = json.loads(request_json)
    payload = run_instrumented(
        request["source"],
        request["values"],
        min(int(request.get("timeoutMs", 3000)), 10000),
        min(int(request.get("maxEvents", 30000)), 100000),
        True,
    )
    return json.dumps({"type": "trace-result", **payload}, allow_nan=False)


def __algoscope_analyze(request_json):
    request = json.loads(request_json)
    source = request["source"]
    timeout_ms = min(int(request.get("timeoutMs", 8000)), 20000)
    deadline = time.perf_counter() + timeout_ms / 1000
    cases = []
    for pattern in request["patterns"]:
        points = []
        for size in request["sizes"]:
            if time.perf_counter() > deadline:
                raise TraceTimeout("Complexity analysis exceeded the time limit.")
            values = generate_values(pattern, int(size), int(size) * 97)
            traced = run_instrumented(source, values, timeout_ms, 500000, False)
            if not traced["correct"]:
                raise ValueError(f"Incorrect result for {pattern} input of size {size}.")
            timings = [benchmark_once(source, values) for _ in range(3)]
            points.append({
                "n": size,
                "elapsedMs": statistics.median(timings),
                **traced["metrics"],
            })
        cases.append({"name": pattern, "points": points})
    return json.dumps({"type": "analysis-result", "cases": cases}, allow_nan=False)


def __algoscope_measure(request_json):
    request = json.loads(request_json)
    repeats = max(3, min(int(request.get("repeats", 7)), 11))
    samples = [benchmark_once(request["source"], request["values"]) for _ in range(repeats)]
    return json.dumps({
        "type": "measure-result",
        "elapsedMs": statistics.median(samples),
        "samples": samples,
    }, allow_nan=False)


def __algoscope_execute(request_json):
    request = json.loads(request_json)
    timeout_ms = min(int(request.get("timeoutMs", 4000)), 10000)
    result = execute_solution(request["source"], request.get("data"), timeout_ms)
    return json.dumps({"type": "execute-result", "result": result}, allow_nan=False)
