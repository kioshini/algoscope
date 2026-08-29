export const javaSources: Record<string, string> = {
  bubble: `public static void bubbleSort(int[] values) {
    for (int end = values.length - 1; end > 0; end--) {
        boolean swapped = false;
        for (int i = 0; i < end; i++) {
            if (values[i] > values[i + 1]) {
                int temporary = values[i];
                values[i] = values[i + 1];
                values[i + 1] = temporary;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
  quick: `public static void quickSort(int[] values) {
    quickSort(values, 0, values.length - 1);
}

private static void quickSort(int[] values, int low, int high) {
    if (low >= high) return;
    int pivot = values[high];
    int split = low;
    for (int i = low; i < high; i++) {
        if (values[i] < pivot) {
            int temporary = values[i]; values[i] = values[split]; values[split++] = temporary;
        }
    }
    int temporary = values[split]; values[split] = values[high]; values[high] = temporary;
    quickSort(values, low, split - 1); quickSort(values, split + 1, high);
}`,
  merge: `public static void mergeSort(int[] values) {
    int[] buffer = new int[values.length]; mergeSort(values, buffer, 0, values.length);
}

private static void mergeSort(int[] values, int[] buffer, int start, int end) {
    if (end - start < 2) return;
    int middle = (start + end) / 2; mergeSort(values, buffer, start, middle); mergeSort(values, buffer, middle, end);
    int left = start, right = middle, next = start;
    while (left < middle || right < end) buffer[next++] = right == end || (left < middle && values[left] <= values[right]) ? values[left++] : values[right++];
    System.arraycopy(buffer, start, values, start, end - start);
}`,
  'search-binary-first': `public static int binarySearch(int[] values, int target) {
    int low = 0, high = values.length - 1, result = -1;
    while (low <= high) { int middle = low + (high - low) / 2; if (values[middle] >= target) { if (values[middle] == target) result = middle; high = middle - 1; } else low = middle + 1; }
    return result;
}`,
  'breadth-first-search': `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;
import java.util.Queue;

public static List<Integer> breadthFirstSearch(List<List<Integer>> graph, int start) {
    List<Integer> order = new ArrayList<>(); Queue<Integer> queue = new ArrayDeque<>(); boolean[] seen = new boolean[graph.size()];
    queue.add(start); seen[start] = true;
    while (!queue.isEmpty()) { int vertex = queue.remove(); order.add(vertex); for (int next : graph.get(vertex)) if (!seen[next]) { seen[next] = true; queue.add(next); } }
    return order;
}`,
  kmp: `public static int kmpSearch(String text, String pattern) {
    if (pattern.isEmpty()) return 0; int[] table = new int[pattern.length()];
    for (int i = 1, matched = 0; i < pattern.length();) if (pattern.charAt(i) == pattern.charAt(matched)) table[i++] = ++matched; else if (matched > 0) matched = table[matched - 1]; else table[i++] = 0;
    for (int i = 0, matched = 0; i < text.length();) { if (text.charAt(i) == pattern.charAt(matched)) { i++; matched++; if (matched == pattern.length()) return i - matched; } else if (matched > 0) matched = table[matched - 1]; else i++; }
    return -1;
}`,
  'fibonacci-tabulation': `public static long fibonacciTabulation(int n) {
    if (n < 0) throw new IllegalArgumentException("n must be nonnegative"); long[] table = new long[n + 1];
    if (n > 0) table[1] = 1; for (int i = 2; i <= n; i++) table[i] = table[i - 1] + table[i - 2]; return table[n];
}`,
  selection: `public static void selectionSort(int[] values) {
    for (int start = 0; start < values.length - 1; start++) {
        int minimum = start;
        for (int index = start + 1; index < values.length; index++) if (values[index] < values[minimum]) minimum = index;
        if (minimum != start) { int temporary = values[start]; values[start] = values[minimum]; values[minimum] = temporary; }
    }
}`,
  insertion: `public static void insertionSort(int[] values) {
    for (int index = 1; index < values.length; index++) {
        int item = values[index]; int position = index - 1;
        while (position >= 0 && item < values[position]) { values[position + 1] = values[position]; position--; }
        values[position + 1] = item;
    }
}`,
  cocktail: `public static void cocktailSort(int[] values) {
    int lower = 0, upper = values.length - 1; boolean changed = true;
    while (changed && lower < upper) {
        changed = false;
        for (int index = lower; index < upper; index++) if (values[index + 1] < values[index]) { int temporary = values[index]; values[index] = values[index + 1]; values[index + 1] = temporary; changed = true; }
        upper--; if (!changed) break;
        changed = false;
        for (int index = upper; index > lower; index--) if (values[index] < values[index - 1]) { int temporary = values[index]; values[index] = values[index - 1]; values[index - 1] = temporary; changed = true; }
        lower++;
    }
}`,
  gnome: `public static void gnomeSort(int[] values) {
    int index = 1;
    while (index < values.length) {
        if (index == 0 || !(values[index] < values[index - 1])) { index++; }
        else { int temporary = values[index]; values[index] = values[index - 1]; values[index - 1] = temporary; index--; }
    }
}`,
  shell: `public static void shellSort(int[] values) {
    int gap = values.length / 2;
    while (gap > 0) {
        for (int index = gap; index < values.length; index++) {
            int item = values[index]; int position = index;
            while (position >= gap && item < values[position - gap]) { values[position] = values[position - gap]; position -= gap; }
            values[position] = item;
        }
        gap /= 2;
    }
}`,
  heap: `public static void heapSort(int[] values) {
    for (int root = values.length / 2 - 1; root >= 0; root--) siftDown(values, root, values.length);
    for (int upper = values.length - 1; upper > 0; upper--) {
        int temporary = values[0]; values[0] = values[upper]; values[upper] = temporary;
        siftDown(values, 0, upper);
    }
}

private static void siftDown(int[] values, int root, int upper) {
    while (2 * root + 1 < upper) {
        int child = 2 * root + 1;
        if (child + 1 < upper && values[child] < values[child + 1]) child++;
        if (!(values[root] < values[child])) break;
        int temporary = values[root]; values[root] = values[child]; values[child] = temporary;
        root = child;
    }
}`,
  cycle: `public static void cycleSort(int[] values) {
    for (int cycleStart = 0; cycleStart < values.length - 1; cycleStart++) {
        int item = values[cycleStart]; int position = cycleStart;
        for (int index = cycleStart + 1; index < values.length; index++) if (values[index] < item) position++;
        if (position == cycleStart) continue;
        while (item == values[position]) position++;
        int displaced = values[position]; values[position] = item; item = displaced;
        while (position != cycleStart) {
            position = cycleStart;
            for (int index = cycleStart + 1; index < values.length; index++) if (values[index] < item) position++;
            while (item == values[position]) position++;
            displaced = values[position]; values[position] = item; item = displaced;
        }
    }
}`,
  comb: `public static void combSort(int[] values) {
    int gap = values.length; boolean swapped = true;
    while (gap > 1 || swapped) {
        gap = Math.max(1, (gap * 10) / 13); swapped = false;
        for (int index = 0; index < values.length - gap; index++) {
            int other = index + gap;
            if (values[index] > values[other]) { int temporary = values[index]; values[index] = values[other]; values[other] = temporary; swapped = true; }
        }
    }
}`,
  'odd-even': `public static void oddEvenSort(int[] values) {
    boolean changed = true;
    while (changed) {
        changed = false;
        for (int phase = 0; phase < 2; phase++) {
            int start = phase == 0 ? 1 : 0;
            for (int index = start; index < values.length - 1; index += 2) if (values[index] > values[index + 1]) { int temporary = values[index]; values[index] = values[index + 1]; values[index + 1] = temporary; changed = true; }
        }
    }
}`,
  pancake: `public static void pancakeSort(int[] values) {
    for (int size = values.length; size > 1; size--) {
        int maximum = 0;
        for (int index = 1; index < size; index++) if (values[index] > values[maximum]) maximum = index;
        if (maximum == size - 1) continue;
        if (maximum != 0) flip(values, maximum);
        flip(values, size - 1);
    }
}

private static void flip(int[] values, int end) {
    int left = 0;
    while (left < end) { int temporary = values[left]; values[left] = values[end]; values[end] = temporary; left++; end--; }
}`,
  'binary-insertion': `public static void binaryInsertionSort(int[] values) {
    for (int index = 1; index < values.length; index++) {
        int current = values[index]; int left = 0, right = index;
        while (left < right) { int middle = left + (right - left) / 2; if (current < values[middle]) right = middle; else left = middle + 1; }
        int position = index;
        while (position > left) { values[position] = values[position - 1]; position--; }
        values[left] = current;
    }
}`,
  'three-way-quick': `public static void threeWayQuickSort(int[] values) {
    threeWayQuickSort(values, 0, values.length - 1);
}

private static void threeWayQuickSort(int[] values, int lower, int upper) {
    if (lower >= upper) return;
    int pivot = values[lower]; int less = lower; int index = lower + 1; int greater = upper;
    while (index <= greater) {
        if (values[index] < pivot) { int temporary = values[less]; values[less] = values[index]; values[index] = temporary; less++; index++; }
        else if (pivot < values[index]) { int temporary = values[index]; values[index] = values[greater]; values[greater] = temporary; greater--; }
        else index++;
    }
    threeWayQuickSort(values, lower, less - 1); threeWayQuickSort(values, greater + 1, upper);
}`,
  'natural-merge': `public static void naturalMergeSort(int[] values) {
    int length = values.length; if (length < 2) return;
    List<int[]> runs = new ArrayList<>();
    int start = 0;
    for (int index = 1; index < length; index++) if (values[index] < values[index - 1]) { runs.add(new int[]{start, index}); start = index; }
    runs.add(new int[]{start, length});
    while (runs.size() > 1) {
        List<int[]> merged = new ArrayList<>();
        for (int runIndex = 0; runIndex < runs.size(); runIndex += 2) {
            if (runIndex + 1 >= runs.size()) { merged.add(runs.get(runIndex)); break; }
            int left = runs.get(runIndex)[0]; int middle = runs.get(runIndex)[1]; int right = runs.get(runIndex + 1)[1];
            int[] buffer = new int[right - left];
            int first = left, second = middle, destination = 0;
            while (first < middle && second < right) buffer[destination++] = !(values[second] < values[first]) ? values[first++] : values[second++];
            while (first < middle) buffer[destination++] = values[first++];
            while (second < right) buffer[destination++] = values[second++];
            for (int offset = 0; offset < buffer.length; offset++) values[left + offset] = buffer[offset];
            merged.add(new int[]{left, right});
        }
        runs = merged;
    }
}`,
  'hoare-quick': `public static void hoareQuickSort(int[] values) {
    hoareQuickSort(values, 0, values.length - 1);
}

private static void hoareQuickSort(int[] values, int lower, int upper) {
    if (lower >= upper) return;
    int pivot = values[(lower + upper) / 2]; int left = lower; int right = upper;
    while (left <= right) {
        while (values[left] < pivot) left++;
        while (pivot < values[right]) right--;
        if (left <= right) { int temporary = values[left]; values[left] = values[right]; values[right] = temporary; left++; right--; }
    }
    hoareQuickSort(values, lower, right); hoareQuickSort(values, left, upper);
}`,
  'dual-pivot-quick': `public static void dualPivotQuickSort(int[] values) {
    dualPivotQuickSort(values, 0, values.length - 1);
}

private static void dualPivotQuickSort(int[] values, int lower, int upper) {
    if (lower >= upper) return;
    if (values[upper] < values[lower]) { int temporary = values[lower]; values[lower] = values[upper]; values[upper] = temporary; }
    int leftPivot = values[lower]; int rightPivot = values[upper];
    int less = lower + 1; int greater = upper - 1; int index = less;
    while (index <= greater) {
        if (values[index] < leftPivot) { int temporary = values[index]; values[index] = values[less]; values[less] = temporary; less++; }
        else if (rightPivot < values[index]) {
            while (index < greater && rightPivot < values[greater]) greater--;
            int temporary = values[index]; values[index] = values[greater]; values[greater] = temporary; greater--;
            if (values[index] < leftPivot) { temporary = values[index]; values[index] = values[less]; values[less] = temporary; less++; }
        }
        index++;
    }
    less--; greater++;
    int temporary = values[lower]; values[lower] = values[less]; values[less] = temporary;
    temporary = values[upper]; values[upper] = values[greater]; values[greater] = temporary;
    dualPivotQuickSort(values, lower, less - 1);
    if (leftPivot < rightPivot) dualPivotQuickSort(values, less + 1, greater - 1);
    dualPivotQuickSort(values, greater + 1, upper);
}`,
  'median-three-quick': `public static void medianThreeQuickSort(int[] values) {
    medianThreeQuickSort(values, 0, values.length - 1);
}

private static void medianThreeQuickSort(int[] values, int lower, int upper) {
    if (lower >= upper) return;
    int middle = (lower + upper) / 2;
    if (values[middle] < values[lower]) { int temporary = values[lower]; values[lower] = values[middle]; values[middle] = temporary; }
    if (values[upper] < values[lower]) { int temporary = values[lower]; values[lower] = values[upper]; values[upper] = temporary; }
    if (values[upper] < values[middle]) { int temporary = values[middle]; values[middle] = values[upper]; values[upper] = temporary; }
    int pivot = values[middle]; int left = lower; int right = upper;
    while (left <= right) {
        while (values[left] < pivot) left++;
        while (pivot < values[right]) right--;
        if (left <= right) { int temporary = values[left]; values[left] = values[right]; values[right] = temporary; left++; right--; }
    }
    medianThreeQuickSort(values, lower, right); medianThreeQuickSort(values, left, upper);
}`,
  'bottom-up-merge': `public static void bottomUpMergeSort(int[] values) {
    int length = values.length; int[] auxiliary = new int[length];
    for (int width = 1; width < length; width *= 2) {
        for (int lower = 0; lower < length; lower += 2 * width) {
            int middle = Math.min(lower + width, length); int upper = Math.min(lower + 2 * width, length);
            for (int index = lower; index < upper; index++) auxiliary[index] = values[index];
            int left = lower, right = middle, destination = lower;
            while (destination < upper) {
                if (left >= middle) values[destination] = auxiliary[right++];
                else if (right >= upper) values[destination] = auxiliary[left++];
                else if (auxiliary[right] < auxiliary[left]) values[destination] = auxiliary[right++];
                else values[destination] = auxiliary[left++];
                destination++;
            }
        }
    }
}`,
  'in-place-merge': `public static void inPlaceMergeSort(int[] values) {
    inPlaceMergeSort(values, 0, values.length);
}

private static void inPlaceMergeSort(int[] values, int lower, int upper) {
    if (upper - lower < 2) return;
    int middle = (lower + upper) / 2;
    inPlaceMergeSort(values, lower, middle); inPlaceMergeSort(values, middle, upper);
    mergeShift(values, lower, middle, upper);
}

private static void mergeShift(int[] values, int lower, int middle, int upper) {
    int left = lower, right = middle;
    while (left < right && right < upper) {
        if (!(values[right] < values[left])) { left++; continue; }
        int temporary = values[right]; int index = right;
        while (index > left) { values[index] = values[index - 1]; index--; }
        values[left] = temporary;
        left++; right++;
    }
}`,
  intro: `public static void introSort(int[] values) {
    int length = values.length; if (length < 2) return;
    int depthLimit = 0; for (int remaining = length; remaining > 1; remaining /= 2) depthLimit += 2;
    int threshold = 16;
    List<int[]> pending = new ArrayList<>(); pending.add(new int[]{0, length, depthLimit});
    while (!pending.isEmpty()) {
        int[] range = pending.remove(pending.size() - 1);
        int lower = range[0], upper = range[1], depth = range[2];
        while (upper - lower > threshold) {
            if (depth == 0) { introHeapSort(values, lower, upper); lower = upper; break; }
            depth--;
            int middle = lower + (upper - lower) / 2; int last = upper - 1;
            if (values[middle] < values[lower]) introSwap(values, middle, lower);
            if (values[last] < values[middle]) introSwap(values, last, middle);
            if (values[middle] < values[lower]) introSwap(values, middle, lower);
            introSwap(values, middle, last);
            int pivot = values[last]; int boundary = lower;
            for (int index = lower; index < last; index++) if (values[index] < pivot) introSwap(values, boundary++, index);
            introSwap(values, boundary, last);
            if (boundary - lower < upper - boundary - 1) { pending.add(new int[]{boundary + 1, upper, depth}); upper = boundary; }
            else { pending.add(new int[]{lower, boundary, depth}); lower = boundary + 1; }
        }
        if (lower < upper) introInsertionSort(values, lower, upper);
    }
}

private static void introSwap(int[] values, int first, int second) { int temporary = values[first]; values[first] = values[second]; values[second] = temporary; }

private static void introInsertionSort(int[] values, int lower, int upper) {
    for (int index = lower + 1; index < upper; index++) {
        int item = values[index]; int position = index;
        while (position > lower && item < values[position - 1]) { values[position] = values[position - 1]; position--; }
        values[position] = item;
    }
}

private static void introHeapSort(int[] values, int lower, int upper) {
    int size = upper - lower;
    for (int root = size / 2 - 1; root >= 0; root--) introSiftDown(values, lower, root, size);
    for (int end = size - 1; end > 0; end--) { introSwap(values, lower, lower + end); introSiftDown(values, lower, 0, end); }
}

private static void introSiftDown(int[] values, int lower, int root, int count) {
    while (2 * root + 1 < count) {
        int child = 2 * root + 1;
        if (child + 1 < count && values[lower + child] < values[lower + child + 1]) child++;
        if (!(values[lower + root] < values[lower + child])) return;
        introSwap(values, lower + root, lower + child); root = child;
    }
}`,
  tim: `public static void timSort(int[] values) {
    int length = values.length; if (length < 2) return;
    int minrun = length; int remainder = 0;
    while (minrun >= 64) { remainder |= minrun & 1; minrun >>= 1; }
    minrun += remainder;
    int[] buffer = new int[length];
    List<int[]> runs = new ArrayList<>();
    int start = 0;
    while (start < length) {
        int end = start + 1;
        if (end < length) {
            if (values[end] < values[start]) { end++; while (end < length && values[end] < values[end - 1]) end++; timReverse(values, start, end); }
            else { end++; while (end < length && !(values[end] < values[end - 1])) end++; }
        }
        int forcedEnd = Math.min(start + minrun, length);
        if (end < forcedEnd) { timInsertionSort(values, start, forcedEnd, end); end = forcedEnd; }
        runs.add(new int[]{start, end - start});
        while (runs.size() > 1) {
            int count = runs.size();
            if (count >= 3 && runs.get(count - 3)[1] <= runs.get(count - 2)[1] + runs.get(count - 1)[1]) { if (runs.get(count - 3)[1] < runs.get(count - 1)[1]) timMergeAt(runs, values, buffer, count - 3); else timMergeAt(runs, values, buffer, count - 2); }
            else if (runs.get(count - 2)[1] <= runs.get(count - 1)[1]) timMergeAt(runs, values, buffer, count - 2);
            else break;
        }
        start = end;
    }
    while (runs.size() > 1) timMergeAt(runs, values, buffer, runs.size() - 2);
}

private static void timReverse(int[] values, int lower, int upper) {
    upper--; while (lower < upper) { int temporary = values[lower]; values[lower] = values[upper]; values[upper] = temporary; lower++; upper--; }
}

private static void timInsertionSort(int[] values, int lower, int upper, int start) {
    for (int index = start; index < upper; index++) {
        int item = values[index]; int position = index;
        while (position > lower && item < values[position - 1]) { values[position] = values[position - 1]; position--; }
        values[position] = item;
    }
}

private static void timMergeAt(List<int[]> runs, int[] values, int[] buffer, int index) {
    int left = runs.get(index)[0]; int leftSize = runs.get(index)[1]; int rightSize = runs.get(index + 1)[1];
    int middle = left + leftSize; int right = middle + rightSize;
    for (int position = left; position < middle; position++) buffer[position] = values[position];
    int first = left, second = middle, destination = left;
    while (first < middle && second < right) values[destination++] = values[second] < buffer[first] ? values[second++] : buffer[first++];
    while (first < middle) values[destination++] = buffer[first++];
    runs.set(index, new int[]{left, leftSize + rightSize});
    runs.remove(index + 1);
}`,
  tournament: `public static void tournamentSort(int[] values) {
    int length = values.length; if (length < 2) return;
    int[] contenders = Arrays.copyOf(values, length);
    int leafCount = 1; while (leafCount < length) leafCount *= 2;
    Integer[] tree = new Integer[2 * leafCount];
    for (int index = 0; index < length; index++) tree[leafCount + index] = index;
    for (int node = leafCount - 1; node >= 1; node--) tree[node] = tournamentWinner(contenders, tree[2 * node], tree[2 * node + 1]);
    for (int destination = 0; destination < length; destination++) {
        int champion = tree[1]; values[destination] = contenders[champion];
        int node = leafCount + champion; tree[node] = null; node /= 2;
        while (node != 0) { tree[node] = tournamentWinner(contenders, tree[2 * node], tree[2 * node + 1]); node /= 2; }
    }
}

private static Integer tournamentWinner(int[] contenders, Integer first, Integer second) {
    if (first == null) return second;
    if (second == null) return first;
    return contenders[second] < contenders[first] ? second : first;
}`,
  patience: `public static void patienceSort(int[] values) {
    int length = values.length; if (length < 2) return;
    List<List<Integer>> piles = new ArrayList<>();
    for (int value : values) {
        int lower = 0, upper = piles.size();
        while (lower < upper) { int middle = lower + (upper - lower) / 2; if (piles.get(middle).get(piles.get(middle).size() - 1) < value) lower = middle + 1; else upper = middle; }
        if (lower == piles.size()) { List<Integer> pile = new ArrayList<>(); pile.add(value); piles.add(pile); }
        else piles.get(lower).add(value);
    }
    PriorityQueue<Integer> heap = new PriorityQueue<>((first, second) -> { List<Integer> a = piles.get(first), b = piles.get(second); return Integer.compare(a.get(a.size() - 1), b.get(b.size() - 1)); });
    for (int index = 0; index < piles.size(); index++) heap.add(index);
    for (int destination = 0; destination < length; destination++) {
        int pileIndex = heap.remove(); List<Integer> pile = piles.get(pileIndex);
        values[destination] = pile.remove(pile.size() - 1);
        if (!pile.isEmpty()) heap.add(pileIndex);
    }
}`,
  tree: `public static void treeSort(int[] values) {
    int length = values.length; if (length < 2) return;
    int[] nodeValue = new int[length]; int[] left = new int[length]; int[] right = new int[length]; int[] count = new int[length];
    Arrays.fill(left, -1); Arrays.fill(right, -1); Arrays.fill(count, 1);
    nodeValue[0] = values[0]; int nodeCount = 1;
    for (int index = 1; index < length; index++) {
        int item = values[index]; int node = 0;
        while (true) {
            if (item < nodeValue[node]) { if (left[node] == -1) { left[node] = nodeCount; nodeValue[nodeCount] = item; nodeCount++; break; } node = left[node]; }
            else if (nodeValue[node] < item) { if (right[node] == -1) { right[node] = nodeCount; nodeValue[nodeCount] = item; nodeCount++; break; } node = right[node]; }
            else { count[node]++; break; }
        }
    }
    int[] stack = new int[length]; int top = 0; int node = 0; int destination = 0;
    while (top > 0 || node != -1) {
        while (node != -1) { stack[top++] = node; node = left[node]; }
        node = stack[--top];
        for (int times = 0; times < count[node]; times++) values[destination++] = nodeValue[node];
        node = right[node];
    }
}`,
  strand: `public static void strandSort(int[] values) {
    int length = values.length; if (length < 2) return;
    List<Integer> remaining = new ArrayList<>(); for (int value : values) remaining.add(value);
    List<Integer> result = new ArrayList<>();
    while (!remaining.isEmpty()) {
        List<Integer> strand = new ArrayList<>(); strand.add(remaining.remove(0));
        int index = 0;
        while (index < remaining.size()) { if (!(remaining.get(index) < strand.get(strand.size() - 1))) strand.add(remaining.remove(index)); else index++; }
        List<Integer> merged = new ArrayList<>();
        int resultIndex = 0, strandIndex = 0;
        while (resultIndex < result.size() && strandIndex < strand.size()) { if (!(strand.get(strandIndex) < result.get(resultIndex))) merged.add(result.get(resultIndex++)); else merged.add(strand.get(strandIndex++)); }
        while (resultIndex < result.size()) merged.add(result.get(resultIndex++));
        while (strandIndex < strand.size()) merged.add(strand.get(strandIndex++));
        result = merged;
    }
    for (int index = 0; index < length; index++) values[index] = result.get(index);
}`,
  counting: `public static void countingSort(int[] values) {
    int length = values.length; if (length == 0) return;
    int minimum = values[0], maximum = values[0];
    for (int index = 1; index < length; index++) { if (values[index] < minimum) minimum = values[index]; if (values[index] > maximum) maximum = values[index]; }
    long rangeSize = (long) maximum - minimum + 1;
    if (rangeSize > Math.max(1000000L, (long) length * 100)) {
        Map<Integer, List<Integer>> groups = new LinkedHashMap<>();
        List<Integer> orderedKeys = new ArrayList<>();
        for (int value : values) { if (!groups.containsKey(value)) { groups.put(value, new ArrayList<>()); orderedKeys.add(value); } groups.get(value).add(value); }
        Collections.sort(orderedKeys);
        int destination = 0;
        for (int key : orderedKeys) for (int value : groups.get(key)) values[destination++] = value;
        return;
    }
    int[] counts = new int[(int) rangeSize];
    for (int value : values) counts[value - minimum]++;
    for (int index = 1; index < counts.length; index++) counts[index] += counts[index - 1];
    int[] output = new int[length];
    for (int index = length - 1; index >= 0; index--) { int countIndex = values[index] - minimum; counts[countIndex]--; output[counts[countIndex]] = values[index]; }
    System.arraycopy(output, 0, values, 0, length);
}`,
  'radix-lsd': `public static void radixLsdSort(int[] values) {
    int length = values.length; if (length == 0) return;
    int minimum = values[0], maximum = values[0];
    for (int index = 1; index < length; index++) { if (values[index] < minimum) minimum = values[index]; if (values[index] > maximum) maximum = values[index]; }
    int[] keys = new int[length]; for (int index = 0; index < length; index++) keys[index] = values[index] - minimum;
    int largest = maximum - minimum; int[] items = Arrays.copyOf(values, length);
    for (long place = 1; largest / place > 0; place *= 10) {
        int[] counts = new int[10];
        for (int key : keys) counts[(int) ((key / place) % 10)]++;
        for (int index = 1; index < 10; index++) counts[index] += counts[index - 1];
        int[] nextItems = new int[length]; int[] nextKeys = new int[length];
        for (int index = length - 1; index >= 0; index--) {
            int digit = (int) ((keys[index] / place) % 10); counts[digit]--;
            int destination = counts[digit]; nextItems[destination] = items[index]; nextKeys[destination] = keys[index];
        }
        items = nextItems; keys = nextKeys;
    }
    System.arraycopy(items, 0, values, 0, length);
}`,
  bucket: `public static void bucketSort(int[] values) {
    int length = values.length; if (length < 2) return;
    int minimum = values[0], maximum = values[0];
    for (int index = 1; index < length; index++) { if (values[index] < minimum) minimum = values[index]; if (values[index] > maximum) maximum = values[index]; }
    if (minimum == maximum) return;
    int bucketCount = length;
    List<List<Integer>> buckets = new ArrayList<>(); for (int index = 0; index < bucketCount; index++) buckets.add(new ArrayList<>());
    long span = (long) maximum - minimum;
    for (int value : values) {
        int bucketIndex = (int) (((long) (value - minimum) * (bucketCount - 1)) / span);
        if (bucketIndex < 0) bucketIndex = 0; else if (bucketIndex >= bucketCount) bucketIndex = bucketCount - 1;
        buckets.get(bucketIndex).add(value);
    }
    for (List<Integer> bucket : buckets) for (int index = 1; index < bucket.size(); index++) { int item = bucket.get(index); int position = index; while (position > 0 && item < bucket.get(position - 1)) { bucket.set(position, bucket.get(position - 1)); position--; } bucket.set(position, item); }
    int destination = 0;
    for (List<Integer> bucket : buckets) for (int item : bucket) values[destination++] = item;
}`,
  'search-linear-first': `public static int linearSearch(int[] values, int target) {
    for (int index = 0; index < values.length; index++) if (values[index] == target) return index;
    return -1;
}`,
  'search-sentinel-first': `public static int sentinelSearch(int[] values, int target) {
    int length = values.length;
    int[] working = Arrays.copyOf(values, length + 1); working[length] = target;
    int index = 0;
    while (working[index] != target) index++;
    return index < length ? index : -1;
}`,
  'search-lower-bound': `public static int lowerBound(int[] values, int target) {
    int left = 0, right = values.length;
    while (left < right) { int middle = (left + right) / 2; if (values[middle] < target) left = middle + 1; else right = middle; }
    return left;
}`,
  'search-upper-bound': `public static int upperBound(int[] values, int target) {
    int left = 0, right = values.length;
    while (left < right) { int middle = (left + right) / 2; if (target < values[middle]) right = middle; else left = middle + 1; }
    return left;
}`,
  'search-jump-first': `public static int jumpSearch(int[] values, int target) {
    int length = values.length; if (length == 0) return -1;
    int step = Math.max(1, (int) Math.sqrt(length));
    int blockStart = 0, blockEnd = Math.min(step, length);
    while (values[blockEnd - 1] < target) {
        blockStart = blockEnd; if (blockStart >= length) return -1;
        blockEnd = Math.min(blockEnd + step, length);
    }
    for (int index = blockStart; index < blockEnd; index++) { if (values[index] == target) return index; if (target < values[index]) break; }
    return -1;
}`,
  'search-exponential-first': `public static int exponentialSearch(int[] values, int target) {
    int length = values.length; if (length == 0 || target < values[0]) return -1;
    if (values[0] == target) return 0;
    int bound = 1; while (bound < length && values[bound] < target) bound *= 2;
    int left = bound / 2, right = Math.min(bound, length - 1), result = -1;
    while (left <= right) { int middle = (left + right) / 2; if (values[middle] < target) left = middle + 1; else { if (values[middle] == target) result = middle; right = middle - 1; } }
    return result;
}`,
  'search-interpolation-first': `public static int interpolationSearch(int[] values, int target) {
    int low = 0, high = values.length - 1, result = -1;
    while (low <= high && values[low] <= target && target <= values[high]) {
        if (values[low] == values[high]) return values[low] == target ? low : result;
        int position = low + (int) ((long) (target - values[low]) * (high - low) / (values[high] - values[low]));
        position = Math.max(low, Math.min(position, high));
        if (values[position] < target) low = position + 1;
        else { if (values[position] == target) result = position; high = position - 1; }
    }
    return result;
}`,
  'search-fibonacci-first': `public static int fibonacciSearch(int[] values, int target) {
    int length = values.length;
    int smaller = 0, larger = 1, fibonacci = smaller + larger;
    while (fibonacci < length) { smaller = larger; larger = fibonacci; fibonacci = smaller + larger; }
    int offset = -1, result = -1;
    while (fibonacci > 1) {
        int index = Math.min(offset + smaller, length - 1);
        if (values[index] < target) { fibonacci = larger; larger = smaller; smaller = fibonacci - larger; offset = index; }
        else { if (values[index] == target) result = index; fibonacci = smaller; larger = larger - smaller; smaller = fibonacci - larger; }
    }
    int candidate = offset + 1;
    if (candidate < length && values[candidate] == target) result = candidate;
    return result;
}`,
  'search-quickselect-kth': `public static int quickselect(int[] values, int k) {
    if (k < 0 || k >= values.length) throw new IllegalArgumentException("k must be an index between 0 and len(values) - 1");
    int[] working = Arrays.copyOf(values, values.length);
    int left = 0, right = working.length - 1;
    while (left <= right) {
        int pivot = working[right]; int destination = left;
        for (int index = left; index < right; index++) if (working[index] <= pivot) { int temporary = working[index]; working[index] = working[destination]; working[destination++] = temporary; }
        int temporary = working[destination]; working[destination] = working[right]; working[right] = temporary;
        if (destination == k) return working[destination];
        if (destination < k) left = destination + 1; else right = destination - 1;
    }
    return -1;
}`,
  'depth-first-search': `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.List;

public static List<Integer> depthFirstSearch(List<List<Integer>> graph, int start) {
    List<Integer> order = new ArrayList<>(); boolean[] seen = new boolean[graph.size()]; ArrayDeque<Integer> stack = new ArrayDeque<>();
    stack.push(start);
    while (!stack.isEmpty()) { int vertex = stack.pop(); if (seen[vertex]) continue; seen[vertex] = true; order.add(vertex); for (int i = graph.get(vertex).size() - 1; i >= 0; i--) { int next = graph.get(vertex).get(i); if (!seen[next]) stack.push(next); } }
    return order;
}`,
  dijkstra: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

public static List<Integer> dijkstra(List<List<int[]>> graph, int start) {
    int size = graph.size(); long[] distances = new long[size]; int[] previous = new int[size];
    Arrays.fill(distances, Long.MAX_VALUE); Arrays.fill(previous, -1);
    distances[start] = 0;
    PriorityQueue<long[]> heap = new PriorityQueue<>(Comparator.comparingLong(pair -> pair[0]));
    heap.add(new long[]{0, start});
    while (!heap.isEmpty()) {
        long[] top = heap.remove(); int vertex = (int) top[1]; if (top[0] != distances[vertex]) continue;
        for (int[] edge : graph.get(vertex)) { int next = edge[0], weight = edge[1]; long candidate = distances[vertex] + weight; if (candidate < distances[next]) { distances[next] = candidate; previous[next] = vertex; heap.add(new long[]{candidate, next}); } }
    }
    return null;
}`,
  'bellman-ford': `import java.util.Arrays;

public static long[] bellmanFord(int nodeCount, int[][] edges, int start) {
    long[] distances = new long[nodeCount]; Arrays.fill(distances, Long.MAX_VALUE); distances[start] = 0;
    for (int pass = 0; pass < nodeCount - 1; pass++) {
        boolean changed = false;
        for (int[] edge : edges) { int left = edge[0], right = edge[1], weight = edge[2]; if (distances[left] != Long.MAX_VALUE && distances[left] + weight < distances[right]) { distances[right] = distances[left] + weight; changed = true; } }
        if (!changed) break;
    }
    for (int[] edge : edges) { int left = edge[0], right = edge[1], weight = edge[2]; if (distances[left] != Long.MAX_VALUE && distances[left] + weight < distances[right]) return new long[]{-1}; }
    return distances;
}`,
  'floyd-warshall': `import java.util.Arrays;

public static long[][] floydWarshall(int[][] graph) {
    int size = graph.length; long[][] distances = new long[size][];
    for (int left = 0; left < size; left++) { distances[left] = new long[size]; for (int right = 0; right < size; right++) distances[left][right] = left == right ? 0 : graph[left][right]; }
    for (int middle = 0; middle < size; middle++) for (int left = 0; left < size; left++) for (int right = 0; right < size; right++) { long candidate = distances[left][middle] + distances[middle][right]; if (candidate < distances[left][right]) distances[left][right] = candidate; }
    for (int node = 0; node < size; node++) if (distances[node][node] < 0) return new long[][]{};
    return distances;
}`,
  'a-star': `import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

public static List<Integer> aStar(List<List<int[]>> graph, double[] x, double[] y, int start, int goal) {
    int size = graph.size(); double[] g = new double[size]; int[] previous = new int[size];
    Arrays.fill(g, Double.POSITIVE_INFINITY); Arrays.fill(previous, -1); g[start] = 0;
    PriorityQueue<double[]> open = new PriorityQueue<>(Comparator.comparingDouble(pair -> pair[0]));
    open.add(new double[]{heuristic(x, y, start, goal), start});
    while (!open.isEmpty()) {
        double[] top = open.remove(); int vertex = (int) top[1]; if (vertex == goal) break; double distance = top[0] - heuristic(x, y, vertex, goal); if (distance != g[vertex]) continue;
        for (int[] edge : graph.get(vertex)) { int next = edge[0], weight = edge[1]; if (next == start) continue; double candidate = distance + weight; if (candidate < g[next]) { g[next] = candidate; previous[next] = vertex; open.add(new double[]{candidate + heuristic(x, y, next, goal), next}); } }
    }
    if (Double.isInfinite(g[goal])) return new ArrayList<>();
    List<Integer> path = new ArrayList<>(); for (int node = goal; node != -1; node = previous[node]) path.add(node);
    Collections.reverse(path); return path;
}

private static double heuristic(double[] x, double[] y, int node, int goal) {
    return Math.hypot(x[node] - x[goal], y[node] - y[goal]);
}`,
  'dfs-topological-sort': `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public static List<Integer> dfsTopologicalSort(List<List<Integer>> graph) {
    int size = graph.size(); int[] state = new int[size]; List<Integer> order = new ArrayList<>();
    for (int node = size - 1; node >= 0; node--) if (state[node] == 0) visitTopo(node, graph, state, order);
    Collections.reverse(order); return order;
}

private static void visitTopo(int node, List<List<Integer>> graph, int[] state, List<Integer> order) {
    if (state[node] == 1) throw new IllegalStateException("topological sort requires an acyclic graph");
    if (state[node] == 2) return;
    state[node] = 1;
    for (int neighbor : graph.get(node)) visitTopo(neighbor, graph, state, order);
    state[node] = 2; order.add(node);
}`,
  'kahn-topological-sort': `import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;

public static List<Integer> kahnTopologicalSort(List<List<Integer>> graph) {
    int size = graph.size(); int[] indegree = new int[size];
    for (List<Integer> neighbors : graph) for (int neighbor : neighbors) indegree[neighbor]++;
    PriorityQueue<Integer> ready = new PriorityQueue<>();
    for (int node = 0; node < size; node++) if (indegree[node] == 0) ready.add(node);
    List<Integer> order = new ArrayList<>();
    while (!ready.isEmpty()) {
        int node = ready.remove(); order.add(node);
        for (int neighbor : graph.get(node)) { indegree[neighbor]--; if (indegree[neighbor] == 0) ready.add(neighbor); }
    }
    if (order.size() != size) throw new IllegalStateException("topological sort requires an acyclic graph");
    return order;
}`,
  'connected-components': `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public static List<List<Integer>> connectedComponents(List<List<Integer>> graph) {
    int size = graph.size(); boolean[] visited = new boolean[size]; List<List<Integer>> components = new ArrayList<>();
    for (int start = 0; start < size; start++) {
        if (visited[start]) continue;
        List<Integer> component = new ArrayList<>(); ArrayDeque<Integer> stack = new ArrayDeque<>();
        stack.push(start); visited[start] = true;
        while (!stack.isEmpty()) { int node = stack.pop(); component.add(node); for (int neighbor : graph.get(node)) if (!visited[neighbor]) { visited[neighbor] = true; stack.push(neighbor); } }
        Collections.sort(component); components.add(component);
    }
    return components;
}`,
  'cycle-detection': `import java.util.Arrays;

public static boolean hasCycle(List<List<Integer>> graph, boolean directed) {
    int size = graph.size();
    if (directed) { int[] state = new int[size]; for (int node = 0; node < size; node++) if (state[node] == 0 && directedVisit(node, graph, state)) return true; return false; }
    int[] parent = new int[size]; Arrays.fill(parent, -1); boolean[] visited = new boolean[size];
    for (int node = 0; node < size; node++) if (!visited[node] && undirectedVisit(node, graph, visited, parent)) return true;
    return false;
}

private static boolean directedVisit(int node, List<List<Integer>> graph, int[] state) {
    state[node] = 1;
    for (int neighbor : graph.get(node)) if (state[neighbor] == 1 || (state[neighbor] == 0 && directedVisit(neighbor, graph, state))) return true;
    state[node] = 2; return false;
}

private static boolean undirectedVisit(int node, List<List<Integer>> graph, boolean[] visited, int[] parent) {
    visited[node] = true;
    for (int neighbor : graph.get(node)) { if (!visited[neighbor]) { parent[neighbor] = node; if (undirectedVisit(neighbor, graph, visited, parent)) return true; } else if (neighbor != parent[node]) return true; }
    return false;
}`,
  'kosaraju-scc': `import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public static List<List<Integer>> kosarajuScc(List<List<Integer>> graph) {
    int size = graph.size(); List<List<Integer>> reverse = new ArrayList<>(); for (int node = 0; node < size; node++) reverse.add(new ArrayList<>());
    for (int node = 0; node < size; node++) for (int neighbor : graph.get(node)) reverse.get(neighbor).add(node);
    boolean[] visited = new boolean[size]; List<Integer> finish = new ArrayList<>();
    for (int node = 0; node < size; node++) if (!visited[node]) kosarajuFirst(node, graph, visited, finish);
    Arrays.fill(visited, false); List<List<Integer>> components = new ArrayList<>();
    for (int i = size - 1; i >= 0; i--) { int node = finish.get(i); if (!visited[node]) { List<Integer> component = new ArrayList<>(); kosarajuSecond(node, reverse, visited, component); Collections.sort(component); components.add(component); } }
    components.sort((a, b) -> a.get(0) - b.get(0));
    return components;
}

private static void kosarajuFirst(int node, List<List<Integer>> graph, boolean[] visited, List<Integer> finish) {
    visited[node] = true; for (int neighbor : graph.get(node)) if (!visited[neighbor]) kosarajuFirst(neighbor, graph, visited, finish);
    finish.add(node);
}

private static void kosarajuSecond(int node, List<List<Integer>> reverse, boolean[] visited, List<Integer> component) {
    visited[node] = true; component.add(node); for (int neighbor : reverse.get(node)) if (!visited[neighbor]) kosarajuSecond(neighbor, reverse, visited, component);
}`,
  'tarjan-scc': `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public static List<List<Integer>> tarjanScc(List<List<Integer>> graph) {
    int size = graph.size(); int[] indices = new int[size]; int[] low = new int[size]; Arrays.fill(indices, -1);
    ArrayDeque<Integer> stack = new ArrayDeque<>(); boolean[] onStack = new boolean[size]; List<List<Integer>> components = new ArrayList<>(); int[] nextIndex = new int[]{0};
    for (int node = 0; node < size; node++) if (indices[node] == -1) tarjan(node, graph, indices, low, stack, onStack, components, nextIndex);
    components.sort((a, b) -> a.get(0) - b.get(0)); return components;
}

private static void tarjan(int node, List<List<Integer>> graph, int[] indices, int[] low, ArrayDeque<Integer> stack, boolean[] onStack, List<List<Integer>> components, int[] nextIndex) {
    indices[node] = nextIndex[0]; low[node] = nextIndex[0]; nextIndex[0]++;
    stack.push(node); onStack[node] = true;
    for (int neighbor : graph.get(node)) {
        if (indices[neighbor] == -1) { tarjan(neighbor, graph, indices, low, stack, onStack, components, nextIndex); low[node] = Math.min(low[node], low[neighbor]); }
        else if (onStack[neighbor]) low[node] = Math.min(low[node], indices[neighbor]);
    }
    if (low[node] == indices[node]) {
        List<Integer> component = new ArrayList<>(); int member;
        do { member = stack.pop(); onStack[member] = false; component.add(member); } while (member != node);
        components.add(component);
    }
}`,
  'prim-mst': `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

public static List<int[]> primMst(List<List<int[]>> graph) {
    int size = graph.size(); boolean[] visited = new boolean[size]; List<int[]> forest = new ArrayList<>(); int[] total = new int[]{0};
    for (int root = 0; root < size; root++) {
        if (visited[root]) continue;
        visited[root] = true;
        PriorityQueue<int[]> heap = new PriorityQueue<>(Comparator.comparingInt(edge -> edge[0]));
        for (int[] edge : graph.get(root)) heap.add(new int[]{edge[1], root, edge[0]});
        while (!heap.isEmpty()) {
            int[] top = heap.remove(); int weight = top[0], from = top[1], neighbor = top[2];
            if (visited[neighbor]) continue;
            visited[neighbor] = true; forest.add(new int[]{from, neighbor, weight}); total[0] += weight;
            for (int[] edge : graph.get(neighbor)) if (!visited[edge[0]]) heap.add(new int[]{edge[1], neighbor, edge[0]});
        }
    }
    return forest;
}`,
  'kruskal-mst': `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public static List<int[]> kruskalMst(int nodeCount, int[][] edges) {
    int[] parent = new int[nodeCount]; int[] rank = new int[nodeCount];
    for (int node = 0; node < nodeCount; node++) parent[node] = node;
    Arrays.sort(edges, (a, b) -> a[2] != b[2] ? a[2] - b[2] : (a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]));
    List<int[]> forest = new ArrayList<>();
    for (int[] edge : edges) { int left = findRoot(parent, edge[0]), right = findRoot(parent, edge[1]); if (left != right) { unionRank(parent, rank, left, right); forest.add(edge); } }
    return forest;
}

private static int findRoot(int[] parent, int node) { while (parent[node] != node) { parent[node] = parent[parent[node]]; node = parent[node]; } return node; }

private static void unionRank(int[] parent, int[] rank, int left, int right) {
    if (rank[left] < rank[right]) { int temporary = left; left = right; right = temporary; }
    parent[right] = left; if (rank[left] == rank[right]) rank[left]++;
}`,
  'union-find-connectivity': `import java.util.Arrays;

public static boolean[] unionFindConnectivity(int nodeCount, int[][] edges, int[][] queries) {
    int[] parent = new int[nodeCount]; int[] rank = new int[nodeCount];
    for (int node = 0; node < nodeCount; node++) parent[node] = node;
    for (int[] edge : edges) { int left = findRoot(parent, edge[0]), right = findRoot(parent, edge[1]); if (left != right) unionRank(parent, rank, left, right); }
    boolean[] connected = new boolean[queries.length];
    for (int index = 0; index < queries.length; index++) connected[index] = findRoot(parent, queries[index][0]) == findRoot(parent, queries[index][1]);
    return connected;
}

private static int findRoot(int[] parent, int node) { if (parent[node] != node) parent[node] = findRoot(parent, parent[node]); return parent[node]; }

private static void unionRank(int[] parent, int[] rank, int left, int right) {
    if (rank[left] < rank[right]) { int temporary = left; left = right; right = temporary; }
    parent[right] = left; if (rank[left] == rank[right]) rank[left]++;
}`,
  'naive-search': `public static int naiveSearch(String text, String pattern) {
    if (pattern.isEmpty()) return 0;
    int limit = text.length() - pattern.length() + 1;
    for (int start = 0; start < limit; start++) {
        boolean matched = true;
        for (int offset = 0; offset < pattern.length(); offset++) if (text.charAt(start + offset) != pattern.charAt(offset)) { matched = false; break; }
        if (matched) return start;
    }
    return -1;
}`,
  'z-algorithm': `public static int zAlgorithm(String text, String pattern) {
    if (pattern.isEmpty()) return 0;
    char separator = '\\u0001';
    String sequence = pattern + separator + text;
    int length = sequence.length(); int[] z = new int[length]; int left = 0, right = 0;
    for (int index = 1; index < length; index++) {
        if (index <= right) z[index] = Math.min(right - index + 1, z[index - left]);
        while (index + z[index] < length && sequence.charAt(z[index]) == sequence.charAt(index + z[index])) z[index]++;
        if (index + z[index] - 1 > right) { left = index; right = index + z[index] - 1; }
        if (index > pattern.length() && z[index] >= pattern.length()) return index - pattern.length() - 1;
    }
    return -1;
}`,
  'rabin-karp': `public static int rabinKarp(String text, String pattern) {
    int patternLength = pattern.length(); if (patternLength == 0) return 0; if (patternLength > text.length()) return -1;
    long base = 257, modulus = 1000000007L;
    long highPlace = 1; for (int index = 0; index < patternLength - 1; index++) highPlace = (highPlace * base) % modulus;
    long patternHash = 0, windowHash = 0;
    for (int index = 0; index < patternLength; index++) { patternHash = (patternHash * base + pattern.charAt(index)) % modulus; windowHash = (windowHash * base + text.charAt(index)) % modulus; }
    for (int start = 0; start + patternLength <= text.length(); start++) {
        if (patternHash == windowHash && text.substring(start, start + patternLength).equals(pattern)) return start;
        if (start + patternLength < text.length()) { windowHash = ((windowHash - text.charAt(start) * highPlace) % modulus + modulus) % modulus; windowHash = (windowHash * base + text.charAt(start + patternLength)) % modulus; }
    }
    return -1;
}`,
  'boyer-moore': `import java.util.HashMap;
import java.util.Map;

public static int boyerMoore(String text, String pattern) {
    int patternLength = pattern.length(); if (patternLength == 0) return 0; if (patternLength > text.length()) return -1;
    Map<Character, Integer> lastPosition = new HashMap<>();
    for (int index = 0; index < patternLength; index++) lastPosition.put(pattern.charAt(index), index);
    int[] shift = new int[patternLength + 1]; int[] border = new int[patternLength + 1];
    int left = patternLength, right = patternLength + 1; border[left] = right;
    while (left > 0) {
        while (right <= patternLength && pattern.charAt(left - 1) != pattern.charAt(right - 1)) { if (shift[right] == 0) shift[right] = right - left; right = border[right]; }
        left--; right--; border[left] = right;
    }
    right = border[0];
    for (int index = 0; index <= patternLength; index++) { if (shift[index] == 0) shift[index] = right; if (index == right) right = border[right]; }
    int start = 0;
    while (start <= text.length() - patternLength) {
        int index = patternLength - 1;
        while (index >= 0 && pattern.charAt(index) == text.charAt(start + index)) index--;
        if (index < 0) return start;
        int badCharacter = index - lastPosition.getOrDefault(text.charAt(start + index), -1);
        start += Math.max(1, Math.max(badCharacter, shift[index + 1]));
    }
    return -1;
}`,
  horspool: `import java.util.HashMap;
import java.util.Map;

public static int horspool(String text, String pattern) {
    int patternLength = pattern.length(); if (patternLength == 0) return 0; if (patternLength > text.length()) return -1;
    Map<Character, Integer> shifts = new HashMap<>();
    for (int index = 0; index < patternLength - 1; index++) shifts.put(pattern.charAt(index), patternLength - index - 1);
    int end = patternLength - 1;
    while (end < text.length()) {
        int offset = 0;
        while (offset < patternLength && pattern.charAt(patternLength - offset - 1) == text.charAt(end - offset)) offset++;
        if (offset == patternLength) return end - patternLength + 1;
        end += shifts.getOrDefault(text.charAt(end), patternLength);
    }
    return -1;
}`,
  'aho-corasick': `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public static List<int[]> ahoCorasick(String text, List<String> patterns) {
    List<Map<Character, Integer>> transitions = new ArrayList<>(); List<Integer> failures = new ArrayList<>(); List<List<Integer>> outputs = new ArrayList<>();
    transitions.add(new HashMap<>()); failures.add(0); outputs.add(new ArrayList<>());
    for (int patternIndex = 0; patternIndex < patterns.size(); patternIndex++) {
        String pattern = patterns.get(patternIndex); if (pattern.isEmpty()) continue;
        int state = 0;
        for (char character : pattern.toCharArray()) {
            Integer nextState = transitions.get(state).get(character);
            if (nextState == null) { nextState = transitions.size(); transitions.get(state).put(character, nextState); transitions.add(new HashMap<>()); failures.add(0); outputs.add(new ArrayList<>()); }
            state = nextState;
        }
        outputs.get(state).add(patternIndex);
    }
    ArrayDeque<Integer> queue = new ArrayDeque<>(); for (int state : transitions.get(0).values()) queue.add(state);
    while (!queue.isEmpty()) {
        int state = queue.remove();
        for (Map.Entry<Character, Integer> entry : transitions.get(state).entrySet()) {
            int nextState = entry.getValue(); queue.add(nextState);
            int fallback = failures.get(state);
            while (fallback != 0 && !transitions.get(fallback).containsKey(entry.getKey())) fallback = failures.get(fallback);
            failures.set(nextState, transitions.get(fallback).getOrDefault(entry.getKey(), 0));
            outputs.get(nextState).addAll(outputs.get(failures.get(nextState)));
        }
    }
    List<int[]> found = new ArrayList<>();
    for (int patternIndex = 0; patternIndex < patterns.size(); patternIndex++) if (patterns.get(patternIndex).isEmpty()) found.add(new int[]{0, patternIndex});
    int state = 0;
    for (int end = 0; end < text.length(); end++) {
        char character = text.charAt(end);
        while (state != 0 && !transitions.get(state).containsKey(character)) state = failures.get(state);
        state = transitions.get(state).getOrDefault(character, 0);
        for (int patternIndex : outputs.get(state)) found.add(new int[]{end - patterns.get(patternIndex).length() + 1, patternIndex});
    }
    found.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
    return found;
}`,
  'trie-lookup': `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public static boolean trieLookup(List<String> words, String query) {
    List<Map<Character, Integer>> children = new ArrayList<>(); List<Boolean> terminal = new ArrayList<>();
    children.add(new HashMap<>()); terminal.add(false);
    for (String word : words) {
        int state = 0;
        for (char character : word.toCharArray()) {
            Integer nextState = children.get(state).get(character);
            if (nextState == null) { nextState = children.size(); children.get(state).put(character, nextState); children.add(new HashMap<>()); terminal.add(false); }
            state = nextState;
        }
        terminal.set(state, true);
    }
    int state = 0;
    for (char character : query.toCharArray()) { Integer nextState = children.get(state).get(character); if (nextState == null) return false; state = nextState; }
    return terminal.get(state);
}`,
  'longest-common-prefix': `import java.util.List;

public static String longestCommonPrefix(List<String> strings) {
    if (strings.isEmpty()) return "";
    String first = strings.get(0); int prefixLength = first.length();
    for (String value : strings) {
        if (value == first) continue;
        prefixLength = Math.min(prefixLength, value.length());
        int index = 0;
        while (index < prefixLength && first.charAt(index) == value.charAt(index)) index++;
        prefixLength = index;
        if (prefixLength == 0) break;
    }
    return first.substring(0, prefixLength);
}`,
  manacher: `public static String manacher(String text) {
    int length = text.length(); if (length == 0) return "";
    int bestStart = 0, bestLength = 1;
    int[] odd = new int[length]; int left = 0, right = -1;
    for (int center = 0; center < length; center++) {
        int radius = center > right ? 1 : Math.min(odd[left + right - center], right - center + 1);
        while (center - radius >= 0 && center + radius < length && text.charAt(center - radius) == text.charAt(center + radius)) radius++;
        odd[center] = radius; int start = center - radius + 1; int palindrome = radius * 2 - 1;
        if (palindrome > bestLength || (palindrome == bestLength && start < bestStart)) { bestStart = start; bestLength = palindrome; }
        if (center + radius - 1 > right) { left = center - radius + 1; right = center + radius - 1; }
    }
    int[] even = new int[length]; left = 0; right = -1;
    for (int center = 0; center < length; center++) {
        int radius = center > right ? 0 : Math.min(even[left + right - center + 1], right - center + 1);
        while (center - radius - 1 >= 0 && center + radius < length && text.charAt(center - radius - 1) == text.charAt(center + radius)) radius++;
        even[center] = radius; int start = center - radius; int palindrome = radius * 2;
        if (palindrome > bestLength || (palindrome == bestLength && start < bestStart)) { bestStart = start; bestLength = palindrome; }
        if (center + radius - 1 > right) { left = center - radius; right = center + radius - 1; }
    }
    return text.substring(bestStart, bestStart + bestLength);
}`,
  'levenshtein-distance': `public static int levenshteinDistance(String first, String second) {
    if (first.length() < second.length()) { String temporary = first; first = second; second = temporary; }
    int[] previous = new int[second.length() + 1]; for (int index = 0; index <= second.length(); index++) previous[index] = index;
    for (int firstIndex = 1; firstIndex <= first.length(); firstIndex++) {
        int[] current = new int[second.length() + 1]; current[0] = firstIndex;
        for (int secondIndex = 1; secondIndex <= second.length(); secondIndex++) {
            int insertion = current[secondIndex - 1] + 1;
            int deletion = previous[secondIndex] + 1;
            int substitution = previous[secondIndex - 1] + (first.charAt(firstIndex - 1) == second.charAt(secondIndex - 1) ? 0 : 1);
            current[secondIndex] = Math.min(insertion, Math.min(deletion, substitution));
        }
        previous = current;
    }
    return previous[second.length()];
}`,
  'longest-common-subsequence': `public static String longestCommonSubsequence(String first, String second) {
    int firstLength = first.length(), secondLength = second.length();
    int[][] lengths = new int[firstLength + 1][secondLength + 1];
    for (int firstIndex = firstLength - 1; firstIndex >= 0; firstIndex--) for (int secondIndex = secondLength - 1; secondIndex >= 0; secondIndex--) {
        if (first.charAt(firstIndex) == second.charAt(secondIndex)) lengths[firstIndex][secondIndex] = lengths[firstIndex + 1][secondIndex + 1] + 1;
        else lengths[firstIndex][secondIndex] = Math.max(lengths[firstIndex + 1][secondIndex], lengths[firstIndex][secondIndex + 1]);
    }
    StringBuilder result = new StringBuilder();
    int firstIndex = 0, secondIndex = 0;
    while (firstIndex < firstLength && secondIndex < secondLength) {
        if (first.charAt(firstIndex) == second.charAt(secondIndex)) { result.append(first.charAt(firstIndex)); firstIndex++; secondIndex++; }
        else if (lengths[firstIndex + 1][secondIndex] >= lengths[firstIndex][secondIndex + 1]) firstIndex++;
        else secondIndex++;
    }
    return result.toString();
}`,
  'fibonacci-memoization': `import java.util.HashMap;
import java.util.Map;

public static long fibonacciMemoization(int n) {
    if (n < 0) throw new IllegalArgumentException("n must be nonnegative");
    Map<Integer, Long> memo = new HashMap<>(); memo.put(0, 0L); memo.put(1, 1L); return fibMemo(memo, n);
}

private static long fibMemo(Map<Integer, Long> memo, int index) {
    Long cached = memo.get(index); if (cached != null) return cached;
    long value = fibMemo(memo, index - 1) + fibMemo(memo, index - 2); memo.put(index, value); return value;
}`,
  'zero-one-knapsack': `public static int zeroOneKnapsack(int[] weights, int[] values, int capacity) {
    int[] best = new int[capacity + 1];
    for (int index = 0; index < weights.length; index++) for (int current = capacity; current >= weights[index]; current--) best[current] = Math.max(best[current], best[current - weights[index]] + values[index]);
    return best[capacity];
}`,
  'unbounded-knapsack': `public static int unboundedKnapsack(int[] weights, int[] values, int capacity) {
    int[] best = new int[capacity + 1];
    for (int current = 1; current <= capacity; current++) for (int index = 0; index < weights.length; index++) if (weights[index] <= current) best[current] = Math.max(best[current], best[current - weights[index]] + values[index]);
    return best[capacity];
}`,
  'coin-change-count': `public static long coinChangeCount(int[] coins, int amount) {
    long[] combinations = new long[amount + 1]; combinations[0] = 1;
    for (int coin : coins) for (int current = coin; current <= amount; current++) combinations[current] += combinations[current - coin];
    return combinations[amount];
}`,
  'coin-change-minimum': `public static int coinChangeMinimum(int[] coins, int amount) {
    int unreachable = amount + 1; int[] minimum = new int[amount + 1]; java.util.Arrays.fill(minimum, unreachable); minimum[0] = 0;
    for (int current = 1; current <= amount; current++) for (int coin : coins) if (coin <= current) minimum[current] = Math.min(minimum[current], minimum[current - coin] + 1);
    return minimum[amount] == unreachable ? -1 : minimum[amount];
}`,
  'longest-increasing-subsequence': `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public static List<Integer> longestIncreasingSubsequence(int[] values) {
    int length = values.length; int[] lengths = new int[length]; int[] previous = new int[length]; java.util.Arrays.fill(previous, -1);
    int bestEnd = 0; lengths[0] = 1;
    for (int end = 0; end < length; end++) { lengths[end] = 1; for (int start = 0; start < end; start++) if (values[start] < values[end] && lengths[start] + 1 > lengths[end]) { lengths[end] = lengths[start] + 1; previous[end] = start; } if (lengths[end] > lengths[bestEnd]) bestEnd = end; }
    List<Integer> result = new ArrayList<>(); for (int endpoint = bestEnd; endpoint != -1; endpoint = previous[endpoint]) result.add(values[endpoint]);
    Collections.reverse(result); return result;
}`,
  'matrix-chain-multiplication': `public static long matrixChainMultiplication(int[] dimensions) {
    int matrixCount = Math.max(0, dimensions.length - 1); if (matrixCount < 2) return 0;
    long[][] costs = new long[matrixCount][matrixCount];
    for (int chainLength = 2; chainLength <= matrixCount; chainLength++) for (int left = 0; left + chainLength <= matrixCount; left++) {
        int right = left + chainLength - 1; long best = Long.MAX_VALUE;
        for (int split = left; split < right; split++) best = Math.min(best, costs[left][split] + costs[split + 1][right] + (long) dimensions[left] * dimensions[split + 1] * dimensions[right + 1]);
        costs[left][right] = best;
    }
    return costs[0][matrixCount - 1];
}`,
  'edit-distance': `public static int editDistance(String source, String target) {
    int[] previous = new int[target.length() + 1]; for (int index = 0; index <= target.length(); index++) previous[index] = index;
    for (int sourceIndex = 1; sourceIndex <= source.length(); sourceIndex++) {
        int[] current = new int[target.length() + 1]; current[0] = sourceIndex;
        for (int targetIndex = 1; targetIndex <= target.length(); targetIndex++) {
            int substitution = previous[targetIndex - 1] + (source.charAt(sourceIndex - 1) == target.charAt(targetIndex - 1) ? 0 : 1);
            current[targetIndex] = Math.min(previous[targetIndex] + 1, Math.min(current[targetIndex - 1] + 1, substitution));
        }
        previous = current;
    }
    return previous[target.length()];
}`,
  'grid-paths': `import java.util.Arrays;

public static long gridPaths(int rows, int columns) {
    if (rows == 0 || columns == 0) return 0;
    long[] paths = new long[columns]; Arrays.fill(paths, 1);
    for (int row = 1; row < rows; row++) for (int column = 1; column < columns; column++) paths[column] += paths[column - 1];
    return paths[columns - 1];
}`,
  'minimum-path-sum': `public static int minimumPathSum(int[][] grid) {
    int rows = grid.length, columns = grid[0].length;
    int[] totals = new int[columns];
    for (int row = 0; row < rows; row++) for (int column = 0; column < columns; column++) {
        if (row == 0 && column == 0) totals[column] = grid[row][column];
        else if (row == 0) totals[column] = totals[column - 1] + grid[row][column];
        else if (column == 0) totals[column] += grid[row][column];
        else totals[column] = Math.min(totals[column], totals[column - 1]) + grid[row][column];
    }
    return totals[columns - 1];
}`,
  'rod-cutting': `public static int rodCutting(int[] prices, int length) {
    int[] revenue = new int[length + 1];
    for (int current = 1; current <= length; current++) {
        int best = 0; int limit = Math.min(current, prices.length);
        for (int piece = 1; piece <= limit; piece++) best = Math.max(best, prices[piece - 1] + revenue[current - piece]);
        revenue[current] = best;
    }
    return revenue[length];
}`,
  'partition-equal-subset-sum': `public static boolean partitionEqualSubsetSum(int[] values) {
    int total = 0; for (int value : values) total += value;
    if ((total & 1) == 1) return false;
    int target = total / 2;
    boolean[] reachable = new boolean[target + 1]; reachable[0] = true;
    for (int value : values) for (int subtotal = target; subtotal >= value; subtotal--) reachable[subtotal] = reachable[subtotal] || reachable[subtotal - value];
    return reachable[target];
}`,
};
