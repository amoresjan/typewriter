---
target: toast
total_score: 22
p0_count: 1
p1_count: 2
timestamp: 2026-05-15T07-44-06Z
slug: src-components-common-toast-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Toast appears and names the event, but no dismiss affordance and no countdown — user doesn't know how long it will linger |
| 2 | Match System / Real World | 1 | "AFK Detected" is gaming slang in a newspaper-editorial product; "WPM readjusted" reads like a system log |
| 3 | User Control and Freedom | 1 | No X button, no click-to-dismiss, no Escape key handler; 5 forced seconds during active typing |
| 4 | Consistency and Standards | 3 | Token fidelity is correct (border-ink, bg-paper, shadow spec); one inconsistency: shadow embeds raw hex instead of token |
| 5 | Error Prevention | 3 | onDismiss passed as inline arrow function — every parent re-render (WPM interval fires every 1s) creates a new reference, potentially resetting both timers mid-flight |
| 6 | Recognition Rather Than Recall | 3 | Copy is self-explanatory; no recall burden |
| 7 | Flexibility and Efficiency | 2 | No Escape-to-dismiss; no click-to-dismiss; typists have hands on keyboard and must wait 5s |
| 8 | Aesthetic and Minimalist Design | 2 | Correct tokens but generic interior — could be any SaaS app; no editorial character inside the toast |
| 9 | Error Recovery | 2 | Describes what happened but gives no actionable guidance; user doesn't know what to do next |
| 10 | Help and Documentation | 3 | N/A for this component |
| **Total** | | **22/40** | **Fair** |

## Anti-Patterns Verdict

**LLM assessment**: No banned patterns (no gradient text, no glassmorphism, no hero metric, no card grid). However, the component shows a moderate AI slop signal of a different kind: the two-tier title/description anatomy is a direct clone of shadcn/ui's Sonner / Radix Toast structure — generic, not tailored. The hardcoded `w-80` is a classic "just use 320" LLM default. Most tellingly, the interior has no editorial character whatsoever: two lines of system-sans text on a paper background, indistinguishable from any SaaS notification. The brand is a printing press; this toast reads like a Slack DM.

**Deterministic scan**: 0 findings. No CSS anti-patterns detected. The implementation is technically clean.

## Overall Impression

The tokens are all correct and the animation timing is sound — this is disciplined implementation. The problem is the soul: "AFK Detected" is gamer terminology in a vintage newspaper app, the interior has no editorial personality, and the user has no control over dismissal. The biggest opportunity is rewriting the copy to match the brand voice and adding a dismiss affordance.

## What's Working

1. **Timing architecture is sound.** The 300ms pre-exit trigger, `forwards` fill-mode on slide-out to prevent flicker before React unmounts, and `prefers-reduced-motion` CSS coverage are all correctly implemented.
2. **Design token fidelity.** `border-ink`, `bg-paper`, `text-attribution`, `font-sans`, the 4×4 ink shadow — all match the spec. This component didn't drift from the system the way Word.tsx did.
3. **Component API is clean and reusable.** `title`, `description`, `duration`, `onDismiss` with optional description is a solid, extensible interface.

## Priority Issues

**[P0] Brand voice mismatch in copy**
- **What**: "AFK Detected" is gaming slang. The description "WPM has been readjusted to your last active typing speed" reads like an engine log. Neither belongs in *The Typewriter Times*.
- **Why it matters**: The editorial newspaper voice is the entire identity of this product. A toast that sounds like Fortnite server feedback breaks the illusion at the moment the user is most engaged.
- **Fix**: Rewrite the usage site. Title: "Stepped away?" — Description: "Your speed reflects only your active typing time." Or lean into the era: "The presses waited. Your pace has been measured from your last active stretch."
- **Suggested command**: `/impeccable clarify`

**[P1] No dismiss affordance**
- **What**: No close button, no click-to-dismiss, no Escape key handler. User waits 5 seconds.
- **Why it matters**: This is a keyboard-focused typing game. The user's hands are on the keyboard. Forcing a 5s toast with no exit during active play is a flow interruption with no control.
- **Fix**: Add an `×` button (top-right, `aria-label="Dismiss"`, calls `triggerDismiss`). Add an `onKeyDown` Escape listener in the effect. Optionally make the whole toast `onClick` dismissible.
- **Suggested command**: `/impeccable harden`

**[P1] Timer reference instability**
- **What**: `onDismiss` is an inline arrow function at the usage site, passed into `useEffect`'s dependency array. The parent re-renders every second (WPM interval). Each re-render creates a new `onDismiss` reference, clearing and resetting both `exitTimer` and `dismissTimer` — the toast may never auto-dismiss.
- **Why it matters**: A functional bug: in the worst case, the toast stays indefinitely until a render cycle happens to not reset the timers within the 5s window.
- **Fix**: `useCallback` on `onDismiss` at the usage site, or capture the callback in a `useRef` inside Toast and only read `ref.current` (not the state variable) inside the effect.
- **Suggested command**: `/impeccable harden`

**[P2] Missing ARIA role**
- **What**: No `role="status"` or `aria-live="polite"` on the toast container.
- **Why it matters**: Screen readers will not announce the AFK notification. Accessibility is not optional.
- **Fix**: Add `role="status" aria-live="polite" aria-atomic="true"` to the outer `<div>`.
- **Suggested command**: `/impeccable audit`

**[P2] Generic interior — no editorial character**
- **What**: Two lines of system-sans text on paper. No typographic differentiation from any other SaaS toast. The newspaper aesthetic is entirely absent from the inside of the component.
- **Why it matters**: Every other surface in the app — masthead, body copy, buttons — reads as *The Typewriter Times*. This toast reads as shadcn.
- **Fix**: The DESIGN.md spec gives the title `font-sans 0.875rem/600` — correct for function. But add explicit `text-ink` to the title span (currently relying on cascade). Consider a thin 1px `border-t border-ash-border` above the description as a column-break typographic detail, which would cost one line of markup and add period character.
- **Suggested command**: `/impeccable polish`

## Persona Red Flags

**Morgan (Focused Typist, in the zone at 70 WPM):** Goes AFK for 8 seconds, returns, sees toast. Wants to dismiss immediately and keep typing. Can't. The toast occupies peripheral attention for 5 full seconds she didn't consent to. She misses several word transitions while her eye wanders bottom-right. The brand says "The editorial copy is the stage." This toast competes with the stage.

**Sam (First-time user, just learning the game):** Sees "AFK Detected" and doesn't know what AFK means. The description mentions "active typing speed" but gives no indication of what to do next. No actionable guidance. The tone feels like a warning rather than a gentle system note.

## Minor Observations

- `bottom-16` (64px) assumes footer height; fragile if layout changes. Prefer a named spacing token.
- `w-80` (320px) is not responsive. On narrow viewports it will clip. `max-w-[calc(100vw-2rem)]` as a safeguard costs nothing.
- The CSS animation duration (0.3s = 300ms) is coupled to the JS timer offset (`duration - 300`) but not co-located. If someone changes the CSS to 0.5s, the component dismisses 200ms before animation ends.
- `gap-1` (4px) between title and description is very tight for the editorial register. `gap-1.5` or `gap-2` would breathe better.
- No stacking/queue awareness: if the user goes AFK repeatedly in quick succession, multiple toasts could mount simultaneously.
