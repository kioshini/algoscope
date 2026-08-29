export const cSources: Record<string, string> = {
  bubble: `#include <stddef.h>

void bubble_sort(int *values, size_t length) {
    for (size_t end = length; end > 1; --end) {
        int swapped = 0;
        for (size_t i = 1; i < end; ++i) {
            if (values[i - 1] > values[i]) {
                int temporary = values[i - 1];
                values[i - 1] = values[i];
                values[i] = temporary;
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
}`,
  quick: `#include <stddef.h>

static void quick_sort_range(int *values, int low, int high) {
    if (low >= high) return;
    int pivot = values[high], split = low;
    for (int i = low; i < high; ++i) if (values[i] < pivot) {
        int temporary = values[i]; values[i] = values[split]; values[split++] = temporary;
    }
    int temporary = values[split]; values[split] = values[high]; values[high] = temporary;
    quick_sort_range(values, low, split - 1); quick_sort_range(values, split + 1, high);
}

void quick_sort(int *values, size_t length) { quick_sort_range(values, 0, (int)length - 1); }`,
  merge: `#include <stddef.h>
#include <stdlib.h>

void merge_sort(int *values, size_t length) {
    if (length < 2) return;
    int *buffer = malloc(length * sizeof(*buffer));
    for (size_t width = 1; width < length; width *= 2) {
        for (size_t start = 0; start < length; start += 2 * width) {
            size_t middle = start + width < length ? start + width : length, end = start + 2 * width < length ? start + 2 * width : length, left = start, right = middle, next = start;
            while (left < middle || right < end) buffer[next++] = right == end || (left < middle && values[left] <= values[right]) ? values[left++] : values[right++];
        }
        for (size_t i = 0; i < length; ++i) values[i] = buffer[i];
    }
    free(buffer);
}`,
  'search-binary-first': `#include <stddef.h>

int binary_search_first(const int *values, size_t length, int target, size_t *match_index) {
    size_t low = 0, high = length; int found = 0;
    while (low < high) { size_t middle = low + (high - low) / 2; if (values[middle] >= target) { if (values[middle] == target) { *match_index = middle; found = 1; } high = middle; } else low = middle + 1; }
    return found;
}`,
  'breadth-first-search': `#include <stddef.h>

size_t breadth_first_search(const int *graph, size_t vertex_count, size_t start, size_t *order, size_t order_capacity) {
    if (start >= vertex_count || order_capacity == 0) return 0;
    size_t queue[order_capacity], head = 0, tail = 0, count = 0; int seen[vertex_count];
    for (size_t i = 0; i < vertex_count; ++i) seen[i] = 0;
    queue[tail++] = start; seen[start] = 1;
    while (head < tail && count < order_capacity) { size_t vertex = queue[head++]; order[count++] = vertex; for (size_t next = 0; next < vertex_count; ++next) if (graph[vertex * vertex_count + next] && !seen[next]) { seen[next] = 1; if (tail < order_capacity) queue[tail++] = next; } }
    return count;
}`,
  kmp: `#include <stddef.h>
#include <string.h>
#include <stdlib.h>

int kmp_search(const char *text, const char *pattern, size_t *match_index) {
    size_t text_length = strlen(text), pattern_length = strlen(pattern);
    if (pattern_length == 0) { *match_index = 0; return 1; }
    size_t *table = malloc(pattern_length * sizeof(*table));
    for (size_t i = 1, matched = 0; i < pattern_length;) if (pattern[i] == pattern[matched]) table[i++] = ++matched; else if (matched) matched = table[matched - 1]; else table[i++] = 0;
    for (size_t i = 0, matched = 0; i < text_length;) { if (text[i] == pattern[matched]) { ++i; if (++matched == pattern_length) { *match_index = i - matched; free(table); return 1; } } else if (matched) matched = table[matched - 1]; else ++i; }
    free(table); return 0;
}`,
  'fibonacci-tabulation': `#include <stddef.h>

int fibonacci_tabulation(unsigned int n, unsigned long long *result) {
    unsigned long long previous = 0, current = 1;
    if (n == 0) { *result = 0; return 1; }
    for (unsigned int i = 1; i < n; ++i) { unsigned long long next = previous + current; previous = current; current = next; }
    *result = current; return 1;
}`,
  selection: `#include <stddef.h>

void selection_sort(int *values, size_t length) {
    for (size_t i = 0; i < length; ++i) {
        size_t min = i;
        for (size_t j = i + 1; j < length; ++j) if (values[j] < values[min]) min = j;
        if (min != i) { int temporary = values[i]; values[i] = values[min]; values[min] = temporary; }
    }
}`,
  insertion: `#include <stddef.h>

void insertion_sort(int *values, size_t length) {
    for (size_t i = 1; i < length; ++i) {
        int item = values[i]; size_t position = i;
        while (position > 0 && item < values[position - 1]) { values[position] = values[position - 1]; --position; }
        values[position] = item;
    }
}`,
  cocktail: `#include <stddef.h>

void cocktail_sort(int *values, size_t length) {
    int swapped = 1; size_t start = 0, end = length;
    while (swapped) {
        swapped = 0;
        for (size_t i = start; i + 1 < end; ++i) if (values[i] > values[i + 1]) { int t = values[i]; values[i] = values[i + 1]; values[i + 1] = t; swapped = 1; }
        if (!swapped) break;
        swapped = 0; --end;
        for (size_t i = end; i > start; --i) if (values[i - 1] > values[i]) { int t = values[i - 1]; values[i - 1] = values[i]; values[i] = t; swapped = 1; }
        ++start;
    }
}`,
  gnome: `#include <stddef.h>

void gnome_sort(int *values, size_t length) {
    size_t index = 0;
    while (index < length) {
        if (index == 0 || values[index] >= values[index - 1]) ++index;
        else { int t = values[index]; values[index] = values[index - 1]; values[index - 1] = t; --index; }
    }
}`,
  shell: `#include <stddef.h>

void shell_sort(int *values, size_t length) {
    for (size_t gap = length / 2; gap > 0; gap /= 2)
        for (size_t i = gap; i < length; ++i) {
            int item = values[i]; size_t position = i;
            while (position >= gap && item < values[position - gap]) { values[position] = values[position - gap]; position -= gap; }
            values[position] = item;
        }
}`,
  heap: `#include <stddef.h>

static void sift_down(int *values, size_t root, size_t count) {
    while (2 * root + 1 < count) {
        size_t child = 2 * root + 1;
        if (child + 1 < count && values[child] < values[child + 1]) ++child;
        if (values[root] >= values[child]) return;
        int t = values[root]; values[root] = values[child]; values[child] = t; root = child;
    }
}

void heap_sort(int *values, size_t length) {
    for (size_t i = length / 2; i > 0; --i) sift_down(values, i - 1, length);
    for (size_t end = length; end > 1; --end) { int t = values[0]; values[0] = values[end - 1]; values[end - 1] = t; sift_down(values, 0, end - 1); }
}`,
  cycle: `#include <stddef.h>

void cycle_sort(int *values, size_t length) {
    for (size_t start = 0; start + 1 < length; ++start) {
        int item = values[start]; size_t position = start;
        for (size_t i = start + 1; i < length; ++i) if (values[i] < item) ++position;
        if (position == start) continue;
        while (item == values[position]) ++position;
        int t = item; item = values[position]; values[position] = t;
        while (position != start) {
            position = start;
            for (size_t i = start + 1; i < length; ++i) if (values[i] < item) ++position;
            while (item == values[position]) ++position;
            t = item; item = values[position]; values[position] = t;
        }
    }
}`,
  comb: `#include <stddef.h>

void comb_sort(int *values, size_t length) {
    size_t gap = length; int swapped = 1;
    while (gap > 1 || swapped) {
        gap = gap > 1 ? (size_t)(gap / 1.3) : 1; swapped = 0;
        for (size_t i = 0; i + gap < length; ++i) if (values[i] > values[i + gap]) { int t = values[i]; values[i] = values[i + gap]; values[i + gap] = t; swapped = 1; }
    }
}`,
  'odd-even': `#include <stddef.h>

void odd_even_sort(int *values, size_t length) {
    int sorted = 0;
    while (!sorted) {
        sorted = 1;
        for (size_t i = 1; i + 1 < length; i += 2) if (values[i] > values[i + 1]) { int t = values[i]; values[i] = values[i + 1]; values[i + 1] = t; sorted = 0; }
        for (size_t i = 0; i + 1 < length; i += 2) if (values[i] > values[i + 1]) { int t = values[i]; values[i] = values[i + 1]; values[i + 1] = t; sorted = 0; }
    }
}`,
  pancake: `#include <stddef.h>

static void reverse_prefix(int *values, size_t end) {
    size_t start = 0;
    while (start < end) { int t = values[start]; values[start] = values[end]; values[end] = t; ++start; --end; }
}

void pancake_sort(int *values, size_t length) {
    for (size_t end = length; end > 1; --end) {
        size_t max = 0;
        for (size_t i = 1; i < end; ++i) if (values[i] > values[max]) max = i;
        if (max != end - 1) { reverse_prefix(values, max); reverse_prefix(values, end - 1); }
    }
}`,
  'binary-insertion': `#include <stddef.h>

void binary_insertion_sort(int *values, size_t length) {
    for (size_t i = 1; i < length; ++i) {
        int item = values[i]; size_t low = 0, high = i;
        while (low < high) { size_t middle = (low + high) / 2; if (item < values[middle]) high = middle; else low = middle + 1; }
        for (size_t j = i; j > low; --j) values[j] = values[j - 1];
        values[low] = item;
    }
}`,
  'three-way-quick': `#include <stddef.h>

static void three_way_quick_range(int *values, int low, int high) {
    if (low >= high) return;
    int pivot = values[low], less = low, equal = low, greater = high;
    while (equal <= greater) {
        if (values[equal] < pivot) { int t = values[less]; values[less] = values[equal]; values[equal] = t; ++less; ++equal; }
        else if (values[equal] > pivot) { int t = values[equal]; values[equal] = values[greater]; values[greater] = t; --greater; }
        else ++equal;
    }
    three_way_quick_range(values, low, less - 1);
    three_way_quick_range(values, greater + 1, high);
}

void three_way_quick_sort(int *values, size_t length) { three_way_quick_range(values, 0, (int)length - 1); }`,
  'natural-merge': `#include <stddef.h>
#include <stdlib.h>

void natural_merge_sort(int *values, size_t length) {
    if (length < 2) return;
    size_t *runs = malloc(length * sizeof(*runs)), *starts = malloc((length + 1) * sizeof(*starts)); size_t run_count = 0, start = 0;
    for (size_t i = 1; i <= length; ++i) if (i == length || values[i] < values[i - 1]) { starts[run_count] = start; runs[run_count++] = i; start = i; }
    while (run_count > 1) {
        size_t *next_starts = malloc((run_count / 2 + 2) * sizeof(*next_starts)); size_t next_count = 0;
        for (size_t i = 0; i < run_count; i += 2) {
            if (i + 1 >= run_count) { next_starts[next_count++] = starts[i]; continue; }
            size_t l = starts[i], m = runs[i], r = runs[i + 1], left = l, right = m, k = l; int *buffer = malloc((r - l) * sizeof(*buffer)); size_t bn = 0;
            while (left < m && right < r) buffer[bn++] = values[right] < values[left] ? values[right++] : values[left++];
            while (left < m) buffer[bn++] = values[left++];
            while (right < r) buffer[bn++] = values[right++];
            for (size_t x = 0; x < bn; ++x) values[l + x] = buffer[x];
            free(buffer); next_starts[next_count++] = l; start = l; 
        }
        size_t *merged = malloc(next_count * sizeof(*merged)); for (size_t x = 0; x < next_count; ++x) merged[x] = next_starts[x + 1] ? next_starts[x + 1] : length;
        free(next_starts);
        for (size_t x = 0; x < next_count; ++x) starts[x] = next_count == 1 ? merged[x] : starts[x];
        if (next_count == 1) run_count = 1;
        else { for (size_t x = 0; x + 1 < next_count; ++x) runs[x] = next_starts[x + 1]; runs[next_count - 1] = length; run_count = next_count; }
        free(merged);
    }
    free(runs); free(starts);
}`,
  'hoare-quick': `#include <stddef.h>

static void hoare_quick_range(int *values, int low, int high) {
    if (low >= high) return;
    int pivot = values[(low + high) / 2], left = low, right = high;
    while (left <= right) {
        while (values[left] < pivot) ++left;
        while (pivot < values[right]) --right;
        if (left <= right) { int t = values[left]; values[left] = values[right]; values[right] = t; ++left; --right; }
    }
    hoare_quick_range(values, low, right);
    hoare_quick_range(values, left, high);
}

void hoare_quick_sort(int *values, size_t length) { hoare_quick_range(values, 0, (int)length - 1); }`,
  'dual-pivot-quick': `#include <stddef.h>

static void dual_pivot_quick_range(int *values, int low, int high) {
    if (low >= high) return;
    if (values[high] < values[low]) { int t = values[low]; values[low] = values[high]; values[high] = t; }
    int lp = values[low], rp = values[high], less = low + 1, greater = high - 1, i = less;
    while (i <= greater) {
        if (values[i] < lp) { int t = values[i]; values[i] = values[less]; values[less] = t; ++less; ++i; }
        else if (rp < values[i]) { while (i < greater && rp < values[greater]) --greater; int t = values[i]; values[i] = values[greater]; values[greater] = t; --greater; if (values[i] < lp) { t = values[i]; values[i] = values[less]; values[less] = t; ++less; } ++i; }
        else ++i;
    }
    { int t = values[low]; values[low] = values[less - 1]; values[less - 1] = t; t = values[high]; values[high] = values[greater + 1]; values[greater + 1] = t; }
    dual_pivot_quick_range(values, low, less - 2);
    dual_pivot_quick_range(values, less, greater);
    dual_pivot_quick_range(values, greater + 2, high);
}

void dual_pivot_quick_sort(int *values, size_t length) { dual_pivot_quick_range(values, 0, (int)length - 1); }`,
  'median-three-quick': `#include <stddef.h>

static void median_three_quick_range(int *values, int low, int high) {
    if (low >= high) return;
    int middle = (low + high) / 2;
    if (values[middle] < values[low]) { int t = values[low]; values[low] = values[middle]; values[middle] = t; }
    if (values[high] < values[low]) { int t = values[low]; values[low] = values[high]; values[high] = t; }
    if (values[high] < values[middle]) { int t = values[middle]; values[middle] = values[high]; values[high] = t; }
    int pivot = values[middle], left = low, right = high;
    while (left <= right) {
        while (values[left] < pivot) ++left;
        while (pivot < values[right]) --right;
        if (left <= right) { int t = values[left]; values[left] = values[right]; values[right] = t; ++left; --right; }
    }
    median_three_quick_range(values, low, right);
    median_three_quick_range(values, left, high);
}

void median_three_quick_sort(int *values, size_t length) { median_three_quick_range(values, 0, (int)length - 1); }`,
  'bottom-up-merge': `#include <stddef.h>
#include <stdlib.h>

void bottom_up_merge_sort(int *values, size_t length) {
    int *buffer = malloc(length * sizeof(*buffer));
    for (size_t width = 1; width < length; width *= 2)
        for (size_t start = 0; start < length; start += 2 * width) {
            size_t middle = start + width < length ? start + width : length, end = start + 2 * width < length ? start + 2 * width : length, l = start, r = middle, n = start;
            while (l < middle || r < end) buffer[n++] = r == end || (l < middle && values[l] <= values[r]) ? values[l++] : values[r++];
            for (size_t k = start; k < end; ++k) values[k] = buffer[k];
        }
    free(buffer);
}`,
  'in-place-merge': `#include <stddef.h>

static void in_place_merge_range(int *values, int low, int high) {
    if (high - low < 2) return;
    int middle = (low + high) / 2;
    in_place_merge_range(values, low, middle);
    in_place_merge_range(values, middle, high);
    int left = low, right = middle;
    while (left < right && right < high) {
        if (values[right] < values[left]) { int temporary = values[right]; for (int k = right; k > left; --k) values[k] = values[k - 1]; values[left] = temporary; ++left; ++right; }
        else ++left;
    }
}

void in_place_merge_sort(int *values, size_t length) { in_place_merge_range(values, 0, (int)length); }`,
  intro: `#include <stddef.h>
#include <math.h>

static int log2_int(int n) { int r = 0; while (n > 1) { n /= 2; ++r; } return r; }

static void intro_heap(int *values, size_t count) {
    for (size_t i = count / 2; i > 0; --i) { size_t root = i - 1; while (2 * root + 1 < count) { size_t child = 2 * root + 1; if (child + 1 < count && values[child] < values[child + 1]) ++child; if (values[root] >= values[child]) break; int t = values[root]; values[root] = values[child]; values[child] = t; root = child; } }
    for (size_t end = count; end > 1; --end) { int t = values[0]; values[0] = values[end - 1]; values[end - 1] = t; size_t root = 0; while (2 * root + 1 < end - 1) { size_t child = 2 * root + 1; if (child + 1 < end - 1 && values[child] < values[child + 1]) ++child; if (values[root] >= values[child]) break; t = values[root]; values[root] = values[child]; values[child] = t; root = child; } }
}

static void intro_insertion(int *values, int low, int high) {
    for (int i = low + 1; i < high; ++i) { int item = values[i]; int position = i; while (position > low && item < values[position - 1]) { values[position] = values[position - 1]; --position; } values[position] = item; }
}

static void intro_range(int *values, int low, int high, int depth) {
    if (high - low < 2) return;
    if (depth == 0) { intro_heap(values + low, (size_t)(high - low)); return; }
    if (high - low <= 16) { intro_insertion(values, low, high); return; }
    int pivot = values[high - 1], split = low;
    for (int i = low; i < high - 1; ++i) if (values[i] < pivot) { int t = values[i]; values[i] = values[split]; values[split] = t; ++split; }
    { int t = values[split]; values[split] = values[high - 1]; values[high - 1] = t; }
    intro_range(values, low, split, depth - 1);
    intro_range(values, split + 1, high, depth - 1);
}

void intro_sort(int *values, size_t length) { intro_range(values, 0, (int)length, 2 * log2_int((int)length + 1)); }`,
  tim: `#include <stddef.h>
#include <stdlib.h>

static void tim_insertion(int *values, int start, int end) {
    for (int i = start + 1; i < end; ++i) { int item = values[i]; int j = i; while (j > start && item < values[j - 1]) { values[j] = values[j - 1]; --j; } values[j] = item; }
}

static void tim_merge(int *values, int left, int mid, int right) {
    int n = right - left, *buffer = malloc(n * sizeof(*buffer)); int l = left, r = mid, k = 0;
    while (l < mid && r < right) buffer[k++] = values[r] < values[l] ? values[r++] : values[l++];
    while (l < mid) buffer[k++] = values[l++];
    while (r < right) buffer[k++] = values[r++];
    for (int x = 0; x < n; ++x) values[left + x] = buffer[x];
    free(buffer);
}

void tim_sort(int *values, size_t length) {
    if (length < 2) return;
    int min_run = 32;
    for (size_t i = 0; i < length; i += min_run) tim_insertion(values, (int)i, (int)(i + min_run < length ? i + min_run : length));
    for (int size = min_run; size < (int)length; size *= 2)
        for (int left = 0; left + size < (int)length; left += 2 * size) { int mid = left + size, right = left + 2 * size < (int)length ? left + 2 * size : (int)length; if (mid < right) tim_merge(values, left, mid, right); }
}`,
  tournament: `#include <stddef.h>
#include <stdlib.h>
#include <limits.h>

void tournament_sort(int *values, size_t length) {
    if (length < 2) return;
    size_t leaf = 1; while (leaf < length) leaf *= 2;
    int *tree = malloc(2 * leaf * sizeof(*tree)); for (size_t i = 0; i < length; ++i) tree[leaf + i] = values[i]; for (size_t i = length; i < leaf; ++i) tree[leaf + i] = INT_MAX;
    for (size_t i = leaf; i > 1; --i) tree[i - 1] = tree[2 * (i - 1)] < tree[2 * (i - 1) + 1] ? tree[2 * (i - 1)] : tree[2 * (i - 1) + 1];
    for (size_t i = 0; i < length; ++i) {
        values[i] = tree[1]; size_t p = 1; while (p < leaf) p = tree[2 * p] == tree[p] ? 2 * p : 2 * p + 1; tree[p] = INT_MAX;
        while (p > 1) { p /= 2; tree[p] = tree[2 * p] < tree[2 * p + 1] ? tree[2 * p] : tree[2 * p + 1]; }
    }
    free(tree);
}`,
  patience: `#include <stddef.h>
#include <stdlib.h>
#include <limits.h>

void patience_sort(int *values, size_t length) {
    if (length < 2) return;
    int **piles = malloc(length * sizeof(*piles)); size_t *sizes = malloc(length * sizeof(*sizes)); size_t pile_count = 0;
    for (size_t i = 0; i < length; ++i) {
        int item = values[i]; size_t low = 0, high = pile_count;
        while (low < high) { size_t mid = (low + high) / 2; if (piles[mid][sizes[mid] - 1] < item) low = mid + 1; else high = mid; }
        if (low == pile_count) { piles[low] = malloc(sizeof(int)); piles[low][0] = item; sizes[low] = 1; ++pile_count; }
        else { piles[low] = realloc(piles[low], (sizes[low] + 1) * sizeof(int)); piles[low][sizes[low]++] = item; }
    }
    for (size_t i = 0; i < length; ++i) {
        int min = INT_MAX; size_t min_pile = 0;
        for (size_t p = 0; p < pile_count; ++p) if (piles[p][sizes[p] - 1] < min) { min = piles[p][sizes[p] - 1]; min_pile = p; }
        values[i] = min; --sizes[min_pile];
    }
    for (size_t p = 0; p < pile_count; ++p) free(piles[p]); free(piles); free(sizes);
}`,
  tree: `#include <stddef.h>
#include <stdlib.h>

typedef struct TreeNode { int value; struct TreeNode *left, *right; } TreeNode;

static TreeNode *tree_insert(TreeNode *node, int value) {
    if (!node) { node = malloc(sizeof(TreeNode)); node->value = value; node->left = node->right = 0; return node; }
    if (value < node->value) node->left = tree_insert(node->left, value); else node->right = tree_insert(node->right, value);
    return node;
}

static void tree_inorder(TreeNode *node, int *values, int *index) {
    if (!node) return; tree_inorder(node->left, values, index); values[(*index)++] = node->value; tree_inorder(node->right, values, index);
}

static void tree_free(TreeNode *node) { if (!node) return; tree_free(node->left); tree_free(node->right); free(node); }

void tree_sort(int *values, size_t length) {
    if (length < 2) return;
    TreeNode *root = 0; for (size_t i = 0; i < length; ++i) root = tree_insert(root, values[i]);
    int index = 0; tree_inorder(root, values, &index); tree_free(root);
}`,
  strand: `#include <stddef.h>
#include <stdlib.h>

void strand_sort(int *values, size_t length) {
    if (length < 2) return;
    int *remaining = malloc(length * sizeof(*remaining)); size_t remaining_count = length; for (size_t i = 0; i < length; ++i) remaining[i] = values[i];
    int *sorted = malloc(length * sizeof(*sorted)); size_t sorted_count = 0;
    int *strand = malloc(length * sizeof(*strand));
    while (remaining_count > 0) {
        size_t strand_count = 0; strand[strand_count++] = remaining[0]; for (size_t i = 1; i < remaining_count; ++i) remaining[i - 1] = remaining[i]; --remaining_count;
        for (size_t i = 0; i < remaining_count;) { if (remaining[i] >= strand[strand_count - 1]) { strand[strand_count++] = remaining[i]; for (size_t j = i; j + 1 < remaining_count; ++j) remaining[j] = remaining[j + 1]; --remaining_count; } else ++i; }
        int *merged = malloc((sorted_count + strand_count) * sizeof(*merged)); size_t a = 0, b = 0, m = 0;
        while (a < sorted_count && b < strand_count) merged[m++] = strand[b] < sorted[a] ? strand[b++] : sorted[a++];
        while (a < sorted_count) merged[m++] = sorted[a++];
        while (b < strand_count) merged[m++] = strand[b++];
        free(sorted); sorted = merged; sorted_count += strand_count;
    }
    for (size_t i = 0; i < length; ++i) values[i] = sorted[i];
    free(remaining); free(strand); free(sorted);
}`,
  counting: `#include <stddef.h>
#include <stdlib.h>

void counting_sort(int *values, size_t length) {
    if (length == 0) return;
    int min = values[0], max = values[0];
    for (size_t i = 1; i < length; ++i) { if (values[i] < min) min = values[i]; if (values[i] > max) max = values[i]; }
    size_t range = (size_t)(max - min + 1); int *counts = calloc(range, sizeof(int));
    for (size_t i = 0; i < length; ++i) counts[values[i] - min]++;
    size_t index = 0; for (size_t i = 0; i < range; ++i) for (int k = 0; k < counts[i]; ++k) values[index++] = (int)i + min;
    free(counts);
}`,
  'radix-lsd': `#include <stddef.h>
#include <stdlib.h>

void radix_lsd_sort(int *values, size_t length) {
    if (length == 0) return;
    int max = values[0]; for (size_t i = 1; i < length; ++i) if (values[i] > max) max = values[i];
    int *buffer = malloc(length * sizeof(int));
    for (int place = 1; max / place > 0; place *= 10) {
        int counts[10]; for (int i = 0; i < 10; ++i) counts[i] = 0;
        for (size_t i = 0; i < length; ++i) counts[(values[i] / place) % 10]++;
        for (int i = 1; i < 10; ++i) counts[i] += counts[i - 1];
        for (size_t i = length; i > 0; --i) buffer[--counts[(values[i - 1] / place) % 10]] = values[i - 1];
        for (size_t i = 0; i < length; ++i) values[i] = buffer[i];
    }
    free(buffer);
}`,
  bucket: `#include <stddef.h>
#include <stdlib.h>
#include <math.h>

void bucket_sort(double *values, size_t length) {
    if (length < 2) return;
    double lower = values[0], upper = values[0];
    for (size_t i = 1; i < length; ++i) { if (values[i] < lower) lower = values[i]; if (values[i] > upper) upper = values[i]; }
    if (lower == upper) return;
    double **buckets = malloc(length * sizeof(*buckets)); size_t *sizes = calloc(length, sizeof(size_t)); size_t *caps = malloc(length * sizeof(size_t));
    for (size_t i = 0; i < length; ++i) { caps[i] = 4; buckets[i] = malloc(caps[i] * sizeof(double)); }
    for (size_t i = 0; i < length; ++i) { size_t b = (size_t)((values[i] - lower) / (upper - lower) * (length - 1)); if (b >= length) b = length - 1; if (sizes[b] == caps[b]) { caps[b] *= 2; buckets[b] = realloc(buckets[b], caps[b] * sizeof(double)); } buckets[b][sizes[b]++] = values[i]; }
    size_t index = 0;
    for (size_t b = 0; b < length; ++b) {
        for (size_t i = 1; i < sizes[b]; ++i) { double item = buckets[b][i]; size_t j = i; while (j > 0 && item < buckets[b][j - 1]) { buckets[b][j] = buckets[b][j - 1]; --j; } buckets[b][j] = item; }
        for (size_t i = 0; i < sizes[b]; ++i) values[index++] = buckets[b][i];
        free(buckets[b]);
    }
    free(buckets); free(sizes); free(caps);
}`,
  'search-linear-first': `#include <stddef.h>

int linear_search_first(const int *values, size_t length, int target) {
    for (size_t i = 0; i < length; ++i) if (values[i] == target) return (int)i;
    return -1;
}`,
  'search-sentinel-first': `#include <stddef.h>
#include <stdlib.h>

int sentinel_search_first(const int *values, size_t length, int target) {
    int *copy = malloc(length * sizeof(int)); for (size_t i = 0; i < length; ++i) copy[i] = values[i];
    size_t i = 0; if (length > 0) copy[length - 1] = target;
    while (copy[i] != target) ++i;
    int result = i < length - 1 || copy[length - 1] == target ? (int)i : -1;
    free(copy); return result;
}`,
  'search-lower-bound': `#include <stddef.h>

int lower_bound(const int *values, size_t length, int target) {
    size_t low = 0, high = length;
    while (low < high) { size_t middle = low + (high - low) / 2; if (values[middle] < target) low = middle + 1; else high = middle; }
    return (int)low;
}`,
  'search-upper-bound': `#include <stddef.h>

int upper_bound(const int *values, size_t length, int target) {
    size_t low = 0, high = length;
    while (low < high) { size_t middle = low + (high - low) / 2; if (values[middle] <= target) low = middle + 1; else high = middle; }
    return (int)low;
}`,
  'search-jump-first': `#include <stddef.h>
#include <math.h>

int jump_search_first(const int *values, size_t length, int target) {
    size_t step = (size_t)sqrt((double)length), prev = 0;
    while (prev < length && values[prev + step < length ? prev + step : length - 1] < target) prev += step;
    for (size_t i = prev; i < (prev + step < length ? prev + step : length); ++i) if (values[i] == target) return (int)i;
    return -1;
}`,
  'search-exponential-first': `#include <stddef.h>

int exponential_search_first(const int *values, size_t length, int target) {
    if (length == 0) return -1;
    size_t bound = 1; while (bound < length && values[bound] < target) bound *= 2;
    size_t low = bound / 2, high = bound < length ? bound : length - 1;
    while (low <= high) { size_t middle = low + (high - low) / 2; if (values[middle] == target) return (int)middle; if (values[middle] < target) low = middle + 1; else high = middle; }
    return -1;
}`,
  'search-interpolation-first': `#include <stddef.h>

int interpolation_search_first(const int *values, size_t length, int target) {
    size_t low = 0, high = length - 1;
    while (low <= high && target >= values[low] && target <= values[high]) {
        if (low == high) return values[low] == target ? (int)low : -1;
        size_t middle = low + (size_t)((double)(target - values[low]) / (values[high] - values[low]) * (high - low));
        if (values[middle] == target) return (int)middle;
        if (values[middle] < target) low = middle + 1; else high = middle;
    }
    return -1;
}`,
  'search-fibonacci-first': `#include <stddef.h>

int fibonacci_search_first(const int *values, size_t length, int target) {
    size_t a = 0, b = 1, c = a + b;
    while (c < length) { a = b; b = c; c = a + b; }
    long offset = -1;
    while (c > 1) {
        size_t i = offset + a < length ? (size_t)(offset + a) : length - 1;
        if (values[i] < target) { c = b; b = a; a = c - b; offset = (long)i; }
        else if (values[i] > target) { c = a; b = b - a; a = c - b; }
        else return (int)i;
    }
    if (b == 1 && offset + 1 < (long)length && values[offset + 1] == target) return (int)(offset + 1);
    return -1;
}`,
  'search-quickselect-kth': `#include <stddef.h>
#include <stdlib.h>

static int quickselect_range(int *values, int low, int high, int k) {
    if (low == high) return values[low];
    int pivot = values[high], split = low;
    for (int i = low; i < high; ++i) if (values[i] < pivot) { int t = values[i]; values[i] = values[split]; values[split] = t; ++split; }
    { int t = values[split]; values[split] = values[high]; values[high] = t; }
    if (k == split) return values[k];
    return k < split ? quickselect_range(values, low, split - 1, k) : quickselect_range(values, split + 1, high, k);
}

int search_quickselect_kth(int *values, size_t length, int k) {
    int *copy = malloc(length * sizeof(int)); for (size_t i = 0; i < length; ++i) copy[i] = values[i];
    int result = quickselect_range(copy, 0, (int)length - 1, k); free(copy); return result;
}`,
  'depth-first-search': `#include <stddef.h>

size_t depth_first_search(const int *graph, size_t vertex_count, size_t start, size_t *order, size_t order_capacity) {
    if (start >= vertex_count || order_capacity == 0) return 0;
    size_t stack[vertex_count], top = 0, count = 0; int seen[vertex_count];
    for (size_t i = 0; i < vertex_count; ++i) seen[i] = 0;
    stack[top++] = start; seen[start] = 1;
    while (top > 0 && count < order_capacity) { size_t vertex = stack[--top]; order[count++] = vertex; for (size_t next = vertex_count; next > 0; --next) if (graph[vertex * vertex_count + next - 1] && !seen[next - 1]) { seen[next - 1] = 1; if (top < vertex_count) stack[top++] = next - 1; } }
    return count;
}`,
  dijkstra: `#include <stddef.h>
#include <limits.h>

long dijkstra_shortest(int vertex_count, int *edge_from, int *edge_to, int *edge_weight, int edge_count, int start, int goal) {
    long *dist = malloc((size_t)vertex_count * sizeof(long)); int *settled = calloc((size_t)vertex_count, sizeof(int));
    for (int i = 0; i < vertex_count; ++i) dist[i] = LONG_MAX / 2; dist[start] = 0;
    for (int step = 0; step < vertex_count; ++step) {
        int u = -1; for (int v = 0; v < vertex_count; ++v) if (!settled[v] && (u == -1 || dist[v] < dist[u])) u = v;
        if (u == -1) break; settled[u] = 1;
        for (int e = 0; e < edge_count; ++e) if (edge_from[e] == u && !settled[edge_to[e]] && dist[u] + edge_weight[e] < dist[edge_to[e]]) dist[edge_to[e]] = dist[u] + edge_weight[e];
    }
    long result = dist[goal]; free(dist); free(settled); return result >= LONG_MAX / 2 ? -1 : result;
}`,
  'bellman-ford': `#include <stddef.h>
#include <limits.h>
#include <stdlib.h>

long bellman_ford_shortest(int vertex_count, int *edge_from, int *edge_to, int *edge_weight, int edge_count, int start, int goal) {
    long *dist = malloc((size_t)vertex_count * sizeof(long));
    for (int i = 0; i < vertex_count; ++i) dist[i] = LONG_MAX / 2; dist[start] = 0;
    for (int i = 0; i < vertex_count - 1; ++i) for (int e = 0; e < edge_count; ++e) if (dist[edge_from[e]] + edge_weight[e] < dist[edge_to[e]]) dist[edge_to[e]] = dist[edge_from[e]] + edge_weight[e];
    for (int e = 0; e < edge_count; ++e) if (dist[edge_from[e]] + edge_weight[e] < dist[edge_to[e]]) { free(dist); return -1; }
    long result = dist[goal]; free(dist); return result >= LONG_MAX / 2 ? -1 : result;
}`,
  'floyd-warshall': `#include <stddef.h>
#include <limits.h>
#include <stdlib.h>

void floyd_warshall(int vertex_count, int *edge_from, int *edge_to, int *edge_weight, int edge_count, long *out_dist) {
    for (int i = 0; i < vertex_count; ++i) for (int j = 0; j < vertex_count; ++j) out_dist[i * vertex_count + j] = i == j ? 0 : LONG_MAX / 2;
    for (int e = 0; e < edge_count; ++e) out_dist[edge_from[e] * vertex_count + edge_to[e]] = edge_weight[e];
    for (int k = 0; k < vertex_count; ++k) for (int i = 0; i < vertex_count; ++i) for (int j = 0; j < vertex_count; ++j) if (out_dist[i * vertex_count + k] + out_dist[k * vertex_count + j] < out_dist[i * vertex_count + j]) out_dist[i * vertex_count + j] = out_dist[i * vertex_count + k] + out_dist[k * vertex_count + j];
}`,
  'a-star': `#include <stddef.h>
#include <limits.h>
#include <stdlib.h>

int a_star_search(int vertex_count, int *edge_from, int *edge_to, int *edge_weight, int edge_count, int start, int goal, int *heuristic) {
    int *g = malloc((size_t)vertex_count * sizeof(int)); int *f = malloc((size_t)vertex_count * sizeof(int)); int *closed = calloc((size_t)vertex_count, sizeof(int));
    for (int i = 0; i < vertex_count; ++i) { g[i] = INT_MAX / 2; f[i] = INT_MAX / 2; } g[start] = 0; f[start] = heuristic[start];
    int chosen = -1;
    for (int step = 0; step < vertex_count; ++step) {
        int u = -1; for (int v = 0; v < vertex_count; ++v) if (!closed[v] && (u == -1 || f[v] < f[u])) u = v;
        if (u == -1 || f[u] >= INT_MAX / 2) break; if (u == goal) { chosen = g[u]; break; } closed[u] = 1;
        for (int e = 0; e < edge_count; ++e) if (edge_from[e] == u && g[u] + edge_weight[e] < g[edge_to[e]]) { g[edge_to[e]] = g[u] + edge_weight[e]; f[edge_to[e]] = g[edge_to[e]] + heuristic[edge_to[e]]; }
    }
    free(g); free(f); free(closed); return chosen;
}`,
  'dfs-topological-sort': `#include <stddef.h>
#include <stdlib.h>

int dfs_topological_sort(int vertex_count, int *edge_from, int *edge_to, int edge_count, int *out_order) {
    int *adj[vertex_count]; for (int i = 0; i < vertex_count; ++i) adj[i] = malloc(sizeof(int) * (edge_count + 1));
    for (int i = 0; i < vertex_count; ++i) adj[i][0] = 0; for (int e = 0; e < edge_count; ++e) adj[edge_from[e]][0]++;
    int index = 0; int *visited = calloc((size_t)vertex_count, sizeof(int)); int *on_stack = calloc((size_t)vertex_count, sizeof(int)); int ok = 1;
    void (*visit)(int) = 0; (void)visit;
    int *stack = malloc((size_t)vertex_count * sizeof(int)); int top = 0;
    for (int s = 0; s < vertex_count; ++s) if (!visited[s]) {
        stack[top++] = s; on_stack[s] = 1; visited[s] = 1;
        while (top > 0 && ok) {
            int u = stack[top - 1]; int found = 0;
            for (int e = 0; e < edge_count; ++e) if (edge_from[e] == u && !visited[edge_to[e]]) { if (on_stack[edge_to[e]]) { ok = 0; break; } stack[top++] = edge_to[e]; visited[edge_to[e]] = 1; on_stack[edge_to[e]] = 1; found = 1; break; }
            if (ok && !found) { on_stack[u] = 0; out_order[index++] = u; --top; }
        }
        if (!ok) break;
    }
    free(stack);
    for (int i = 0; i < vertex_count; ++i) free(adj[i]);
    if (!ok) return 0;
    for (int i = 0; i < index / 2; ++i) { int t = out_order[i]; out_order[i] = out_order[index - 1 - i]; out_order[index - 1 - i] = t; }
    free(visited); free(on_stack); return index;
}`,
  'kahn-topological-sort': `#include <stddef.h>
#include <stdlib.h>

int kahn_topological_sort(int vertex_count, int *edge_from, int *edge_to, int edge_count, int *out_order) {
    int *indegree = calloc((size_t)vertex_count, sizeof(int));
    for (int e = 0; e < edge_count; ++e) indegree[edge_to[e]]++;
    int *dependency = malloc((size_t)vertex_count * sizeof(int)); for (int i = 0; i < vertex_count; ++i) dependency[i] = 0;
    int *queue = malloc((size_t)vertex_count * sizeof(int)); int head = 0, tail = 0, index = 0;
    for (int i = 0; i < vertex_count; ++i) if (indegree[i] == 0) queue[tail++] = i;
    while (head < tail) { int u = queue[head++]; out_order[index++] = u; for (int e = 0; e < edge_count; ++e) if (edge_from[e] == u && --indegree[edge_to[e]] == 0) queue[tail++] = edge_to[e]; }
    free(indegree); free(dependency); free(queue); return index == vertex_count ? index : 0;
}`,
  'connected-components': `#include <stddef.h>
#include <stdlib.h>

void connected_components(int vertex_count, int *edge_from, int *edge_to, int edge_count, int *out_component, int *out_count) {
    int *component = malloc((size_t)vertex_count * sizeof(int)); for (int i = 0; i < vertex_count; ++i) component[i] = -1; int count = 0;
    for (int s = 0; s < vertex_count; ++s) if (component[s] == -1) {
        int *stack = malloc((size_t)vertex_count * sizeof(int)); int top = 0; stack[top++] = s; component[s] = count;
        while (top > 0) { int u = stack[--top]; for (int e = 0; e < edge_count; ++e) { int v = edge_from[e] == u ? edge_to[e] : edge_to[e] == u ? edge_from[e] : -1; if (v >= 0 && component[v] == -1) { component[v] = count; stack[top++] = v; } } }
        free(stack); ++count;
    }
    for (int i = 0; i < vertex_count; ++i) out_component[i] = component[i]; *out_count = count; free(component);
}`,
  'cycle-detection': `#include <stddef.h>
#include <stdlib.h>

int directed_cycle_detected(int vertex_count, int *edge_from, int *edge_to, int edge_count) {
    int *state = calloc((size_t)vertex_count, sizeof(int));
    int *stack = malloc((size_t)vertex_count * sizeof(int));
    int result = 0;
    for (int s = 0; s < vertex_count && !result; ++s) if (state[s] == 0) {
        int top = 0; stack[top++] = s; state[s] = 1;
        while (top > 0 && !result) {
            int u = stack[top - 1]; int advanced = 0;
            for (int e = 0; e < edge_count; ++e) if (edge_from[e] == u) {
                int v = edge_to[e];
                if (state[v] == 1) { result = 1; break; }
                if (state[v] == 0) { state[v] = 1; stack[top++] = v; advanced = 1; break; }
            }
            if (!result && !advanced && top > 0) { state[stack[--top]] = 2; }
        }
    }
    free(state); free(stack); return result;
}`,
  'kosaraju-scc': `#include <stddef.h>
#include <stdlib.h>

void kosaraju_scc(int vertex_count, int *edge_from, int *edge_to, int edge_count, int *out_component) {
    int *visited = calloc((size_t)vertex_count, sizeof(int)); int *order = malloc((size_t)vertex_count * sizeof(int)); int order_index = 0;
    for (int s = 0; s < vertex_count; ++s) if (!visited[s]) {
        int *stack = malloc((size_t)vertex_count * sizeof(int)); int top = 0; stack[top++] = s; visited[s] = 1;
        while (top > 0) { int u = stack[top - 1]; int advanced = 0; for (int e = 0; e < edge_count; ++e) if (edge_from[e] == u && !visited[edge_to[e]]) { visited[edge_to[e]] = 1; stack[top++] = edge_to[e]; advanced = 1; break; } if (!advanced) { order[order_index++] = u; --top; } }
        free(stack);
    }
    int *component = malloc((size_t)vertex_count * sizeof(int)); for (int i = 0; i < vertex_count; ++i) component[i] = -1; int count = 0;
    for (int oi = order_index - 1; oi >= 0; --oi) { int s = order[oi]; if (component[s] == -1) { int *stack = malloc((size_t)vertex_count * sizeof(int)); int top = 0; stack[top++] = s; component[s] = count; while (top > 0) { int u = stack[--top]; for (int e = 0; e < edge_count; ++e) if (edge_to[e] == u && component[edge_from[e]] == -1) { component[edge_from[e]] = count; stack[top++] = edge_from[e]; } } free(stack); ++count; } }
    for (int i = 0; i < vertex_count; ++i) out_component[i] = component[i]; free(visited); free(order); free(component);
}`,
  'tarjan-scc': `#include <stddef.h>
#include <stdlib.h>

void tarjan_scc(int vertex_count, int *edge_from, int *edge_to, int edge_count, int *out_component) {
    int *index = malloc((size_t)vertex_count * sizeof(int)); int *low = malloc((size_t)vertex_count * sizeof(int)); int *on_stack = calloc((size_t)vertex_count, sizeof(int)); int *comp = malloc((size_t)vertex_count * sizeof(int));
    for (int i = 0; i < vertex_count; ++i) { index[i] = -1; comp[i] = -1; }
    int *stack = malloc((size_t)vertex_count * sizeof(int)); int stack_top = 0, next = 0, count = 0;
    void (*sc)(int) = 0; (void)sc;
    int *call = malloc((size_t)vertex_count * sizeof(int)); int call_top = 0;
    for (int s = 0; s < vertex_count; ++s) if (index[s] == -1) {
        call[call_top++] = s;
        while (call_top > 0) {
            int u = call[call_top - 1];
            if (index[u] == -1) { index[u] = low[u] = next++; stack[stack_top++] = u; on_stack[u] = 1; }
            int advanced = 0;
            for (int e = 0; e < edge_count; ++e) if (edge_from[e] == u) {
                int v = edge_to[e];
                if (index[v] == -1) { call[call_top++] = v; advanced = 1; break; }
                if (on_stack[v] && index[v] < low[u]) low[u] = index[v];
            }
            if (!advanced) {
                --call_top;
                for (int e = 0; e < edge_count; ++e) if (edge_from[e] == u && index[edge_to[e]] != -1 && on_stack[edge_to[e]] && low[edge_to[e]] < low[u]) low[u] = low[edge_to[e]];
                if (low[u] == index[u]) { while (stack_top > 0) { int w = stack[--stack_top]; on_stack[w] = 0; comp[w] = count; if (w == u) break; } ++count; }
            }
        }
    }
    for (int i = 0; i < vertex_count; ++i) out_component[i] = comp[i]; free(index); free(low); free(on_stack); free(comp); free(stack); free(call);
}`,
  'prim-mst': `#include <stddef.h>
#include <limits.h>
#include <stdlib.h>

long prim_mst(int vertex_count, int *edge_from, int *edge_to, int *edge_weight, int edge_count) {
    long *key = malloc((size_t)vertex_count * sizeof(long)); int *in_mst = calloc((size_t)vertex_count, sizeof(int));
    for (int i = 0; i < vertex_count; ++i) key[i] = LONG_MAX / 2; key[0] = 0; long total = 0;
    for (int step = 0; step < vertex_count; ++step) {
        int u = -1; for (int v = 0; v < vertex_count; ++v) if (!in_mst[v] && (u == -1 || key[v] < key[u])) u = v;
        if (u == -1) break; in_mst[u] = 1; total += key[u];
        for (int e = 0; e < edge_count; ++e) if (edge_from[e] == u && !in_mst[edge_to[e]] && edge_weight[e] < key[edge_to[e]]) key[edge_to[e]] = edge_weight[e];
    }
    free(key); free(in_mst); return total;
}`,
  'kruskal-mst': `#include <stddef.h>
#include <stdlib.h>

static int compare_edges(const void *a, const void *b) { const int *ea = a, *eb = b; return ea[2] - eb[2]; }

static int find_root(int *parent, int x) { while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }

long kruskal_mst(int vertex_count, int *edge_from, int *edge_to, int *edge_weight, int edge_count) {
    int (*edges)[3] = malloc((size_t)edge_count * sizeof(*edges)); for (int i = 0; i < edge_count; ++i) { edges[i][0] = edge_from[i]; edges[i][1] = edge_to[i]; edges[i][2] = edge_weight[i]; }
    qsort(edges, (size_t)edge_count, sizeof(*edges), compare_edges);
    int *parent = malloc((size_t)vertex_count * sizeof(int)); for (int i = 0; i < vertex_count; ++i) parent[i] = i; long total = 0;
    for (int i = 0; i < edge_count; ++i) { int a = find_root(parent, edges[i][0]), b = find_root(parent, edges[i][1]); if (a != b) { parent[a] = b; total += edges[i][2]; } }
    free(edges); free(parent); return total;
}`,
  'union-find-connectivity': `#include <stddef.h>
#include <stdlib.h>

static int uf_find(int *parent, int x) { while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }

void union_find_connectivity(int vertex_count, int *edge_from, int *edge_to, int edge_count, int *query_from, int *query_to, int query_count, int *out_connected) {
    int *parent = malloc((size_t)vertex_count * sizeof(int)); for (int i = 0; i < vertex_count; ++i) parent[i] = i;
    for (int i = 0; i < edge_count; ++i) { int a = uf_find(parent, edge_from[i]), b = uf_find(parent, edge_to[i]); if (a != b) parent[a] = b; }
    for (int i = 0; i < query_count; ++i) out_connected[i] = uf_find(parent, query_from[i]) == uf_find(parent, query_to[i]);
    free(parent);
}`,
  'naive-search': `#include <stddef.h>
#include <string.h>

int naive_search(const char *text, const char *pattern, size_t *match_index) {
    size_t n = strlen(text), m = strlen(pattern); if (m == 0) { *match_index = 0; return 1; }
    if (m > n) return 0;
    for (size_t i = 0; i <= n - m; ++i) { size_t j = 0; while (j < m && text[i + j] == pattern[j]) ++j; if (j == m) { *match_index = i; return 1; } }
    return 0;
}`,
  'z-algorithm': `#include <stddef.h>
#include <string.h>
#include <stdlib.h>

int z_algorithm(const char *text, const char *pattern, size_t *match_index) {
    size_t plen = strlen(pattern), tlen = strlen(text), n = plen + 1 + tlen; char *s = malloc(n + 1); size_t idx = 0;
    for (size_t i = 0; i < plen; ++i) s[idx++] = pattern[i]; s[idx++] = 1; for (size_t i = 0; i < tlen; ++i) s[idx++] = text[i]; s[idx] = 0;
    int *z = calloc(n, sizeof(int)); size_t left = 0, right = 0; int result = -1;
    for (size_t i = 1; i < n; ++i) { if (i <= right) z[i] = (int)(z[i - left] < right - i + 1 ? z[i - left] : right - i + 1); while (i + z[i] < n && s[z[i]] == s[i + z[i]]) ++z[i]; if (i + z[i] - 1 > right) { left = i; right = i + z[i] - 1; } if (z[i] >= (int)plen) { result = (int)(i - plen - 1); break; } }
    free(s); free(z); if (result >= 0) { *match_index = (size_t)result; return 1; } return 0;
}`,
  'rabin-karp': `#include <stddef.h>
#include <string.h>

int rabin_karp(const char *text, const char *pattern, size_t *match_index) {
    size_t n = strlen(text), m = strlen(pattern); if (m == 0) { *match_index = 0; return 1; }
    int prime = 101; long hash = 0, target = 0, power = 1;
    for (size_t i = 0; i < m; ++i) { target = target * prime + pattern[i]; power *= prime; }
    for (size_t i = 0; i < n; ++i) { hash = hash * prime + text[i]; if (i >= m) hash -= power * text[i - m]; if (hash == target && i + 1 >= m && strncmp(text + i + 1 - m, pattern, m) == 0) { *match_index = i + 1 - m; return 1; } }
    return 0;
}`,
  'boyer-moore': `#include <stddef.h>
#include <string.h>

int boyer_moore(const char *text, const char *pattern, size_t *match_index) {
    size_t n = strlen(text), m = strlen(pattern); if (m == 0) { *match_index = 0; return 1; }
    int shift[256]; for (int i = 0; i < 256; ++i) shift[i] = (int)m; for (size_t i = 0; i + 1 < m; ++i) shift[(unsigned char)pattern[i]] = (int)(m - 1 - i);
    long pos = 0; while (pos <= (long)(n - m)) { long i = (long)m - 1; while (i >= 0 && pattern[i] == text[pos + i]) --i; if (i < 0) { *match_index = (size_t)pos; return 1; } pos += shift[(unsigned char)text[pos + m - 1]]; }
    return 0;
}`,
  horspool: `#include <stddef.h>
#include <string.h>

int horspool(const char *text, const char *pattern, size_t *match_index) {
    size_t n = strlen(text), m = strlen(pattern); if (m == 0) { *match_index = 0; return 1; }
    int shift[256]; for (int i = 0; i < 256; ++i) shift[i] = (int)m; for (size_t i = 0; i + 1 < m; ++i) shift[(unsigned char)pattern[i]] = (int)(m - 1 - i);
    long pos = 0; while (pos <= (long)(n - m)) { long i = (long)m - 1; while (i >= 0 && pattern[i] == text[pos + i]) --i; if (i < 0) { *match_index = (size_t)pos; return 1; } pos += shift[(unsigned char)text[pos + m - 1]]; }
    return 0;
}`,
  'aho-corasick': `#include <stddef.h>
#include <string.h>
#include <stdlib.h>

int aho_corasick(const char *text, const char **patterns, int pattern_count, size_t *out_index) {
    size_t *matches = calloc((size_t)pattern_count, sizeof(size_t)); int *used = calloc((size_t)pattern_count, sizeof(int)); size_t count = 0;
    for (int p = 0; p < pattern_count; ++p) { const char *pos = strstr(text, patterns[p]); if (pos && !used[p]) { matches[count++] = (size_t)(pos - text); used[p] = 1; } }
    for (size_t i = 0; i < count; ++i) out_index[i] = matches[i]; free(matches); free(used); return (int)count;
}`,
  'trie-lookup': `#include <stddef.h>
#include <string.h>

int trie_lookup(const char *const *words, int word_count, const char *query) {
    for (int i = 0; i < word_count; ++i) if (strcmp(words[i], query) == 0) return 1; return 0;
}`,
  'longest-common-prefix': `#include <stddef.h>
#include <string.h>

const char *longest_common_prefix(const char *const *strings, int count, char *buffer, size_t buffer_size) {
    if (count == 0) { buffer[0] = 0; return buffer; }
    size_t len = strlen(strings[0]);
    for (int i = 1; i < count; ++i) { size_t j = 0; while (j < len && strings[i][j] == strings[0][j]) ++j; len = j; if (len == 0) break; }
    if (len >= buffer_size) len = buffer_size - 1; for (size_t j = 0; j < len; ++j) buffer[j] = strings[0][j]; buffer[len] = 0; return buffer;
}`,
  manacher: `#include <stddef.h>
#include <string.h>
#include <stdlib.h>

int manacher(const char *text, char *out, size_t out_size) {
    size_t n = strlen(text); if (n == 0) { out[0] = 0; return 0; }
    size_t tlen = 2 * n + 1; char *t = malloc(tlen + 1); for (size_t i = 0; i < n; ++i) { t[2 * i] = '#'; t[2 * i + 1] = text[i]; } t[tlen - 1] = '#'; t[tlen] = 0;
    int *radius = calloc(tlen, sizeof(int)); size_t center = 0, right = 0, best = 0, best_center = 0;
    for (size_t i = 0; i < tlen; ++i) { size_t mirror = 2 * center - i; radius[i] = i < right ? (int)(radius[mirror] < right - i ? radius[mirror] : right - i) : 0; size_t a = i - radius[i] - 1, b = i + radius[i] + 1; while (a + 1 > 0 && b < tlen && t[a + 1] == t[b]) { ++radius[i]; a = i - radius[i] - 1; b = i + radius[i] + 1; } if (i + radius[i] > right) { center = i; right = i + radius[i]; } if ((size_t)radius[i] > best) { best = radius[i]; best_center = i; } }
    size_t start = (best_center - best) / 2; size_t taken = best < out_size ? best : out_size - 1; for (size_t i = 0; i < taken; ++i) out[i] = text[start + i]; out[taken] = 0; free(t); free(radius); return (int)taken;
}`,
  'levenshtein-distance': `#include <stddef.h>
#include <string.h>
#include <stdlib.h>

int levenshtein_distance(const char *a, const char *b) {
    size_t m = strlen(a), n = strlen(b); int *prev = malloc((n + 1) * sizeof(int)); int *curr = malloc((n + 1) * sizeof(int));
    for (size_t j = 0; j <= n; ++j) prev[j] = (int)j;
    for (size_t i = 1; i <= m; ++i) { curr[0] = (int)i; for (size_t j = 1; j <= n; ++j) { int d = prev[j - 1] + (a[i - 1] == b[j - 1] ? 0 : 1); if (curr[j - 1] + 1 < d) d = curr[j - 1] + 1; if (prev[j] + 1 < d) d = prev[j] + 1; curr[j] = d; } int *t = prev; prev = curr; curr = t; } int result = prev[n]; free(prev); free(curr); return result;
}`,
  'longest-common-subsequence': `#include <stddef.h>
#include <string.h>
#include <stdlib.h>

int longest_common_subsequence(const char *a, const char *b, char *out, size_t out_size) {
    size_t m = strlen(a), n = strlen(b); int **dp = malloc((m + 1) * sizeof(int*)); for (size_t i = 0; i <= m; ++i) dp[i] = calloc(n + 1, sizeof(int));
    for (size_t i = 1; i <= m; ++i) for (size_t j = 1; j <= n; ++j) dp[i][j] = a[i - 1] == b[j - 1] ? dp[i - 1][j - 1] + 1 : (dp[i - 1][j] >= dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1]);
    int len = dp[m][n]; int index = len - 1; if (index >= (int)out_size) index = (int)out_size - 1;
    size_t x = m, y = n; while (x > 0 && y > 0 && index >= 0) { if (a[x - 1] == b[y - 1]) { out[index] = a[x - 1]; --index; --x; --y; } else if (dp[x - 1][y] >= dp[x][y - 1]) --x; else --y; }
    out[len] = 0; size_t start = index + 1, taken = (size_t)len; if (start > 0) { for (size_t i = 0; i < taken; ++i) { out[i] = out[i + start]; } }
    for (size_t i = 0; i <= m; ++i) free(dp[i]); free(dp); return len;
}`,
  'fibonacci-memoization': `#include <stddef.h>
#include <stdlib.h>

long long fibonacci_memoization(int n) {
    long long *memo = calloc((size_t)(n + 1), sizeof(long long)); for (int i = 0; i <= n; ++i) memo[i] = -1; memo[0] = 0; if (n >= 1) memo[1] = 1;
    long long (*fib)(int) = 0; (void)fib;
    for (int i = 2; i <= n; ++i) { memo[i] = memo[i - 1] + memo[i - 2]; }
    long long result = memo[n]; free(memo); return result;
}`,
  'zero-one-knapsack': `#include <stddef.h>
#include <stdlib.h>

int zero_one_knapsack(const int *weights, const int *values, int count, int capacity) {
    int *dp = calloc((size_t)(capacity + 1), sizeof(int));
    for (int i = 0; i < count; ++i) for (int c = capacity; c >= weights[i]; --c) if (dp[c - weights[i]] + values[i] > dp[c]) dp[c] = dp[c - weights[i]] + values[i];
    int result = dp[capacity]; free(dp); return result;
}`,
  'unbounded-knapsack': `#include <stddef.h>
#include <stdlib.h>

int unbounded_knapsack(const int *weights, const int *values, int count, int capacity) {
    int *dp = calloc((size_t)(capacity + 1), sizeof(int));
    for (int c = 1; c <= capacity; ++c) for (int i = 0; i < count; ++i) if (weights[i] <= c && dp[c - weights[i]] + values[i] > dp[c]) dp[c] = dp[c - weights[i]] + values[i];
    int result = dp[capacity]; free(dp); return result;
}`,
  'coin-change-count': `#include <stddef.h>
#include <stdlib.h>

int coin_change_count(const int *coins, int count, int amount) {
    int *dp = calloc((size_t)(amount + 1), sizeof(int)); dp[0] = 1;
    for (int i = 0; i < count; ++i) for (int a = coins[i]; a <= amount; ++a) dp[a] += dp[a - coins[i]];
    int result = dp[amount]; free(dp); return result;
}`,
  'coin-change-minimum': `#include <stddef.h>
#include <stdlib.h>

int coin_change_minimum(const int *coins, int count, int amount) {
    int inf = 1000000; int *dp = calloc((size_t)(amount + 1), sizeof(int)); for (int i = 1; i <= amount; ++i) dp[i] = inf;
    for (int a = 1; a <= amount; ++a) for (int i = 0; i < count; ++i) if (coins[i] <= a && dp[a - coins[i]] + 1 < dp[a]) dp[a] = dp[a - coins[i]] + 1;
    int result = dp[amount] >= inf ? -1 : dp[amount]; free(dp); return result;
}`,
  'longest-increasing-subsequence': `#include <stddef.h>
#include <stdlib.h>

int longest_increasing_subsequence(const int *values, size_t length) {
    if (length == 0) return 0; int *tails = malloc(length * sizeof(int)); int size = 0;
    for (size_t i = 0; i < length; ++i) { int low = 0, high = size; while (low < high) { int mid = (low + high) / 2; if (tails[mid] < values[i]) low = mid + 1; else high = mid; } tails[low] = values[i]; if (low == size) ++size; }
    int result = size; free(tails); return result;
}`,
  'matrix-chain-multiplication': `#include <stddef.h>
#include <stdlib.h>
#include <limits.h>

int matrix_chain_multiplication(const int *dimensions, int size) {
    int n = size - 1; int **dp = malloc((size_t)n * sizeof(int*)); for (int i = 0; i < n; ++i) dp[i] = malloc((size_t)n * sizeof(int));
    for (int len = 2; len <= n; ++len) for (int i = 0; i <= n - len; ++i) { int j = i + len - 1; dp[i][j] = INT_MAX; for (int k = i; k < j; ++k) { int cost = dp[i][k] + dp[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1]; if (cost < dp[i][j]) dp[i][j] = cost; } }
    int result = dp[0][n - 1]; for (int i = 0; i < n; ++i) free(dp[i]); free(dp); return result;
}`,
  'edit-distance': `#include <stddef.h>
#include <string.h>
#include <stdlib.h>

int edit_distance(const char *a, const char *b) {
    size_t m = strlen(a), n = strlen(b); int *prev = malloc((n + 1) * sizeof(int)); int *curr = malloc((n + 1) * sizeof(int));
    for (size_t j = 0; j <= n; ++j) prev[j] = (int)j;
    for (size_t i = 1; i <= m; ++i) { curr[0] = (int)i; for (size_t j = 1; j <= n; ++j) { int d = prev[j - 1] + (a[i - 1] == b[j - 1] ? 0 : 1); if (curr[j - 1] + 1 < d) d = curr[j - 1] + 1; if (prev[j] + 1 < d) d = prev[j] + 1; curr[j] = d; } int *t = prev; prev = curr; curr = t; } int result = prev[n]; free(prev); free(curr); return result;
}`,
  'grid-paths': `#include <stddef.h>
#include <stdlib.h>

long long grid_paths(int rows, int columns) {
    long long **dp = malloc((size_t)rows * sizeof(long long*)); for (int i = 0; i < rows; ++i) dp[i] = calloc((size_t)columns, sizeof(long long));
    dp[0][0] = 1;
    for (int i = 0; i < rows; ++i) for (int j = 0; j < columns; ++j) { if (i > 0) dp[i][j] += dp[i - 1][j]; if (j > 0) dp[i][j] += dp[i][j - 1]; }
    long long result = dp[rows - 1][columns - 1]; for (int i = 0; i < rows; ++i) free(dp[i]); free(dp); return result;
}`,
  'minimum-path-sum': `#include <stddef.h>
#include <stdlib.h>

int minimum_path_sum(int **grid, int rows, int columns) {
    int **dp = malloc((size_t)rows * sizeof(int*)); for (int i = 0; i < rows; ++i) dp[i] = malloc((size_t)columns * sizeof(int));
    for (int i = 0; i < rows; ++i) for (int j = 0; j < columns; ++j) { dp[i][j] = grid[i][j]; if (i > 0 && j > 0) dp[i][j] += dp[i - 1][j] < dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1]; else if (i > 0) dp[i][j] += dp[i - 1][j]; else if (j > 0) dp[i][j] += dp[i][j - 1]; }
    int result = dp[rows - 1][columns - 1]; for (int i = 0; i < rows; ++i) free(dp[i]); free(dp); return result;
}`,
  'rod-cutting': `#include <stddef.h>
#include <stdlib.h>

int rod_cutting(const int *prices, int length) {
    int *dp = calloc((size_t)(length + 1), sizeof(int));
    for (int i = 1; i <= length; ++i) for (int cut = 1; cut <= i; ++cut) if (prices[cut - 1] + dp[i - cut] > dp[i]) dp[i] = prices[cut - 1] + dp[i - cut];
    int result = dp[length]; free(dp); return result;
}`,
  'partition-equal-subset-sum': `#include <stddef.h>
#include <stdlib.h>

int partition_equal_subset_sum(const int *values, int count) {
    int sum = 0; for (int i = 0; i < count; ++i) sum += values[i]; if (sum % 2 != 0) return 0; int target = sum / 2; int *dp = calloc((size_t)(target + 1), sizeof(int)); dp[0] = 1;
    for (int i = 0; i < count; ++i) for (int s = target; s >= values[i]; --s) if (dp[s - values[i]]) dp[s] = 1;
    int result = dp[target]; free(dp); return result;
}`,
};
