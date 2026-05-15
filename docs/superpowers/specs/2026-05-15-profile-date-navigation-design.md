# Profile & Date Navigation Design

**Date:** 2026-05-15
**Status:** Approved

## Overview

Add user authentication (manual credentials), a profile modal showing game stats, and a date-picker in the header that lets users load and play any past day's news article.

## Goals

- Users can register and log in with username + password
- Logged-in users have their game results (WPM, accuracy) saved to the backend
- Clicking the date in the header opens a calendar to navigate to any past date's article
- The profile is accessible via the header username — a modal shows stats when logged in, and login/register forms when logged out

## Out of Scope

- Social auth (Google, GitHub, etc.)
- Public profile pages
- Per-date game history list
- React Router / URL-based routing

---

## Backend

### New app: `accounts`

Handles user registration and JWT authentication via `djangorestframework-simplejwt`. Tokens are stored as `httpOnly` cookies (access token + refresh token).

**Endpoints:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register/` | None | Create account with username + password. Returns `{ id, username }` and sets httpOnly cookies. |
| `POST` | `/api/auth/login/` | None | Validates credentials. Returns `{ id, username }` in body and sets httpOnly cookies. |
| `POST` | `/api/auth/logout/` | Required | Clears httpOnly cookies. |
| `POST` | `/api/auth/refresh/` | Cookie | Issues new access token using refresh cookie. Returns `{ id, username }`. |
| `GET` | `/api/profile/` | Required | Returns `{ id, username, best_wpm, avg_accuracy, total_games }` for the current user. |

### New app: `results`

Stores completed game results per user per news article.

**Model: `GameResult`**

```
user          FK → User (on_delete=CASCADE)
news          FK → News (on_delete=CASCADE)
wpm           IntegerField
accuracy      IntegerField
completed_at  DateTimeField (auto_now=True)

unique_together: (user, news)  ← upsert on replay
```

Replaying the same date overwrites the previous result (upsert via `update_or_create`).

**Endpoints:**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/results/` | Required | Save or update result for a given `news_id`. Body: `{ news_id, wpm, accuracy }`. |

Stats (`best_wpm`, `avg_accuracy`, `total_games`) are computed from `GameResult` in the `GET /api/profile/` view — no denormalized fields on the user model.

---

## Frontend

### Auth Context — `AuthProvider`

New context wrapping the entire app. Holds:

```ts
type AuthUser = { id: string; username: string };
type AuthContextValue = {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
```

**Session restoration on mount:**
1. Read `localStorage` for `{ id, username }` — if present, set as current user optimistically
2. Call `POST /api/auth/refresh/` — if it succeeds, confirm the session; if it 401s, clear `localStorage` and set `user` to `null`

`login()` and `register()` both call the backend, then write `{ id, username }` to `localStorage` and update context state. `logout()` calls the backend, clears `localStorage`, and sets `user` to `null`.

### Header — Username button

Replaces the hardcoded `USER` constant. Reads from `AuthContext`.

- Shows "Guest" when logged out, or the username when logged in
- Clicking opens a `<Modal>`:
  - **Logged out:** togglable Login / Register forms
  - **Logged in:** stats summary (best WPM, avg accuracy, total games) fetched from `GET /api/profile/`, plus a logout button

### Header — Date button

The date text becomes a button that opens a shadcn `<Popover>` containing a shadcn `<Calendar>`.

- Default: no date selected → today's article loads (existing behavior)
- On date select: popover closes, selected date stored in local React state (`selectedDate`), passed down to `useNews`
- Disabled future dates in the calendar

### `useNews` hook — date param

```ts
useNews(date?: string)  // date format: MM-DD-YYYY
```

When `date` is provided, fetches `/api/news/${date}/`. When omitted, fetches today (existing behavior). The `queryKey` includes `date` so TanStack Query caches each date separately.

`selectedDate` state lives in `App.tsx` (or the nearest common ancestor of `Header` and `TypewriterGame`) and is passed to both as a prop.

### Game result sync

On game completion (detected in `GameProvider` when `currentWordIndex >= wordsList.length`):

1. Save to `localStorage` as today (existing behavior)
2. If `user` is not null, fire `POST /api/results/` in the background
3. Failure is silent — it does not block the `GameCompletion` screen

The result sync is triggered once per completion via a `useEffect` that watches the completed state flag.

---

## Data Flow

```
App
 ├── AuthProvider          (user state, login/logout/register)
 ├── Header
 │    ├── Username button  → Modal (login/register or stats + logout)
 │    └── Date button      → Popover → Calendar → selectedDate state
 └── TypewriterGame
      └── useNews(selectedDate)   → fetches news for selected date
           └── GameProvider
                └── on completion → POST /api/results/ (if logged in)
```

---

## Error Handling

- **Login/register failures:** display inline error message inside the modal (e.g., "Invalid credentials", "Username already taken")
- **Profile fetch failure:** show a generic error state inside the modal ("Could not load profile")
- **Date with no article:** if the API returns an empty array for a selected date, show a message in the game area ("No article available for this date")
- **Result sync failure:** silent — no user-facing error; the game completion screen proceeds normally
- **Session refresh failure on mount:** silently log out (clear localStorage, set user to null)

---

## Package additions

**Backend:**
- `djangorestframework-simplejwt`

**Frontend:**
- `shadcn/ui` Calendar + Popover components (already using shadcn pattern via NeoButton/Modal)
- No new major dependencies (no React Router)
