import { useState } from 'react'

const emptySubtask = () => ({ key: crypto.randomUUID(), title: '' })

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [endDate, setEndDate] = useState('')
  const [taskPriority, setTaskPriority] = useState(5)
  const [subtasks, setSubtasks] = useState([])
  const [error, setError] = useState('')

  function updateSubtask(key, value) {
    setSubtasks((prev) => prev.map((s) => (s.key === key ? { ...s, title: value } : s)))
  }

  function removeSubtask(key) {
    setSubtasks((prev) => prev.filter((s) => s.key !== key))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return setError('Title is required.')
    if (!endDate) return setError('End date is required.')
    const priorityNum = Number(taskPriority)
    if (!Number.isInteger(priorityNum) || priorityNum < 1 || priorityNum > 10) {
      return setError('Priority must be an integer 1-10.')
    }
    setError('')
    await onSubmit({
      title,
      details,
      endDate,
      taskPriority: priorityNum,
      subtasks: subtasks.map((s) => s.title),
    })
    setTitle('')
    setDetails('')
    setEndDate('')
    setTaskPriority(5)
    setSubtasks([])
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Details (optional)"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />
      <div className="task-form-row">
        <label>
          End date
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <label>
          Priority (1-10)
          <input
            type="number"
            min="1"
            max="10"
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
          />
        </label>
      </div>

      <div className="subtask-editor">
        <span>Subtasks</span>
        {subtasks.map((s) => (
          <div className="subtask-row" key={s.key}>
            <input
              type="text"
              placeholder="Subtask title"
              value={s.title}
              onChange={(e) => updateSubtask(s.key, e.target.value)}
            />
            <button type="button" onClick={() => removeSubtask(s.key)} aria-label="Remove subtask">
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setSubtasks((prev) => [...prev, emptySubtask()])}>
          + Add subtask
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="primary">Add task</button>
    </form>
  )
}
