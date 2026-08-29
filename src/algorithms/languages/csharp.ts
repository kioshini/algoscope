export const csharpSources: Record<string, string> = {
  bubble: `public static void BubbleSort(int[] values) {
    for (int end = values.Length - 1; end > 0; end--) {
        bool swapped = false;
        for (int i = 0; i < end; i++) {
            if (values[i] > values[i + 1]) {
                (values[i], values[i + 1]) = (values[i + 1], values[i]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
  quick: `public static void QuickSort(int[] values) {
    QuickSort(values, 0, values.Length - 1);
}

private static void QuickSort(int[] values, int low, int high) {
    if (low >= high) return;
    int pivot = values[high];
    int split = low;
    for (int i = low; i < high; i++) {
        if (values[i] < pivot) { int temporary = values[i]; values[i] = values[split]; values[split++] = temporary; }
    }
    (values[split], values[high]) = (values[high], values[split]);
    QuickSort(values, low, split - 1);
    QuickSort(values, split + 1, high);
}`,
  merge: `public static void MergeSort(int[] values) {
    int[] buffer = new int[values.Length];
    Sort(values, buffer, 0, values.Length);
}

private static void Sort(int[] values, int[] buffer, int start, int end) {
    if (end - start < 2) return;
    int middle = (start + end) / 2; Sort(values, buffer, start, middle); Sort(values, buffer, middle, end);
    int left = start, right = middle, next = start;
    while (left < middle || right < end) buffer[next++] = right == end || (left < middle && values[left] <= values[right]) ? values[left++] : values[right++];
    System.Array.Copy(buffer, start, values, start, end - start);
}`,
  'search-binary-first': `public static int BinarySearch(int[] values, int target) {
    int low = 0, high = values.Length - 1, result = -1;
    while (low <= high) { int middle = low + (high - low) / 2; if (values[middle] >= target) { if (values[middle] == target) result = middle; high = middle - 1; } else low = middle + 1; }
    return result;
}`,
  'breadth-first-search': `using System.Collections.Generic;

public static int[] BreadthFirstSearch(int[][] graph, int start) {
    var order = new List<int>(); var queue = new Queue<int>(); var seen = new bool[graph.Length];
    queue.Enqueue(start); seen[start] = true;
    while (queue.Count > 0) { int vertex = queue.Dequeue(); order.Add(vertex); foreach (int next in graph[vertex]) if (!seen[next]) { seen[next] = true; queue.Enqueue(next); } }
    return order.ToArray();
}`,
  kmp: `public static int KmpSearch(string text, string pattern) {
    if (pattern.Length == 0) return 0; int[] table = new int[pattern.Length];
    for (int i = 1, matched = 0; i < pattern.Length;) if (pattern[i] == pattern[matched]) table[i++] = ++matched; else if (matched > 0) matched = table[matched - 1]; else table[i++] = 0;
    for (int i = 0, matched = 0; i < text.Length;) { if (text[i] == pattern[matched]) { i++; matched++; if (matched == pattern.Length) return i - matched; } else if (matched > 0) matched = table[matched - 1]; else i++; }
    return -1;
}`,
  'fibonacci-tabulation': `public static long FibonacciTabulation(int n) {
    if (n < 0) throw new System.ArgumentOutOfRangeException(nameof(n)); long[] table = new long[n + 1];
    if (n > 0) table[1] = 1; for (int i = 2; i <= n; i++) table[i] = table[i - 1] + table[i - 2]; return table[n];
}`,
  selection: `public static void SelectionSort(int[] values) {
    for (int i = 0; i < values.Length - 1; i++) {
        int min = i;
        for (int j = i + 1; j < values.Length; j++) if (values[j] < values[min]) min = j;
        if (min != i) (values[i], values[min]) = (values[min], values[i]);
    }
}`,
  insertion: `public static void InsertionSort(int[] values) {
    for (int i = 1; i < values.Length; i++) {
        int item = values[i], position = i;
        while (position > 0 && item < values[position - 1]) { values[position] = values[position - 1]; position--; }
        values[position] = item;
    }
}`,
  cocktail: `public static void CocktailSort(int[] values) {
    bool swapped = true; int start = 0, end = values.Length - 1;
    while (swapped) {
        swapped = false;
        for (int i = start; i < end; i++) if (values[i] > values[i + 1]) { (values[i], values[i + 1]) = (values[i + 1], values[i]); swapped = true; }
        if (!swapped) break;
        swapped = false; end--;
        for (int i = end; i > start; i--) if (values[i - 1] > values[i]) { (values[i - 1], values[i]) = (values[i], values[i - 1]); swapped = true; }
        start++;
    }
}`,
  gnome: `public static void GnomeSort(int[] values) {
    int index = 0;
    while (index < values.Length) {
        if (index == 0 || values[index] >= values[index - 1]) index++;
        else { (values[index], values[index - 1]) = (values[index - 1], values[index]); index--; }
    }
}`,
  shell: `public static void ShellSort(int[] values) {
    for (int gap = values.Length / 2; gap > 0; gap /= 2)
        for (int i = gap; i < values.Length; i++) {
            int item = values[i], position = i;
            while (position >= gap && item < values[position - gap]) { values[position] = values[position - gap]; position -= gap; }
            values[position] = item;
        }
}`,
  heap: `public static void HeapSort(int[] values) {
    int n = values.Length;
    for (int i = n / 2 - 1; i >= 0; i--) Sift(values, i, n);
    for (int end = n - 1; end > 0; end--) { (values[0], values[end]) = (values[end], values[0]); Sift(values, 0, end); }
}

private static void Sift(int[] values, int root, int count) {
    while (2 * root + 1 < count) {
        int child = 2 * root + 1;
        if (child + 1 < count && values[child] < values[child + 1]) child++;
        if (values[root] >= values[child]) return;
        (values[root], values[child]) = (values[child], values[root]); root = child;
    }
}`,
  cycle: `public static void CycleSort(int[] values) {
    for (int start = 0; start < values.Length - 1; start++) {
        int item = values[start], position = start;
        for (int i = start + 1; i < values.Length; i++) if (values[i] < item) position++;
        if (position == start) continue;
        while (item == values[position]) position++;
        (item, values[position]) = (values[position], item);
        while (position != start) {
            position = start;
            for (int i = start + 1; i < values.Length; i++) if (values[i] < item) position++;
            while (item == values[position]) position++;
            (item, values[position]) = (values[position], item);
        }
    }
}`,
  comb: `public static void CombSort(int[] values) {
    int gap = values.Length; bool swapped = true;
    while (gap > 1 || swapped) {
        gap = Math.Max(1, (int)(gap / 1.3)); swapped = false;
        for (int i = 0; i + gap < values.Length; i++) if (values[i] > values[i + gap]) { (values[i], values[i + gap]) = (values[i + gap], values[i]); swapped = true; }
    }
}`,
  'odd-even': `public static void OddEvenSort(int[] values) {
    bool sorted = false;
    while (!sorted) {
        sorted = true;
        for (int i = 1; i < values.Length - 1; i += 2) if (values[i] > values[i + 1]) { (values[i], values[i + 1]) = (values[i + 1], values[i]); sorted = false; }
        for (int i = 0; i < values.Length - 1; i += 2) if (values[i] > values[i + 1]) { (values[i], values[i + 1]) = (values[i + 1], values[i]); sorted = false; }
    }
}`,
  pancake: `public static void PancakeSort(int[] values) {
    for (int end = values.Length; end > 1; end--) {
        int max = 0;
        for (int i = 1; i < end; i++) if (values[i] > values[max]) max = i;
        if (max != end - 1) {
            Reverse(values, 0, max);
            Reverse(values, 0, end - 1);
        }
    }
}

private static void Reverse(int[] values, int start, int end) {
    while (start < end) { (values[start], values[end]) = (values[end], values[start]); start++; end--; }
}`,
  'binary-insertion': `public static void BinaryInsertionSort(int[] values) {
    for (int i = 1; i < values.Length; i++) {
        int item = values[i], low = 0, high = i;
        while (low < high) { int middle = (low + high) / 2; if (item < values[middle]) high = middle; else low = middle + 1; }
        for (int j = i; j > low; j--) values[j] = values[j - 1];
        values[low] = item;
    }
}`,
  'three-way-quick': `public static void ThreeWayQuickSort(int[] values) { ThreeWayQuickSort(values, 0, values.Length - 1); }

private static void ThreeWayQuickSort(int[] values, int low, int high) {
    if (low >= high) return;
    int pivot = values[low], less = low, equal = low, greater = high;
    while (equal <= greater) {
        if (values[equal] < pivot) { (values[less], values[equal]) = (values[equal], values[less]); less++; equal++; }
        else if (values[equal] > pivot) { (values[equal], values[greater]) = (values[greater], values[equal]); greater--; }
        else equal++;
    }
    ThreeWayQuickSort(values, low, less - 1);
    ThreeWayQuickSort(values, greater + 1, high);
}`,
  'natural-merge': `public static void NaturalMergeSort(int[] values) {
    if (values.Length < 2) return;
    var (start, end) = (0, 0);
    List<(int, int)> runs = new List<(int, int)>();
    for (int i = 1; i <= values.Length; i++) {
        if (i == values.Length || values[i] < values[i - 1]) { runs.Add((start, i)); start = i; }
    }
    while (runs.Count > 1) {
        List<(int, int)> merged = new List<(int, int)>();
        for (int i = 0; i < runs.Count; i += 2) {
            if (i + 1 >= runs.Count) { merged.Add(runs[i]); break; }
            int l = runs[i].Item1, m = runs[i].Item2, r = runs[i + 1].Item2;
            int[] buffer = new int[r - l];
            int f = l, s = m, n = 0;
            while (f < m && s < r) buffer[n++] = values[s] < values[f] ? values[s++] : values[f++];
            while (f < m) buffer[n++] = values[f++];
            while (s < r) buffer[n++] = values[s++];
            for (int k = 0; k < n; k++) values[l + k] = buffer[k];
            merged.Add((l, r));
        }
        runs = merged;
    }
}`,
  'hoare-quick': `public static void HoareQuickSort(int[] values) { HoareQuickSort(values, 0, values.Length - 1); }

private static void HoareQuickSort(int[] values, int low, int high) {
    if (low >= high) return;
    int pivot = values[(low + high) / 2], left = low, right = high;
    while (left <= right) {
        while (values[left] < pivot) left++;
        while (pivot < values[right]) right--;
        if (left <= right) { (values[left], values[right]) = (values[right], values[left]); left++; right--; }
    }
    HoareQuickSort(values, low, right);
    HoareQuickSort(values, left, high);
}`,
  'dual-pivot-quick': `public static void DualPivotQuickSort(int[] values) { DualPivotQuickSort(values, 0, values.Length - 1); }

private static void DualPivotQuickSort(int[] values, int low, int high) {
    if (low >= high) return;
    if (values[high] < values[low]) (values[low], values[high]) = (values[high], values[low]);
    int lp = values[low], rp = values[high], less = low + 1, greater = high - 1, i = less;
    while (i <= greater) {
        if (values[i] < lp) { (values[i], values[less]) = (values[less], values[i]); less++; i++; }
        else if (rp < values[i]) { while (i < greater && rp < values[greater]) greater--; (values[i], values[greater]) = (values[greater], values[i]); greater--; if (values[i] < lp) { (values[i], values[less]) = (values[less], values[i]); less++; } i++; }
        else i++;
    }
    (values[low], values[less - 1]) = (values[less - 1], values[low]);
    (values[high], values[greater + 1]) = (values[greater + 1], values[high]);
    DualPivotQuickSort(values, low, less - 2);
    DualPivotQuickSort(values, less, greater);
    DualPivotQuickSort(values, greater + 2, high);
}`,
  'median-three-quick': `public static void MedianThreeQuickSort(int[] values) { MedianThreeQuickSort(values, 0, values.Length - 1); }

private static void MedianThreeQuickSort(int[] values, int low, int high) {
    if (low >= high) return;
    int middle = (low + high) / 2;
    if (values[middle] < values[low]) (values[low], values[middle]) = (values[middle], values[low]);
    if (values[high] < values[low]) (values[low], values[high]) = (values[high], values[low]);
    if (values[high] < values[middle]) (values[middle], values[high]) = (values[high], values[middle]);
    int pivot = values[middle], left = low, right = high;
    while (left <= right) {
        while (values[left] < pivot) left++;
        while (pivot < values[right]) right--;
        if (left <= right) { (values[left], values[right]) = (values[right], values[left]); left++; right--; }
    }
    MedianThreeQuickSort(values, low, right);
    MedianThreeQuickSort(values, left, high);
}`,
  'bottom-up-merge': `public static void BottomUpMergeSort(int[] values) {
    int[] buffer = new int[values.Length];
    for (int width = 1; width < values.Length; width *= 2)
        for (int start = 0; start < values.Length; start += 2 * width) {
            int middle = Math.Min(start + width, values.Length), end = Math.Min(start + 2 * width, values.Length), l = start, r = middle, n = start;
            while (l < middle || r < end) buffer[n++] = r == end || (l < middle && values[l] <= values[r]) ? values[l++] : values[r++];
            for (int k = start; k < end; k++) values[k] = buffer[k];
        }
}`,
  'in-place-merge': `public static void InPlaceMergeSort(int[] values) { InPlaceMergeSort(values, 0, values.Length); }

private static void InPlaceMergeSort(int[] values, int low, int high) {
    if (high - low < 2) return;
    int middle = (low + high) / 2;
    InPlaceMergeSort(values, low, middle);
    InPlaceMergeSort(values, middle, high);
    int left = low, right = middle;
    while (left < right && right < high) {
        if (values[right] < values[left]) { int temp = values[right]; for (int k = right; k > left; k--) values[k] = values[k - 1]; values[left] = temp; left++; right++; }
        else left++;
    }
}`,
  intro: `public static void IntroSort(int[] values) {
    int depthLimit = 2 * (int)Math.Log2(Math.Max(values.Length, 1));
    IntroSort(values, 0, values.Length, depthLimit);
}

private static void IntroSort(int[] values, int low, int high, int depth) {
    if (high - low < 2) return;
    if (depth == 0) { HeapSort(values); return; }
    if (high - low <= 16) { InsertionSort(values); return; }
    int pivot = values[high - 1], split = low;
    for (int i = low; i < high - 1; i++) if (values[i] < pivot) { (values[i], values[split]) = (values[split], values[i]); split++; }
    (values[split], values[high - 1]) = (values[high - 1], values[split]);
    IntroSort(values, low, split, depth - 1);
    IntroSort(values, split + 1, high, depth - 1);
}`,
  tim: `public static void TimSort(int[] values) {
    int n = values.Length; if (n < 2) return;
    int minRun = 32;
    for (int i = 0; i < n; i += minRun) InsertionSort(values, i, Math.Min(i + minRun, n));
    for (int size = minRun; size < n; size *= 2)
        for (int left = 0; left < n; left += 2 * size) {
            int mid = Math.Min(left + size, n), right = Math.Min(left + 2 * size, n);
            if (mid < right) Merge(values, left, mid, right);
        }
}

private static void InsertionSort(int[] values, int start, int end) {
    for (int i = start + 1; i < end; i++) { int item = values[i], j = i; while (j > start && item < values[j - 1]) { values[j] = values[j - 1]; j--; } values[j] = item; }
}

private static void Merge(int[] values, int left, int mid, int right) {
    int[] buffer = new int[right - left]; int l = left, r = mid, n = 0;
    while (l < mid && r < right) buffer[n++] = values[r] < values[l] ? values[r++] : values[l++];
    while (l < mid) buffer[n++] = values[l++];
    while (r < right) buffer[n++] = values[r++];
    for (int k = 0; k < n; k++) values[left + k] = buffer[k];
}`,
  tournament: `public static void TournamentSort(int[] values) {
    int n = values.Length; if (n < 2) return;
    int leaf = 1; while (leaf < n) leaf *= 2;
    int[] tree = new int[2 * leaf]; for (int i = 0; i < n; i++) tree[leaf + i] = values[i];
    for (int i = leaf - 1; i > 0; i--) tree[i] = Math.Min(tree[2 * i], tree[2 * i + 1]);
    for (int i = 0; i < n; i++) { values[i] = tree[1]; int p = leaf + Array.IndexOf(values, tree[1]); tree[p] = int.MaxValue; while (p > 1) { p /= 2; tree[p] = Math.Min(tree[2 * p], tree[2 * p + 1]); } }
}`,
  patience: `public static void PatienceSort(int[] values) {
    int n = values.Length; if (n < 2) return;
    List<List<int>> piles = new List<List<int>>();
    for (int i = 0; i < n; i++) {
        int item = values[i], low = 0, high = piles.Count;
        while (low < high) { int mid = (low + high) / 2; if (piles[mid][piles[mid].Count - 1] < item) low = mid + 1; else high = mid; }
        if (low == piles.Count) piles.Add(new List<int> { item }); else piles[low].Add(item);
    }
    for (int i = 0; i < n; i++) { int min = 0; for (int p = 1; p < piles.Count; p++) if (piles[p][piles[p].Count - 1] < piles[min][piles[min].Count - 1]) min = p; values[i] = piles[min][piles[min].Count - 1]; piles[min].RemoveAt(piles[min].Count - 1); if (piles[min].Count == 0) piles.RemoveAt(min); }
}`,
  tree: `public static void TreeSort(int[] values) {
    int n = values.Length; if (n < 2) return;
    Node root = new Node(values[0]);
    for (int i = 1; i < n; i++) Insert(root, values[i]);
    int[] output = new int[n]; InOrder(root, values, 0, output); for (int i = 0; i < n; i++) values[i] = output[i];
}

public class Node { public int Value; public Node Left, Right; public Node(int v) { Value = v; } }

private static void Insert(Node node, int v) { while (true) { if (v < node.Value) { if (node.Left == null) { node.Left = new Node(v); return; } node = node.Left; } else { if (node.Right == null) { node.Right = new Node(v); return; } node = node.Right; } } }

private static void InOrder(Node node, int[] source, int index, int[] output) {
    if (node == null) return;
    InOrder(node.Left, source, index, output);
    output[index] = node.Value; index++;
    InOrder(node.Right, source, index, output);
}`,
  strand: `public static void StrandSort(int[] values) {
    List<int> remaining = new List<int>(values), sorted = new List<int>();
    while (remaining.Count > 0) {
        List<int> strand = new List<int> { remaining[0] }; remaining.RemoveAt(0);
        for (int i = 0; i < remaining.Count;) { if (remaining[i] >= strand[strand.Count - 1]) { strand.Add(remaining[i]); remaining.RemoveAt(i); } else i++; }
        sorted = MergeLists(sorted, strand);
    }
    for (int i = 0; i < values.Length; i++) values[i] = sorted[i];
}

private static List<int> MergeLists(List<int> a, List<int> b) {
    List<int> result = new List<int>(); int i = 0, j = 0;
    while (i < a.Count && j < b.Count) result.Add(b[j] < a[i] ? b[j++] : a[i++]);
    while (i < a.Count) result.Add(a[i++]);
    while (j < b.Count) result.Add(b[j++]);
    return result;
}`,
  counting: `public static void CountingSort(int[] values) {
    if (values.Length == 0) return;
    int min = int.MaxValue, max = int.MinValue;
    foreach (int v in values) { if (v < min) min = v; if (v > max) max = v; }
    int[] counts = new int[max - min + 1];
    foreach (int v in values) counts[v - min]++;
    int index = 0;
    for (int i = 0; i < counts.Length; i++) for (int k = 0; k < counts[i]; k++) values[index++] = i + min;
}`,
  'radix-lsd': `public static void RadixLsdSort(int[] values) {
    if (values.Length == 0) return;
    int max = int.MinValue; foreach (int v in values) if (v > max) max = v;
    for (int place = 1; max / place > 0; place *= 10) {
        int[] counts = new int[10], buffer = new int[values.Length];
        foreach (int v in values) counts[(v / place) % 10]++;
        for (int i = 1; i < 10; i++) counts[i] += counts[i - 1];
        for (int i = values.Length - 1; i >= 0; i--) buffer[--counts[(values[i] / place) % 10]] = values[i];
        for (int i = 0; i < values.Length; i++) values[i] = buffer[i];
    }
}`,
  bucket: `public static void BucketSort(double[] values) {
    if (values.Length < 2) return;
    double lower = values[0], upper = values[0];
    for (int i = 1; i < values.Length; i++) { if (values[i] < lower) lower = values[i]; if (values[i] > upper) upper = values[i]; }
    if (lower == upper) return;
    List<List<double>> buckets = new List<List<double>>();
    for (int i = 0; i < values.Length; i++) buckets.Add(new List<double>());
    foreach (double v in values) buckets[(int)((v - lower) / (upper - lower) * (values.Length - 1))].Add(v);
    int index = 0;
    foreach (var bucket in buckets) { bucket.Sort(); foreach (double v in bucket) values[index++] = v; }
}`,
  'search-linear-first': `public static int LinearSearch(int[] values, int target) {
    for (int i = 0; i < values.Length; i++) if (values[i] == target) return i;
    return -1;
}`,
  'search-sentinel-first': `public static int SentinelSearch(int[] values, int target) {
    int[] copy = (int[])values.Clone();
    int last = copy.Length - 1; if (last >= 0) copy[last] = target;
    int i = 0; while (copy[i] != target) i++;
    return i < last || copy[last] == target ? i : -1;
}`,
  'search-lower-bound': `public static int LowerBound(int[] values, int target) {
    int low = 0, high = values.Length;
    while (low < high) { int middle = low + (high - low) / 2; if (values[middle] < target) low = middle + 1; else high = middle; }
    return low;
}`,
  'search-upper-bound': `public static int UpperBound(int[] values, int target) {
    int low = 0, high = values.Length;
    while (low < high) { int middle = low + (high - low) / 2; if (values[middle] <= target) low = middle + 1; else high = middle; }
    return low;
}`,
  'search-jump-first': `public static int JumpSearch(int[] values, int target) {
    int step = (int)Math.Sqrt(values.Length), prev = 0;
    while (prev < values.Length && values[Math.Min(prev + step, values.Length) - 1] < target) prev += step;
    for (int i = prev; i < Math.Min(prev + step, values.Length); i++) if (values[i] == target) return i;
    return -1;
}`,
  'search-exponential-first': `public static int ExponentialSearch(int[] values, int target) {
    if (values.Length == 0) return -1;
    int bound = 1; while (bound < values.Length && values[bound] < target) bound *= 2;
    int low = bound / 2, high = Math.Min(bound, values.Length - 1);
    while (low <= high) { int middle = low + (high - low) / 2; if (values[middle] == target) return middle; if (values[middle] < target) low = middle + 1; else high = middle - 1; }
    return -1;
}`,
  'search-interpolation-first': `public static int InterpolationSearch(int[] values, int target) {
    int low = 0, high = values.Length - 1;
    while (low <= high && target >= values[low] && target <= values[high]) {
        if (low == high) return values[low] == target ? low : -1;
        int middle = low + (int)((double)(target - values[low]) / (values[high] - values[low]) * (high - low));
        if (values[middle] == target) return middle;
        if (values[middle] < target) low = middle + 1; else high = middle - 1;
    }
    return -1;
}`,
  'search-fibonacci-first': `public static int FibonacciSearch(int[] values, int target) {
    int n = values.Length, a = 0, b = 1, c = a + b;
    while (c < n) { a = b; b = c; c = a + b; }
    int offset = -1;
    while (c > 1) {
        int i = Math.Min(offset + a, n - 1);
        if (values[i] < target) { c = b; b = a; a = c - b; offset = i; }
        else if (values[i] > target) { c = a; b = b - a; a = c - b; }
        else return i;
    }
    if (b == 1 && offset + 1 < n && values[offset + 1] == target) return offset + 1;
    return -1;
}`,
  'search-quickselect-kth': `public static int Quickselect(int[] values, int k) {
    int[] copy = (int[])values.Clone();
    return QuickselectRange(copy, 0, copy.Length - 1, k);
}

private static int QuickselectRange(int[] values, int low, int high, int k) {
    if (low == high) return values[low];
    int pivot = values[high], split = low;
    for (int i = low; i < high; i++) if (values[i] < pivot) { (values[i], values[split]) = (values[split], values[i]); split++; }
    (values[split], values[high]) = (values[high], values[split]);
    if (k == split) return values[k];
    return k < split ? QuickselectRange(values, low, split - 1, k) : QuickselectRange(values, split + 1, high, k);
}`,
  'depth-first-search': `public static int[] DepthFirstSearch(int[][] graph, int start) {
    var order = new List<int>(); var seen = new bool[graph.Length]; var stack = new Stack<int>();
    stack.Push(start); seen[start] = true;
    while (stack.Count > 0) { int vertex = stack.Pop(); order.Add(vertex); for (int next = graph[vertex].Length - 1; next >= 0; next--) if (!seen[graph[vertex][next]]) { seen[graph[vertex][next]] = true; stack.Push(graph[vertex][next]); } }
    return order.ToArray();
}`,
  dijkstra: `public static long ShortestDijkstra(int n, int[][] edges, int start) {
    long inf = long.MaxValue / 2; long[] dist = new long[n]; bool[] settled = new bool[n]; for (int i = 0; i < n; i++) dist[i] = inf; dist[start] = 0;
    for (int step = 0; step < n; step++) {
        int u = -1; for (int v = 0; v < n; v++) if (!settled[v] && (u == -1 || dist[v] < dist[u])) u = v;
        if (u == -1) break; settled[u] = true;
        foreach (int[] edge in edges) if (edge[0] == u && !settled[edge[1]] && dist[u] + edge[2] < dist[edge[1]]) dist[edge[1]] = dist[u] + edge[2];
    }
    return dist[n - 1] >= inf ? -1 : dist[n - 1];
}`,
  'bellman-ford': `public static long BellmanFord(int n, int[][] edges, int start) {
    long inf = long.MaxValue / 2; long[] dist = new long[n]; for (int i = 0; i < n; i++) dist[i] = inf; dist[start] = 0;
    for (int i = 0; i < n - 1; i++) foreach (int[] edge in edges) if (dist[edge[0]] + edge[2] < dist[edge[1]]) dist[edge[1]] = dist[edge[0]] + edge[2];
    foreach (int[] edge in edges) if (dist[edge[0]] + edge[2] < dist[edge[1]]) return -1;
    return dist[n - 1] >= inf ? -1 : dist[n - 1];
}`,
  'floyd-warshall': `public static long[,] FloydWarshall(int n, int[][] edges) {
    long inf = long.MaxValue / 2; long[,] dist = new long[n, n]; for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) dist[i, j] = i == j ? 0 : inf;
    foreach (int[] edge in edges) dist[edge[0], edge[1]] = edge[2];
    for (int k = 0; k < n; k++) for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) if (dist[i, k] + dist[k, j] < dist[i, j]) dist[i, j] = dist[i, k] + dist[k, j];
    return dist;
}`,
  'a-star': `public static int AStar(int n, int[][] edges, int start, int goal, int[] heuristic) {
    int inf = int.MaxValue / 2; int[] g = new int[n]; int[] f = new int[n]; bool[] closed = new bool[n]; for (int i = 0; i < n; i++) { g[i] = inf; f[i] = inf; } g[start] = 0; f[start] = heuristic[start];
    var open = new System.Collections.Generic.SortedSet<(int f, int node)> { (f[start], start) };
    while (open.Count > 0) {
        var current = open.Min; open.Remove(current); int u = current.node; if (u == goal) return g[u]; if (closed[u]) continue; closed[u] = true;
        foreach (int[] edge in edges) if (edge[0] == u) { int v = edge[1], w = edge[2]; if (g[u] + w < g[v]) { g[v] = g[u] + w; f[v] = g[v] + heuristic[v]; open.Add((f[v], v)); } }
    }
    return -1;
}`,
  'dfs-topological-sort': `public static int[] DfsTopologicalSort(int n, int[][] edges) {
    var adj = new List<int>[n]; for (int i = 0; i < n; i++) adj[i] = new List<int>(); foreach (int[] e in edges) adj[e[0]].Add(e[1]);
    bool[] visited = new bool[n]; bool[] inStack = new bool[n]; var order = new List<int>();
    System.Func<int, bool> dfs = null; dfs = (u) => { if (inStack[u]) return false; if (visited[u]) return true; visited[u] = inStack[u] = true; foreach (int v in adj[u]) if (!dfs(v)) return false; inStack[u] = false; order.Add(u); return true; };
    for (int i = 0; i < n; i++) if (!visited[i] && !dfs(i)) return new int[0];
    order.Reverse(); return order.ToArray();
}`,
  'kahn-topological-sort': `public static int[] KahnTopologicalSort(int n, int[][] edges) {
    int[] indegree = new int[n]; var adj = new List<int>[n]; for (int i = 0; i < n; i++) adj[i] = new List<int>(); foreach (int[] e in edges) { adj[e[0]].Add(e[1]); indegree[e[1]]++; }
    var queue = new Queue<int>(); for (int i = 0; i < n; i++) if (indegree[i] == 0) queue.Enqueue(i);
    var order = new List<int>();
    while (queue.Count > 0) { int u = queue.Dequeue(); order.Add(u); foreach (int v in adj[u]) if (--indegree[v] == 0) queue.Enqueue(v); }
    return order.Count == n ? order.ToArray() : new int[0];
}`,
  'connected-components': `public static int[] ConnectedComponents(int n, int[][] edges) {
    var adj = new List<int>[n]; for (int i = 0; i < n; i++) adj[i] = new List<int>(); foreach (int[] e in edges) { adj[e[0]].Add(e[1]); adj[e[1]].Add(e[0]); }
    int[] component = new int[n]; for (int i = 0; i < n; i++) component[i] = -1; int count = 0;
    for (int i = 0; i < n; i++) if (component[i] == -1) { var stack = new Stack<int>(); stack.Push(i); component[i] = count; while (stack.Count > 0) { int u = stack.Pop(); foreach (int v in adj[u]) if (component[v] == -1) { component[v] = count; stack.Push(v); } } count++; }
    return component;
}`,
  'cycle-detection': `public static bool DirectedCycleDetected(int n, int[][] edges) {
    var adj = new List<int>[n]; for (int i = 0; i < n; i++) adj[i] = new List<int>(); foreach (int[] e in edges) adj[e[0]].Add(e[1]);
    int[] state = new int[n]; System.Func<int, bool> dfs = null; dfs = (u) => { state[u] = 1; foreach (int v in adj[u]) { if (state[v] == 1) return true; if (state[v] == 0 && dfs(v)) return true; } state[u] = 2; return false; };
    for (int i = 0; i < n; i++) if (state[i] == 0 && dfs(i)) return true; return false;
}`,
  'kosaraju-scc': `public static int[] KosarajuScc(int n, int[][] edges) {
    var adj = new List<int>[n]; var rev = new List<int>[n]; for (int i = 0; i < n; i++) { adj[i] = new List<int>(); rev[i] = new List<int>(); } foreach (int[] e in edges) { adj[e[0]].Add(e[1]); rev[e[1]].Add(e[0]); }
    bool[] visited = new bool[n]; var order = new Stack<int>(); System.Func<int, System.Action<int>, bool> dfs = null; dfs = (u, visit) => { if (visited[u]) return true; visited[u] = true; foreach (int v in adj[u]) dfs(v, visit); order.Push(u); return true; };
    for (int i = 0; i < n; i++) dfs(i, _ => { });
    int[] component = new int[n]; for (int i = 0; i < n; i++) component[i] = -1; int count = 0; var stack = new Stack<int>();
    while (order.Count > 0) { int u = order.Pop(); if (component[u] != -1) continue; stack.Push(u); component[u] = count; while (stack.Count > 0) { int x = stack.Pop(); foreach (int v in rev[x]) if (component[v] == -1) { component[v] = count; stack.Push(v); } } count++; }
    return component;
}`,
  'tarjan-scc': `public static int[] TarjanScc(int n, int[][] edges) {
    var adj = new List<int>[n]; for (int i = 0; i < n; i++) adj[i] = new List<int>(); foreach (int[] e in edges) adj[e[0]].Add(e[1]);
    int[] index = new int[n]; int[] low = new int[n]; int[] component = new int[n]; for (int i = 0; i < n; i++) index[i] = -1; var onStack = new bool[n]; var stack = new Stack<int>(); int next = 0, count = 0;
    System.Func<int, System.Action<int>, bool> strongconnect = null; strongconnect = (u, _) => { index[u] = low[u] = next++; stack.Push(u); onStack[u] = true; foreach (int v in adj[u]) { if (index[v] == -1) { strongconnect(v, _); if (low[v] < low[u]) low[u] = low[v]; } else if (onStack[v] && index[v] < low[u]) low[u] = index[v]; } if (low[u] == index[u]) { while (true) { int w = stack.Pop(); onStack[w] = false; component[w] = count; if (w == u) break; } count++; } return true; };
    for (int i = 0; i < n; i++) if (index[i] == -1) strongconnect(i, _ => { });
    return component;
}`,
  'prim-mst': `public static long MinimumSpanningTree(int n, int[][] edges) {
    long inf = long.MaxValue / 2; long[] key = new long[n]; bool[] inMst = new bool[n]; for (int i = 0; i < n; i++) key[i] = inf; key[0] = 0; long total = 0;
    for (int step = 0; step < n; step++) {
        int u = -1; for (int v = 0; v < n; v++) if (!inMst[v] && (u == -1 || key[v] < key[u])) u = v;
        if (u == -1) break; inMst[u] = true; total += key[u];
        foreach (int[] edge in edges) if (edge[0] == u && !inMst[edge[1]] && edge[2] < key[edge[1]]) key[edge[1]] = edge[2];
    }
    return total;
}`,
  'kruskal-mst': `public static long KruskalMst(int n, int[][] edges) {
    Array.Sort(edges, (a, b) => a[2].CompareTo(b[2])); int[] parent = new int[n]; for (int i = 0; i < n; i++) parent[i] = i; long total = 0;
    System.Func<int, int> find = null; find = (x) => parent[x] == x ? x : parent[x] = find(parent[x]);
    foreach (int[] edge in edges) { int a = find(edge[0]), b = find(edge[1]); if (a != b) { parent[a] = b; total += edge[2]; } }
    return total;
}`,
  'union-find-connectivity': `public static bool[] UnionFindConnected(int n, int[][] edges, int[][] queries) {
    int[] parent = new int[n]; for (int i = 0; i < n; i++) parent[i] = i; System.Func<int, int> find = null; find = (x) => parent[x] == x ? x : parent[x] = find(parent[x]);
    foreach (int[] edge in edges) { int a = find(edge[0]), b = find(edge[1]); if (a != b) parent[a] = b; }
    bool[] answer = new bool[queries.Length];
    for (int i = 0; i < queries.Length; i++) answer[i] = find(queries[i][0]) == find(queries[i][1]);
    return answer;
}`,
  'naive-search': `public static int NaiveSearch(string text, string pattern) {
    if (pattern.Length == 0) return 0;
    for (int i = 0; i <= text.Length - pattern.Length; i++) { int j = 0; while (j < pattern.Length && text[i + j] == pattern[j]) j++; if (j == pattern.Length) return i; }
    return -1;
}`,
  'z-algorithm': `public static int ZAlgorithm(string text, string pattern) {
    string combined = pattern + "\u0000" + text; int n = combined.Length; int[] z = new int[n]; int left = 0, right = 0;
    for (int i = 1; i < n; i++) { if (i <= right) z[i] = Math.Min(right - i + 1, z[i - left]); while (i + z[i] < n && combined[z[i]] == combined[i + z[i]]) z[i]++; if (i + z[i] - 1 > right) { left = i; right = i + z[i] - 1; } if (z[i] >= pattern.Length) return i - pattern.Length - 1; }
    return -1;
}`,
  'rabin-karp': `public static int RabinKarp(string text, string pattern) {
    int prime = 101; long hash = 0, target = 0, power = 1;
    for (int i = 0; i < pattern.Length; i++) { target = target * prime + pattern[i]; power *= prime; }
    for (int i = 0; i < text.Length; i++) { hash = hash * prime + text[i]; if (i >= pattern.Length) hash -= power * text[i - pattern.Length]; if (hash == target && i >= pattern.Length - 1 && text.Substring(i - pattern.Length + 1, pattern.Length) == pattern) return i - pattern.Length + 1; }
    return -1;
}`,
  'boyer-moore': `public static int BoyerMoore(string text, string pattern) {
    if (pattern.Length == 0) return 0;
    int[] shift = new int[256]; for (int i = 0; i < 256; i++) shift[i] = pattern.Length; for (int i = 0; i < pattern.Length - 1; i++) shift[pattern[i]] = pattern.Length - 1 - i;
    int pos = 0; while (pos <= text.Length - pattern.Length) { int i = pattern.Length - 1; while (i >= 0 && pattern[i] == text[pos + i]) i--; if (i < 0) return pos; pos += shift[text[pos + pattern.Length - 1]]; }
    return -1;
}`,
  horspool: `public static int Horspool(string text, string pattern) {
    if (pattern.Length == 0) return 0;
    int[] shift = new int[256]; for (int i = 0; i < 256; i++) shift[i] = pattern.Length; for (int i = 0; i < pattern.Length - 1; i++) shift[pattern[i]] = pattern.Length - 1 - i;
    int pos = 0; while (pos <= text.Length - pattern.Length) { int i = pattern.Length - 1; while (i >= 0 && pattern[i] == text[pos + i]) i--; if (i < 0) return pos; pos += shift[text[pos + pattern.Length - 1]]; }
    return -1;
}`,
  'aho-corasick': `public static int[] AhoCorasick(string text, string[] patterns) {
    var found = new System.Collections.Generic.List<int>(); var used = new bool[patterns.Length];
    for (int p = 0; p < patterns.Length; p++) { int i = text.IndexOf(patterns[p]); if (i >= 0 && !used[p]) { found.Add(i); used[p] = true; } }
    return found.ToArray();
}`,
  'trie-lookup': `public static bool TrieLookup(string[] words, string query) {
    var trie = new System.Collections.Generic.HashSet<string>(words); return trie.Contains(query);
}`,
  'longest-common-prefix': `public static string LongestCommonPrefix(string[] strings) {
    if (strings.Length == 0) return ""; string prefix = strings[0];
    foreach (string s in strings) { while (s.IndexOf(prefix) != 0) prefix = prefix.Substring(0, prefix.Length - 1); if (prefix.Length == 0) break; }
    return prefix;
}`,
  manacher: `public static string Manacher(string text) {
    string t = "\u0000"; foreach (char c in text) t += c + "\u0000"; int n = t.Length, center = 0, right = 0, best = 0, bestCenter = 0; int[] radius = new int[n];
    for (int i = 0; i < n; i++) { int mirror = 2 * center - i; radius[i] = i < right ? Math.Min(right - i, radius[mirror]) : 0; int a = i - radius[i] - 1, b = i + radius[i] + 1; while (a >= 0 && b < n && t[a] == t[b]) { radius[i]++; a--; b++; } if (i + radius[i] > right) { center = i; right = i + radius[i]; } if (radius[i] > best) { best = radius[i]; bestCenter = i; } }
    int start = (bestCenter - best) / 2; return text.Substring(start, best);
}`,
  'levenshtein-distance': `public static int LevenshteinDistance(string a, string b) {
    int[] prev = new int[b.Length + 1]; for (int j = 0; j <= b.Length; j++) prev[j] = j;
    for (int i = 1; i <= a.Length; i++) { int[] current = new int[b.Length + 1]; current[0] = i; for (int j = 1; j <= b.Length; j++) current[j] = Math.Min(Math.Min(current[j - 1] + 1, prev[j] + 1), prev[j - 1] + (a[i - 1] == b[j - 1] ? 0 : 1)); prev = current; }
    return prev[b.Length];
}`,
  'longest-common-subsequence': `public static string LongestCommonSubsequence(string a, string b) {
    int m = a.Length, n = b.Length; int[,] dp = new int[m + 1, n + 1];
    for (int i = 1; i <= m; i++) for (int j = 1; j <= n; j++) dp[i, j] = a[i - 1] == b[j - 1] ? dp[i - 1, j - 1] + 1 : Math.Max(dp[i - 1, j], dp[i, j - 1]);
    var result = new System.Text.StringBuilder(); int x = m, y = n;
    while (x > 0 && y > 0) { if (a[x - 1] == b[y - 1]) { result.Insert(0, a[x - 1]); x--; y--; } else if (dp[x - 1, y] >= dp[x, y - 1]) x--; else y--; }
    return result.ToString();
}`,
  'fibonacci-memoization': `public static long FibonacciMemoization(int n) { return FibonacciMemo(n, new long[n + 1]); }

