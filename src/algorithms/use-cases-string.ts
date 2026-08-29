import type { AlgorithmUseCase } from './types';

export const STRING_USE_CASES: Record<string, AlgorithmUseCase[]> = {
  'naive-search': [
    {
      title: 'Spot-checking the last line of a log',
      context:
        "An operator pastes a single log tail into a tool to confirm whether a stacktrace fragment like 'NullPointerException at com.svc.handle' appears before escalating. One read, small text, no reused state: brute-force is simplest and fast enough since the text is scanned once from start to finish.",
      tags: ['substring', 'log-scan', 'brute force'],
    },
    {
      title: 'Finding a constant in a small in-memory config',
      context:
        "A startup script scans a few KB of environment text for a literal token like 'API_TOKEN' to detect whether it was injected. The text is tiny and scanned a handful of times, so O(nm) is irrelevant and the plain loop keeps the code dependency-free.",
      tags: ['substring', 'scan', 'config'],
    },
    {
      title: 'Teaching exact matching fundamentals',
      context:
        'An algorithms course uses naive search to make the sliding-window idea concrete before introducing prefix tables. It demonstrates the wasted rescanning on repeated prefixes, which then motivates KMP and Z: the textbook entry point for pattern matching.',
      tags: ['substring', 'education', 'brute force'],
    },
  ],
  kmp: [
    {
      title: 'Repeated greps over a huge bundle of source files',
      context:
        'A CI linter re-scan the same build log for a recurring issue pattern across hundreds of files. The text is walked once and never rewound, so the linear guarantee of KMP plus its precomputed prefix table makes repeated scans predictable and non-degenerate.',
      tags: ['substring', 'log-scan', 'linear'],
    },
    {
      title: 'Detecting a recursive include cycle in code',
      context:
        "A dependency walker searches each file's text for a repeated '#include' path token that would form a cycle. KMP's fallback through known borders avoids re-examining characters after each mismatch, keeping the scan proportional to file size for large source trees.",
      tags: ['substring', 'cycle', 'dependency'],
    },
    {
      title: 'Streaming binary signature match',
      context:
        'A network sensor watches a continuous byte stream for a fixed malware signature. Because KMP never backtracks in the text, it can consume the stream incrementally and only keep the small prefix table, perfect for long-lived, unbounded input.',
      tags: ['substring', 'streaming', 'signature'],
    },
  ],
  'z-algorithm': [
    {
      title: 'Reporting every occurrence of a token in a corpus scan',
      context:
        'A content pipeline concatenates a query and its separator with a large body of text, then asks for the Z-table to extract each index where the token matches. One combined pass exposes both the first and every later occurrence without extra bookkeeping state.',
      tags: ['substring', 'multiple-pattern', 'linear'],
    },
    {
      title: 'Duplicated-line detection in version-controlled files',
      context:
        'A refactoring checker joins each line with the whole file to compute Z values that reveal which lines repeat elsewhere. The precomputed Z array gives all match start positions at once, ideal when the same short string may appear many times.',
      tags: ['substring', 'dedup', 'linear'],
    },
    {
      title: 'Indexing exact repeats in a genome assembly',
      context:
        'A bioinformatics script wraps a short primer against a scaffold and uses Z-values to find every hybridisation site in one linear sweep, keeping only the combined buffer. It avoids re-scanning already-covered text and works well for long nucleotide strings.',
      tags: ['genome', 'substring', 'multiple-pattern'],
    },
  ],
  'rabin-karp': [
    {
      title: 'Multiple-pattern plagiarism screening in one pass',
      context:
        'A plagiarism checker wants to detect many paraphrased phrases from a reference library inside a submission. Rolling hashes let it slide a window and compare candidates in constant time per step, checking each candidate family with the same cumulative hash structure.',
      tags: ['plagiarism', 'rolling hash', 'multiple-pattern'],
    },
    {
      title: 'Detecting duplicate repetitive blocks in a dataset',
      context:
        'A data-dedup tool fingerprints overlapping windows of a large string to spot re-occurring blocks quickly. The rolling hash keeps a running value instead of re-hashing each window, so even long documents scan near-linearly on average.',
      tags: ['dedup', 'rolling hash', 'scan'],
    },
    {
      title: 'Video-frame boundary fingerprinting',
      context:
        "A media tool looks for a known signature bitstring inside an indexed stream where exact matches are the norm. Rabin-Karp's average linear time and constant extra memory make it practical to test many candidate frames before resorting to full verification only on hash collisions.",
      tags: ['signature', 'rolling hash', 'scan'],
    },
  ],
  'boyer-moore': [
    {
      title: 'Skipping through long prose to find a quoted phrase',
      context:
        "A document search tool hunts an exact phrase inside a multi-megabyte PDF's extracted text. Because the alphabet is large and the phrase is several words long, the bad-character and good-suffix shifts jump quickly past non-matching stretches.",
      tags: ['substring', 'search', 'good suffix'],
    },
    {
      title: 'Short-pattern extraction from a huge SQL dump',
      context:
        'An analyst scans a very large exported dataset for a specific table name used as a substring. Boyer-Moore shifts based on the character currently under the end of the pattern, so the effective text is far smaller than the naive O(nm) cost.',
      tags: ['substring', 'log-scan', 'scan'],
    },
    {
      title: 'Wide-alphabet keyset scan in an index builder',
      context:
        'An indexing service greps a large document store for a handful of long identifiers. The right-to-left comparisons create large safe shifts, which matters more than preprocessing cost for the frequently repeated, long, varied key strings.',
      tags: ['substring', 'search', 'index'],
    },
  ],
  horspool: [
    {
      title: 'On-the-fly URL matcher in a request filter',
      context:
        "A middleware filters inbound requests for a specific ambiguous path segment such as '/admin'. Horspool gives near-linear average time with a tiny shift table, so it is cheap enough to run per request without a full Boyer-Moore state machine.",
      tags: ['substring', 'search', 'shift table'],
    },
    {
      title: 'Text snippet extraction from chat transcripts',
      context:
        'A moderation bot pulls a specific greeting or known toxic token from long chat archives. The right-to-left comparison plus the single char-at-end shift keeps the scan fast while the preprocessing is trivial to maintain in a hot loop.',
      tags: ['substring', 'scan', 'search'],
    },
    {
      title: 'Quick negative check in an antivirus carve',
      context:
        "A file scanner first rejects benign files by searching for a known-not-malicious marker. Horspool's simple shift table is ideal for these cheap, frequent, pure-negative lookups where failing fast is the goal rather than enumerating every match.",
      tags: ['antivirus', 'scan', 'negative-check'],
    },
  ],
  'aho-corasick': [
    {
      title: 'Antivirus signature scan over a file for thousands of malware hashes',
      context:
        'A security tool checks a document against an entire signature database in a single pass. Aho-Corasick builds one trie and walking it once surfaces all matching signatures at any offset, so adding patterns does not multiply the number of scans.',
      tags: ['antivirus', 'multiple-pattern', 'trie'],
    },
    {
      title: 'Keyword highlight along a long news article',
      context:
        'An editor highlights every mention of a long list of topics and entities inside an article. The automaton reports all matches grouped by start index, letting the UI annotate overlapping hits in a single linear traversal of the text.',
      tags: ['multiple-pattern', 'highlight', 'trie'],
    },
    {
      title: 'Blocking a blocklist of banned words in a chat stream',
      context:
        'A live chat system matches a long list of banned terms against each incoming message as it arrives. One trie over the whole blocklist and a single pass per message keeps latency flat even as the blocklist grows to tens of thousands of entries.',
      tags: ['multiple-pattern', 'blocklist', 'chat'],
    },
  ],
  'trie-lookup': [
    {
      title: 'Autocomplete dictionary in a search bar',
      context:
        'A search box prefixes every keystroke against a vocabulary of product names. Each inserted word ends on a terminal, and a prefix query descends one edge at a time, so lookups are proportional to query length rather than word count.',
      tags: ['autocomplete', 'dictionary', 'prefix'],
    },
    {
      title: 'Spell-suggest prefix trie for a mobile keyboard',
      context:
        'A keyboard maintains a trie of valid words and rejects a typed fragment as soon as the path fails. Because membership is checked edge by edge, a long dictionary stays responsive and the terminal flags give exact-word detection.',
      tags: ['dictionary', 'spellcheck', 'prefix'],
    },
    {
      title: 'Bulk word membership in a lexicon validator',
      context:
        'A localization tool builds a trie once, then validates thousands of translation keys against it. Insertion is O(total word length) and each query is O(word length), so bulk membership checks amortise far better than repeated linear searches.',
      tags: ['dictionary', 'membership', 'bulk'],
    },
  ],
  'longest-common-prefix': [
    {
      title: 'IP range batching from a list of subnets',
      context:
        'A network tool groups a set of IP strings to find the narrowest CIDR umbrella that covers them all. It shrinks a candidate prefix across the collection and keeps only the shared leading bits ready to report as a single aggregate range.',
      tags: ['prefix', 'network', 'batching'],
    },
    {
      title: 'Routing-stable shared base directory',
      context:
        'A build tool computes the deepest directory common to a list of file paths so it can host them under one root. A shared-prefix scan compares each path only within the current bound, giving a cheap, streaming result for thousands of entries.',
      tags: ['prefix', 'paths', 'filesystem'],
    },
    {
      title: 'Autosuggest grouping by common word stem',
      context:
        "A storefront clusters related product categories that begin the same way. The longest common prefix across the names yields the shortest stem that every label shares, which then becomes the group's display heading.",
      tags: ['prefix', 'autocomplete', 'grouping'],
    },
  ],
  manacher: [
    {
      title: 'Longest palindromic tag in a reference string',
      context:
        'A text-analysis utility extracts the longest palindrome from a genome or prose sample to flag repetitive regions. Manacher reuses mirrored palindrome radii instead of re-expanding, so it finds the answer in linear time even on long, high-entropy input.',
      tags: ['palindrome', 'linear', 'text-analysis'],
    },
    {
      title: 'Reverse-checking a URL for a symmetric slug',
      context:
        'A link-shortening service verifies whether part of a slug is mirrored so it can be split into a human-friendly suffix. Odd and even radius passes let it locate both odd- and even-length palindromic substrings reliably across the whole slug.',
      tags: ['palindrome', 'slug', 'split'],
    },
    {
      title: 'Crash-recognition on a repeating log signature',
      context:
        "A log forensics tool hunts for palindromic patterns in a captured stack-trace stream that indicate retries. Because the segment that mirrors itself matters, Manacher's linear radii reveal the widest reversed block without exponential re-expansion.",
      tags: ['palindrome', 'log-scan', 'forensics'],
    },
  ],
  'levenshtein-distance': [
    {
      title: 'Fuzzy spell suggestion ranking in a search engine',
      context:
        "A query encoder ranks candidate corrections by how many single-character edits turn the typo into each dictionary word. Levenshtein's edit cost (insert, delete, substitute) gives a natural distance to order suggestions before showing the top matches.",
      tags: ['spellcheck', 'edit-distance', 'ranking'],
    },
    {
      title: 'Near-duplicate record fusion in a CRM import',
      context:
        'A contact import compares name and email fields to decide whether two rows are the same person. A low edit distance marks rows as duplicates for merging, while the two-row dynamic-programming implementation keeps memory bounded.',
      tags: ['dedup', 'edit-distance', 'fusion'],
    },
    {
      title: 'Typo-tolerant OCR correction pipeline',
      context:
        'An OCR stage measures distance between a scanned token and the nearest lexicon entry to auto-fix mangled words. Substitutions are cheap, so the edit distance directly reflects the types of OCR mistakes and guides the replacement choice.',
      tags: ['ocr', 'edit-distance', 'spellcheck'],
    },
  ],
  'longest-common-subsequence': [
    {
      title: 'Diff and version-control file comparison',
      context:
        'A version-control engine aligns two versions of a file by keeping the character subsequence common to both. The suffix table lets it reconstruct one deterministic sequence and highlight only the insertions and deletions relative to that shared backbone.',
      tags: ['diff', 'version-control', 'lcs'],
    },
    {
      title: 'Genetic sequence similarity in a genomics tool',
      context:
        'A bioinformatics pipeline measures how much of two DNA fragments is shared as an ordered subsequence. LCS identifies the conserved order even with insertions or gaps, which exact substring matching would miss entirely.',
      tags: ['genome', 'lcs', 'similarity'],
    },
    {
      title: 'Plagiarism scaffold between a student paper and a source',
      context:
        'A plagiarism detector finds the longest ordered run of words common to a submission and a reference document. LCS reveals paraphrases that keep the original sentence structure, complementing substring-based checks that only catch exact copies.',
      tags: ['plagiarism', 'lcs', 'similarity'],
    },
  ],
};
