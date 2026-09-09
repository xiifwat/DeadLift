import { useState } from 'react'
import TaskForm from './TaskForm'
import SubtaskList from './SubtaskList'
import { urgencyLevel } from '../utils/priority'

function formatDate(endDate) {
  if (!endDate) return '—'
  const d = endDate.toDate ? endDate.toDate() : new Date(endDate)
  return d.toLocaleDateString()
}

export default function TaskItem({ task, onEdit, onDelete, onToggleSubtask, onReorderSubtasks, onToggleCompleted, onTogglePin }) {
  const [editing, setEditing] = useState(false)
  const hasSubtasks = task.subtasks?.length > 0
  const doneCount = task.subtasks?.filter((s) => s.done).length ?? 0
  const urgency = urgencyLevel(task.endDate)

  if (editing) {
    return (
      <li className="task-item">
        <TaskForm
          initialTask={task}
          onCancel={() => setEditing(false)}
          onSubmit={async (data) => {
            await onEdit(task.id, data)
            setEditing(false)
          }}
        />
      </li>
    )
  }

  return (
    <li className={`task-item urgency-${urgency}${task.completed ? ' completed' : ''}${task.pinned ? ' pinned' : ''}`}>
      <div className="task-item-main">
        <button
          type="button"
          className="pin-btn"
          onClick={() => onTogglePin(task)}
          aria-pressed={task.pinned}
          title={task.pinned ? 'Unpin' : 'Pin to top'}
        >
          {task.pinned ? '📌' : '📍'}
        </button>
        {hasSubtasks ? (
          <span
            className="task-complete-dot"
            title="Completion follows subtasks — check them off below"
          >
            {task.completed ? '●' : '○'}
          </span>
        ) : (
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleCompleted(task)}
            title="Mark complete"
          />
        )}
        <span className="task-title">{task.title}</span>
        <span className="task-priority" title="Task priority">P{task.taskPriority}</span>
        <span className="task-date">{formatDate(task.endDate)}</span>
        <button type="button" onClick={() => setEditing(true)}>Edit</button>
        <button type="button" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
      {task.details && <p className="task-details">{task.details}</p>}
      {hasSubtasks && (
        <div className="task-subtasks">
          <span className="subtask-progress">{doneCount}/{task.subtasks.length} subtasks done</span>
          <SubtaskList
            subtasks={task.subtasks}
            onToggle={(subtaskId) => onToggleSubtask(task, subtaskId)}
            onReorder={(newSubtasks) => onReorderSubtasks(task.id, newSubtasks)}
          />
        </div>
      )}
    </li>
  )
}
