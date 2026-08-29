export const cppSources: Record<string, string> = {
  bubble: `#include <algorithm>
#include <vector>

using namespace std;

void bubbleSort(vector<int>& values) {
    for (int end = static_cast<int>(values.size()) - 1; end > 0; --end) {
        bool swapped = false;
        for (int i = 0; i < end; ++i) {
            if (values[i] > values[i + 1]) {
                swap(values[i], values[i + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
  quick: `#include <algorithm>
#include <vector>

using namespace std;

void quickSort(vector<int>& values) {
    auto sortRange = [&](auto&& self, int low, int high) -> void {
        if (low >= high) return;
        int pivot = values[high], split = low;
        for (int i = low; i < high; ++i) if (values[i] < pivot) swap(values[i], values[split++]);
        swap(values[split], values[high]);
        self(self, low, split - 1); self(self, split + 1, high);
    };
    sortRange(sortRange, 0, static_cast<int>(values.size()) - 1);
}`,
  merge: `#include <algorithm>
#include <iterator>
#include <vector>

using namespace std;

vector<int> mergeSort(const vector<int>& values) {
    if (values.size() < 2) return values;
    size_t middle = values.size() / 2;
    vector<int> left(values.begin(), values.begin() + middle), right(values.begin() + middle, values.end());
    left = mergeSort(left); right = mergeSort(right); vector<int> result;
    result.reserve(values.size()); merge(left.begin(), left.end(), right.begin(), right.end(), back_inserter(result));
    return result;
}`,
  'search-binary-first': `#include <vector>

using namespace std;

int binarySearch(const vector<int>& values, int target) {
    int low = 0, high = static_cast<int>(values.size()) - 1, result = -1;
    while (low <= high) { int middle = low + (high - low) / 2; if (values[middle] >= target) { if (values[middle] == target) result = middle; high = middle - 1; } else low = middle + 1; }
    return result;
}`,
  'breadth-first-search': `#include <queue>
#include <vector>

using namespace std;

vector<int> breadthFirstSearch(const vector<vector<int>>& graph, int start) {
    vector<int> order; vector<bool> seen(graph.size()); queue<int> pending; pending.push(start); seen[start] = true;
    while (!pending.empty()) { int vertex = pending.front(); pending.pop(); order.push_back(vertex); for (int next : graph[vertex]) if (!seen[next]) { seen[next] = true; pending.push(next); } }
    return order;
}`,
  kmp: `#include <string>
#include <vector>

using namespace std;

int kmpSearch(const string& text, const string& pattern) {
    if (pattern.empty()) return 0; vector<int> table(pattern.size());
    for (size_t i = 1, matched = 0; i < pattern.size();) if (pattern[i] == pattern[matched]) table[i++] = ++matched; else if (matched) matched = table[matched - 1]; else table[i++] = 0;
    for (size_t i = 0, matched = 0; i < text.size();) { if (text[i] == pattern[matched]) { ++i; if (++matched == pattern.size()) return static_cast<int>(i - matched); } else if (matched) matched = table[matched - 1]; else ++i; }
    return -1;
}`,
  'fibonacci-tabulation': `#include <stdexcept>
#include <vector>

using namespace std;

long long fibonacciTabulation(int n) {
    if (n < 0) throw invalid_argument("n must be nonnegative"); vector<long long> table(n + 1); if (n > 0) table[1] = 1;
    for (int i = 2; i <= n; ++i) table[i] = table[i - 1] + table[i - 2]; return table[n];
}`,
  selection: `#include <algorithm>
#include <vector>

using namespace std;

void selectionSort(vector<int>& values) {
    for (int start = 0; start < static_cast<int>(values.size()) - 1; ++start) {
        int minimum = start;
        for (int index = start + 1; index < static_cast<int>(values.size()); ++index)
            if (values[index] < values[minimum]) minimum = index;
        if (minimum != start) swap(values[start], values[minimum]);
    }
}`,
  insertion: `#include <algorithm>
#include <vector>

using namespace std;

void insertionSort(vector<int>& values) {
    for (int index = 1; index < static_cast<int>(values.size()); ++index) {
        int item = values[index], position = index - 1;
        while (position >= 0 && item < values[position]) { values[position + 1] = values[position]; --position; }
        values[position + 1] = item;
    }
}`,
  cocktail: `#include <algorithm>
#include <vector>

using namespace std;

void cocktailSort(vector<int>& values) {
    int lower = 0, upper = static_cast<int>(values.size()) - 1;
    bool changed = true;
    while (changed && lower < upper) {
        changed = false;
        for (int index = lower; index < upper; ++index) if (values[index + 1] < values[index]) { swap(values[index], values[index + 1]); changed = true; }
        --upper;
        if (!changed) break;
        changed = false;
        for (int index = upper; index > lower; --index) if (values[index] < values[index - 1]) { swap(values[index], values[index - 1]); changed = true; }
        ++lower;
    }
}`,
  gnome: `#include <algorithm>
#include <vector>

using namespace std;

void gnomeSort(vector<int>& values) {
    int index = 1;
    while (index < static_cast<int>(values.size())) {
        if (index == 0 || !(values[index] < values[index - 1])) ++index;
        else { swap(values[index], values[index - 1]); --index; }
    }
}`,
  shell: `#include <algorithm>
#include <vector>

using namespace std;

void shellSort(vector<int>& values) {
    for (int gap = static_cast<int>(values.size()) / 2; gap > 0; gap /= 2)
        for (int index = gap; index < static_cast<int>(values.size()); ++index) {
            int item = values[index], position = index;
            while (position >= gap && item < values[position - gap]) { values[position] = values[position - gap]; position -= gap; }
            values[position] = item;
        }
}`,
  heap: `#include <algorithm>
#include <vector>

using namespace std;

void heapSort(vector<int>& values) {
    auto siftDown = [&](int root, int upper) {
        while (2 * root + 1 < upper) {
            int child = 2 * root + 1;
            if (child + 1 < upper && values[child] < values[child + 1]) ++child;
            if (!(values[root] < values[child])) break;
            swap(values[root], values[child]);
            root = child;
        }
    };
    for (int root = static_cast<int>(values.size()) / 2 - 1; root >= 0; --root) siftDown(root, static_cast<int>(values.size()));
    for (int upper = static_cast<int>(values.size()) - 1; upper > 0; --upper) { swap(values[0], values[upper]); siftDown(0, upper); }
}`,
  cycle: `#include <algorithm>
#include <vector>

using namespace std;

void cycleSort(vector<int>& values) {
    auto equivalent = [](int left, int right) { return !(left < right) && !(right < left); };
    for (int cycleStart = 0; cycleStart < static_cast<int>(values.size()) - 1; ++cycleStart) {
        int item = values[cycleStart], position = cycleStart;
        for (int index = cycleStart + 1; index < static_cast<int>(values.size()); ++index) if (values[index] < item) ++position;
        if (position == cycleStart) continue;
        while (equivalent(item, values[position])) ++position;
        swap(item, values[position]);
        while (position != cycleStart) {
            position = cycleStart;
            for (int index = cycleStart + 1; index < static_cast<int>(values.size()); ++index) if (values[index] < item) ++position;
            while (equivalent(item, values[position])) ++position;
            swap(item, values[position]);
        }
    }
}`,
  comb: `#include <algorithm>
#include <vector>

using namespace std;

void combSort(vector<int>& values) {
    int gap = static_cast<int>(values.size());
    bool swapped = true;
    while (gap > 1 || swapped) {
        gap = max(1, (gap * 10) / 13);
        swapped = false;
        for (int index = 0; index < static_cast<int>(values.size()) - gap; ++index) {
            int other = index + gap;
            if (values[index] > values[other]) { swap(values[index], values[other]); swapped = true; }
        }
    }
}`,
  'odd-even': `#include <algorithm>
#include <vector>

using namespace std;

void oddEvenSort(vector<int>& values) {
    bool changed = true;
    while (changed) {
        changed = false;
        for (int start = 1; start >= 0; --start)
            for (int index = start; index < static_cast<int>(values.size()) - 1; index += 2)
                if (values[index] > values[index + 1]) { swap(values[index], values[index + 1]); changed = true; }
    }
}`,
  pancake: `#include <algorithm>
#include <vector>

using namespace std;

void pancakeSort(vector<int>& values) {
    auto flip = [&](int end) {
        int left = 0;
        while (left < end) { swap(values[left], values[end]); ++left; --end; }
    };
    for (int size = static_cast<int>(values.size()); size > 1; --size) {
        int maximum = 0;
        for (int index = 1; index < size; ++index) if (values[index] > values[maximum]) maximum = index;
        if (maximum == size - 1) continue;
        if (maximum != 0) flip(maximum);
        flip(size - 1);
    }
}`,
  'binary-insertion': `#include <algorithm>
#include <vector>

using namespace std;

void binaryInsertionSort(vector<int>& values) {
    for (int index = 1; index < static_cast<int>(values.size()); ++index) {
        int current = values[index], left = 0, right = index;
        while (left < right) {
            int middle = (left + right) / 2;
            if (current < values[middle]) right = middle; else left = middle + 1;
        }
        int position = index;
        while (position > left) { values[position] = values[position - 1]; --position; }
        values[left] = current;
    }
}`,
  'three-way-quick': `#include <algorithm>
#include <vector>

using namespace std;

void threeWayQuickSort(vector<int>& values) {
    auto quickSort = [&](auto&& self, int lower, int upper) -> void {
        if (lower >= upper) return;
        int pivot = values[lower], less = lower, index = lower + 1, greater = upper;
        while (index <= greater) {
            if (values[index] < pivot) { swap(values[less], values[index]); ++less; ++index; }
            else if (pivot < values[index]) { swap(values[index], values[greater]); --greater; }
            else ++index;
        }
        self(self, lower, less - 1);
        self(self, greater + 1, upper);
    };
    quickSort(quickSort, 0, static_cast<int>(values.size()) - 1);
}`,
  'natural-merge': `#include <algorithm>
#include <utility>
#include <vector>

using namespace std;

void naturalMergeSort(vector<int>& values) {
    if (values.size() < 2) return;
    vector<pair<int, int>> runs;
    int start = 0;
    for (int index = 1; index < static_cast<int>(values.size()); ++index) if (values[index] < values[index - 1]) { runs.push_back({start, index}); start = index; }
    runs.push_back({start, static_cast<int>(values.size())});
    while (runs.size() > 1) {
        vector<pair<int, int>> mergedRuns;
        for (size_t runIndex = 0; runIndex < runs.size();) {
            if (runIndex + 1 >= runs.size()) { mergedRuns.push_back(runs[runIndex]); break; }
            int left = runs[runIndex].first, middle = runs[runIndex].second, right = runs[runIndex + 1].second;
            int first = left, second = middle;
            vector<int> buffer;
            while (first < middle && second < right) {
                if (!(values[second] < values[first])) buffer.push_back(values[first++]);
                else buffer.push_back(values[second++]);
            }
            while (first < middle) buffer.push_back(values[first++]);
            while (second < right) buffer.push_back(values[second++]);
            for (size_t offset = 0; offset < buffer.size(); ++offset) values[left + offset] = buffer[offset];
            mergedRuns.push_back({left, right});
            runIndex += 2;
        }
        runs = mergedRuns;
    }
}`,
  'hoare-quick': `#include <algorithm>
#include <vector>

using namespace std;

void hoareQuickSort(vector<int>& values) {
    auto quickSort = [&](auto&& self, int lower, int upper) -> void {
        if (lower >= upper) return;
        int pivot = values[(lower + upper) / 2], left = lower, right = upper;
        while (left <= right) {
            while (values[left] < pivot) ++left;
            while (pivot < values[right]) --right;
            if (left <= right) { swap(values[left], values[right]); ++left; --right; }
        }
        self(self, lower, right);
        self(self, left, upper);
    };
    quickSort(quickSort, 0, static_cast<int>(values.size()) - 1);
}`,
  'dual-pivot-quick': `#include <algorithm>
#include <vector>

using namespace std;

void dualPivotQuickSort(vector<int>& values) {
    auto quickSort = [&](auto&& self, int lower, int upper) -> void {
        if (lower >= upper) return;
        if (values[upper] < values[lower]) swap(values[lower], values[upper]);
        int leftPivot = values[lower], rightPivot = values[upper];
        int less = lower + 1, greater = upper - 1, index = less;
        while (index <= greater) {
            if (values[index] < leftPivot) { swap(values[index], values[less]); ++less; }
            else if (rightPivot < values[index]) {
                while (index < greater && rightPivot < values[greater]) --greater;
                swap(values[index], values[greater]); --greater;
                if (values[index] < leftPivot) { swap(values[index], values[less]); ++less; }
            }
            ++index;
        }
        --less; ++greater;
        swap(values[lower], values[less]);
        swap(values[upper], values[greater]);
        self(self, lower, less - 1);
        if (leftPivot < rightPivot) self(self, less + 1, greater - 1);
        self(self, greater + 1, upper);
    };
    quickSort(quickSort, 0, static_cast<int>(values.size()) - 1);
}`,
  'median-three-quick': `#include <algorithm>
#include <vector>

using namespace std;

void medianThreeQuickSort(vector<int>& values) {
    auto quickSort = [&](auto&& self, int lower, int upper) -> void {
        if (lower >= upper) return;
        int middle = (lower + upper) / 2;
        if (values[middle] < values[lower]) swap(values[lower], values[middle]);
        if (values[upper] < values[lower]) swap(values[lower], values[upper]);
        if (values[upper] < values[middle]) swap(values[middle], values[upper]);
        int pivot = values[middle], left = lower, right = upper;
        while (left <= right) {
            while (values[left] < pivot) ++left;
            while (pivot < values[right]) --right;
            if (left <= right) { swap(values[left], values[right]); ++left; --right; }
        }
        self(self, lower, right);
        self(self, left, upper);
    };
    quickSort(quickSort, 0, static_cast<int>(values.size()) - 1);
}`,
  'bottom-up-merge': `#include <algorithm>
#include <vector>

using namespace std;

void bottomUpMergeSort(vector<int>& values) {
    int length = static_cast<int>(values.size());
    vector<int> auxiliary(length);
    for (int width = 1; width < length; width *= 2) {
        for (int lower = 0; lower < length; lower += 2 * width) {
            int middle = min(lower + width, length), upper = min(lower + 2 * width, length);
            for (int index = lower; index < upper; ++index) auxiliary[index] = values[index];
            int left = lower, right = middle, destination = lower;
            while (destination < upper) {
                if (left >= middle) values[destination++] = auxiliary[right++];
                else if (right >= upper) values[destination++] = auxiliary[left++];
                else if (auxiliary[right] < auxiliary[left]) values[destination++] = auxiliary[right++];
                else values[destination++] = auxiliary[left++];
            }
        }
    }
}`,
  'in-place-merge': `#include <algorithm>
#include <vector>

using namespace std;

void inPlaceMergeSort(vector<int>& values) {
    auto merge = [&](int lower, int middle, int upper) {
        int left = lower, right = middle;
        while (left < right && right < upper) {
            if (!(values[right] < values[left])) { ++left; continue; }
            int temporary = values[right], index = right;
            while (index > left) { values[index] = values[index - 1]; --index; }
            values[left] = temporary;
            ++left; ++right;
        }
    };
    auto mergeSort = [&](auto&& self, int lower, int upper) -> void {
        if (upper - lower < 2) return;
        int middle = (lower + upper) / 2;
        self(self, lower, middle);
        self(self, middle, upper);
        merge(lower, middle, upper);
    };
    mergeSort(mergeSort, 0, static_cast<int>(values.size()));
}`,
  intro: `#include <algorithm>
#include <tuple>
#include <vector>

using namespace std;

void introSort(vector<int>& values) {
    int length = static_cast<int>(values.size());
    if (length < 2) return;
    auto swapAt = [&](int first, int second) { if (first != second) swap(values[first], values[second]); };
    auto insertionSort = [&](int lower, int upper) {
        for (int index = lower + 1; index < upper; ++index) {
            int item = values[index], position = index;
            while (position > lower && item < values[position - 1]) { values[position] = values[position - 1]; --position; }
            values[position] = item;
        }
    };
    auto heapSort = [&](int lower, int upper) {
        int size = upper - lower;
        auto siftDown = [&](int root, int count) {
            while (2 * root + 1 < count) {
                int child = 2 * root + 1;
                if (child + 1 < count && values[lower + child] < values[lower + child + 1]) ++child;
                if (!(values[lower + root] < values[lower + child])) return;
                swapAt(lower + root, lower + child);
                root = child;
            }
        };
        for (int root = size / 2 - 1; root >= 0; --root) siftDown(root, size);
        for (int end = size - 1; end > 0; --end) { swapAt(lower, lower + end); siftDown(0, end); }
    };
    int depthLimit = 0, remaining = length;
    while (remaining > 1) { depthLimit += 2; remaining /= 2; }
    const int threshold = 16;
    vector<tuple<int, int, int>> pending{make_tuple(0, length, depthLimit)};
    while (!pending.empty()) {
        auto current = pending.back(); pending.pop_back();
        int lower = get<0>(current), upper = get<1>(current), depth = get<2>(current);
        while (upper - lower > threshold) {
            if (depth == 0) { heapSort(lower, upper); lower = upper; break; }
            --depth;
            int middle = lower + (upper - lower) / 2, last = upper - 1;
            if (values[middle] < values[lower]) swapAt(middle, lower);
            if (values[last] < values[middle]) swapAt(last, middle);
            if (values[middle] < values[lower]) swapAt(middle, lower);
            swapAt(middle, last);
            int pivot = values[last], boundary = lower;
            for (int index = lower; index < last; ++index) if (values[index] < pivot) { swapAt(boundary, index); ++boundary; }
            swapAt(boundary, last);
            if (boundary - lower < upper - boundary - 1) { pending.push_back(make_tuple(boundary + 1, upper, depth)); upper = boundary; }
            else { pending.push_back(make_tuple(lower, boundary, depth)); lower = boundary + 1; }
        }
        if (lower < upper) insertionSort(lower, upper);
    }
}`,
  tim: `#include <algorithm>
#include <utility>
#include <vector>

using namespace std;

void timSort(vector<int>& values) {
    int length = static_cast<int>(values.size());
    if (length < 2) return;
    auto reverse = [&](int lower, int upper) { --upper; while (lower < upper) { swap(values[lower], values[upper]); ++lower; --upper; } };
    auto insertionSort = [&](int lower, int upper, int start) {
        for (int index = start; index < upper; ++index) {
            int item = values[index], position = index;
            while (position > lower && item < values[position - 1]) { values[position] = values[position - 1]; --position; }
            values[position] = item;
        }
    };
    auto merge = [&](int left, int middle, int right) {
        vector<int> buffer;
        for (int index = left; index < middle; ++index) buffer.push_back(values[index]);
        int first = 0, second = middle, destination = left;
        while (first < static_cast<int>(buffer.size()) && second < right) {
            if (values[second] < buffer[first]) values[destination++] = values[second++];
            else values[destination++] = buffer[first++];
        }
        while (first < static_cast<int>(buffer.size())) values[destination++] = buffer[first++];
    };
    int minrun = length, remainder = 0;
    while (minrun >= 64) { remainder |= minrun & 1; minrun >>= 1; }
    minrun += remainder;
    vector<pair<int, int>> runs;
    auto mergeAt = [&](int index) {
        int left = runs[index].first, leftSize = runs[index].second, rightSize = runs[index + 1].second;
        merge(left, left + leftSize, left + leftSize + rightSize);
        runs[index] = make_pair(left, leftSize + rightSize);
        runs.erase(runs.begin() + index + 1);
    };
    int start = 0;
    while (start < length) {
        int end = start + 1;
        if (end < length) {
            if (values[end] < values[start]) {
                ++end;
                while (end < length && values[end] < values[end - 1]) ++end;
                reverse(start, end);
            } else {
                ++end;
                while (end < length && !(values[end] < values[end - 1])) ++end;
            }
        }
        int forcedEnd = start + minrun;
        if (forcedEnd > length) forcedEnd = length;
        if (end < forcedEnd) { insertionSort(start, forcedEnd, end); end = forcedEnd; }
        runs.push_back(make_pair(start, end - start));
        while (runs.size() > 1) {
            int count = static_cast<int>(runs.size());
            if (count >= 3 && runs[count - 3].second <= runs[count - 2].second + runs[count - 1].second) {
                if (runs[count - 3].second < runs[count - 1].second) mergeAt(count - 3);
                else mergeAt(count - 2);
            } else if (runs[count - 2].second <= runs[count - 1].second) mergeAt(count - 2);
            else break;
        }
        start = end;
    }
    while (runs.size() > 1) mergeAt(static_cast<int>(runs.size()) - 2);
}`,
  tournament: `#include <algorithm>
#include <vector>

using namespace std;

void tournamentSort(vector<int>& values) {
    int length = static_cast<int>(values.size());
    if (length < 2) return;
    vector<int> contenders(values);
    int leafCount = 1;
    while (leafCount < length) leafCount *= 2;
    vector<int> tree(2 * leafCount, -1);
    for (int index = 0; index < length; ++index) tree[leafCount + index] = index;
    auto winner = [&](int first, int second) -> int {
        if (first == -1) return second;
        if (second == -1) return first;
        if (contenders[second] < contenders[first]) return second;
        return first;
    };
    for (int node = leafCount - 1; node > 0; --node) tree[node] = winner(tree[2 * node], tree[2 * node + 1]);
    for (int destination = 0; destination < length; ++destination) {
        int champion = tree[1];
        values[destination] = contenders[champion];
        int node = leafCount + champion;
        tree[node] = -1;
        node /= 2;
        while (node) { tree[node] = winner(tree[2 * node], tree[2 * node + 1]); node /= 2; }
    }
}`,
  patience: `#include <algorithm>
#include <vector>

using namespace std;

void patienceSort(vector<int>& values) {
    int length = static_cast<int>(values.size());
    if (length < 2) return;
    vector<vector<int>> piles;
    for (int index = 0; index < length; ++index) {
        int item = values[index], lower = 0, upper = static_cast<int>(piles.size());
        while (lower < upper) {
            int middle = lower + (upper - lower) / 2;
            if (piles[middle].back() < item) lower = middle + 1; else upper = middle;
        }
        if (lower == static_cast<int>(piles.size())) piles.push_back({item});
        else piles[lower].push_back(item);
    }
    vector<int> heap;
    auto comesFirst = [&](int first, int second) { return piles[first].back() < piles[second].back(); };
    auto push = [&](int pileIndex) {
        heap.push_back(pileIndex);
        int child = static_cast<int>(heap.size()) - 1;
        while (child > 0) {
            int parent = (child - 1) / 2;
            if (!comesFirst(heap[child], heap[parent])) break;
            swap(heap[child], heap[parent]);
            child = parent;
        }
    };
    auto popMinimum = [&]() -> int {
        int minimum = heap[0], last = heap.back(); heap.pop_back();
        if (!heap.empty()) {
            heap[0] = last;
            int parent = 0;
            while (2 * parent + 1 < static_cast<int>(heap.size())) {
                int child = 2 * parent + 1;
                if (child + 1 < static_cast<int>(heap.size()) && comesFirst(heap[child + 1], heap[child])) ++child;
                if (!comesFirst(heap[child], heap[parent])) break;
                swap(heap[parent], heap[child]);
                parent = child;
            }
        }
        return minimum;
    };
    for (int pileIndex = 0; pileIndex < static_cast<int>(piles.size()); ++pileIndex) push(pileIndex);
    for (int destination = 0; destination < length; ++destination) {
        int pileIndex = popMinimum();
        values[destination] = piles[pileIndex].back();
        piles[pileIndex].pop_back();
        if (!piles[pileIndex].empty()) push(pileIndex);
    }
}`,
  tree: `#include <vector>

using namespace std;

void treeSort(vector<int>& values) {
    int length = static_cast<int>(values.size());
    if (length < 2) return;
    struct Node { int value; Node* left; Node* right; int count; };
    Node* root = new Node{values[0], nullptr, nullptr, 1};
    for (int index = 1; index < length; ++index) {
        int item = values[index];
        Node* node = root;
        while (true) {
            if (item < node->value) { if (!node->left) { node->left = new Node{item, nullptr, nullptr, 1}; break; } node = node->left; }
            else if (node->value < item) { if (!node->right) { node->right = new Node{item, nullptr, nullptr, 1}; break; } node = node->right; }
            else { ++node->count; break; }
        }
    }
    vector<Node*> stack;
    Node* node = root;
    int destination = 0;
    while (!stack.empty() || node) {
        while (node) { stack.push_back(node); node = node->left; }
        node = stack.back(); stack.pop_back();
        for (int count = 0; count < node->count; ++count) values[destination++] = node->value;
        node = node->right;
    }
}`,
  strand: `#include <algorithm>
#include <vector>

using namespace std;

void strandSort(vector<int>& values) {
    if (values.size() < 2) return;
    vector<int> remaining(values), result;
    while (!remaining.empty()) {
        vector<int> strand{remaining[0]};
        remaining.erase(remaining.begin());
        int index = 0;
        while (index < static_cast<int>(remaining.size())) {
            if (!(remaining[index] < strand.back())) { strand.push_back(remaining[index]); remaining.erase(remaining.begin() + index); }
            else ++index;
        }
        vector<int> merged;
        size_t resultIndex = 0, strandIndex = 0;
        while (resultIndex < result.size() && strandIndex < strand.size()) {
            if (!(strand[strandIndex] < result[resultIndex])) merged.push_back(result[resultIndex++]);
            else merged.push_back(strand[strandIndex++]);
        }
        while (resultIndex < result.size()) merged.push_back(result[resultIndex++]);
        while (strandIndex < strand.size()) merged.push_back(strand[strandIndex++]);
        result = merged;
    }
    values = result;
}`,
  counting: `#include <algorithm>
#include <unordered_map>
#include <vector>

using namespace std;

void countingSort(vector<int>& values) {
    if (values.empty()) return;
    int minimum = values[0], maximum = values[0];
    for (int value : values) { if (value < minimum) minimum = value; if (value > maximum) maximum = value; }
    long long range = static_cast<long long>(maximum) - minimum + 1;
    if (range > max(1000000LL, static_cast<long long>(values.size()) * 100LL)) {
        unordered_map<int, vector<int>> groups;
        vector<int> orderedKeys;
        for (int value : values) { if (groups.find(value) == groups.end()) { groups[value] = {}; orderedKeys.push_back(value); } groups[value].push_back(value); }
        sort(orderedKeys.begin(), orderedKeys.end());
        int destination = 0;
        for (int key : orderedKeys) for (int value : groups[key]) values[destination++] = value;
        return;
    }
    vector<int> counts(static_cast<size_t>(range), 0);
    for (int key : values) counts[key - minimum]++;
    for (size_t index = 1; index < counts.size(); ++index) counts[index] += counts[index - 1];
    vector<int> output(values.size());
    for (int index = static_cast<int>(values.size()) - 1; index >= 0; --index) {
        int countIndex = values[index] - minimum;
        counts[countIndex]--;
        output[counts[countIndex]] = values[index];
    }
    values = output;
}`,
  'radix-lsd': `#include <algorithm>
#include <vector>

using namespace std;

void radixLsdSort(vector<int>& values) {
    if (values.empty()) return;
    int minimum = values[0], maximum = values[0];
    for (int value : values) { if (value < minimum) minimum = value; if (value > maximum) maximum = value; }
    vector<int> items(values), keys(values.size());
    for (size_t index = 0; index < items.size(); ++index) keys[index] = items[index] - minimum;
    int largest = maximum - minimum;
    for (int place = 1; largest / place > 0; place *= 10) {
        vector<int> counts(10, 0);
        for (int key : keys) counts[(key / place) % 10]++;
        for (int index = 1; index < 10; ++index) counts[index] += counts[index - 1];
        vector<int> nextItems(items.size()), nextKeys(items.size());
        for (int index = static_cast<int>(items.size()) - 1; index >= 0; --index) {
            int digit = (keys[index] / place) % 10;
            counts[digit]--;
            nextItems[counts[digit]] = items[index];
            nextKeys[counts[digit]] = keys[index];
        }
        items = nextItems;
        keys = nextKeys;
    }
    values = items;
}`,
  bucket: `#include <algorithm>
#include <vector>

using namespace std;

void bucketSort(vector<double>& values) {
    if (values.size() < 2) return;
    double minimum = values[0], maximum = values[0];
    for (double value : values) { if (value < minimum) minimum = value; if (value > maximum) maximum = value; }
    if (!(minimum < maximum) && !(maximum < minimum)) return;
    int bucketCount = static_cast<int>(values.size());
    vector<vector<double>> buckets(bucketCount);
    double span = maximum - minimum;
    for (double value : values) {
        int bucketIndex = static_cast<int>((value - minimum) * (bucketCount - 1) / span);
        if (bucketIndex < 0) bucketIndex = 0;
        else if (bucketIndex >= bucketCount) bucketIndex = bucketCount - 1;
        buckets[bucketIndex].push_back(value);
    }
    for (auto& bucket : buckets) {
        for (int index = 1; index < static_cast<int>(bucket.size()); ++index) {
            double item = bucket[index];
            int position = index;
            while (position > 0 && item < bucket[position - 1]) { bucket[position] = bucket[position - 1]; --position; }
            bucket[position] = item;
        }
    }
    int destination = 0;
    for (auto& bucket : buckets) for (double item : bucket) values[destination++] = item;
}`,
  'search-linear-first': `#include <vector>

using namespace std;

int linearSearch(const vector<int>& values, int target) {
    for (int index = 0; index < static_cast<int>(values.size()); ++index) if (values[index] == target) return index;
    return -1;
}`,
  'search-sentinel-first': `#include <vector>

using namespace std;

int sentinelSearch(vector<int> values, int target) {
    int originalLength = static_cast<int>(values.size());
    values.push_back(target);
    int index = 0;
    while (values[index] != target) ++index;
    return index < originalLength ? index : -1;
}`,
  'search-lower-bound': `#include <vector>

using namespace std;

int lowerBound(const vector<int>& values, int target) {
    int left = 0, right = static_cast<int>(values.size());
    while (left < right) {
        int middle = (left + right) / 2;
        if (values[middle] < target) left = middle + 1; else right = middle;
    }
    return left;
}`,
  'search-upper-bound': `#include <vector>

using namespace std;

int upperBound(const vector<int>& values, int target) {
    int left = 0, right = static_cast<int>(values.size());
    while (left < right) {
        int middle = (left + right) / 2;
        if (target < values[middle]) right = middle; else left = middle + 1;
    }
    return left;
}`,
  'search-jump-first': `#include <algorithm>
#include <cmath>
#include <vector>

using namespace std;

int jumpSearch(const vector<int>& values, int target) {
    int length = static_cast<int>(values.size());
    if (length == 0) return -1;
    int step = max(1, static_cast<int>(sqrt(static_cast<double>(length))));
    int blockStart = 0, blockEnd = min(step, length);
    while (values[blockEnd - 1] < target) {
        blockStart = blockEnd;
        if (blockStart >= length) return -1;
        blockEnd = min(blockEnd + step, length);
    }
    for (int index = blockStart; index < blockEnd; ++index) {
        if (values[index] == target) return index;
        if (target < values[index]) break;
    }
    return -1;
}`,
  'search-exponential-first': `#include <algorithm>
#include <vector>

using namespace std;

int exponentialSearch(const vector<int>& values, int target) {
    int length = static_cast<int>(values.size());
    if (length == 0 || target < values[0]) return -1;
    if (values[0] == target) return 0;
    int bound = 1;
    while (bound < length && values[bound] < target) bound *= 2;
    int left = bound / 2, right = min(bound, length - 1), result = -1;
    while (left <= right) {
        int middle = (left + right) / 2;
        if (values[middle] < target) left = middle + 1;
        else { if (values[middle] == target) result = middle; right = middle - 1; }
    }
    return result;
}`,
  'search-interpolation-first': `#include <algorithm>
#include <vector>

using namespace std;

int interpolationSearch(const vector<int>& values, int target) {
    int low = 0, high = static_cast<int>(values.size()) - 1, result = -1;
    while (low <= high && values[low] <= target && target <= values[high]) {
        if (values[low] == values[high]) return values[low] == target ? low : result;
        int position = low + static_cast<int>(static_cast<long long>(target - values[low]) * (high - low) / (values[high] - values[low]));
        position = max(low, min(position, high));
        if (values[position] < target) low = position + 1;
        else { if (values[position] == target) result = position; high = position - 1; }
    }
    return result;
}`,
  'search-fibonacci-first': `#include <algorithm>
#include <vector>

using namespace std;

int fibonacciSearch(const vector<int>& values, int target) {
    int length = static_cast<int>(values.size());
    int smaller = 0, larger = 1, fibonacci = smaller + larger;
    while (fibonacci < length) { smaller = larger; larger = fibonacci; fibonacci = smaller + larger; }
    int offset = -1, result = -1;
    while (fibonacci > 1) {
        int index = min(offset + smaller, length - 1);
        if (values[index] < target) { fibonacci = larger; larger = smaller; smaller = fibonacci - larger; offset = index; }
        else { if (values[index] == target) result = index; fibonacci = smaller; larger = larger - smaller; smaller = fibonacci - larger; }
    }
    int candidate = offset + 1;
    if (candidate < length && values[candidate] == target) result = candidate;
    return result;
}`,
  'search-quickselect-kth': `#include <algorithm>
#include <stdexcept>
#include <vector>

using namespace std;

int quickselectKth(const vector<int>& input, int k) {
    vector<int> values(input);
    if (k < 0 || k >= static_cast<int>(values.size())) throw invalid_argument("k must be an integer index between 0 and len(values) - 1");
    int left = 0, right = static_cast<int>(values.size()) - 1;
    while (left <= right) {
        int pivot = values[right], destination = left;
        for (int index = left; index < right; ++index) if (values[index] <= pivot) swap(values[destination++], values[index]);
        swap(values[destination], values[right]);
        if (destination == k) return values[destination];
        if (destination < k) left = destination + 1;
        else right = destination - 1;
    }
    return -1;
}`,
  'depth-first-search': `#include <vector>

using namespace std;

vector<int> depthFirstSearch(const vector<vector<int>>& graph, int start) {
    vector<int> order;
    vector<bool> visited(graph.size());
    vector<int> stack{start};
    while (!stack.empty()) {
        int node = stack.back(); stack.pop_back();
        if (visited[node]) continue;
        visited[node] = true;
        order.push_back(node);
        for (int neighbor : graph[node]) if (!visited[neighbor]) stack.push_back(neighbor);
    }
    return order;
}`,
  dijkstra: `#include <limits>
#include <queue>
#include <utility>
#include <vector>

using namespace std;

pair<vector<int>, vector<int>> dijkstra(const vector<vector<pair<int, int>>>& graph, int start) {
    const int INF = numeric_limits<int>::max();
    int size = static_cast<int>(graph.size());
    vector<int> distances(size, INF), previous(size, -1);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> heap;
    distances[start] = 0;
    heap.push({0, start});
    while (!heap.empty()) {
        auto top = heap.top(); heap.pop();
        int distance = top.first, node = top.second;
        if (distance != distances[node]) continue;
        for (auto edge : graph[node]) {
            int neighbor = edge.first, weight = edge.second;
            if (neighbor == start) continue;
            int candidate = distance + weight;
            if (candidate < distances[neighbor] || (candidate == distances[neighbor] && (previous[neighbor] == -1 || node < previous[neighbor]))) {
                distances[neighbor] = candidate;
                previous[neighbor] = node;
                heap.push({candidate, neighbor});
            }
        }
    }
    return make_pair(distances, previous);
}`,
  'bellman-ford': `#include <algorithm>
#include <functional>
#include <limits>
#include <tuple>
#include <utility>
#include <vector>

using namespace std;

tuple<vector<int>, vector<int>, bool> bellmanFord(const vector<tuple<int, int, int>>& edges, int nodeCount, int start, bool directed) {
    const int INF = numeric_limits<int>::max();
    vector<int> distances(nodeCount, INF), previous(nodeCount, -1);
    distances[start] = 0;
    vector<tuple<int, int, int>> arcs = edges;
    if (!directed) for (auto edge : edges) arcs.push_back(make_tuple(get<1>(edge), get<0>(edge), get<2>(edge)));
    sort(arcs.begin(), arcs.end());
    for (int i = 0; i < max(0, nodeCount - 1); ++i) {
        bool changed = false;
        for (auto arc : arcs) {
            int left = get<0>(arc), right = get<1>(arc), weight = get<2>(arc);
            if (distances[left] != INF && distances[left] + weight < distances[right]) {
                distances[right] = distances[left] + weight;
                previous[right] = left;
                changed = true;
            }
        }
        if (!changed) break;
    }
    bool negativeCycle = false;
    for (auto arc : arcs) {
        int left = get<0>(arc), right = get<1>(arc), weight = get<2>(arc);
        if (distances[left] != INF && distances[left] + weight < distances[right]) { negativeCycle = true; break; }
    }
    return make_tuple(distances, previous, negativeCycle);
}`,
  'floyd-warshall': `#include <algorithm>
#include <limits>
#include <tuple>
#include <utility>
#include <vector>

using namespace std;

pair<vector<vector<int>>, bool> floydWarshall(const vector<tuple<int, int, int>>& edges, int nodeCount, bool directed) {
    const int INF = numeric_limits<int>::max();
    vector<vector<int>> distances(nodeCount, vector<int>(nodeCount, INF));
    for (int node = 0; node < nodeCount; ++node) distances[node][node] = 0;
    for (auto edge : edges) {
        int left = get<0>(edge), right = get<1>(edge), weight = get<2>(edge);
        distances[left][right] = min(distances[left][right], weight);
        if (!directed) distances[right][left] = min(distances[right][left], weight);
    }
    for (int middle = 0; middle < nodeCount; ++middle)
        for (int left = 0; left < nodeCount; ++left)
            for (int right = 0; right < nodeCount; ++right)
                if (distances[left][middle] != INF && distances[middle][right] != INF)
                    distances[left][right] = min(distances[left][right], distances[left][middle] + distances[middle][right]);
    bool negativeCycle = false;
    for (int node = 0; node < nodeCount; ++node) if (distances[node][node] < 0) { negativeCycle = true; break; }
    return make_pair(distances, negativeCycle);
}`,
  'a-star': `#include <algorithm>
#include <cmath>
#include <limits>
#include <queue>
#include <tuple>
#include <utility>
#include <vector>

using namespace std;

pair<vector<int>, double> aStar(const vector<vector<pair<int, double>>>& graph, const vector<pair<double, double>>& coordinates, int start, int goal) {
    auto heuristic = [&](int node) {
        double dx = coordinates[node].first - coordinates[goal].first, dy = coordinates[node].second - coordinates[goal].second;
        return sqrt(dx * dx + dy * dy);
    };
    const double INF = numeric_limits<double>::infinity();
    vector<double> distances(coordinates.size(), INF);
    vector<int> previous(coordinates.size(), -1);
    distances[start] = 0;
    priority_queue<tuple<double, double, int>, vector<tuple<double, double, int>>, greater<tuple<double, double, int>>> heap;
    heap.push(make_tuple(heuristic(start), 0.0, start));
    while (!heap.empty()) {
        auto top = heap.top(); heap.pop();
        double distance = get<1>(top);
        int node = get<2>(top);
        if (distance != distances[node]) continue;
        for (auto edge : graph[node]) {
            int neighbor = edge.first;
            double weight = edge.second;
            if (neighbor == start) continue;
            double candidate = distance + weight;
            if (candidate < distances[neighbor] || (candidate == distances[neighbor] && (previous[neighbor] == -1 || node < previous[neighbor]))) {
                distances[neighbor] = candidate;
                previous[neighbor] = node;
                heap.push(make_tuple(candidate + heuristic(neighbor), candidate, neighbor));
            }
        }
    }
    if (distances[goal] == INF) return make_pair(vector<int>(), INF);
    vector<int> path;
    int node = goal;
    while (node != -1) { path.push_back(node); node = previous[node]; }
    reverse(path.begin(), path.end());
    return make_pair(path, distances[goal]);
}`,
  'dfs-topological-sort': `#include <algorithm>
#include <functional>
#include <stdexcept>
#include <vector>

using namespace std;

vector<int> dfsTopologicalSort(const vector<vector<int>>& graph) {
    int n = static_cast<int>(graph.size());
    vector<int> state(n, 0), order;
    function<void(int)> visit = [&](int node) {
        if (state[node] == 1) throw invalid_argument("topological sort requires an acyclic graph");
        if (state[node] == 2) return;
        state[node] = 1;
        for (int neighbor : graph[node]) visit(neighbor);
        state[node] = 2;
        order.push_back(node);
    };
    for (int node = n - 1; node >= 0; --node) if (state[node] == 0) visit(node);
    reverse(order.begin(), order.end());
    return order;
}`,
  'kahn-topological-sort': `#include <algorithm>
#include <queue>
#include <stdexcept>
#include <vector>

using namespace std;

vector<int> kahnTopologicalSort(const vector<vector<int>>& graph) {
    int n = static_cast<int>(graph.size());
    vector<int> indegree(n, 0);
    for (int node = 0; node < n; ++node) for (int neighbor : graph[node]) ++indegree[neighbor];
    priority_queue<int, vector<int>, greater<int>> ready;
    for (int node = 0; node < n; ++node) if (indegree[node] == 0) ready.push(node);
    vector<int> order;
    while (!ready.empty()) {
        int node = ready.top(); ready.pop();
        order.push_back(node);
        vector<int> neighbors(graph[node]);
        sort(neighbors.begin(), neighbors.end());
        for (int neighbor : neighbors) { if (--indegree[neighbor] == 0) ready.push(neighbor); }
    }
    if (order.size() != graph.size()) throw invalid_argument("topological sort requires an acyclic graph");
    return order;
}`,
  'connected-components': `#include <algorithm>
#include <set>
#include <vector>

using namespace std;

vector<vector<int>> connectedComponents(const vector<vector<int>>& graph) {
    int n = static_cast<int>(graph.size());
    vector<bool> visited(n, false);
    vector<vector<int>> components;
    for (int start = 0; start < n; ++start) {
        if (visited[start]) continue;
        vector<int> component, stack{start};
        visited[start] = true;
        while (!stack.empty()) {
            int node = stack.back(); stack.pop_back();
            component.push_back(node);
            set<int> neighbors(graph[node].begin(), graph[node].end());
            for (auto it = neighbors.rbegin(); it != neighbors.rend(); ++it) {
                if (!visited[*it]) { visited[*it] = true; stack.push_back(*it); }
            }
        }
        sort(component.begin(), component.end());
        components.push_back(component);
    }
    return components;
}`,
  'cycle-detection': `#include <functional>
#include <vector>

using namespace std;

bool cycleDetection(const vector<vector<int>>& graph, bool directed) {
    int n = static_cast<int>(graph.size());
    if (directed) {
        vector<int> state(n, 0);
        function<bool(int)> visit = [&](int node) -> bool {
            state[node] = 1;
            for (int neighbor : graph[node]) if (state[neighbor] == 1 || (state[neighbor] == 0 && visit(neighbor))) return true;
            state[node] = 2;
            return false;
        };
        for (int node = 0; node < n; ++node) if (state[node] == 0 && visit(node)) return true;
        return false;
    }
    vector<bool> visited(n, false);
    function<bool(int, int)> visit = [&](int node, int parent) -> bool {
        visited[node] = true;
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) { if (visit(neighbor, node)) return true; }
            else if (neighbor != parent) return true;
        }
        return false;
    };
    for (int node = 0; node < n; ++node) if (!visited[node] && visit(node, -1)) return true;
    return false;
}`,
  'kosaraju-scc': `#include <algorithm>
