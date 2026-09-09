# Product Backlog

Status legend: `TODO` `IN PROGRESS` `DONE`

## Epic 1: Auth & Foundation
- **US-1.1** As a user, I can sign in with Google so my tasks are private to me. `DONE`
  - Verified by user 2026-09-09: real-browser Google sign-in works end-to-end.
- **US-1.2** As a user, I can sign out. `DONE`

## Epic 2: Core Task CRUD
- **US-2.1** As a user, I can add a task with title, details, end date, and priority (1-10), and break it into subtasks. `DONE`
  - Verified by user 2026-09-09.
  - AC: Title, end date, priority required on the parent task; details optional.
  - AC: Priority (1-10) is set only on the parent task — subtasks have no priority field of their own.
  - AC: Parent task can have zero or more subtasks (title only, no separate end date/priority).
  - AC: Subtasks can be added/removed/checked off independently after creation.
  - AC: Subtasks can be reordered via drag-and-drop; new order persists (array order in the Firestore doc — see ADR-0001).
- **US-2.2** As a user, I can view my task list, with each task's subtasks and completion progress (e.g. 2/5 done). `DONE`
  - Verified by user 2026-09-09.
- **US-2.3** As a user, I can edit an existing task (parent fields and its subtasks). `DONE`
  - Verified by user 2026-09-09.
- **US-2.4** As a user, I can delete a task (soft delete + undo toast) or an individual subtask. `DONE`
  - Verified by user 2026-09-09. Individual-subtask delete is via edit mode (remove row), not a standalone control while viewing — confirmed acceptable.
- **US-2.5** As a user, checking off all subtasks automatically marks the parent task complete; unchecking any subtask reopens it. `DONE`
  - AC: A task with zero subtasks is marked complete/incomplete directly (manual checkbox).
  - AC: A task with subtasks cannot be manually marked complete — completion is derived from subtask state, not set directly.
  - Verified by user 2026-09-09.

## Epic 3: Gross Priority & Sorting
- **US-3.1** As a user, my tasks are automatically ranked by gross priority (task priority + urgency from deadline). `DONE`
  - AC: Formula documented in ADR-0002 (v2 — exponential urgency decay after v1 underweighted urgency). Recomputed at render time, not stored stale.
  - Verified by user 2026-09-09.
- **US-3.2** As a user, I see a visual urgency indicator (color) per task. `DONE`
  - Verified by user 2026-09-09.
- **US-3.3** As a user, I can manually pin a task to override gross priority ranking. `DONE`
  - Verified by user 2026-09-09.

## Epic 4: Usability enhancements (post-MVP)
- **US-4.1** As a user, I can tag tasks and filter the list by tag. `DONE`
  - AC: Tags are free-text, user-defined (no preset list). A task can have zero or more.
  - AC: Filter control lists every tag currently in use; selecting tags shows tasks matching any of them (OR); no selection = all tasks.
  - AC: When adding/editing a task, existing tags are offered as pickable chips; user can also type a new one.
  - Verified by user 2026-09-09.
- **US-4.2** As a user, I can search tasks by title or details. `DONE`
  - AC: Case-insensitive substring match on title + details.
  - AC: Search and tag filter combine (AND) — both narrow the same list.
  - Verified by user 2026-09-09.
- **US-4.3** Recurring tasks. `TODO` (not in Sprint 3)
- **US-4.4** Deadline reminders/notifications. `TODO` (not in Sprint 3)
- **US-4.5** Dark mode. `TODO` (not in Sprint 3)

## Epic 5: Professional UI + PWA
- **US-5.1** As a user, the app looks like a polished product, not a functional prototype. `TODO`
  - AC: Consistent color/type/spacing system, applied across all existing screens (sign-in, task list, forms).
  - AC: Mockup reviewed and signed off before implementation.
- **US-5.2** As a user, I can install the app on desktop or mobile and open it standalone (PWA). `TODO`
  - AC: Manifest + icons + service worker via `vite-plugin-pwa`.
  - AC: Installable from Chrome (desktop + Android) and addable to home screen on iOS Safari.

## Definition of Ready (DoR)
- Story has clear acceptance criteria
- No unresolved dependency on another in-progress story

## Definition of Done (DoD)
- Code implemented + manually verified in running app
- No console errors
- Committed with descriptive message
- BACKLOG.md status updated
