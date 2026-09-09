import { useEffect, useState } from 'react'
import TaskItem from './TaskItem'
import { softDeleteTask, restoreTask } from '../lib/tasks'
import { sortByGrossPriority } from '../utils/priority'

const UNDO_WINDOW_MS = 6000
const RERANK_INTERVAL_MS = 60000 // re-sort periodically so urgency stays fresh while idle

function matchesSearch(task, query) {
  if (!query) return true
  const q = query.toLowerCase()
  return task.title.toLowerCase().includes(q) || task.details?.toLowerCase().includes(q)
}

function matchesTags(task, selectedTags) {
  if (selectedTags.length === 0) return true
  return selectedTags.some((tag) => task.tags?.includes(tag))
}

export default function TaskList({ tasks, uid, allTags, onEdit, onToggleSubtask, onReorderSubtasks, onToggleCompleted, onTogglePin, searchQuery, selectedTags }) {
  const [undo, setUndo] = useState(null) // { taskId, title, timeoutId }
  const [completedOpen, setCompletedOpen] = useState(true)
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), RERANK_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  const filtered = tasks
    .filter((t) => !t.deletedAt)
    .filter((t) => matchesSearch(t, searchQuery))
    .filter((t) => matchesTags(t, selectedTags))

  const pending = sortByGrossPriority(filtered.filter((t) => !t.completed))
  const completed = sortByGrossPriority(filtered.filter((t) => t.completed))

  async function handleDelete(taskId) {
    const task = tasks.find((t) => t.id === taskId)
    await softDeleteTask(uid, taskId)
    if (undo) clearTimeout(undo.timeoutId)
    const timeoutId = setTimeout(() => setUndo(null), UNDO_WINDOW_MS)
    setUndo({ taskId, title: task.title, timeoutId })
  }

  async function handleUndo() {
    if (!undo) return
    clearTimeout(undo.timeoutId)
    await restoreTask(uid, undo.taskId)
    setUndo(null)
  }

  const itemProps = {
    uid,
    allTags,
    onEdit,
    onDelete: handleDelete,
    onToggleSubtask,
    onReorderSubtasks,
    onToggleCompleted,
    onTogglePin,
  }

  if (pending.length === 0 && completed.length === 0 && !undo) {
    const hasAnyTasks = tasks.some((t) => !t.deletedAt)
    return (
      <p className="empty-state">
        {hasAnyTasks ? 'No tasks match your search/filter.' : 'No tasks yet — add one above.'}
      </p>
    )
  }

  return (
    <>
      {undo && (
        <div className="undo-toast">
          <span>Deleted "{undo.title}"</span>
          <button type="button" onClick={handleUndo}>Undo</button>
        </div>
      )}

      {pending.length > 0 && (
        <ul className="task-list">
          {pending.map((task) => (
            <TaskItem key={task.id} task={task} {...itemProps} />
          ))}
        </ul>
      )}

      {completed.length > 0 && (
        <div className="completed-section">
          <button
            type="button"
            className={`completed-toggle${completedOpen ? ' open' : ''}`}
            onClick={() => setCompletedOpen((v) => !v)}
            aria-expanded={completedOpen}
          >
            <span className="chevron">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
            <span className="completed-toggle-label">Completed · {completed.length}</span>
          </button>
          {completedOpen && (
            <ul className="task-list">
              {completed.map((task) => (
                <TaskItem key={task.id} task={task} {...itemProps} />
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  )
}