#include <functional>
#include <vector>

using namespace std;

vector<vector<int>> kosarajuScc(const vector<vector<int>>& graph) {
    int n = static_cast<int>(graph.size());
    vector<vector<int>> reverseGraph(n);
    for (int node = 0; node < n; ++node) for (int neighbor : graph[node]) reverseGraph[neighbor].push_back(node);
    vector<bool> visited(n, false);
    vector<int> finish;
    function<void(int)> first = [&](int node) {
        visited[node] = true;
        vector<int> neighbors(graph[node]);
        sort(neighbors.begin(), neighbors.end());
        for (int neighbor : neighbors) if (!visited[neighbor]) first(neighbor);
        finish.push_back(node);
    };
    for (int node = 0; node < n; ++node) if (!visited[node]) first(node);
    fill(visited.begin(), visited.end(), false);
    vector<vector<int>> components;
    function<void(int, vector<int>&)> second = [&](int node, vector<int>& component) {
        visited[node] = true;
        component.push_back(node);
        vector<int> neighbors(reverseGraph[node]);
        sort(neighbors.begin(), neighbors.end());
        for (int neighbor : neighbors) if (!visited[neighbor]) second(neighbor, component);
    };
    for (auto it = finish.rbegin(); it != finish.rend(); ++it) {
        if (!visited[*it]) { vector<int> component; second(*it, component); sort(component.begin(), component.end()); components.push_back(component); }
    }
    sort(components.begin(), components.end());
    return components;
}`,
  'tarjan-scc': `#include <algorithm>
