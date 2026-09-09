import { useState } from 'react'
import TaskItem from './TaskItem'
import { softDeleteTask, restoreTask } from '../lib/tasks'

const UNDO_WINDOW_MS = 6000

export default function TaskList({ tasks, uid, onEdit, onToggleSubtask, onReorderSubtasks, onToggleCompleted }) {
  const [undo, setUndo] = useState(null) // { taskId, title, timeoutId }

  const visibleTasks = tasks.filter((t) => !t.deletedAt)

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
          />
        ))}
      </ul>
    </>
  )
}
