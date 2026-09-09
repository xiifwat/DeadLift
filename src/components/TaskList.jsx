function formatDate(endDate) {
  if (!endDate) return '—'
  const d = endDate.toDate ? endDate.toDate() : new Date(endDate)
  return d.toLocaleDateString()
}

export default function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet — add one above.</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const doneCount = task.subtasks?.filter((s) => s.done).length ?? 0
        const total = task.subtasks?.length ?? 0
        return (
          <li key={task.id} className={`task-item${task.completed ? ' completed' : ''}`}>
            <div className="task-item-main">
              <span className="task-title">{task.title}</span>
              <span className="task-priority" title="Task priority">P{task.taskPriority}</span>
              <span className="task-date">{formatDate(task.endDate)}</span>
            </div>
            {task.details && <p className="task-details">{task.details}</p>}
            {total > 0 && (
              <div className="task-subtasks">
                <span className="subtask-progress">{doneCount}/{total} subtasks done</span>
                <ul>
                  {task.subtasks.map((s) => (
                    <li key={s.id} className={s.done ? 'done' : ''}>{s.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