#include <functional>
#include <vector>

using namespace std;

vector<vector<int>> tarjanScc(const vector<vector<int>>& graph) {
    int n = static_cast<int>(graph.size());
    vector<int> indices(n, -1), low(n, 0), stack;
    vector<bool> onStack(n, false);
    vector<vector<int>> components;
    int index = 0;
    function<void(int)> visit = [&](int node) {
        indices[node] = low[node] = index++;
        stack.push_back(node);
        onStack[node] = true;
        vector<int> neighbors(graph[node]);
        sort(neighbors.begin(), neighbors.end());
        for (int neighbor : neighbors) {
            if (indices[neighbor] == -1) { visit(neighbor); low[node] = min(low[node], low[neighbor]); }
            else if (onStack[neighbor]) low[node] = min(low[node], indices[neighbor]);
        }
        if (low[node] == indices[node]) {
            vector<int> component;
            while (true) { int member = stack.back(); stack.pop_back(); onStack[member] = false; component.push_back(member); if (member == node) break; }
            sort(component.begin(), component.end());
            components.push_back(component);
        }
    };
    for (int node = 0; node < n; ++node) if (indices[node] == -1) visit(node);
    sort(components.begin(), components.end());
    return components;
}`,
  'prim-mst': `#include <algorithm>
#include <functional>
#include <queue>
#include <tuple>
#include <utility>
#include <vector>

