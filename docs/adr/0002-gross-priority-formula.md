# ADR-0002: Gross priority formula

## Status
Accepted — 2026-09-09. Revised — 2026-09-09 (v2, see below).

## Context
Tasks need a single sortable "gross priority" combining user-given `taskPriority` (1-10)
and urgency from `endDate`.

## v1 (superseded)
```
urgency = overdue ? 2 : clamp(1 + 1 / (1 + hoursRemaining / 24), 1, 2)
grossPriority = taskPriority * urgency
```
Real usage exposed the problem: capping urgency at 2x meant `taskPriority` dominated too
hard. A P1 task due today ranked *below* a P10 task due in 3 days (2 × 1 = 2 vs
10 × 1.25 = 12.5) — the opposite of what felt right. User confirmed: urgency should be
able to overpower a large priority gap as the deadline gets close, with no separate hard
"overdue always wins" rule — one continuous formula, pulled harder.

## Decision (v2)
```
HALF_LIFE_HOURS = 18   // urgency roughly halves every 18h further out
URGENCY_MAX = 10        // multiplier when due now / overdue
URGENCY_MIN = 0.5        // floor for far-out tasks

urgency = hoursRemaining <= 0
  ? URGENCY_MAX
  : clamp(URGENCY_MAX * 2^(-hoursRemaining / HALF_LIFE_HOURS), URGENCY_MIN, URGENCY_MAX)

grossPriority = taskPriority * urgency
```

Exponential decay instead of the old harmonic curve — a harmonic curve's ratio between
"now" and "days out" is bounded (maxes out around 4x no matter how high the ceiling), which
can't beat a 10x priority gap. Exponential decay has no such ceiling on the ratio: push the
half-life down and near-term urgency can dominate arbitrarily large priority gaps.

Worked example (the case that exposed v1): P1 task overdue vs P10 task due in 3 days (72h).
- P1, overdue: `urgency = 10` → gross = 10
- P10, 72h out: `urgency = 10 * 2^(-72/18) = 10 * 2^-4 = 0.625` → gross = 6.25

P1-overdue now outranks P10-in-3-days, matching the intended feel.

Still computed at render time in `src/utils/priority.js`, not stored.

## Consequences
- A task due tomorrow can still beat a much-higher-priority task due in overdue... no —
  urgency at 24h out is `10 * 2^(-24/18) ≈ 3.97`, so a P10 task due tomorrow (gross ≈ 39.7)
  still beats a P1 task overdue (gross = 10). That's intentional: "tomorrow" isn't as urgent
  as "now", and a 10x priority gap is extreme — most real priority gaps are smaller, where
  urgency wins the close calls it's meant to.
- `URGENCY_MIN = 0.5` keeps far-out tasks ordered by priority rather than all flattening to
  the same near-zero multiplier.
- Tune `HALF_LIFE_HOURS` down for a steeper pull (overdue dominates even bigger priority
  gaps) or up for a gentler one, if real usage still feels off.
