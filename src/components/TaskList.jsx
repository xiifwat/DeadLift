import { useEffect, useState } from 'react'
import TaskItem from './TaskItem'
import { softDeleteTask, restoreTask } from '../lib/tasks'
import { sortByGrossPriority } from '../utils/priority'

const UNDO_WINDOW_MS = 6000
const RERANK_INTERVAL_MS = 60000 // re-sort periodically so urgency stays fresh while idle

export default function TaskList({ tasks, uid, onEdit, onToggleSubtask, onReorderSubtasks, onToggleCompleted, onTogglePin }) {
  const [undo, setUndo] = useState(null) // { taskId, title, timeoutId }
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), RERANK_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  const visibleTasks = sortByGrossPriority(tasks.filter((t) => !t.deletedAt))

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

  if (visibleTasks.length === 0 && !undo) {
    return <p className="empty-state">No tasks yet — add one above.</p>
  }

  return (
    <>
      {undo && (
        <div className="undo-toast">
          <span>Deleted "{undo.title}"</span>
          <button type="button" onClick={handleUndo}>Undo</button>
        </div>
      )}
      <ul className="task-list">
        {visibleTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={handleDelete}
            onToggleSubtask={onToggleSubtask}
            onReorderSubtasks={onReorderSubtasks}
            onToggleCompleted={onToggleCompleted}
            onTogglePin={onTogglePin}
          />
        ))}
      </ul>
    </>
  )
}