using namespace std;

tuple<vector<tuple<int, int, int>>, int, bool> primMst(const vector<tuple<int, int, int>>& edges, int nodeCount) {
    vector<vector<pair<int, int>>> adjacency(nodeCount);
    for (auto edge : edges) {
        int left = get<0>(edge), right = get<1>(edge), weight = get<2>(edge);
        adjacency[left].push_back(make_pair(weight, right));
        adjacency[right].push_back(make_pair(weight, left));
    }
    vector<bool> visited(nodeCount, false);
    vector<tuple<int, int, int>> forest;
    int total = 0;
    using HeapNode = tuple<int, int, int, int, int>;
    for (int root = 0; root < nodeCount; ++root) {
        if (visited[root]) continue;
        visited[root] = true;
        priority_queue<HeapNode, vector<HeapNode>, greater<HeapNode>> heap;
        for (auto item : adjacency[root]) {
            int weight = item.first, neighbor = item.second;
            pair<int, int> ordered = minmax(root, neighbor);
            heap.push(make_tuple(weight, ordered.first, ordered.second, root, neighbor));
        }
        while (!heap.empty()) {
            auto top = heap.top(); heap.pop();
            int weight = get<0>(top), first = get<1>(top), second = get<2>(top), neighbor = get<4>(top);
            if (visited[neighbor]) continue;
            visited[neighbor] = true;
            forest.push_back(make_tuple(first, second, weight));
            total += weight;
            for (auto item : adjacency[neighbor]) {
                int nextWeight = item.first, nextNode = item.second;
                if (!visited[nextNode]) {
                    pair<int, int> ordered = minmax(neighbor, nextNode);
                    heap.push(make_tuple(nextWeight, ordered.first, ordered.second, neighbor, nextNode));
                }
            }
        }
    }
    sort(forest.begin(), forest.end(), [](const auto& a, const auto& b) {
        return make_tuple(get<2>(a), get<0>(a), get<1>(a)) < make_tuple(get<2>(b), get<0>(b), get<1>(b));
    });
    bool connected = nodeCount <= 1 || static_cast<int>(forest.size()) == nodeCount - 1;
    return make_tuple(forest, total, connected);
}`,
  'kruskal-mst': `#include <algorithm>
