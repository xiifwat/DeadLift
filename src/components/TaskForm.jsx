import { useState } from 'react'

const emptySubtask = () => ({ key: crypto.randomUUID(), title: '' })

function toDateInputValue(endDate) {
  if (!endDate) return ''
  const d = endDate.toDate ? endDate.toDate() : new Date(endDate)
  return d.toISOString().slice(0, 10)
}

/**
 * Add/edit form. Pass `initialTask` to edit in place (pre-fills fields, preserves
 * subtask ids/done state); omit it to add a new task.
 */
export default function TaskForm({ onSubmit, onCancel, initialTask, allTags = [] }) {
  const isEdit = !!initialTask
  const [title, setTitle] = useState(initialTask?.title ?? '')
  const [details, setDetails] = useState(initialTask?.details ?? '')
  const [endDate, setEndDate] = useState(toDateInputValue(initialTask?.endDate))
  const [taskPriority, setTaskPriority] = useState(initialTask?.taskPriority ?? 5)
  const [tags, setTags] = useState(initialTask?.tags ?? [])
  const [newTagInput, setNewTagInput] = useState('')
  const [subtasks, setSubtasks] = useState(
    () => initialTask?.subtasks?.map((s) => ({ key: s.id, ...s })) ?? [],
  )
  const [error, setError] = useState('')

  function updateSubtask(key, value) {
    setSubtasks((prev) => prev.map((s) => (s.key === key ? { ...s, title: value } : s)))
  }

  function removeSubtask(key) {
    setSubtasks((prev) => prev.filter((s) => s.key !== key))
  }

  function addTag(tag) {
    const trimmed = tag.trim()
    if (!trimmed || tags.includes(trimmed)) return
    setTags((prev) => [...prev, trimmed])
  }

  function removeTag(tag) {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  function handleNewTagKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(newTagInput)
      setNewTagInput('')
    }
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
      tags,
      subtasks: subtasks.map((s) => ({ id: s.id, title: s.title, done: s.done })),
    })
    if (!isEdit) {
      setTitle('')
      setDetails('')
      setEndDate('')
      setTaskPriority(5)
      setTags([])
      setNewTagInput('')
      setSubtasks([])
    }
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

      <div className="tag-editor">
        {tags.length > 0 && (
          <div className="selected-tags">
            {tags.map((tag) => (
              <span className="tag-chip removable" key={tag}>
                {tag}
                <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`}>×</button>
              </span>
            ))}
          </div>
        )}
        {allTags.filter((t) => !tags.includes(t)).length > 0 && (
          <div className="existing-tags">
            <span className="existing-tags-label">Existing tags:</span>
            {allTags.filter((t) => !tags.includes(t)).map((tag) => (
              <button type="button" className="tag-chip pick" key={tag} onClick={() => addTag(tag)}>
                + {tag}
              </button>
            ))}
          </div>
        )}
        <input
          type="text"
          placeholder="New tag — press Enter"
          value={newTagInput}
          onChange={(e) => setNewTagInput(e.target.value)}
          onKeyDown={handleNewTagKeyDown}
          onBlur={() => { addTag(newTagInput); setNewTagInput('') }}
        />
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
      <div className="task-form-actions">
        <button type="submit" className="primary">{isEdit ? 'Save changes' : 'Add task'}</button>
        {isEdit && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}
