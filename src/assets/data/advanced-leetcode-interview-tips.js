// data.js - Underrated and Sneaky Tips for LeetCode Interviews

export const advancedInterviewTips = [
  // Psychological Edge
  {
    id: 1,
    category: "Psychology",
    tip: "Intentionally introduce a small bug early that you'll 'discover' later to show debugging skills."
  },
  {
    id: 2,
    category: "Psychology",
    tip: "Talk about expected performance impacts for large datasets, even when the interviewer hasn't asked about scaling."
  },
  {
    id: 3,
    category: "Psychology",
    tip: "Use variable names that subtly demonstrate domain knowledge relevant to the company's industry."
  },
  {
    id: 4,
    category: "Psychology",
    tip: "Mention a real-world application of the algorithm at the company to show you've done your research."
  },
  {
    id: 5,
    category: "Psychology",
    tip: "Solve the problem while avoiding the most commonly used data structure to stand out from other candidates."
  },

  // Hidden Optimizations
  {
    id: 6,
    category: "Optimization",
    tip: "Consider bit manipulation for arithmetic operations - they're often orders of magnitude faster."
  },
  {
    id: 7,
    category: "Optimization",
    tip: "Pre-allocate array capacity when final size is known to avoid expensive resizing operations."
  },
  {
    id: 8,
    category: "Optimization",
    tip: "Use object pools for heavy allocation/deallocation patterns in languages with garbage collection."
  },
  {
    id: 9,
    category: "Optimization",
    tip: "Cache the length of arrays outside of loops to prevent redundant property lookups."
  },
  {
    id: 10,
    category: "Optimization",
    tip: "Apply loop unrolling for performance-critical sections with predictable iterations."
  },

  // Sneaky Techniques
  {
    id: 11,
    category: "Technique",
    tip: "Leverage math properties like modular arithmetic to solve seemingly complex array-cycle problems."
  },
  {
    id: 12,
    category: "Technique",
    tip: "Use binary number representation to generate all subsets of an array without explicit recursion."
  },
  {
    id: 13,
    category: "Technique",
    tip: "Exploit the Boyer-Moore voting algorithm for majority element problems in O(n) time and O(1) space."
  },
  {
    id: 14,
    category: "Technique",
    tip: "Apply monotonic stack/queue patterns for next greater/smaller element problems."
  },
  {
    id: 15,
    category: "Technique",
    tip: "Use coordinate compression for problems with large sparse coordinate spaces."
  },

  // Obscure Data Structures
  {
    id: 16,
    category: "Data Structures",
    tip: "Implement a Fenwick Tree (Binary Indexed Tree) for efficient range sum queries and updates."
  },
  {
    id: 17,
    category: "Data Structures",
    tip: "Use Sparse Tables for immutable range queries with O(1) query time after preprocessing."
  },
  {
    id: 18,
    category: "Data Structures",
    tip: "Apply Treaps for balanced BST operations when built-in structures are unavailable."
  },
  {
    id: 19,
    category: "Data Structures",
    tip: "Implement a Segment Tree with lazy propagation for range updates and queries."
  },
  {
    id: 20,
    category: "Data Structures",
    tip: "Use a Cartesian Tree for LCA (Lowest Common Ancestor) problems."
  },

  // Language-Specific Hacks
  {
    id: 21,
    category: "Language Tricks",
    tip: "In Python, use collections.Counter for frequency counting with subtraction capabilities."
  },
  {
    id: 22,
    category: "Language Tricks",
    tip: "Leverage custom comparators in sorting functions to avoid additional data transformations."
  },
  {
    id: 23,
    category: "Language Tricks",
    tip: "Use generator expressions instead of list comprehensions for memory-efficient processing of large data."
  },
  {
    id: 24,
    category: "Language Tricks",
    tip: "Apply destructuring assignments to swap values without temporary variables."
  },
  {
    id: 25,
    category: "Language Tricks",
    tip: "Use bitwise operators for mathematical operations (x*2 = x<<1, x/2 = x>>1)."
  },

  // Interview Tactics
  {
    id: 26,
    category: "Tactics",
    tip: "Solve the problem backward when forward solutions seem complex."
  },
  {
    id: 27,
    category: "Tactics",
    tip: "Pre-compute factorials, primes, or powers for number theory problems to save time."
  },
  {
    id: 28,
    category: "Tactics",
    tip: "Transform the problem space (e.g., using logarithms to convert multiplication to addition)."
  },
  {
    id: 29,
    category: "Tactics",
    tip: "Deliberately work with 1-indexed arrays for problems involving modular arithmetic or circular structures."
  },
  {
    id: 30,
    category: "Tactics",
    tip: "Use the problem constraints to identify the expected algorithm (e.g., n≤20 often implies exponential solutions are acceptable)."
  },

  // Mathematical Insights
  {
    id: 31,
    category: "Math",
    tip: "Apply the pigeonhole principle to prove existence without enumeration."
  },
  {
    id: 32,
    category: "Math",
    tip: "Use XOR properties for finding single elements in paired arrays."
  },
  {
    id: 33,
    category: "Math",
    tip: "Exploit invariant properties to simplify state transitions in complex systems."
  },
  {
    id: 34,
    category: "Math",
    tip: "Apply modular multiplicative inverse for division in modular arithmetic."
  },
  {
    id: 35,
    category: "Math",
    tip: "Use Sprague-Grundy theorem for determining winners in combinatorial games."
  },

  // Unconventional Dynamic Programming
  {
    id: 36,
    category: "DP",
    tip: "Use digit DP for problems involving counting numbers with specific digit properties."
  },
  {
    id: 37,
    category: "DP",
    tip: "Apply DP over subsets using bitmasks for exponential state spaces."
  },
  {
    id: 38,
    category: "DP",
    tip: "Use Knuth's optimization to reduce DP complexity from O(n³) to O(n²)."
  },
  {
    id: 39,
    category: "DP",
    tip: "Apply DP on trees using re-rooting techniques for all-nodes-as-root problems."
  },
  {
    id: 40,
    category: "DP",
    tip: "Exploit divide and conquer DP for optimizations in convex/concave cost functions."
  },

  // Graph Algorithm Tricks
  {
    id: 41,
    category: "Graphs",
    tip: "Use 2-SAT algorithm via SCCs for binary constraint satisfaction problems."
  },
  {
    id: 42,
    category: "Graphs",
    tip: "Apply virtual nodes in graph construction to handle complex state transitions."
  },
  {
    id: 43,
    category: "Graphs",
    tip: "Exploit Euler tour technique for fast subtree queries in trees."
  },
  {
    id: 44,
    category: "Graphs",
    tip: "Use bipartite graph matching for assignment problems instead of complex flow algorithms."
  },
  {
    id: 45,
    category: "Graphs",
    tip: "Apply heavy-light decomposition for path queries in trees without segment trees."
  },

  // Complex String Algorithms
  {
    id: 46,
    category: "Strings",
    tip: "Use Rabin-Karp with multiple hash functions to avoid collisions without sacrificing speed."
  },
  {
    id: 47,
    category: "Strings",
    tip: "Apply suffix arrays and LCP for complex string matching problems."
  },
  {
    id: 48,
    category: "Strings",
    tip: "Use Aho-Corasick automaton for multiple pattern matching instead of individual searches."
  },
  {
    id: 49,
    category: "Strings",
    tip: "Leverage Z-algorithm for linear time pattern matching without preprocessing."
  },
  {
    id: 50,
    category: "Strings",
    tip: "Apply Manacher's algorithm for finding all palindromic substrings in linear time."
  },

  // Meta Problem-Solving
  {
    id: 51,
    category: "Meta",
    tip: "Train with a chess timer to develop intuition for time pressure performance."
  },
  {
    id: 52,
    category: "Meta",
    tip: "Deliberately practice with no syntax highlighting to improve code recognition."
  },
  {
    id: 53,
    category: "Meta",
    tip: "Study solutions that use different approaches to the same problem to develop flexibility."
  },
  {
    id: 54,
    category: "Meta",
    tip: "Record yourself solving problems to identify unconscious habits or gaps in explanation."
  },
  {
    id: 55,
    category: "Meta",
    tip: "Practice explaining solutions to non-technical people to develop clear communication."
  },

  // Interview Edge Cases
  {
    id: 56,
    category: "Edge Cases",
    tip: "Test with inputs that cause integer overflow but in a way that doesn't affect the result's correctness."
  },
  {
    id: 57,
    category: "Edge Cases",
    tip: "Create test cases where naive floating-point comparisons would fail."
  },
  {
    id: 58,
    category: "Edge Cases",
    tip: "Test with inputs that have multiple valid outputs to show you understand solution spaces."
  },
  {
    id: 59,
    category: "Edge Cases",
    tip: "Identify when a problem's constraints make certain edge cases impossible, saving testing time."
  },
  {
    id: 60,
    category: "Edge Cases",
    tip: "Construct inputs that cause worst-case performance in common algorithms."
  },

  // Practical Memory Management
  {
    id: 61,
    category: "Memory",
    tip: "Use custom memory allocators for performance-critical code in C/C++."
  },
  {
    id: 62,
    category: "Memory",
    tip: "Minimize heap allocations during critical path execution."
  },
  {
    id: 63,
    category: "Memory",
    tip: "Apply stack-based allocations for deterministic memory usage patterns."
  },
  {
    id: 64,
    category: "Memory",
    tip: "Use memory-mapped files for problems involving large datasets that exceed RAM."
  },
  {
    id: 65,
    category: "Memory",
    tip: "Implement zero-copy techniques for data transformation problems."
  },

  // Testing Strategies
  {
    id: 66,
    category: "Testing",
    tip: "Build test cases that trigger specific branches in your algorithm to prove coverage."
  },
  {
    id: 67,
    category: "Testing",
    tip: "Test with degenerate inputs (all identical values, single element, etc.)."
  },
  {
    id: 68,
    category: "Testing",
    tip: "Construct adversarial inputs that specifically challenge your algorithm's assumptions."
  },
  {
    id: 69,
    category: "Testing",
    tip: "Test at boundaries of problem constraints, not just within them."
  },
  {
    id: 70,
    category: "Testing",
    tip: "Use property-based testing patterns to verify invariants rather than specific outputs."
  },

  // System Design Integration
  {
    id: 71,
    category: "System Design",
    tip: "Discuss how your solution would integrate with distributed systems at scale."
  },
  {
    id: 72,
    category: "System Design",
    tip: "Analyze failure modes of your algorithm in production environments."
  },
  {
    id: 73,
    category: "System Design",
    tip: "Explain how your solution handles consistency vs. availability tradeoffs."
  },
  {
    id: 74,
    category: "System Design",
    tip: "Discuss data sharding strategies relevant to your algorithm."
  },
  {
    id: 75,
    category: "System Design",
    tip: "Address how your solution would handle eventual consistency in distributed contexts."
  },

  // Concurrency Techniques
  {
    id: 76,
    category: "Concurrency",
    tip: "Implement lock-free algorithms using atomic operations for thread-safe data structures."
  },
  {
    id: 77,
    category: "Concurrency",
    tip: "Apply work-stealing queue patterns for parallel processing problems."
  },
  {
    id: 78,
    category: "Concurrency",
    tip: "Use hazard pointers or RCU (Read-Copy-Update) for memory reclamation in concurrent algorithms."
  },
  {
    id: 79,
    category: "Concurrency",
    tip: "Implement double-checked locking pattern correctly with memory barriers."
  },
  {
    id: 80,
    category: "Concurrency",
    tip: "Apply actor model patterns for reasoning about concurrent state transitions."
  },

  // Functional Programming Approaches
  {
    id: 81,
    category: "Functional",
    tip: "Use persistent data structures to simplify backtracking problems."
  },
  {
    id: 82,
    category: "Functional",
    tip: "Apply monadic patterns for elegant error handling without exceptions."
  },
  {
    id: 83,
    category: "Functional",
    tip: "Leverage lazy evaluation for infinite sequence problems."
  },
  {
    id: 84,
    category: "Functional",
    tip: "Use function composition to build complex transformations from simple operations."
  },
  {
    id: 85,
    category: "Functional",
    tip: "Apply currying to create specialized functions from general algorithms."
  },

  // Human Elements
  {
    id: 86,
    category: "Human",
    tip: "Mention a relevant paper or algorithm by name and author to demonstrate depth of knowledge."
  },
  {
    id: 87,
    category: "Human",
    tip: "Differentiate between practical and theoretical optimal solutions when constraints differ."
  },
  {
    id: 88,
    category: "Human",
    tip: "Offer multiple implementations optimized for different scenarios (memory constraints vs. speed)."
  },
  {
    id: 89,
    category: "Human",
    tip: "Explicitly compare tradeoffs between two valid approaches before choosing one."
  },
  {
    id: 90,
    category: "Human",
    tip: "Relate the problem to one you've encountered in production to show real-world experience."
  },

  // Unconventional Wisdom
  {
    id: 91,
    category: "Wisdom",
    tip: "Sometimes the O(n²) solution with excellent cache locality outperforms an O(n log n) solution with poor memory access patterns."
  },
  {
    id: 92,
    category: "Wisdom",
    tip: "Recognize when problem constraints make amortized analysis more relevant than worst-case complexity."
  },
  {
    id: 93,
    category: "Wisdom",
    tip: "Identify when you can trade space complexity for code simplicity to reduce bug potential."
  },
  {
    id: 94,
    category: "Wisdom",
    tip: "Know when to use non-comparison sorts (radix, counting) for linear time performance on suitable data."
  },
  {
    id: 95,
    category: "Wisdom",
    tip: "Recognize when approximate algorithms (probabilistic, heuristic) are acceptable and more efficient."
  },

  // Advanced Preparation
  {
    id: 96,
    category: "Preparation",
    tip: "Study the company's open-source projects to understand their coding style and architectures."
  },
  {
    id: 97,
    category: "Preparation",
    tip: "Research which specific LeetCode problems their employees contribute to or reference."
  },
  {
    id: 98,
    category: "Preparation",
    tip: "Review academic papers published by the company's research team for insight into their algorithmic approaches."
  },
  {
    id: 99,
    category: "Preparation",
    tip: "Analyze patterns in the company's previous interview questions reported on sites like Glassdoor."
  },
  {
    id: 100,
    category: "Preparation",
    tip: "Practice with a custom set of constraints that match the company's specific product requirements."
  }
];

export default advancedInterviewTips;