#include <functional>
#include <tuple>
#include <utility>
#include <vector>

using namespace std;

tuple<vector<tuple<int, int, int>>, int, bool> kruskalMst(const vector<tuple<int, int, int>>& edges, int nodeCount) {
    vector<int> parent(nodeCount), rank(nodeCount, 0);
    for (int i = 0; i < nodeCount; ++i) parent[i] = i;
    function<int(int)> find = [&](int node) {
        while (parent[node] != node) { parent[node] = parent[parent[node]]; node = parent[node]; }
        return node;
    };
    auto union_ = [&](int left, int right) -> bool {
        int leftRoot = find(left), rightRoot = find(right);
        if (leftRoot == rightRoot) return false;
        if (rank[leftRoot] < rank[rightRoot] || (rank[leftRoot] == rank[rightRoot] && leftRoot > rightRoot)) swap(leftRoot, rightRoot);
        parent[rightRoot] = leftRoot;
        if (rank[leftRoot] == rank[rightRoot]) ++rank[leftRoot];
        return true;
    };
    vector<tuple<int, int, int>> normalized;
    for (auto edge : edges) normalized.push_back(make_tuple(get<2>(edge), min(get<0>(edge), get<1>(edge)), max(get<0>(edge), get<1>(edge))));
    sort(normalized.begin(), normalized.end());
    vector<tuple<int, int, int>> forest;
    int total = 0;
    for (auto edge : normalized) {
        int weight = get<0>(edge), left = get<1>(edge), right = get<2>(edge);
        if (union_(left, right)) { forest.push_back(make_tuple(left, right, weight)); total += weight; }
    }
    bool connected = nodeCount <= 1 || static_cast<int>(forest.size()) == nodeCount - 1;
    return make_tuple(forest, total, connected);
}`,
  'union-find-connectivity': `#include <algorithm>
