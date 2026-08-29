export const goSources: Record<string, string> = {
  bubble: `func BubbleSort(values []int) {
    for end := len(values) - 1; end > 0; end-- {
        swapped := false
        for i := 0; i < end; i++ {
            if values[i] > values[i+1] {
                values[i], values[i+1] = values[i+1], values[i]
                swapped = true
            }
        }
        if !swapped { break }
    }
}`,
  quick: `func QuickSort(values []int) {
    var sortRange func(int, int)
    sortRange = func(low, high int) {
        if low >= high { return }
        pivot, split := values[high], low
        for i := low; i < high; i++ { if values[i] < pivot { values[i], values[split] = values[split], values[i]; split++ } }
        values[split], values[high] = values[high], values[split]
        sortRange(low, split-1); sortRange(split+1, high)
    }
    sortRange(0, len(values)-1)
}`,
  merge: `func MergeSort(values []int) []int {
    if len(values) < 2 { return append([]int(nil), values...) }
    middle := len(values) / 2; left, right := MergeSort(values[:middle]), MergeSort(values[middle:]); result := make([]int, 0, len(values))
    for len(left) > 0 || len(right) > 0 { if len(right) == 0 || (len(left) > 0 && left[0] <= right[0]) { result = append(result, left[0]); left = left[1:] } else { result = append(result, right[0]); right = right[1:] } }
    return result
}`,
  'search-binary-first': `func BinarySearch(values []int, target int) int {
    low, high, result := 0, len(values)-1, -1
    for low <= high { middle := low + (high-low)/2; if values[middle] >= target { if values[middle] == target { result = middle }; high = middle-1 } else { low = middle+1 } }
    return result
}`,
  'breadth-first-search': `func BreadthFirstSearch(graph [][]int, start int) []int {
    order, queue, seen := []int{}, []int{start}, make([]bool, len(graph)); seen[start] = true
    for len(queue) > 0 { vertex := queue[0]; queue = queue[1:]; order = append(order, vertex); for _, next := range graph[vertex] { if !seen[next] { seen[next] = true; queue = append(queue, next) } } }
    return order
}`,
  kmp: `func KmpSearch(text, pattern string) int {
    if len(pattern) == 0 { return 0 }; table := make([]int, len(pattern)); for i, matched := 1, 0; i < len(pattern); { if pattern[i] == pattern[matched] { table[i] = matched+1; i++; matched++ } else if matched > 0 { matched = table[matched-1] } else { i++ } }
    for i, matched := 0, 0; i < len(text); { if text[i] == pattern[matched] { i++; matched++; if matched == len(pattern) { return i-matched } } else if matched > 0 { matched = table[matched-1] } else { i++ } }; return -1
}`,
  'fibonacci-tabulation': `func FibonacciTabulation(n int) uint64 {
    if n < 0 { panic("n must be nonnegative") }; table := make([]uint64, n+1); if n > 0 { table[1] = 1 }
    for i := 2; i <= n; i++ { table[i] = table[i-1] + table[i-2] }; return table[n]
}`,
  selection: `func SelectionSort(values []int) {
    for start := 0; start < len(values)-1; start++ {
        minimum := start
        for index := start + 1; index < len(values); index++ { if values[index] < values[minimum] { minimum = index } }
        if minimum != start { values[start], values[minimum] = values[minimum], values[start] }
    }
}`,
  insertion: `func InsertionSort(values []int) {
    for index := 1; index < len(values); index++ {
        item, position := values[index], index-1
        for position >= 0 && item < values[position] { values[position+1] = values[position]; position-- }
        values[position+1] = item
    }
}`,
  cocktail: `func CocktailSort(values []int) {
    lower, upper := 0, len(values)-1; changed := true
    for changed && lower < upper {
        changed = false
        for index := lower; index < upper; index++ { if values[index+1] < values[index] { values[index], values[index+1] = values[index+1], values[index]; changed = true } }
        upper--
        if !changed { break }
        changed = false
        for index := upper; index > lower; index-- { if values[index] < values[index-1] { values[index], values[index-1] = values[index-1], values[index]; changed = true } }
        lower++
    }
}`,
  gnome: `func GnomeSort(values []int) {
    index := 1
    for index < len(values) {
        if index == 0 || !(values[index] < values[index-1]) { index++ } else { values[index], values[index-1] = values[index-1], values[index]; index-- }
    }
}`,
  shell: `func ShellSort(values []int) {
    for gap := len(values) / 2; gap > 0; gap /= 2 {
        for index := gap; index < len(values); index++ {
            item, position := values[index], index
            for position >= gap && item < values[position-gap] { values[position] = values[position-gap]; position -= gap }
            values[position] = item
        }
    }
}`,
  heap: `func HeapSort(values []int) {
    siftDown := func(root, upper int) {
        for 2*root+1 < upper {
            child := 2*root + 1
            if child+1 < upper && values[child] < values[child+1] { child++ }
            if !(values[root] < values[child]) { break }
            values[root], values[child] = values[child], values[root]; root = child
        }
    }
    for root := len(values)/2 - 1; root >= 0; root-- { siftDown(root, len(values)) }
    for upper := len(values) - 1; upper > 0; upper-- { values[0], values[upper] = values[upper], values[0]; siftDown(0, upper) }
}`,
  cycle: `func CycleSort(values []int) {
    equivalent := func(a, b int) bool { return !(a < b) && !(b < a) }
    for cycleStart := 0; cycleStart < len(values)-1; cycleStart++ {
        item, position := values[cycleStart], cycleStart
        for index := cycleStart + 1; index < len(values); index++ { if values[index] < item { position++ } }
        if position == cycleStart { continue }
        for equivalent(item, values[position]) { position++ }
        values[position], item = item, values[position]
        for position != cycleStart {
            position = cycleStart
            for index := cycleStart + 1; index < len(values); index++ { if values[index] < item { position++ } }
            for equivalent(item, values[position]) { position++ }
            values[position], item = item, values[position]
        }
    }
}`,
  comb: `func CombSort(values []int) {
    gap, swapped := len(values), true
    for gap > 1 || swapped {
        gap = (gap * 10) / 13; if gap < 1 { gap = 1 }
        swapped = false
        for index := 0; index < len(values)-gap; index++ {
            other := index + gap
            if values[index] > values[other] { values[index], values[other] = values[other], values[index]; swapped = true }
        }
    }
}`,
  'odd-even': `func OddEvenSort(values []int) {
    changed := true
    for changed {
        changed = false
        for _, parity := range []int{1, 0} {
            for index := parity; index < len(values)-1; index += 2 {
                if values[index] > values[index+1] { values[index], values[index+1] = values[index+1], values[index]; changed = true }
            }
        }
    }
}`,
  pancake: `func PancakeSort(values []int) {
    flip := func(end int) {
        left := 0
        for left < end { values[left], values[end] = values[end], values[left]; left++; end-- }
    }
    for size := len(values); size > 1; size-- {
        maximum := 0
        for index := 1; index < size; index++ { if values[index] > values[maximum] { maximum = index } }
        if maximum == size-1 { continue }
        if maximum != 0 { flip(maximum) }
        flip(size - 1)
    }
}`,
  'binary-insertion': `func BinaryInsertionSort(values []int) {
    for index := 1; index < len(values); index++ {
        current, left, right := values[index], 0, index
        for left < right { middle := (left + right) / 2; if current < values[middle] { right = middle } else { left = middle + 1 } }
        position := index
        for position > left { values[position] = values[position-1]; position-- }
        values[left] = current
    }
}`,
  'three-way-quick': `func ThreeWayQuickSort(values []int) {
    var quickSort func(int, int)
    quickSort = func(lower, upper int) {
        if lower >= upper { return }
        pivot, less, index, greater := values[lower], lower, lower+1, upper
        for index <= greater {
            if values[index] < pivot { values[less], values[index] = values[index], values[less]; less++; index++ } else if pivot < values[index] { values[index], values[greater] = values[greater], values[index]; greater-- } else { index++ }
        }
        quickSort(lower, less-1); quickSort(greater+1, upper)
    }
    quickSort(0, len(values)-1)
}`,
  'natural-merge': `func NaturalMergeSort(values []int) {
    if len(values) < 2 { return }
    runs := [][2]int{}; start := 0
    for index := 1; index < len(values); index++ { if values[index] < values[index-1] { runs = append(runs, [2]int{start, index}); start = index } }
    runs = append(runs, [2]int{start, len(values)})
    for len(runs) > 1 {
        mergedRuns := [][2]int{}
        for runIndex := 0; runIndex < len(runs); runIndex += 2 {
            if runIndex+1 >= len(runs) { mergedRuns = append(mergedRuns, runs[runIndex]); break }
            left, middle, right := runs[runIndex][0], runs[runIndex][1], runs[runIndex+1][1]
            buffer, first, second := []int{}, left, middle
            for first < middle && second < right { if !(values[second] < values[first]) { buffer = append(buffer, values[first]); first++ } else { buffer = append(buffer, values[second]); second++ } }
            for first < middle { buffer = append(buffer, values[first]); first++ }
            for second < right { buffer = append(buffer, values[second]); second++ }
            for offset := range buffer { values[left+offset] = buffer[offset] }
            mergedRuns = append(mergedRuns, [2]int{left, right})
        }
        runs = mergedRuns
    }
}`,
  'hoare-quick': `func HoareQuickSort(values []int) {
    var quickSort func(int, int)
    quickSort = func(lower, upper int) {
        if lower >= upper { return }
        pivot, left, right := values[(lower+upper)/2], lower, upper
        for left <= right {
            for values[left] < pivot { left++ }
            for pivot < values[right] { right-- }
            if left <= right { values[left], values[right] = values[right], values[left]; left++; right-- }
        }
        quickSort(lower, right); quickSort(left, upper)
    }
    quickSort(0, len(values)-1)
}`,
  'dual-pivot-quick': `func DualPivotQuickSort(values []int) {
    var quickSort func(int, int)
    quickSort = func(lower, upper int) {
        if lower >= upper { return }
        if values[upper] < values[lower] { values[lower], values[upper] = values[upper], values[lower] }
        leftPivot, rightPivot := values[lower], values[upper]
        less, greater, index := lower+1, upper-1, lower+1
        for index <= greater {
            if values[index] < leftPivot { values[index], values[less] = values[less], values[index]; less++ } else if rightPivot < values[index] {
                for index < greater && rightPivot < values[greater] { greater-- }
                values[index], values[greater] = values[greater], values[index]; greater--
                if values[index] < leftPivot { values[index], values[less] = values[less], values[index]; less++ }
            }
            index++
        }
        less--; greater++
        values[lower], values[less] = values[less], values[lower]
        values[upper], values[greater] = values[greater], values[upper]
        quickSort(lower, less-1)
        if leftPivot < rightPivot { quickSort(less+1, greater-1) }
        quickSort(greater+1, upper)
    }
    quickSort(0, len(values)-1)
}`,
  'median-three-quick': `func MedianThreeQuickSort(values []int) {
    var quickSort func(int, int)
    quickSort = func(lower, upper int) {
        if lower >= upper { return }
        middle := (lower + upper) / 2
        if values[middle] < values[lower] { values[lower], values[middle] = values[middle], values[lower] }
        if values[upper] < values[lower] { values[lower], values[upper] = values[upper], values[lower] }
        if values[upper] < values[middle] { values[middle], values[upper] = values[upper], values[middle] }
        pivot, left, right := values[middle], lower, upper
        for left <= right {
            for values[left] < pivot { left++ }
            for pivot < values[right] { right-- }
            if left <= right { values[left], values[right] = values[right], values[left]; left++; right-- }
        }
        quickSort(lower, right); quickSort(left, upper)
    }
    quickSort(0, len(values)-1)
}`,
  'bottom-up-merge': `func BottomUpMergeSort(values []int) {
    length := len(values); auxiliary := make([]int, length)
    for width := 1; width < length; width *= 2 {
        for lower := 0; lower < length; lower += 2 * width {
            middle := lower + width; if middle > length { middle = length }
            upper := lower + 2*width; if upper > length { upper = length }
            for index := lower; index < upper; index++ { auxiliary[index] = values[index] }
            left, right, destination := lower, middle, lower
            for destination < upper {
                if left >= middle { values[destination] = auxiliary[right]; right++ } else if right >= upper { values[destination] = auxiliary[left]; left++ } else if auxiliary[right] < auxiliary[left] { values[destination] = auxiliary[right]; right++ } else { values[destination] = auxiliary[left]; left++ }
                destination++
            }
        }
    }
}`,
  'in-place-merge': `func InPlaceMergeSort(values []int) {
    merge := func(lower, middle, upper int) {
        left, right := lower, middle
        for left < right && right < upper {
            if !(values[right] < values[left]) { left++; continue }
            temporary, index := values[right], right
            for index > left { values[index] = values[index-1]; index-- }
            values[left] = temporary; left++; right++
        }
    }
    var mergeSort func(int, int)
    mergeSort = func(lower, upper int) {
        if upper-lower < 2 { return }
        middle := (lower + upper) / 2
        mergeSort(lower, middle); mergeSort(middle, upper); merge(lower, middle, upper)
    }
    mergeSort(0, len(values))
}`,
  intro: `func IntroSort(values []int) {
    length := len(values)
    if length < 2 { return }
    swap := func(a, b int) { values[a], values[b] = values[b], values[a] }
    insertionSort := func(lower, upper int) {
        for index := lower + 1; index < upper; index++ {
            item, position := values[index], index
            for position > lower && item < values[position-1] { values[position] = values[position-1]; position-- }
            values[position] = item
        }
    }
    heapSort := func(lower, upper int) {
        size := upper - lower
        siftDown := func(root, count int) {
            for 2*root+1 < count {
                child := 2*root + 1
                if child+1 < count && values[lower+child] < values[lower+child+1] { child++ }
                if !(values[lower+root] < values[lower+child]) { return }
                swap(lower+root, lower+child); root = child
            }
        }
        for root := size/2 - 1; root >= 0; root-- { siftDown(root, size) }
        for end := size - 1; end > 0; end-- { swap(lower, lower+end); siftDown(0, end) }
    }
    depthLimit := 0
    for remaining := length; remaining > 1; remaining /= 2 { depthLimit += 2 }
    threshold := 16
    pending := [][3]int{{0, length, depthLimit}}
    for len(pending) > 0 {
        task := pending[len(pending)-1]; pending = pending[:len(pending)-1]
        lower, upper, depth := task[0], task[1], task[2]
        for upper-lower > threshold {
            if depth == 0 { heapSort(lower, upper); lower = upper; break }
            depth--
            middle, last := lower+(upper-lower)/2, upper-1
            if values[middle] < values[lower] { swap(middle, lower) }
            if values[last] < values[middle] { swap(last, middle) }
            if values[middle] < values[lower] { swap(middle, lower) }
            swap(middle, last)
            pivot, boundary := values[last], lower
            for index := lower; index < last; index++ { if values[index] < pivot { swap(boundary, index); boundary++ } }
            swap(boundary, last)
            if boundary-lower < upper-boundary-1 { pending = append(pending, [3]int{boundary + 1, upper, depth}); upper = boundary } else { pending = append(pending, [3]int{lower, boundary, depth}); lower = boundary + 1 }
        }
        if lower < upper { insertionSort(lower, upper) }
    }
}`,
  tim: `func TimSort(values []int) {
    length := len(values)
    if length < 2 { return }
    reverse := func(lower, upper int) {
        upper--
        for lower < upper { values[lower], values[upper] = values[upper], values[lower]; lower++; upper-- }
    }
    insertionSort := func(lower, upper, start int) {
        for index := start; index < upper; index++ {
            item, position := values[index], index
            for position > lower && item < values[position-1] { values[position] = values[position-1]; position-- }
            values[position] = item
        }
    }
    merge := func(left, middle, right int) {
        buffer := append([]int(nil), values[left:middle]...)
        first, second, destination := 0, middle, left
        for first < len(buffer) && second < right { if values[second] < buffer[first] { values[destination] = values[second]; second++ } else { values[destination] = buffer[first]; first++ }; destination++ }
        for first < len(buffer) { values[destination] = buffer[first]; first++; destination++ }
    }
    minrun, remainder := length, 0
    for minrun >= 64 { remainder |= minrun & 1; minrun >>= 1 }
    minrun += remainder
    runs := [][2]int{}
    mergeAt := func(index int) {
        left, leftSize, rightSize := runs[index][0], runs[index][1], runs[index+1][1]
        merge(left, left+leftSize, left+leftSize+rightSize)
        runs[index] = [2]int{left, leftSize + rightSize}
        runs = append(runs[:index+1], runs[index+2:]...)
    }
    start := 0
    for start < length {
        end := start + 1
        if end < length {
            if values[end] < values[start] {
                end++
                for end < length && values[end] < values[end-1] { end++ }
                reverse(start, end)
            } else {
                end++
                for end < length && !(values[end] < values[end-1]) { end++ }
            }
        }
        forcedEnd := start + minrun; if forcedEnd > length { forcedEnd = length }
        if end < forcedEnd { insertionSort(start, forcedEnd, end); end = forcedEnd }
        runs = append(runs, [2]int{start, end - start})
        for len(runs) > 1 {
            count := len(runs)
            if count >= 3 && runs[count-3][1] <= runs[count-2][1]+runs[count-1][1] { if runs[count-3][1] < runs[count-1][1] { mergeAt(count - 3) } else { mergeAt(count - 2) } } else if runs[count-2][1] <= runs[count-1][1] { mergeAt(count - 2) } else { break }
        }
        start = end
    }
    for len(runs) > 1 { mergeAt(len(runs) - 2) }
}`,
  tournament: `func TournamentSort(values []int) {
    length := len(values)
    if length < 2 { return }
    contenders := append([]int(nil), values...)
    leafCount := 1
    for leafCount < length { leafCount *= 2 }
    tree := make([]int, 2*leafCount)
    for index := range tree { tree[index] = -1 }
    for index := 0; index < length; index++ { tree[leafCount+index] = index }
    winner := func(first, second int) int {
        if first < 0 { return second }
        if second < 0 { return first }
        if contenders[second] < contenders[first] { return second }
        return first
    }
    for node := leafCount - 1; node > 0; node-- { tree[node] = winner(tree[2*node], tree[2*node+1]) }
    for destination := 0; destination < length; destination++ {
        champion := tree[1]; values[destination] = contenders[champion]
        node := leafCount + champion; tree[node] = -1; node /= 2
        for node > 0 { tree[node] = winner(tree[2*node], tree[2*node+1]); node /= 2 }
    }
}`,
  patience: `func PatienceSort(values []int) {
    length := len(values)
    if length < 2 { return }
    piles := [][]int{}
    for index := 0; index < length; index++ {
        item, lower, upper := values[index], 0, len(piles)
        for lower < upper { middle := lower + (upper-lower)/2; if piles[middle][len(piles[middle])-1] < item { lower = middle + 1 } else { upper = middle } }
        if lower == len(piles) { piles = append(piles, []int{item}) } else { piles[lower] = append(piles[lower], item) }
    }
    heap := []int{}
    comesFirst := func(first, second int) bool { return piles[first][len(piles[first])-1] < piles[second][len(piles[second])-1] }
    push := func(pileIndex int) {
        heap = append(heap, pileIndex); child := len(heap) - 1
        for child > 0 { parent := (child - 1) / 2; if !comesFirst(heap[child], heap[parent]) { break }; heap[child], heap[parent] = heap[parent], heap[child]; child = parent }
    }
    popMinimum := func() int {
        minimum := heap[0]; last := heap[len(heap)-1]; heap = heap[:len(heap)-1]
        if len(heap) > 0 {
            heap[0] = last; parent := 0
            for 2*parent+1 < len(heap) {
                child := 2*parent + 1
                if child+1 < len(heap) && comesFirst(heap[child+1], heap[child]) { child++ }
                if !comesFirst(heap[child], heap[parent]) { break }
                heap[parent], heap[child] = heap[child], heap[parent]; parent = child
            }
        }
        return minimum
    }
    for pileIndex := 0; pileIndex < len(piles); pileIndex++ { push(pileIndex) }
    for destination := 0; destination < length; destination++ {
        pileIndex := popMinimum()
        values[destination] = piles[pileIndex][len(piles[pileIndex])-1]
        piles[pileIndex] = piles[pileIndex][:len(piles[pileIndex])-1]
        if len(piles[pileIndex]) > 0 { push(pileIndex) }
    }
}`,
  tree: `func TreeSort(values []int) {
    length := len(values)
    if length < 2 { return }
    type node struct { value int; left, right *node; count int }
    root := &node{value: values[0], count: 1}
    for index := 1; index < length; index++ {
        item, current := values[index], root
        for {
            if item < current.value {
                if current.left == nil { current.left = &node{value: item, count: 1}; break }
                current = current.left
            } else if current.value < item {
                if current.right == nil { current.right = &node{value: item, count: 1}; break }
                current = current.right
            } else { current.count++; break }
        }
    }
    stack := []*node{}; current := root; destination := 0
    for len(stack) > 0 || current != nil {
        for current != nil { stack = append(stack, current); current = current.left }
        current = stack[len(stack)-1]; stack = stack[:len(stack)-1]
        for count := 0; count < current.count; count++ { values[destination] = current.value; destination++ }
        current = current.right
    }
}`,
  strand: `func StrandSort(values []int) {
    if len(values) < 2 { return }
    remaining := append([]int(nil), values...); result := []int{}
    for len(remaining) > 0 {
        strand := []int{remaining[0]}; remaining = remaining[1:]; index := 0
        for index < len(remaining) {
            if !(remaining[index] < strand[len(strand)-1]) { strand = append(strand, remaining[index]); remaining = append(remaining[:index], remaining[index+1:]...) } else { index++ }
        }
        merged := []int{}; resultIndex, strandIndex := 0, 0
        for resultIndex < len(result) && strandIndex < len(strand) { if !(strand[strandIndex] < result[resultIndex]) { merged = append(merged, result[resultIndex]); resultIndex++ } else { merged = append(merged, strand[strandIndex]); strandIndex++ } }
        for resultIndex < len(result) { merged = append(merged, result[resultIndex]); resultIndex++ }
        for strandIndex < len(strand) { merged = append(merged, strand[strandIndex]); strandIndex++ }
        result = merged
    }
    copy(values, result)
}`,
  counting: `func CountingSort(values []int) {
    if len(values) == 0 { return }
    minimum, maximum := values[0], values[0]
    for _, value := range values[1:] { if value < minimum { minimum = value }; if value > maximum { maximum = value } }
    rangeSize := maximum - minimum + 1
    if rangeSize > max(1000000, len(values)*100) {
        groups := map[int][]int{}; orderedKeys := []int{}
        for _, value := range values { if _, exists := groups[value]; !exists { groups[value] = []int{}; orderedKeys = append(orderedKeys, value) }; groups[value] = append(groups[value], value) }
        for index := 1; index < len(orderedKeys); index++ { key := orderedKeys[index]; position := index; for position > 0 && key < orderedKeys[position-1] { orderedKeys[position] = orderedKeys[position-1]; position-- }; orderedKeys[position] = key }
        destination := 0
        for _, key := range orderedKeys { for _, value := range groups[key] { values[destination] = value; destination++ } }
        return
    }
    counts := make([]int, rangeSize)
    for _, value := range values { counts[value-minimum]++ }
    for index := 1; index < len(counts); index++ { counts[index] += counts[index-1] }
    output := make([]int, len(values))
    for index := len(values) - 1; index >= 0; index-- { countIndex := values[index] - minimum; counts[countIndex]--; output[counts[countIndex]] = values[index] }
    copy(values, output)
}`,
  'radix-lsd': `func RadixLsdSort(values []int) {
    if len(values) == 0 { return }
    items := append([]int(nil), values...); keys := append([]int(nil), values...)
    minimum, maximum := keys[0], keys[0]
    for _, key := range keys[1:] { if key < minimum { minimum = key }; if key > maximum { maximum = key } }
    for index := range keys { keys[index] -= minimum }
    largest := maximum - minimum
    for place := 1; largest/place > 0; place *= 10 {
        counts := make([]int, 10)
        for _, key := range keys { counts[(key/place)%10]++ }
        for index := 1; index < 10; index++ { counts[index] += counts[index-1] }
        nextItems, nextKeys := make([]int, len(items)), make([]int, len(items))
        for index := len(items) - 1; index >= 0; index-- { digit := (keys[index] / place) % 10; counts[digit]--; destination := counts[digit]; nextItems[destination] = items[index]; nextKeys[destination] = keys[index] }
        items, keys = nextItems, nextKeys
    }
    copy(values, items)
}`,
  bucket: `func BucketSort(values []float64) {
    if len(values) < 2 { return }
    minimum, maximum := values[0], values[0]
    for index := 1; index < len(values); index++ { if values[index] < minimum { minimum = values[index] }; if maximum < values[index] { maximum = values[index] } }
    if !(minimum < maximum) && !(maximum < minimum) { return }
    bucketCount, span := len(values), maximum-minimum
    buckets := make([][]float64, bucketCount)
    for _, value := range values { bucketIndex := int((value - minimum) * float64(bucketCount-1) / span); if bucketIndex < 0 { bucketIndex = 0 } else if bucketIndex >= bucketCount { bucketIndex = bucketCount - 1 }; buckets[bucketIndex] = append(buckets[bucketIndex], value) }
    for _, bucket := range buckets {
        for index := 1; index < len(bucket); index++ { item, position := bucket[index], index; for position > 0 && item < bucket[position-1] { bucket[position] = bucket[position-1]; position-- }; bucket[position] = item }
    }
    destination := 0
    for _, bucket := range buckets { for _, item := range bucket { values[destination] = item; destination++ } }
}`,
  'search-linear-first': `func LinearSearch(values []int, target int) int {
    for index, value := range values { if value == target { return index } }
    return -1
}`,
  'search-sentinel-first': `func SentinelSearch(values []int, target int) int {
    length := len(values)
    values = append(values, target)
    index := 0
    for values[index] != target { index++ }
    if index < length { return index }; return -1
}`,
  'search-lower-bound': `func LowerBound(values []int, target int) int {
    left, right := 0, len(values)
    for left < right { middle := (left + right) / 2; if values[middle] < target { left = middle + 1 } else { right = middle } }
    return left
}`,
  'search-upper-bound': `func UpperBound(values []int, target int) int {
    left, right := 0, len(values)
    for left < right { middle := (left + right) / 2; if target < values[middle] { right = middle } else { left = middle + 1 } }
    return left
}`,
  'search-jump-first': `func JumpSearch(values []int, target int) int {
    length := len(values)
    if length == 0 { return -1 }
    step := 1
    for (step+1)*(step+1) <= length { step++ }
    blockStart, blockEnd := 0, step
    if blockEnd > length { blockEnd = length }
    for values[blockEnd-1] < target {
        blockStart = blockEnd
        if blockStart >= length { return -1 }
        blockEnd += step; if blockEnd > length { blockEnd = length }
    }
    for index := blockStart; index < blockEnd; index++ { if values[index] == target { return index }; if target < values[index] { break } }
    return -1
}`,
  'search-exponential-first': `func ExponentialSearch(values []int, target int) int {
    length := len(values)
    if length == 0 || target < values[0] { return -1 }
    if values[0] == target { return 0 }
    bound := 1
    for bound < length && values[bound] < target { bound *= 2 }
    left := bound / 2; right := bound; if right > length-1 { right = length - 1 }
    result := -1
    for left <= right { middle := (left + right) / 2; if values[middle] < target { left = middle + 1 } else { if values[middle] == target { result = middle }; right = middle - 1 } }
    return result
}`,
  'search-interpolation-first': `func InterpolationSearch(values []int, target int) int {
    low, high, result := 0, len(values)-1, -1
    for low <= high && values[low] <= target && target <= values[high] {
        if values[low] == values[high] { if values[low] == target { return low }; return result }
        position := low + (target-values[low])*(high-low)/(values[high]-values[low])
        if position < low { position = low }; if position > high { position = high }
        if values[position] < target { low = position + 1 } else { if values[position] == target { result = position }; high = position - 1 }
    }
    return result
}`,
  'search-fibonacci-first': `func FibonacciSearch(values []int, target int) int {
    length := len(values)
    smaller, larger := 0, 1
    fibonacci := smaller + larger
    for fibonacci < length { smaller, larger = larger, fibonacci; fibonacci = smaller + larger }
    offset, result := -1, -1
    for fibonacci > 1 {
        index := offset + smaller; if index > length-1 { index = length - 1 }
        if values[index] < target { fibonacci, larger, smaller, offset = larger, smaller, fibonacci-larger, index } else { if values[index] == target { result = index }; fibonacci, larger, smaller = smaller, larger-smaller, fibonacci-larger }
    }
    candidate := offset + 1
    if candidate < length && values[candidate] == target { result = candidate }
    return result
}`,
  'search-quickselect-kth': `func Quickselect(values []int, k int) int {
    if k < 0 || k >= len(values) { panic("k must be an integer index between 0 and len(values) - 1") }
    work := append([]int(nil), values...)
    left, right := 0, len(work)-1
    for left <= right {
        pivot, destination := work[right], left
        for index := left; index < right; index++ { if work[index] <= pivot { work[index], work[destination] = work[destination], work[index]; destination++ } }
        work[destination], work[right] = work[right], work[destination]
        if destination == k { return work[destination] }
        if destination < k { left = destination + 1 } else { right = destination - 1 }
    }
    return work[k]
}`,
  'depth-first-search': `func DepthFirstSearch(graph [][]int, start int) ([]int, []int) {
    order := []int{}; parent := make([]int, len(graph)); seen := make([]bool, len(graph))
    for index := range parent { parent[index] = -1 }
    stack := []int{start}
    for len(stack) > 0 {
        node := stack[len(stack)-1]; stack = stack[:len(stack)-1]
        if seen[node] { continue }
        seen[node] = true; order = append(order, node)
        for index := len(graph[node]) - 1; index >= 0; index-- { next := graph[node][index]; if !seen[next] { if parent[next] == -1 && next != start { parent[next] = node }; stack = append(stack, next) } }
    }
    return order, parent
}`,
  dijkstra: `func Dijkstra(graph [][][2]int, start int) ([]int, []int) {
    count := len(graph); const inf = int(^uint(0) >> 1)
    distance, previous := make([]int, count), make([]int, count)
    for index := 0; index < count; index++ { distance[index] = inf; previous[index] = -1 }
    distance[start] = 0; visited := make([]bool, count)
    for step := 0; step < count; step++ {
        node := -1
        for index := 0; index < count; index++ { if !visited[index] && (node == -1 || distance[index] < distance[node]) { node = index } }
        if node == -1 || distance[node] == inf { break }
        visited[node] = true
        for _, edge := range graph[node] { next, weight := edge[0], edge[1]; if distance[node]+weight < distance[next] { distance[next] = distance[node] + weight; previous[next] = node } }
    }
    return distance, previous
}`,
  'bellman-ford': `func BellmanFord(count int, edges [][3]int, start int) ([]int, []int, bool) {
    const inf = int(^uint(0) >> 1)
    distance, previous := make([]int, count), make([]int, count)
    for index := 0; index < count; index++ { distance[index] = inf; previous[index] = -1 }
    distance[start] = 0
    for iteration := 0; iteration < count-1; iteration++ {
        changed := false
        for _, edge := range edges { from, to, weight := edge[0], edge[1], edge[2]; if distance[from] != inf && distance[from]+weight < distance[to] { distance[to] = distance[from] + weight; previous[to] = from; changed = true } }
        if !changed { break }
    }
    negativeCycle := false
    for _, edge := range edges { from, to, weight := edge[0], edge[1], edge[2]; if distance[from] != inf && distance[from]+weight < distance[to] { negativeCycle = true; break } }
    return distance, previous, negativeCycle
}`,
  'floyd-warshall': `func FloydWarshall(count int, edges [][3]int, directed bool) ([][]int, bool) {
    const inf = int(^uint(0) >> 1)
    distance := make([][]int, count)
    for from := 0; from < count; from++ { distance[from] = make([]int, count); for to := 0; to < count; to++ { distance[from][to] = inf }; distance[from][from] = 0 }
    for _, edge := range edges { from, to, weight := edge[0], edge[1], edge[2]; if weight < distance[from][to] { distance[from][to] = weight }; if !directed && weight < distance[to][from] { distance[to][from] = weight } }
    for middle := 0; middle < count; middle++ { for from := 0; from < count; from++ { for to := 0; to < count; to++ { if distance[from][middle] != inf && distance[middle][to] != inf && distance[from][middle]+distance[middle][to] < distance[from][to] { distance[from][to] = distance[from][middle] + distance[middle][to] } } } }
    negativeCycle := false
    for node := 0; node < count; node++ { if distance[node][node] < 0 { negativeCycle = true; break } }
    return distance, negativeCycle
}`,
  'a-star': `func AStar(graph [][][2]float64, coordinates [][2]float64, start, goal int) ([]int, float64) {
    const inf = float64(int(^uint(0) >> 1))
    heuristic := func(node int) float64 { dx := coordinates[node][0] - coordinates[goal][0]; dy := coordinates[node][1] - coordinates[goal][1]; return dx*dx + dy*dy }
    cost := make([]float64, len(graph)); previous := make([]int, len(graph)); visited := make([]bool, len(graph))
    for index := range cost { cost[index] = inf; previous[index] = -1 }
    cost[start] = 0
    for {
        node := -1; best := inf
        for index := 0; index < len(graph); index++ { if !visited[index] && cost[index] < best { best = cost[index]; node = index } }
        if node == -1 { break }
        visited[node] = true
        for _, edge := range graph[node] { next, weight := edge[0], edge[1]; candidate := cost[node] + weight; if candidate < cost[next] { cost[next] = candidate; previous[next] = node } }
        if node == goal { break }
    }
    path := []int{}
    for node := goal; node != -1; node = previous[node] { path = append(path, node) }
    if len(path) == 0 || path[0] != start || path[len(path)-1] != goal { return path, inf }
    for left, right := 0, len(path)-1; left < right; left, right = left+1, right-1 { path[left], path[right] = path[right], path[left] }
    return path, cost[goal]
}`,
  'dfs-topological-sort': `func DfsTopologicalSort(count int, edges [][2]int) ([]int, bool) {
    adjacency := make([][]int, count)
    for _, edge := range edges { adjacency[edge[0]] = append(adjacency[edge[0]], edge[1]) }
    state := make([]int, count); order := []int{}
    var visit func(int) bool
    visit = func(node int) bool {
        state[node] = 1
        for _, next := range adjacency[node] { if state[next] == 1 { return false }; if state[next] == 0 && !visit(next) { return false } }
        state[node] = 2; order = append(order, node); return true
    }
    for node := 0; node < count; node++ { if state[node] == 0 && !visit(node) { return nil, false } }
    for left, right := 0, len(order)-1; left < right; left, right = left+1, right-1 { order[left], order[right] = order[right], order[left] }
    return order, true
}`,
  'kahn-topological-sort': `func KahnTopologicalSort(count int, edges [][2]int) ([]int, bool) {
    adjacency := make([][]int, count); indegree := make([]int, count)
    for _, edge := range edges { adjacency[edge[0]] = append(adjacency[edge[0]], edge[1]); indegree[edge[1]]++ }
    order := []int{}; processed := make([]bool, count)
    for len(order) < count {
        candidate := -1
        for node := 0; node < count; node++ { if !processed[node] && indegree[node] == 0 { candidate = node; break } }
        if candidate == -1 { return order, false }
        processed[candidate] = true; order = append(order, candidate)
        for _, next := range adjacency[candidate] { indegree[next]-- }
    }
    return order, true
}`,
  'connected-components': `func ConnectedComponents(count int, edges [][2]int) ([][]int, int) {
    adjacency := make([][]int, count)
    for _, edge := range edges { left, right := edge[0], edge[1]; adjacency[left] = append(adjacency[left], right); adjacency[right] = append(adjacency[right], left) }
    visited := make([]bool, count); components := [][]int{}
    for start := 0; start < count; start++ {
        if visited[start] { continue }
        component := []int{}; stack := []int{start}; visited[start] = true
        for len(stack) > 0 { node := stack[len(stack)-1]; stack = stack[:len(stack)-1]; component = append(component, node); for _, next := range adjacency[node] { if !visited[next] { visited[next] = true; stack = append(stack, next) } } }
        components = append(components, component)
    }
    return components, len(components)
}`,
  'cycle-detection': `func CycleDetection(count int, edges [][2]int, directed bool) bool {
    adjacency := make([][]int, count)
    for _, edge := range edges { left, right := edge[0], edge[1]; adjacency[left] = append(adjacency[left], right); if !directed { adjacency[right] = append(adjacency[right], left) } }
    if directed {
        state := make([]int, count)
        var visit func(int) bool
        visit = func(node int) bool {
            state[node] = 1
            for _, next := range adjacency[node] { if state[next] == 1 { return true }; if state[next] == 0 && visit(next) { return true } }
            state[node] = 2; return false
        }
        for node := 0; node < count; node++ { if state[node] == 0 && visit(node) { return true } }
        return false
    }
    visited := make([]bool, count)
    var visit func(int, int) bool
    visit = func(node, parent int) bool {
        visited[node] = true
        for _, next := range adjacency[node] { if !visited[next] { if visit(next, node) { return true } } else if next != parent { return true } }
        return false
    }
    for node := 0; node < count; node++ { if !visited[node] && visit(node, -1) { return true } }
    return false
}`,
  'kosaraju-scc': `func KosarajuSCC(count int, edges [][2]int) ([][]int, int) {
    graph := make([][]int, count); reverse := make([][]int, count)
    for _, edge := range edges { graph[edge[0]] = append(graph[edge[0]], edge[1]); reverse[edge[1]] = append(reverse[edge[1]], edge[0]) }
    visited := make([]bool, count); finish := []int{}
    var first func(int)
    first = func(node int) { visited[node] = true; for _, next := range graph[node] { if !visited[next] { first(next) } }; finish = append(finish, node) }
    for node := 0; node < count; node++ { if !visited[node] { first(node) } }
    visited = make([]bool, count); components := [][]int{}
    var second func(int, *[]int)
    second = func(node int, component *[]int) { visited[node] = true; *component = append(*component, node); for _, next := range reverse[node] { if !visited[next] { second(next, component) } } }
    for index := len(finish) - 1; index >= 0; index-- { node := finish[index]; if !visited[node] { component := []int{}; second(node, &component); components = append(components, component) } }
    return components, len(components)
}`,
  'tarjan-scc': `func TarjanSCC(count int, edges [][2]int) ([][]int, int) {
    graph := make([][]int, count)
    for _, edge := range edges { graph[edge[0]] = append(graph[edge[0]], edge[1]) }
    index := 0; indices := make([]int, count); low := make([]int, count); onStack := make([]bool, count); stack := []int{}; components := [][]int{}
    for node := range indices { indices[node] = -1 }
    var visit func(int)
    visit = func(node int) {
        indices[node], low[node] = index, index; index++
        stack = append(stack, node); onStack[node] = true
        for _, next := range graph[node] { if indices[next] == -1 { visit(next); if low[next] < low[node] { low[node] = low[next] } } else if onStack[next] && indices[next] < low[node] { low[node] = indices[next] } }
        if low[node] == indices[node] {
            component := []int{}
            for { member := stack[len(stack)-1]; stack = stack[:len(stack)-1]; onStack[member] = false; component = append(component, member); if member == node { break } }
            components = append(components, component)
        }
    }
    for node := 0; node < count; node++ { if indices[node] == -1 { visit(node) } }
    return components, len(components)
}`,
  'prim-mst': `func PrimMST(count int, edges [][3]int) ([][3]int, int, bool) {
    adjacency := make([][][2]int, count)
    for _, edge := range edges { left, right, weight := edge[0], edge[1], edge[2]; adjacency[left] = append(adjacency[left], [2]int{right, weight}); adjacency[right] = append(adjacency[right], [2]int{left, weight}) }
    const inf = int(^uint(0) >> 1)
    visited := make([]bool, count); forest := [][3]int{}; total := 0
    for root := 0; root < count; root++ {
        if visited[root] { continue }
        visited[root] = true
        for {
            bestWeight, bestFrom, bestTo := inf, -1, -1
            for from := 0; from < count; from++ { if visited[from] { for _, edge := range adjacency[from] { to, weight := edge[0], edge[1]; if !visited[to] && weight < bestWeight { bestWeight, bestFrom, bestTo = weight, from, to } } } }
            if bestFrom == -1 { break }
            visited[bestTo] = true; forest = append(forest, [3]int{bestFrom, bestTo, bestWeight}); total += bestWeight
        }
    }
    connected := count <= 1 || len(forest) == count-1
    return forest, total, connected
}`,
  'kruskal-mst': `func KruskalMST(count int, edges [][3]int) ([][3]int, int, bool) {
    sorted := append([][3]int(nil), edges...)
    for index := 1; index < len(sorted); index++ { key := sorted[index]; position := index; for position > 0 && sorted[position-1][2] > key[2] { sorted[position] = sorted[position-1]; position-- }; sorted[position] = key }
    parent := make([]int, count); rank := make([]int, count)
    for node := range parent { parent[node] = node }
    var find func(int) int
    find = func(node int) int { for parent[node] != node { parent[node] = parent[parent[node]]; node = parent[node] }; return node }
    union := func(left, right int) bool {
        leftRoot, rightRoot := find(left), find(right)
        if leftRoot == rightRoot { return false }
        if rank[leftRoot] < rank[rightRoot] { leftRoot, rightRoot = rightRoot, leftRoot }
        parent[rightRoot] = leftRoot; if rank[leftRoot] == rank[rightRoot] { rank[leftRoot]++ }; return true
    }
    forest := [][3]int{}; total := 0
    for _, edge := range sorted { if union(edge[0], edge[1]) { forest = append(forest, edge); total += edge[2] } }
    connected := count <= 1 || len(forest) == count-1
    return forest, total, connected
}`,
  'union-find-connectivity': `func UnionFindConnectivity(count int, edges, queries [][2]int) ([]bool, [][]int) {
    parent := make([]int, count); rank := make([]int, count)
    for node := range parent { parent[node] = node }
    var find func(int) int
    find = func(node int) int { if parent[node] != node { parent[node] = find(parent[node]) }; return parent[node] }
    union := func(left, right int) { leftRoot, rightRoot := find(left), find(right); if leftRoot == rightRoot { return }; if rank[leftRoot] < rank[rightRoot] { leftRoot, rightRoot = rightRoot, leftRoot }; parent[rightRoot] = leftRoot; if rank[leftRoot] == rank[rightRoot] { rank[leftRoot]++ } }
    for _, edge := range edges { union(edge[0], edge[1]) }
    connected := make([]bool, len(queries))
    for index, query := range queries { connected[index] = find(query[0]) == find(query[1]) }
    groups := map[int][]int{}
    for node := 0; node < count; node++ { root := find(node); groups[root] = append(groups[root], node) }
    components := [][]int{}
    for _, group := range groups { components = append(components, group) }
    return connected, components
}`,
  'naive-search': `func NaiveSearch(text, pattern string) int {
    if pattern == "" { return 0 }
    for start := 0; start+len(pattern) <= len(text); start++ {
        matched := true
        for offset := 0; offset < len(pattern); offset++ { if text[start+offset] != pattern[offset] { matched = false; break } }
        if matched { return start }
    }
    return -1
}`,
  'z-algorithm': `func ZAlgorithm(text, pattern string) int {
    if pattern == "" { return 0 }
    combined := make([]byte, 0, len(pattern)+1+len(text))
    combined = append(combined, pattern...); combined = append(combined, 0); combined = append(combined, text...)
    z := make([]int, len(combined)); left, right := 0, 0
    for index := 1; index < len(combined); index++ {
        if index <= right { z[index] = right - index + 1; if z[index-left] < z[index] { z[index] = z[index-left] } }
        for index+z[index] < len(combined) && combined[z[index]] == combined[index+z[index]] { z[index]++ }
        if index+z[index]-1 > right { left, right = index, index+z[index]-1 }
        if index > len(pattern) && z[index] >= len(pattern) { return index - len(pattern) - 1 }
    }
    return -1
}`,
  'rabin-karp': `func RabinKarp(text, pattern string) int {
    patternLength := len(pattern)
    if patternLength == 0 { return 0 }
    if patternLength > len(text) { return -1 }
    const base = 257; const modulus = 1000000007
    highPlace := 1
    for index := 0; index < patternLength-1; index++ { highPlace = (highPlace * base) % modulus }
    patternHash, windowHash := 0, 0
    for index := 0; index < patternLength; index++ { patternHash = (patternHash*base + int(pattern[index])) % modulus; windowHash = (windowHash*base + int(text[index])) % modulus }
    for start := 0; start+patternLength <= len(text); start++ {
        if patternHash == windowHash && text[start:start+patternLength] == pattern { return start }
        if start+patternLength < len(text) { windowHash = (windowHash - int(text[start])*highPlace) % modulus; if windowHash < 0 { windowHash += modulus }; windowHash = (windowHash*base + int(text[start+patternLength])) % modulus }
    }
    return -1
}`,
  'boyer-moore': `func BoyerMoore(text, pattern string) int {
    patternLength := len(pattern)
    if patternLength == 0 { return 0 }
    if patternLength > len(text) { return -1 }
    lastPosition := map[byte]int{}
    for index := 0; index < patternLength; index++ { lastPosition[pattern[index]] = index }
    shift := make([]int, patternLength+1); border := make([]int, patternLength+1)
    left, right := patternLength, patternLength+1; border[left] = right
    for left > 0 {
        for right <= patternLength && pattern[left-1] != pattern[right-1] { if shift[right] == 0 { shift[right] = right - left }; right = border[right] }
        left--; right--; border[left] = right
    }
    right = border[0]
    for index := 0; index <= patternLength; index++ { if shift[index] == 0 { shift[index] = right }; if index == right { right = border[right] } }
    start := 0
    for start <= len(text)-patternLength {
        index := patternLength - 1
        for index >= 0 && pattern[index] == text[start+index] { index-- }
        if index < 0 { return start }
        badCharacter := index + 1
        if position, present := lastPosition[text[start+index]]; present { badCharacter = index - position }
        step := shift[index+1]; if badCharacter > step { step = badCharacter }
        if step < 1 { step = 1 }
        start += step
    }
    return -1
}`,
  horspool: `func Horspool(text, pattern string) int {
    patternLength := len(pattern)
    if patternLength == 0 { return 0 }
    if patternLength > len(text) { return -1 }
    shifts := map[byte]int{}
    for index := 0; index < patternLength-1; index++ { shifts[pattern[index]] = patternLength - index - 1 }
    end := patternLength - 1
    for end < len(text) {
        offset := 0
        for offset < patternLength && pattern[patternLength-offset-1] == text[end-offset] { offset++ }
        if offset == patternLength { return end - patternLength + 1 }
        step := shifts[text[end]]; if step == 0 { step = patternLength }
        end += step
    }
    return -1
}`,
  'aho-corasick': `func AhoCorasick(text string, patterns []string) [][2]int {
    transitions := []map[byte]int{{}}; failures := []int{0}; outputs := [][]int{{}}
    for patternIndex, pattern := range patterns {
        if pattern == "" { continue }
        state := 0
        for index := 0; index < len(pattern); index++ { character := pattern[index]; nextState, present := transitions[state][character]; if !present { nextState = len(transitions); transitions[state][character] = nextState; transitions = append(transitions, map[byte]int{}); failures = append(failures, 0); outputs = append(outputs, []int{}) }; state = nextState }
        outputs[state] = append(outputs[state], patternIndex)
    }
    queue := []int{}
    for _, state := range transitions[0] { queue = append(queue, state) }
    queueIndex := 0
    for queueIndex < len(queue) {
        state := queue[queueIndex]; queueIndex++
        for character, nextState := range transitions[state] {
            queue = append(queue, nextState)
            fallback := failures[state]
            for fallback != 0 { if _, present := transitions[fallback][character]; present { break }; fallback = failures[fallback] }
            if next, present := transitions[fallback][character]; present { failures[nextState] = next } else { failures[nextState] = 0 }
            outputs[nextState] = append(outputs[nextState], outputs[failures[nextState]]...)
        }
    }
    found := [][2]int{}
    for patternIndex, pattern := range patterns { if pattern == "" { found = append(found, [2]int{0, patternIndex}) } }
    state := 0
    for end := 0; end < len(text); end++ {
        character := text[end]
        for state != 0 { if _, present := transitions[state][character]; present { break }; state = failures[state] }
        if next, present := transitions[state][character]; present { state = next } else { state = 0 }
        for _, patternIndex := range outputs[state] { start := end - len(patterns[patternIndex]) + 1; found = append(found, [2]int{start, patternIndex}) }
    }
    for index := 1; index < len(found); index++ { key := found[index]; position := index; for position > 0 && (found[position-1][0] > key[0] || (found[position-1][0] == key[0] && found[position-1][1] > key[1])) { found[position] = found[position-1]; position-- }; found[position] = key }
    return found
}`,
  'trie-lookup': `func TrieLookup(words []string, query string) bool {
    type node struct { children map[byte]*node; terminal bool }
    root := &node{children: map[byte]*node{}}
    for _, word := range words {
        current := root
        for index := 0; index < len(word); index++ { character := word[index]; if current.children[character] == nil { current.children[character] = &node{children: map[byte]*node{}} }; current = current.children[character] }
        current.terminal = true
    }
    current := root
    for index := 0; index < len(query); index++ { current = current.children[query[index]]; if current == nil { return false } }
    return current.terminal
}`,
  'longest-common-prefix': `func LongestCommonPrefix(strings []string) string {
    if len(strings) == 0 { return "" }
    prefixLength := len(strings[0])
    for _, value := range strings[1:] {
        if len(value) < prefixLength { prefixLength = len(value) }
        index := 0
        for index < prefixLength && strings[0][index] == value[index] { index++ }
        prefixLength = index
        if prefixLength == 0 { break }
    }
    return strings[0][:prefixLength]
}`,
  manacher: `func Manacher(text string) string {
    length := len(text)
    if length == 0 { return "" }
    bestStart, bestLength := 0, 1
    odd := make([]int, length); left, right := 0, -1
    for center := 0; center < length; center++ {
        radius := 1
        if center <= right { radius = odd[left+right-center]; if right-center+1 < radius { radius = right - center + 1 } }
        for center-radius >= 0 && center+radius < length && text[center-radius] == text[center+radius] { radius++ }
        odd[center] = radius
        start, palindromeLength := center-radius+1, radius*2-1
        if palindromeLength > bestLength || (palindromeLength == bestLength && start < bestStart) { bestStart, bestLength = start, palindromeLength }
        if center+radius-1 > right { left, right = center-radius+1, center+radius-1 }
    }
    even := make([]int, length); left, right = 0, -1
    for center := 0; center < length; center++ {
        radius := 0
        if center <= right { radius = even[left+right-center+1]; if right-center+1 < radius { radius = right - center + 1 } }
        for center-radius-1 >= 0 && center+radius < length && text[center-radius-1] == text[center+radius] { radius++ }
        even[center] = radius
        start, palindromeLength := center-radius, radius*2
        if palindromeLength > bestLength || (palindromeLength == bestLength && start < bestStart) { bestStart, bestLength = start, palindromeLength }
        if center+radius-1 > right { left, right = center-radius, center+radius-1 }
    }
    return text[bestStart : bestStart+bestLength]
}`,
  'levenshtein-distance': `func LevenshteinDistance(first, second string) int {
    if len(first) < len(second) { first, second = second, first }
    previous := make([]int, len(second)+1)
    for index := range previous { previous[index] = index }
    for firstIndex := 1; firstIndex <= len(first); firstIndex++ {
        current := make([]int, len(second)+1); current[0] = firstIndex
        for secondIndex := 1; secondIndex <= len(second); secondIndex++ {
            substitution := previous[secondIndex-1]
            if first[firstIndex-1] != second[secondIndex-1] { substitution++ }
            insertion, deletion := current[secondIndex-1]+1, previous[secondIndex]+1
            best := insertion; if deletion < best { best = deletion }; if substitution < best { best = substitution }
            current[secondIndex] = best
        }
        previous = current
    }
    return previous[len(second)]
}`,
  'longest-common-subsequence': `func LongestCommonSubsequence(first, second string) string {
    lengths := make([][]int, len(first)+1)
    for index := range lengths { lengths[index] = make([]int, len(second)+1) }
    for firstIndex := len(first) - 1; firstIndex >= 0; firstIndex-- {
        for secondIndex := len(second) - 1; secondIndex >= 0; secondIndex-- {
            if first[firstIndex] == second[secondIndex] { lengths[firstIndex][secondIndex] = lengths[firstIndex+1][secondIndex+1] + 1 } else if lengths[firstIndex+1][secondIndex] >= lengths[firstIndex][secondIndex+1] { lengths[firstIndex][secondIndex] = lengths[firstIndex+1][secondIndex] } else { lengths[firstIndex][secondIndex] = lengths[firstIndex][secondIndex+1] }
        }
    }
    result := []byte{}
    firstIndex, secondIndex := 0, 0
    for firstIndex < len(first) && secondIndex < len(second) {
        if first[firstIndex] == second[secondIndex] { result = append(result, first[firstIndex]); firstIndex++; secondIndex++ } else if lengths[firstIndex+1][secondIndex] >= lengths[firstIndex][secondIndex+1] { firstIndex++ } else { secondIndex++ }
    }
    return string(result)
}`,
  'fibonacci-memoization': `func FibonacciMemoization(n int) uint64 {
    if n < 0 { panic("n must be nonnegative") }
    memo := map[int]uint64{0: 0, 1: 1}
    var fibonacci func(int) uint64
    fibonacci = func(index int) uint64 { if result, present := memo[index]; present { return result }; memo[index] = fibonacci(index-1) + fibonacci(index-2); return memo[index] }
    return fibonacci(n)
}`,
  'zero-one-knapsack': `func ZeroOneKnapsack(weights, values []int, capacity int) int {
    best := make([]int, capacity+1)
    for index := 0; index < len(weights); index++ { weight, value := weights[index], values[index]; for current := capacity; current >= weight; current-- { if best[current-weight]+value > best[current] { best[current] = best[current-weight] + value } } }
    return best[capacity]
}`,
  'unbounded-knapsack': `func UnboundedKnapsack(weights, values []int, capacity int) int {
    best := make([]int, capacity+1)
    for current := 1; current <= capacity; current++ { for index := 0; index < len(weights); index++ { weight, value := weights[index], values[index]; if weight <= current && best[current-weight]+value > best[current] { best[current] = best[current-weight] + value } } }
    return best[capacity]
}`,
  'coin-change-count': `func CoinChangeCount(coins []int, amount int) int {
    combinations := make([]int, amount+1); combinations[0] = 1
    for _, coin := range coins { for current := coin; current <= amount; current++ { combinations[current] += combinations[current-coin] } }
    return combinations[amount]
}`,
  'coin-change-minimum': `func CoinChangeMinimum(coins []int, amount int) int {
    unreachable := amount + 1
    minimum := make([]int, amount+1); minimum[0] = 0
    for current := 1; current <= amount; current++ { minimum[current] = unreachable }
    for current := 1; current <= amount; current++ { for _, coin := range coins { if coin <= current && minimum[current-coin]+1 < minimum[current] { minimum[current] = minimum[current-coin] + 1 } } }
    if minimum[amount] == unreachable { return -1 }; return minimum[amount]
}`,
  'longest-increasing-subsequence': `func LongestIncreasingSubsequence(values []int) []int {
    if len(values) == 0 { return []int{} }
    lengths, previous := make([]int, len(values)), make([]int, len(values))
    for index := range lengths { lengths[index] = 1; previous[index] = -1 }
    for end := 0; end < len(values); end++ { for start := 0; start < end; start++ { if values[start] < values[end] && lengths[start]+1 > lengths[end] { lengths[end] = lengths[start] + 1; previous[end] = start } } }
    endpoint := 0
    for index := 1; index < len(values); index++ { if lengths[index] > lengths[endpoint] { endpoint = index } }
    result := []int{}
    for endpoint != -1 { result = append(result, values[endpoint]); endpoint = previous[endpoint] }
    for left, right := 0, len(result)-1; left < right; left, right = left+1, right-1 { result[left], result[right] = result[right], result[left] }
    return result
}`,
  'matrix-chain-multiplication': `func MatrixChainMultiplication(dimensions []int) int {
    matrixCount := len(dimensions) - 1
    if matrixCount < 2 { return 0 }
    costs := make([][]int, matrixCount)
    for index := range costs { costs[index] = make([]int, matrixCount) }
    for chainLength := 2; chainLength <= matrixCount; chainLength++ {
        for left := 0; left+chainLength <= matrixCount; left++ {
            right := left + chainLength - 1; best := 0
            for split := left; split < right; split++ { candidate := costs[left][split] + costs[split+1][right] + dimensions[left]*dimensions[split+1]*dimensions[right+1]; if split == left || candidate < best { best = candidate } }
            costs[left][right] = best
        }
    }
    return costs[0][matrixCount-1]
}`,
  'edit-distance': `func EditDistance(source, target string) int {
    previous := make([]int, len(target)+1)
    for index := range previous { previous[index] = index }
    for sourceIndex := 1; sourceIndex <= len(source); sourceIndex++ {
        current := make([]int, len(target)+1); current[0] = sourceIndex
        for targetIndex := 1; targetIndex <= len(target); targetIndex++ {
            substitution := previous[targetIndex-1]
            if source[sourceIndex-1] != target[targetIndex-1] { substitution++ }
            deletion, insertion := previous[targetIndex]+1, current[targetIndex-1]+1
            best := deletion; if insertion < best { best = insertion }; if substitution < best { best = substitution }
            current[targetIndex] = best
        }
        previous = current
    }
    return previous[len(target)]
}`,
  'grid-paths': `func GridPaths(rows, columns int) int {
    if rows == 0 || columns == 0 { return 0 }
    paths := make([]int, columns)
    for column := range paths { paths[column] = 1 }
    for row := 1; row < rows; row++ { for column := 1; column < columns; column++ { paths[column] += paths[column-1] } }
    return paths[columns-1]
}`,
  'minimum-path-sum': `func MinimumPathSum(grid [][]int) int {
    if len(grid) == 0 { return 0 }
    width := len(grid[0]); if width == 0 { return 0 }
    totals := make([]int, width)
    for rowIndex := 0; rowIndex < len(grid); rowIndex++ { for column := 0; column < width; column++ { value := grid[rowIndex][column]; if rowIndex == 0 && column == 0 { totals[column] = value } else if rowIndex == 0 { totals[column] = totals[column-1] + value } else if column == 0 { totals[column] += value } else if totals[column] < totals[column-1] { totals[column] += value } else { totals[column] = totals[column-1] + value } } }
    return totals[width-1]
}`,
  'rod-cutting': `func RodCutting(prices []int, length int) int {
    revenue := make([]int, length+1)
    for current := 1; current <= length; current++ {
        bound := current; if len(prices) < bound { bound = len(prices) }
        best := 0
        for piece := 1; piece <= bound; piece++ { candidate := prices[piece-1] + revenue[current-piece]; if piece == 1 || candidate > best { best = candidate } }
        revenue[current] = best
    }
    return revenue[length]
}`,
  'partition-equal-subset-sum': `func PartitionEqualSubsetSum(values []int) bool {
    total := 0
    for _, value := range values { total += value }
    if total%2 != 0 { return false }
    target := total / 2
    reachable := make([]bool, target+1); reachable[0] = true
    for _, value := range values { for subtotal := target; subtotal >= value; subtotal-- { if reachable[subtotal-value] { reachable[subtotal] = true } } }
    return reachable[target]
}`,
};
