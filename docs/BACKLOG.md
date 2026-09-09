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
- **US-2.3** As a user, I can edit an existing task (parent fields and its subtasks). `TODO`
- **US-2.4** As a user, I can delete a task (soft delete + undo toast) or an individual subtask. `TODO`
- **US-2.5** As a user, checking off all subtasks automatically marks the parent task complete; unchecking any subtask reopens it. `TODO`
  - AC: A task with zero subtasks is marked complete/incomplete directly (manual checkbox).
  - AC: A task with subtasks cannot be manually marked complete — completion is derived from subtask state, not set directly.

## Epic 3: Gross Priority & Sorting
- **US-3.1** As a user, my tasks are automatically ranked by gross priority (task priority + urgency from deadline). `TODO`
  - AC: Formula documented in ADR-0002. Recomputed at render time, not stored stale.
- **US-3.2** As a user, I see a visual urgency indicator (color) per task. `TODO`
- **US-3.3** As a user, I can manually pin a task to override gross priority ranking. `TODO`

## Epic 4: Usability enhancements (post-MVP)
- **US-4.1** Tags/categories + filter. `TODO`
- **US-4.2** Search. `TODO`
- **US-4.3** Recurring tasks. `TODO`
- **US-4.4** Deadline reminders/notifications. `TODO`
- **US-4.5** Dark mode. `TODO`

## Definition of Ready (DoR)
- Story has clear acceptance criteria
- No unresolved dependency on another in-progress story

## Definition of Done (DoD)
- Code implemented + manually verified in running app
- No console errors
- Committed with descriptive message
- BACKLOG.md status updated