#include <functional>
#include <unordered_map>
#include <utility>
#include <vector>

using namespace std;

pair<vector<bool>, vector<vector<int>>> unionFindConnectivity(const vector<pair<int, int>>& edges, const vector<pair<int, int>>& queries, int nodeCount) {
    vector<int> parent(nodeCount), rank(nodeCount, 0);
    for (int i = 0; i < nodeCount; ++i) parent[i] = i;
    function<int(int)> find = [&](int node) {
        if (parent[node] != node) parent[node] = find(parent[node]);
        return parent[node];
    };
    auto union_ = [&](int left, int right) {
        int leftRoot = find(left), rightRoot = find(right);
        if (leftRoot == rightRoot) return;
        if (rank[leftRoot] < rank[rightRoot] || (rank[leftRoot] == rank[rightRoot] && leftRoot > rightRoot)) swap(leftRoot, rightRoot);
        parent[rightRoot] = leftRoot;
        if (rank[leftRoot] == rank[rightRoot]) ++rank[leftRoot];
    };
    for (auto edge : edges) union_(edge.first, edge.second);
    vector<bool> connected;
    for (auto query : queries) connected.push_back(find(query.first) == find(query.second));
    unordered_map<int, vector<int>> groups;
    for (int node = 0; node < nodeCount; ++node) groups[find(node)].push_back(node);
    vector<vector<int>> components;
    for (auto& group : groups) { sort(group.second.begin(), group.second.end()); components.push_back(group.second); }
    sort(components.begin(), components.end());
    return make_pair(connected, components);
}`,
  'naive-search': `#include <string>

using namespace std;

int naiveSearch(const string& text, const string& pattern) {
    if (pattern.empty()) return 0;
    int limit = static_cast<int>(text.size()) - static_cast<int>(pattern.size()) + 1;
    for (int start = 0; start < limit; ++start) {
        bool matched = true;
        for (int offset = 0; offset < static_cast<int>(pattern.size()); ++offset)
            if (text[start + offset] != pattern[offset]) { matched = false; break; }
        if (matched) return start;
    }
    return -1;
}`,
  'z-algorithm': `#include <algorithm>
#include <string>
#include <vector>

using namespace std;

int zAlgorithm(const string& text, const string& pattern) {
    if (pattern.empty()) return 0;
    vector<int> sequence(pattern.size() + 1 + text.size());
    for (int i = 0; i < static_cast<int>(pattern.size()); ++i) sequence[i] = static_cast<unsigned char>(pattern[i]);
    sequence[pattern.size()] = -1;
    for (int i = 0; i < static_cast<int>(text.size()); ++i) sequence[pattern.size() + 1 + i] = static_cast<unsigned char>(text[i]);
    vector<int> zValues(sequence.size(), 0);
    int left = 0, right = 0;
    for (int index = 1; index < static_cast<int>(sequence.size()); ++index) {
        if (index <= right) zValues[index] = min(right - index + 1, zValues[index - left]);
        while (index + zValues[index] < static_cast<int>(sequence.size()) && sequence[zValues[index]] == sequence[index + zValues[index]]) ++zValues[index];
        if (index + zValues[index] - 1 > right) { left = index; right = index + zValues[index] - 1; }
        if (index > static_cast<int>(pattern.size()) && zValues[index] >= static_cast<int>(pattern.size())) return index - static_cast<int>(pattern.size()) - 1;
    }
    return -1;
}`,
  'rabin-karp': `#include <string>

