---
target: page header
total_score: 30
p0_count: 0
p1_count: 1
p2_count: 1
timestamp: 2026-05-15T08-29-13Z
slug: src-components-header-tsx
---
## Critique: Page Header (`src/components/Header.tsx` + `src/components/NewsHeader.tsx`)

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | WPM/accuracy live in masthead; tabular-nums present |
| 2 | Match System / Real World | 4 | Newspaper masthead metaphor is clean and unfussy |
| 3 | User Control and Freedom | 3 | n/a for a header; no traps |
| 4 | Consistency and Standards | 2 | border-black violates ink token; meta text at 1rem instead of 0.875rem |
| 5 | Error Prevention | 3 | n/a for header |
| 6 | Recognition Rather Than Recall | 4 | Username, date, WPM always visible; no ambiguity |
| 7 | Flexibility and Efficiency | 3 | No header-specific efficiency needed |
| 8 | Aesthetic and Minimalist Design | 2 | Meta row text too heavy; borders slightly harsh |
| 9 | Error Recovery | 3 | n/a for header |
| 10 | Help and Documentation | 3 | n/a for a typing game header |
| **Total** | | **30/40** | **Good** |

### Anti-Patterns Verdict
Not AI-generated. Automated detector returned zero findings. The failures here are all execution-level token violations, not design vision failures.

### Priority Issues

[P1] border-black used instead of border-ink — HeaderTitle and HeaderMeta both use Tailwind's pure #000000 instead of ink token #0f0e0c. Breaks One Ink Rule.

[P2] Meta row items lack text-sm — date, username, stats inherit 1rem from html base. Should be 0.875rem label size per DESIGN.md.

[P3] border-b-[1px] is a redundant custom value — same as border-b, adds noise.

### Persona Red Flags

Alex (Skill Builder): stats at same visual weight as editorial content. WPM doesn't pop as functional data.
The Morning Aesthete: pure-black borders read clinical; undermines the print-warmth the design intends.
