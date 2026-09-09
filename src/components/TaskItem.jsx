import { useState } from 'react'
import TaskForm from './TaskForm'
import SubtaskList from './SubtaskList'
import { urgencyLevel } from '../utils/priority'

function formatDate(endDate) {
  if (!endDate) return '—'
  const d = endDate.toDate ? endDate.toDate() : new Date(endDate)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function TaskItem({ task, allTags, onEdit, onDelete, onToggleSubtask, onReorderSubtasks, onToggleCompleted, onTogglePin }) {
  const [editing, setEditing] = useState(false)
  const hasSubtasks = task.subtasks?.length > 0
  const doneCount = task.subtasks?.filter((s) => s.done).length ?? 0
  const urgency = urgencyLevel(task.endDate)
  const dateLabel = urgency === 'overdue' ? `Overdue · ${formatDate(task.endDate)}` : `Due ${formatDate(task.endDate)}`

  if (editing) {
    return (
      <li className="task-item row">
        <div className="task-item-body">
          <TaskForm
            initialTask={task}
            allTags={allTags}
            onCancel={() => setEditing(false)}
            onSubmit={async (data) => {
              await onEdit(task.id, data)
              setEditing(false)
            }}
          />
        </div>
      </li>
    )
  }

  return (
    <li className={`task-item row urgency-${urgency}${task.completed ? ' completed' : ''}${task.pinned ? ' pinned' : ''}`}>
      <div className="urgency-band" />

      {hasSubtasks ? (
        <span className="task-complete-dot" title="Completion follows subtasks — check them off below">
          {task.completed ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--neutral)"><circle cx="12" cy="12" r="12" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--neutral)" strokeWidth="1.5"><circle cx="12" cy="12" r="10.5" /></svg>
          )}
        </span>
      ) : (
        <button
          type="button"
          className="task-checkbox-btn"
          onClick={() => onToggleCompleted(task)}
          title="Mark complete"
          aria-pressed={task.completed}
        >
          {task.completed ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--neutral)">
              <circle cx="12" cy="12" r="12" />
              <path d="M8 12l3 3 5-6" stroke="var(--on-accent)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--neutral)" strokeWidth="1.5"><circle cx="12" cy="12" r="10.5" /></svg>
          )}
        </button>
      )}

      <div className="task-item-body">
        <div className="task-item-main">
          <span className="task-title">{task.title}</span>
          {task.endDate && <span className="task-date">{dateLabel}</span>}
        </div>

        <div className="task-actions-row">
          <button
            type="button"
            className="icon-btn pin-btn"
            onClick={() => onTogglePin(task)}
            aria-pressed={task.pinned}
            title={task.pinned ? 'Unpin' : 'Pin to top'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 17v5" />
              <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
            </svg>
          </button>
          <button type="button" className="icon-btn" onClick={() => setEditing(true)} title="Edit">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </button>
          <button type="button" className="icon-btn" onClick={() => onDelete(task.id)} title="Delete">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>

        {task.details && <p className="task-details">{task.details}</p>}

        {hasSubtasks && (
          <div className="task-subtasks">
            <div className="subtask-progress-row">
              <span className="subtask-progress">{doneCount} of {task.subtasks.length} subtasks</span>
              <div className="subtask-progress-bar">
                <div
                  className="subtask-progress-bar-fill"
                  style={{ width: `${(doneCount / task.subtasks.length) * 100}%` }}
                />
              </div>
            </div>
            <SubtaskList
              subtasks={task.subtasks}
              onToggle={(subtaskId) => onToggleSubtask(task, subtaskId)}
              onReorder={(newSubtasks) => onReorderSubtasks(task.id, newSubtasks)}
            />
          </div>
        )}

        <div className="task-meta-row">
          <span className="task-priority">Priority {task.taskPriority}</span>
          {task.tags?.map((tag) => (
            <span className="tag-chip" key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </li>
  )
}