using namespace std;

int rabinKarp(const string& text, const string& pattern) {
    int patternLength = static_cast<int>(pattern.size());
    if (patternLength == 0) return 0;
    if (patternLength > static_cast<int>(text.size())) return -1;
    const long long base = 257, modulus = 1000000007;
    long long highPlace = 1;
    for (int i = 0; i < patternLength - 1; ++i) highPlace = highPlace * base % modulus;
    long long patternHash = 0, windowHash = 0;
    for (int i = 0; i < patternLength; ++i) {
        patternHash = (patternHash * base + static_cast<unsigned char>(pattern[i])) % modulus;
        windowHash = (windowHash * base + static_cast<unsigned char>(text[i])) % modulus;
    }
    for (int start = 0; start + patternLength <= static_cast<int>(text.size()); ++start) {
        if (patternHash == windowHash && text.substr(start, patternLength) == pattern) return start;
        if (start + patternLength < static_cast<int>(text.size())) {
            windowHash = (windowHash - static_cast<unsigned char>(text[start]) * highPlace) % modulus;
            windowHash = (windowHash * base + static_cast<unsigned char>(text[start + patternLength])) % modulus;
            if (windowHash < 0) windowHash += modulus;
        }
    }
    return -1;
}`,
  'boyer-moore': `#include <algorithm>
#include <string>
#include <unordered_map>
#include <vector>

using namespace std;

int boyerMoore(const string& text, const string& pattern) {
    int patternLength = static_cast<int>(pattern.size());
    if (patternLength == 0) return 0;
    if (patternLength > static_cast<int>(text.size())) return -1;
    unordered_map<char, int> lastPosition;
    for (int i = 0; i < patternLength; ++i) lastPosition[pattern[i]] = i;
    vector<int> shift(patternLength + 1, 0), border(patternLength + 1, 0);
    int left = patternLength, right = patternLength + 1;
    border[left] = right;
    while (left > 0) {
        while (right <= patternLength && pattern[left - 1] != pattern[right - 1]) {
            if (shift[right] == 0) shift[right] = right - left;
            right = border[right];
        }
        --left; --right;
        border[left] = right;
    }
    right = border[0];
    for (int index = 0; index <= patternLength; ++index) {
        if (shift[index] == 0) shift[index] = right;
        if (index == right) right = border[right];
    }
    int start = 0;
    while (start <= static_cast<int>(text.size()) - patternLength) {
        int index = patternLength - 1;
        while (index >= 0 && pattern[index] == text[start + index]) --index;
        if (index < 0) return start;
        auto it = lastPosition.find(text[start + index]);
        int badCharacter = index - (it != lastPosition.end() ? it->second : -1);
        start += max(1, max(badCharacter, shift[index + 1]));
    }
    return -1;
}`,
  horspool: `#include <string>
#include <unordered_map>

using namespace std;

int horspool(const string& text, const string& pattern) {
    int patternLength = static_cast<int>(pattern.size());
    if (patternLength == 0) return 0;
    if (patternLength > static_cast<int>(text.size())) return -1;
    unordered_map<char, int> shifts;
    for (int index = 0; index < patternLength - 1; ++index) shifts[pattern[index]] = patternLength - index - 1;
    int end = patternLength - 1;
    while (end < static_cast<int>(text.size())) {
        int offset = 0;
        while (offset < patternLength && pattern[patternLength - offset - 1] == text[end - offset]) ++offset;
        if (offset == patternLength) return end - patternLength + 1;
        auto it = shifts.find(text[end]);
        end += it != shifts.end() ? it->second : patternLength;
    }
    return -1;
}`,
  'aho-corasick': `#include <algorithm>
#include <deque>
#include <string>
#include <unordered_map>
#include <vector>

using namespace std;

vector<pair<int, int>> ahoCorasick(const string& text, const vector<string>& patterns) {
    vector<unordered_map<char, int>> transitions(1);
    vector<int> failures(1, 0);
    vector<vector<int>> outputs(1);
    for (int patternIndex = 0; patternIndex < static_cast<int>(patterns.size()); ++patternIndex) {
        const string& pattern = patterns[patternIndex];
        if (pattern.empty()) continue;
        int state = 0;
        for (char character : pattern) {
            auto it = transitions[state].find(character);
            int nextState;
            if (it == transitions[state].end()) {
                nextState = static_cast<int>(transitions.size());
                transitions[state][character] = nextState;
                transitions.emplace_back();
                failures.push_back(0);
                outputs.emplace_back();
            } else nextState = it->second;
            state = nextState;
        }
        outputs[state].push_back(patternIndex);
    }
    deque<int> queue;
    for (auto& entry : transitions[0]) queue.push_back(entry.second);
    while (!queue.empty()) {
        int state = queue.front(); queue.pop_front();
        for (auto& entry : transitions[state]) {
            char character = entry.first;
            int nextState = entry.second;
            queue.push_back(nextState);
            int fallback = failures[state];
            while (fallback && transitions[fallback].find(character) == transitions[fallback].end()) fallback = failures[fallback];
            auto found = transitions[fallback].find(character);
            failures[nextState] = found != transitions[fallback].end() ? found->second : 0;
            outputs[nextState].insert(outputs[nextState].end(), outputs[failures[nextState]].begin(), outputs[failures[nextState]].end());
        }
    }
    vector<pair<int, int>> found;
    for (int index = 0; index < static_cast<int>(patterns.size()); ++index) if (patterns[index].empty()) found.push_back(make_pair(0, index));
    int state = 0, end = 0;
    for (char character : text) {
        while (state && transitions[state].find(character) == transitions[state].end()) state = failures[state];
        auto foundChar = transitions[state].find(character);
        state = foundChar != transitions[state].end() ? foundChar->second : 0;
        for (int patternIndex : outputs[state]) {
            int start = end - static_cast<int>(patterns[patternIndex].size()) + 1;
            found.push_back(make_pair(start, patternIndex));
        }
        ++end;
    }
    sort(found.begin(), found.end());
    return found;
}`,
  'trie-lookup': `#include <string>
#include <unordered_map>
#include <vector>

using namespace std;

bool trieLookup(const vector<string>& words, const string& query) {
    struct Node { unordered_map<char, Node*> children; bool terminal = false; };
    Node* root = new Node();
    for (const string& word : words) {
        Node* node = root;
        for (char character : word) {
            auto it = node->children.find(character);
            if (it == node->children.end()) it = node->children.emplace(character, new Node()).first;
            node = it->second;
        }
        node->terminal = true;
    }
    Node* node = root;
    for (char character : query) {
        auto it = node->children.find(character);
        if (it == node->children.end()) return false;
        node = it->second;
    }
    return node->terminal;
}`,
  'longest-common-prefix': `#include <algorithm>
#include <string>
#include <vector>

using namespace std;

string longestCommonPrefix(const vector<string>& strings) {
    if (strings.empty()) return "";
    int prefixLength = static_cast<int>(strings[0].size());
    for (int i = 1; i < static_cast<int>(strings.size()); ++i) {
        prefixLength = min(prefixLength, static_cast<int>(strings[i].size()));
        int index = 0;
        while (index < prefixLength && strings[0][index] == strings[i][index]) ++index;
        prefixLength = index;
        if (prefixLength == 0) break;
    }
    return strings[0].substr(0, prefixLength);
}`,
  manacher: `#include <algorithm>
#include <string>
#include <vector>

using namespace std;

string manacher(const string& text) {
    int length = static_cast<int>(text.size());
    if (length == 0) return "";
    int bestStart = 0, bestLength = 1;
    vector<int> odd(length), even(length);
    int left = 0, right = -1;
    for (int center = 0; center < length; ++center) {
        int radius = center > right ? 1 : min(odd[left + right - center], right - center + 1);
        while (center - radius >= 0 && center + radius < length && text[center - radius] == text[center + radius]) ++radius;
        odd[center] = radius;
        int start = center - radius + 1, palindromeLength = radius * 2 - 1;
        if (palindromeLength > bestLength || (palindromeLength == bestLength && start < bestStart)) { bestStart = start; bestLength = palindromeLength; }
        if (center + radius - 1 > right) { left = center - radius + 1; right = center + radius - 1; }
    }
    left = 0; right = -1;
    for (int center = 0; center < length; ++center) {
        int radius = center > right ? 0 : min(even[left + right - center + 1], right - center + 1);
        while (center - radius - 1 >= 0 && center + radius < length && text[center - radius - 1] == text[center + radius]) ++radius;
        even[center] = radius;
        int start = center - radius, palindromeLength = radius * 2;
        if (palindromeLength > bestLength || (palindromeLength == bestLength && start < bestStart)) { bestStart = start; bestLength = palindromeLength; }
        if (center + radius - 1 > right) { left = center - radius; right = center + radius - 1; }
    }
    return text.substr(bestStart, bestLength);
}`,
  'levenshtein-distance': `#include <algorithm>
