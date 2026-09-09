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

const URGENCY_MAX = 10 // multiplier when overdue/due right now
const URGENCY_MIN = 0.5 // floor for far-out tasks — priority still orders them
const HALF_LIFE_HOURS = 18 // urgency roughly halves every 18h further out

/**
 * Exponential decay: 10x when due now/overdue, halving about every 18h out,
 * bottoming out at 0.5x. Steep on purpose — a task due today should usually
 * outrank a much-higher-priority task due in a few days (see ADR-0002).
 */
export function urgencyMultiplier(endDate, now = new Date()) {
  const h = hoursRemaining(endDate, now)
  if (!Number.isFinite(h)) return 1
  if (h <= 0) return URGENCY_MAX
  return clamp(URGENCY_MAX * Math.pow(2, -h / HALF_LIFE_HOURS), URGENCY_MIN, URGENCY_MAX)
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
