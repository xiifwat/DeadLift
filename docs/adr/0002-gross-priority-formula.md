# ADR-0002: Gross priority formula

## Status
Accepted — 2026-09-09

## Context
Tasks need a single sortable "gross priority" combining user-given `taskPriority` (1-10)
and urgency from `endDate`. Linear urgency undervalues near-term deadlines; want last-day
tasks to spike above a high-priority-but-distant task.

## Decision
```
hoursRemaining = (endDate - now) / 3600000
urgency = hoursRemaining <= 0
  ? 2                                    // overdue: max urgency multiplier
  : clamp(1 + 1 / (1 + hoursRemaining / 24), 1, 2)   // decays from ~2 (due now) to ~1 (due far out)

grossPriority = taskPriority * urgency
```

- Overdue tasks always get urgency = 2 (max), so they float near top regardless of how
  overdue — avoids an overdue-by-a-month task decaying back down.
- `taskPriority` stays the dominant factor (1-10 base) so a 2/10 task 1 hour out doesn't
  outrank a 9/10 task due tomorrow — urgency only doubles at most.
- Computed at render time in `src/utils/priority.js`, not stored — always accurate,
  no cron/Cloud Function needed for MVP.

## Consequences
- Recalculated on every render — negligible cost for expected list sizes (<hundreds of
  tasks).
- If sort needs to happen server-side later (e.g. for push notifications "your top task
  changed"), revisit with a Cloud Function scheduled recompute.
