# Graph Report - .  (2026-07-12)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 26 nodes · 19 edges · 11 communities (5 shown, 6 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e8ed9f15`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pipeline.py
- qa.mjs
- scrub-engine.js
- encode.sh
- qa-prod2.mjs
- qa-sections.mjs
- shots.mjs

## God Nodes (most connected - your core abstractions)
1. `mountScrollWorld()` - 3 edges
2. `encode.sh script` - 2 edges
3. `enc()` - 2 edges
4. `save_video()` - 2 edges
5. `gen_video()` - 2 edges
6. `seedParticles()` - 2 edges
7. `injectCSS()` - 2 edges
8. `errors` - 1 edges
9. `errors` - 1 edges
10. `widths` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (11 total, 6 thin omitted)

### Community 2 - "scrub-engine.js"
Cohesion: 0.83
Nodes (3): injectCSS(), mountScrollWorld(), seedParticles()

## Knowledge Gaps
- **5 isolated node(s):** `errors`, `errors`, `widths`, `bounds`, `targets`
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `errors`, `errors`, `widths` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._