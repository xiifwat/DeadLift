# Product Backlog

Status legend: `TODO` `IN PROGRESS` `DONE`

## Epic 1: Auth & Foundation
- **US-1.1** As a user, I can sign in with Google so my tasks are private to me. `TODO`
  - AC: Clicking "Sign in with Google" opens OAuth popup, on success user lands on task list.
  - AC: Signed-out users see only the sign-in screen, no task data.
- **US-1.2** As a user, I can sign out. `TODO`

## Epic 2: Core Task CRUD
- **US-2.1** As a user, I can add a task with title, details, end date, and priority (1-10). `TODO`
  - AC: All fields required except details. Priority restricted to 1-10 int.
- **US-2.2** As a user, I can view my task list. `TODO`
- **US-2.3** As a user, I can edit an existing task. `TODO`
- **US-2.4** As a user, I can delete a task (soft delete + undo toast). `TODO`
- **US-2.5** As a user, I can mark a task complete. `TODO`

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
