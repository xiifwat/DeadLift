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
- **Database**: Firestore. Doc shape: `users/{uid}/tasks/{taskId}`.
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
