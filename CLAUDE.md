# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server (localhost:5173)
npm run build      # Type-check then build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

There are no tests configured in this project.

## Architecture

**The Typewriter Times** is a vintage newspaper-themed typing speed app. React 18 + TypeScript + Vite + Tailwind CSS v4.

### Data Flow

1. `useNews` hook (TanStack Query) fetches a `News` article from the Railway-hosted backend API. In `DEV` mode it always returns `NEWS_CONTENT_MOCK` instead of hitting the network.
2. `TypewriterGame` renders a loading/error state or wraps `GameLayout` in `GameProvider`.
3. `GameProvider` splits `news.content` into `wordsList`, hydrates `TypingState` from `localStorage` (keyed by `news.id`), and exposes state + dispatch via two separate React contexts (`GameStateContext`, `GameDispatchContext`).
4. All keyboard input is handled in `GameLayout.handleOnKeyDown`, which dispatches actions to `typingReducer`.
5. A 1-second interval dispatches `UPDATE_WPM` while the game is active, enabling real-time WPM display and AFK detection.

### State Machine (`TypingReducer.ts`)

The entire game state is a single `TypingState` object managed by `typingReducer`:

- `TYPE_LETTER` — appends a character (capped at `word.length + 5`), accumulates `activeTime` only for gaps < 5 s, tracks accuracy. Auto-advances on last word completion.
- `SUBMIT_WORD` — advances `currentWordIndex` only if the typed word matches exactly.
- `DELETE_LETTER` — trims last character.
- `UPDATE_WPM` — recalculates WPM, maintains a 5-item `wpmHistory`. When the user goes AFK (≥5 s since last keystroke), readjusts WPM to the last active value and sets `showAfkToast: true`.
- `DISMISS_AFK_TOAST` — hides the AFK toast.

Game completion is detected when `currentWordIndex >= wordsList.length`.

### Path Aliases

Configured in `vite.config.ts`:

| Alias | Path |
|---|---|
| `@components` | `src/components` |
| `@context` | `src/context` |
| `@hooks` | `src/hooks` |
| `@mocks` | `src/mocks` |
| `@reducers` | `src/reducers` |
| `@app-types` | `src/types` |

### Backend & Cron

- Production news comes from `https://typewriter-api-production.up.railway.app/api/news/`.
- `api/cron.js` is a Vercel serverless function called daily at 16:00 UTC (configured in `vercel.json`). It hits the backend's `/api/news/generate/` endpoint. Requires `CRON_SECRET` and `VITE_API_URL` environment variables.

### Persistence

Game progress is saved to `localStorage` under key `typewriter_game_state` as `{ newsId, state }` on `beforeunload`. State is restored when the same `news.id` is loaded. Storage is cleared on game completion.
