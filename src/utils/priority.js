// Gross priority formula — see docs/adr/0002-gross-priority-formula.md.
// Computed at call time, never stored, so ranking is always accurate.

const HOUR_MS = 3600000

function toDate(endDate) {
  if (!endDate) return null
  return endDate.toDate ? endDate.toDate() : new Date(endDate)
}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max)
}

/** hours until deadline; negative once overdue. Infinity if no end date set. */
export function hoursRemaining(endDate, now = new Date()) {
  const d = toDate(endDate)
  if (!d) return Infinity
  return (d.getTime() - now.getTime()) / HOUR_MS
}

/** 2 (max) once overdue, decaying from ~2 (due now) down to ~1 (due far out). */
export function urgencyMultiplier(endDate, now = new Date()) {
  const h = hoursRemaining(endDate, now)
  if (!Number.isFinite(h)) return 1
  if (h <= 0) return 2
  return clamp(1 + 1 / (1 + h / 24), 1, 2)
}

export function grossPriority(task, now = new Date()) {
  return task.taskPriority * urgencyMultiplier(task.endDate, now)
}

/** Coarse band for the visual urgency indicator (US-3.2). */
export function urgencyLevel(endDate, now = new Date()) {
  const h = hoursRemaining(endDate, now)
  if (!Number.isFinite(h)) return 'none'
  if (h <= 0) return 'overdue'
  if (h <= 24) return 'today'
  if (h <= 7 * 24) return 'week'
  return 'later'
}

/**
 * Sorts tasks for display: pinned tasks first (US-3.3 manual override), then by
 * gross priority descending, tie-broken by createdAt (stable, earliest first).
 */
export function sortByGrossPriority(tasks, now = new Date()) {
  return [...tasks].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1
    const diff = grossPriority(b, now) - grossPriority(a, now)
    if (diff !== 0) return diff
    const aCreated = a.createdAt?.toMillis?.() ?? 0
    const bCreated = b.createdAt?.toMillis?.() ?? 0
    return aCreated - bCreated
  })
}