#include <string>
#include <vector>

using namespace std;

int levenshteinDistance(const string& first, const string& second) {
    if (first.size() < second.size()) return levenshteinDistance(second, first);
    vector<int> previous(second.size() + 1);
    for (int i = 0; i <= static_cast<int>(second.size()); ++i) previous[i] = i;
    for (int firstIndex = 1; firstIndex <= static_cast<int>(first.size()); ++firstIndex) {
        vector<int> current(second.size() + 1);
        current[0] = firstIndex;
        for (int secondIndex = 1; secondIndex <= static_cast<int>(second.size()); ++secondIndex) {
            int insertion = current[secondIndex - 1] + 1;
            int deletion = previous[secondIndex] + 1;
            int substitution = previous[secondIndex - 1] + (first[firstIndex - 1] != second[secondIndex - 1]);
            current[secondIndex] = min(insertion, min(deletion, substitution));
        }
        previous = current;
    }
    return previous.back();
}`,
  'longest-common-subsequence': `#include <algorithm>
#include <string>
#include <vector>

using namespace std;

string longestCommonSubsequence(const string& first, const string& second) {
    int n = static_cast<int>(first.size()), m = static_cast<int>(second.size());
    vector<vector<int>> lengths(n + 1, vector<int>(m + 1, 0));
    for (int i = n - 1; i >= 0; --i)
        for (int j = m - 1; j >= 0; --j)
            if (first[i] == second[j]) lengths[i][j] = lengths[i + 1][j + 1] + 1;
            else lengths[i][j] = max(lengths[i + 1][j], lengths[i][j + 1]);
    string result;
    int i = 0, j = 0;
    while (i < n && j < m) {
        if (first[i] == second[j]) { result.push_back(first[i]); ++i; ++j; }
        else if (lengths[i + 1][j] >= lengths[i][j + 1]) ++i;
        else ++j;
    }
    return result;
}`,
  'fibonacci-memoization': `#include <functional>
#include <stdexcept>
#include <vector>

using namespace std;

long long fibonacciMemoization(int n) {
    if (n < 0) throw invalid_argument("n must be nonnegative");
    vector<long long> memo(n + 1, -1);
    memo[0] = 0;
    if (n >= 1) memo[1] = 1;
    function<long long(int)> fibonacci = [&](int index) -> long long {
        if (memo[index] != -1) return memo[index];
        return memo[index] = fibonacci(index - 1) + fibonacci(index - 2);
    };
    return fibonacci(n);
}`,
  'zero-one-knapsack': `#include <algorithm>
#include <vector>

using namespace std;

int zeroOneKnapsack(const vector<int>& weights, const vector<int>& values, int capacity) {
    vector<int> best(capacity + 1, 0);
    for (size_t index = 0; index < weights.size(); ++index) {
        int weight = weights[index], value = values[index];
        for (int current = capacity; current >= weight; --current)
            best[current] = max(best[current], best[current - weight] + value);
    }
    return best[capacity];
}`,
  'unbounded-knapsack': `#include <algorithm>
#include <vector>

using namespace std;

int unboundedKnapsack(const vector<int>& weights, const vector<int>& values, int capacity) {
    vector<int> best(capacity + 1, 0);
    for (int current = 1; current <= capacity; ++current)
        for (size_t index = 0; index < weights.size(); ++index)
            if (weights[index] <= current) best[current] = max(best[current], best[current - weights[index]] + values[index]);
    return best[capacity];
}`,
  'coin-change-count': `#include <vector>

using namespace std;

int coinChangeCount(const vector<int>& coins, int amount) {
    vector<int> combinations(amount + 1, 0);
    combinations[0] = 1;
    for (int coin : coins) for (int current = coin; current <= amount; ++current) combinations[current] += combinations[current - coin];
    return combinations[amount];
}`,
  'coin-change-minimum': `#include <algorithm>
#include <vector>

using namespace std;

int coinChangeMinimum(const vector<int>& coins, int amount) {
    int unreachable = amount + 1;
    vector<int> minimum(amount + 1, unreachable);
    minimum[0] = 0;
    for (int current = 1; current <= amount; ++current) for (int coin : coins) if (coin <= current) minimum[current] = min(minimum[current], minimum[current - coin] + 1);
    return minimum[amount] == unreachable ? -1 : minimum[amount];
}`,
  'longest-increasing-subsequence': `#include <algorithm>
#include <vector>

using namespace std;

vector<int> longestIncreasingSubsequence(const vector<int>& values) {
    if (values.empty()) return {};
    int n = static_cast<int>(values.size());
    vector<int> lengths(n, 1), previous(n, -1);
    int endpoint = 0;
    for (int end = 0; end < n; ++end) {
        for (int start = 0; start < end; ++start) {
            int candidate = lengths[start] + 1;
            if (values[start] < values[end] && candidate > lengths[end]) { lengths[end] = candidate; previous[end] = start; }
        }
        if (lengths[end] > lengths[endpoint] || (lengths[end] == lengths[endpoint] && end < endpoint)) endpoint = end;
    }
    vector<int> result;
    for (int current = endpoint; current != -1; current = previous[current]) result.push_back(values[current]);
    reverse(result.begin(), result.end());
    return result;
}`,
  'matrix-chain-multiplication': `#include <algorithm>
#include <limits>
#include <vector>

using namespace std;

int matrixChainMultiplication(const vector<int>& dimensions) {
    int count = static_cast<int>(dimensions.size()) - 1;
    if (count < 2) return 0;
    vector<vector<int>> costs(count, vector<int>(count, 0));
    for (int chainLength = 2; chainLength <= count; ++chainLength) {
        for (int left = 0; left <= count - chainLength; ++left) {
            int right = left + chainLength - 1;
            int best = numeric_limits<int>::max();
            for (int split = left; split < right; ++split) {
                int candidate = costs[left][split] + costs[split + 1][right] + dimensions[left] * dimensions[split + 1] * dimensions[right + 1];
                best = min(best, candidate);
            }
            costs[left][right] = best;
        }
    }
    return costs[0][count - 1];
}`,
  'edit-distance': `#include <algorithm>
#include <string>
#include <vector>

using namespace std;

int editDistance(const string& source, const string& target) {
    vector<int> previous(target.size() + 1);
    for (int i = 0; i <= static_cast<int>(target.size()); ++i) previous[i] = i;
    for (int sourceIndex = 1; sourceIndex <= static_cast<int>(source.size()); ++sourceIndex) {
        vector<int> current(target.size() + 1);
        current[0] = sourceIndex;
        for (int targetIndex = 1; targetIndex <= static_cast<int>(target.size()); ++targetIndex) {
            int substitution = previous[targetIndex - 1] + (source[sourceIndex - 1] != target[targetIndex - 1]);
            current[targetIndex] = min(previous[targetIndex] + 1, min(current[targetIndex - 1] + 1, substitution));
        }
        previous = current;
    }
    return previous.back();
}`,
  'grid-paths': `#include <vector>

using namespace std;

int gridPaths(int rows, int columns) {
    if (rows == 0 || columns == 0) return 0;
    vector<int> paths(columns, 1);
    for (int row = 1; row < rows; ++row) for (int column = 1; column < columns; ++column) paths[column] += paths[column - 1];
    return paths.back();
}`,
  'minimum-path-sum': `#include <algorithm>
#include <vector>

using namespace std;

int minimumPathSum(const vector<vector<int>>& grid) {
    if (grid.empty()) return 0;
    int width = static_cast<int>(grid[0].size());
    vector<int> totals(width, 0);
    for (int rowIndex = 0; rowIndex < static_cast<int>(grid.size()); ++rowIndex) {
        for (int column = 0; column < width; ++column) {
            int value = grid[rowIndex][column];
            if (rowIndex == 0 && column == 0) totals[column] = value;
            else if (rowIndex == 0) totals[column] = totals[column - 1] + value;
            else if (column == 0) totals[column] += value;
            else totals[column] = min(totals[column], totals[column - 1]) + value;
        }
    }
    return totals.back();
}`,
  'rod-cutting': `#include <algorithm>
#include <vector>

using namespace std;

int rodCutting(const vector<int>& prices, int length) {
    vector<int> revenue(length + 1, 0);
    for (int current = 1; current <= length; ++current) {
        int best = 0;
        for (int piece = 1; piece <= min(current, static_cast<int>(prices.size())); ++piece)
            best = max(best, prices[piece - 1] + revenue[current - piece]);
        revenue[current] = best;
    }
    return revenue[length];
}`,
  'partition-equal-subset-sum': `#include <vector>

using namespace std;

bool partitionEqualSubsetSum(const vector<int>& values) {
    int total = 0;
    for (int value : values) total += value;
    if (total % 2) return false;
    int target = total / 2;
    vector<bool> reachable(target + 1, false);
    reachable[0] = true;
    for (int value : values) for (int subtotal = target; subtotal >= value; --subtotal) reachable[subtotal] = reachable[subtotal] || reachable[subtotal - value];
    return reachable[target];
}`,
};
