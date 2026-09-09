import { useEffect, useMemo, useState } from 'react'
import { useAuth } from './context/AuthContext'
import {
  subscribeToTasks,
  addTask,
  editTask,
  toggleSubtask,
  reorderSubtasks,
  toggleTaskCompleted,
  togglePin,
} from './lib/tasks'
import { seedWorkTasks } from './lib/bulkImport'
import { useTheme } from './hooks/useTheme'
import SignIn from './components/SignIn'
import TaskForm from './components/TaskForm'
import TaskFilters from './components/TaskFilters'
import TaskList from './components/TaskList'
import ThemeToggle from './components/ThemeToggle'
import './App.css'

function App() {
  const { user, loading, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [tasks, setTasks] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    return subscribeToTasks(user.uid, setTasks)
  }, [user])

  // TEMPORARY: one-time bulk import, run manually from the browser console.
  useEffect(() => {
    if (!user) return
    window.seedWorkTasks = () => seedWorkTasks(user.uid)
    return () => { delete window.seedWorkTasks }
  }, [user])

  const allTags = useMemo(() => {
    const set = new Set()
    for (const t of tasks) {
      if (t.deletedAt) continue
      for (const tag of t.tags || []) set.add(tag)
    }
    return [...set].sort()
  }, [tasks])

  function toggleTag(tag) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  if (loading) return null
  if (!user) return <SignIn theme={theme} onToggleTheme={toggleTheme} />

  return (
    <div className="app">
      <div className="app-panel">
        <div className="panel-section app-header">
          <div className="brand">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="12.5" width="24" height="3" rx="1.5" fill="var(--accent)" />
              <rect x="5.5" y="8" width="3.5" height="12" rx="1" fill="var(--accent)" />
              <rect x="19" y="8" width="3.5" height="12" rx="1" fill="var(--accent)" />
            </svg>
            <h1>Deadlift</h1>
          </div>
          <div className="header-actions">
            {searchOpen ? (
              <div className="task-filters">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search tasks"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onBlur={() => { if (!searchQuery) setSearchOpen(false) }}
                />
              </div>
            ) : (
              <button
                type="button"
                className="icon-btn"
                onClick={() => setSearchOpen(true)}
                title="Search"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            )}

            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            <div className="header-divider" />
            <div className="avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />
              ) : (
                (user.displayName || user.email || '?').slice(0, 2).toUpperCase()
              )}
            </div>
            <span className="user-name">{user.displayName}</span>
            <button type="button" className="icon-btn" onClick={signOut} title="Sign out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="panel-section">
          <TaskFilters
            allTags={allTags}
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
            onClearTags={() => setSelectedTags([])}
          />
        </div>

        <div className="panel-section">
          {addOpen ? (
            <TaskForm
              allTags={allTags}
              onCancel={() => setAddOpen(false)}
              onSubmit={async (data) => {
                await addTask(user.uid, data)
                setAddOpen(false)
              }}
            />
          ) : (
            <div className="task-form trigger" onClick={() => setAddOpen(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add a task</span>
            </div>
          )}
        </div>

        <div className="panel-section tasklist-wrap">
          <TaskList
            tasks={tasks}
            uid={user.uid}
            allTags={allTags}
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            onEdit={(taskId, data) => editTask(user.uid, taskId, data)}
            onToggleSubtask={(task, subtaskId) => toggleSubtask(user.uid, task, subtaskId)}
            onReorderSubtasks={(taskId, subtasks) => reorderSubtasks(user.uid, taskId, subtasks)}
            onToggleCompleted={(task) => toggleTaskCompleted(user.uid, task)}
            onTogglePin={(task) => togglePin(user.uid, task)}
          />
        </div>
      </div>
    </div>
  )
}

export default App
