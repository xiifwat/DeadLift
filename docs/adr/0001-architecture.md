# ADR-0001: Core architecture

## Status
Accepted — 2026-09-09

## Context
Web todo app. Users add tasks (title, details, end date, priority 1-10). App auto-computes
gross priority from task priority + time-to-deadline, sorts list by it. Need auth so tasks
are per-user. Small team (solo + AI pairing), want minimal ops overhead.

## Decision
- **Frontend**: React (Vite scaffold, not CRA — faster dev server, smaller config surface).
- **Auth**: Firebase Auth, Google OAuth provider. No custom password handling needed.
- **Database**: Firestore. Doc shape: `users/{uid}/tasks/{taskId}`, with subtasks embedded
  as an array on the parent doc (not a subcollection — small, always fetched together with
  the parent, no need for independent querying):
  ```js
  {
    title, details, endDate, taskPriority,   // priority lives only here, on the parent
    pinned, createdAt,
    subtasks: [{ id, title, done: boolean }],
    completed: boolean   // derived: true if subtasks.length === 0 ? manual : all(subtasks.done)
  }
  ```
  `completed` is still stored (not computed at read time) so it can be queried/filtered
  directly, but it's only ever written by the subtask-completion logic when the task has
  subtasks — never set directly by the user in that case.

  Subtask order is the array's own order — no separate `order`/`index` field. Drag-reorder
  writes the whole `subtasks` array back in its new order on drop (small array, cheap
  single-field update, avoids index-management bugs a numeric order field would add).
- **Hosting**: Firebase Hosting.
- **Gross priority**: computed client-side at render time from stored `taskPriority` +
  `endDate`, not persisted as a field — avoids staleness, no scheduled recompute job needed
  for MVP. See ADR-0002 for formula.

## Security
Firestore rules restrict read/write to `request.auth.uid == uid` on the user's own subtree.
No task data readable cross-user.

## Consequences
- No custom backend server to maintain — Firebase handles auth + persistence.
- Client-side priority calc means sort logic duplicated wherever list is rendered; keep it
  in one shared util (`src/utils/priority.js`).
- Firestore free tier (50k reads/20k writes per day) sufficient for personal-scale use;
  revisit if app grows to many concurrent users.
