# Deadlift

A todo app that ranks itself. Give a task a priority (1-10) and a deadline, and
**Deadlift** automatically computes a *gross priority* — priority combined with how
close the deadline is — and sorts your list by it. No manual reordering; the closer
a deadline gets, the harder it pulls a task up the list.

Installable as a PWA on desktop and mobile, works in light or dark theme, and syncs
per-user via Firebase.

## Features

- **Google sign-in** — tasks are private to your account (Firebase Auth)
- **Auto-ranked list** — gross priority = task priority × an urgency multiplier that
  grows sharply as the deadline approaches (see [ADR-0002](docs/adr/0002-gross-priority-formula.md)
  for the exact formula and why it's shaped that way)
- **Subtasks** — break a task down; priority lives only on the parent, and checking
  off every subtask automatically completes it. Drag to reorder.
- **Manual pin** — override the ranking for anything you want pinned to the top
- **Tags & filtering** — tag tasks, filter by one or more, pick from existing tags or
  add new ones inline
- **Search** — across title and details
- **Soft delete + undo** — deleting a task shows an undo toast instead of losing it
  immediately
- **Light/dark theme** — toggle in the header, remembered per device
- **PWA** — installable, works offline for the app shell

## Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Firebase](https://firebase.google.com/) — Auth (Google OAuth) + Firestore
- [@dnd-kit](https://dndkit.com/) — subtask drag-reorder
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) — manifest + service worker

## Getting started

### 1. Firebase project

Create a project at the [Firebase console](https://console.firebase.google.com):

1. **Authentication** → Sign-in method → enable **Google**
2. **Firestore Database** → create one
3. **Project settings** → your web app → copy the SDK config

### 2. Configure

```bash
cp .env.example .env.local
```

Fill in `.env.local` with the config values from step 1 (all `VITE_FIREBASE_*` keys).

### 3. Install & run

```bash
npm install
npm run dev
```

Open the printed local URL and sign in with Google.

### 4. Firestore security rules

`firestore.rules` restricts every task to its owner:

```
match /users/{uid}/tasks/{taskId} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
```

Deploy with the [Firebase CLI](https://firebase.google.com/docs/cli):

```bash
firebase deploy --only firestore:rules
```

## Scripts

| Command           | Purpose                                  |
| ------------------ | ----------------------------------------- |
| `npm run dev`      | Start the dev server                      |
| `npm run build`    | Production build (also emits the PWA service worker/manifest) |
| `npm run preview`  | Serve the production build locally        |
| `npm run lint`     | Lint with oxlint                          |

## Project docs

This was built following a lightweight agile process — the paper trail lives in
[docs](docs):

- [BACKLOG.md](docs/BACKLOG.md) — epics, user stories, status
- [SPRINT-PLAN.md](docs/SPRINT-PLAN.md) — sprint breakdown
- [adr](docs/adr) — architecture decision records (stack choice, the gross-priority
  formula and its revisions, build tooling)

## Data model

Firestore, one document per task under `users/{uid}/tasks/{taskId}`:

```js
{
  title, details, endDate, taskPriority,   // priority lives only on the parent
  pinned, tags, createdAt,
  subtasks: [{ id, title, done }],
  completed: boolean,   // derived from subtasks when any exist, manual otherwise
  deletedAt: Timestamp | undefined  // soft delete
}
```

Gross priority is computed at render time (`src/utils/priority.js`), never stored —
so ranking stays accurate without a background job.