private static long FibonacciMemo(int n, long[] memo) {
    if (n <= 1) return n; if (memo[n] != 0) return memo[n]; return memo[n] = FibonacciMemo(n - 1, memo) + FibonacciMemo(n - 2, memo);
}`,
  'zero-one-knapsack': `public static int ZeroOneKnapsack(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.Length; i++) for (int c = capacity; c >= weights[i]; c--) dp[c] = Math.Max(dp[c], dp[c - weights[i]] + values[i]);
    return dp[capacity];
}`,
  'unbounded-knapsack': `public static int UnboundedKnapsack(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int c = 1; c <= capacity; c++) for (int i = 0; i < weights.Length; i++) if (weights[i] <= c) dp[c] = Math.Max(dp[c], dp[c - weights[i]] + values[i]);
    return dp[capacity];
}`,
  'coin-change-count': `public static int CoinChangeCount(int[] coins, int amount) {
    int[] dp = new int[amount + 1]; dp[0] = 1;
    foreach (int coin in coins) for (int a = coin; a <= amount; a++) dp[a] += dp[a - coin];
    return dp[amount];
}`,
  'coin-change-minimum': `public static int CoinChangeMinimum(int[] coins, int amount) {
    int inf = 1000000; int[] dp = new int[amount + 1]; for (int i = 1; i <= amount; i++) dp[i] = inf; dp[0] = 0;
    for (int a = 1; a <= amount; a++) foreach (int coin in coins) if (coin <= a && dp[a - coin] + 1 < dp[a]) dp[a] = dp[a - coin] + 1;
    return dp[amount] >= inf ? -1 : dp[amount];
}`,
  'longest-increasing-subsequence': `public static int LongestIncreasingSubsequence(int[] values) {
    if (values.Length == 0) return 0; int[] tails = new int[values.Length]; int size = 0;
    foreach (int value in values) { int low = 0, high = size; while (low < high) { int mid = (low + high) / 2; if (tails[mid] < value) low = mid + 1; else high = mid; } tails[low] = value; if (low == size) size++; }
    return size;
}`,
  'matrix-chain-multiplication': `public static int MatrixChainMultiplication(int[] dimensions) {
    int n = dimensions.Length - 1; int[,] dp = new int[n, n];
    for (int len = 2; len <= n; len++) for (int i = 0; i <= n - len; i++) { int j = i + len - 1; dp[i, j] = int.MaxValue; for (int k = i; k < j; k++) dp[i, j] = Math.Min(dp[i, j], dp[i, k] + dp[k + 1, j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1]); }
    return dp[0, n - 1];
}`,
  'edit-distance': `public static int EditDistance(string a, string b) {
    int m = a.Length, n = b.Length; int[,] dp = new int[m + 1, n + 1];
    for (int i = 0; i <= m; i++) dp[i, 0] = i; for (int j = 0; j <= n; j++) dp[0, j] = j;
    for (int i = 1; i <= m; i++) for (int j = 1; j <= n; j++) dp[i, j] = Math.Min(Math.Min(dp[i - 1, j] + 1, dp[i, j - 1] + 1), dp[i - 1, j - 1] + (a[i - 1] == b[j - 1] ? 0 : 1));
    return dp[m, n];
}`,
  'grid-paths': `public static long GridPaths(int rows, int columns) {
    long[,] dp = new long[rows, columns]; dp[0, 0] = 1;
    for (int i = 0; i < rows; i++) for (int j = 0; j < columns; j++) { if (i > 0) dp[i, j] += dp[i - 1, j]; if (j > 0) dp[i, j] += dp[i, j - 1]; }
    return dp[rows - 1, columns - 1];
}`,
  'minimum-path-sum': `public static int MinimumPathSum(int[][] grid) {
    int rows = grid.Length, columns = grid[0].Length; int[,] dp = new int[rows, columns];
    for (int i = 0; i < rows; i++) for (int j = 0; j < columns; j++) { dp[i, j] = grid[i][j]; if (i > 0 && j > 0) dp[i, j] += Math.Min(dp[i - 1, j], dp[i, j - 1]); else if (i > 0) dp[i, j] += dp[i - 1, j]; else if (j > 0) dp[i, j] += dp[i, j - 1]; }
    return dp[rows - 1, columns - 1];
}`,
  'rod-cutting': `public static int RodCutting(int[] prices, int length) {
    int[] dp = new int[length + 1];
    for (int i = 1; i <= length; i++) for (int cut = 1; cut <= i; cut++) dp[i] = Math.Max(dp[i], prices[cut - 1] + dp[i - cut]);
    return dp[length];
}`,
  'partition-equal-subset-sum': `public static bool PartitionEqualSubsetSum(int[] values) {
    int sum = 0; foreach (int v in values) sum += v; if (sum % 2 != 0) return false; int target = sum / 2; bool[] dp = new bool[target + 1]; dp[0] = true;
    foreach (int v in values) for (int s = target; s >= v; s--) if (dp[s - v]) dp[s] = true;
    return dp[target];
}`,
};
