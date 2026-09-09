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
import SignIn from './components/SignIn'
import TaskForm from './components/TaskForm'
import TaskFilters from './components/TaskFilters'
import TaskList from './components/TaskList'
import './App.css'

function App() {
  const { user, loading, signOut } = useAuth()
  const [tasks, setTasks] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])

  useEffect(() => {
    if (!user) return
    return subscribeToTasks(user.uid, setTasks)
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
  if (!user) return <SignIn />

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="12" width="24" height="4" rx="1.5" stroke="var(--accent)" strokeWidth="2" />
            <rect x="5" y="7" width="4" height="14" rx="1" fill="var(--accent)" />
            <rect x="19" y="7" width="4" height="14" rx="1" fill="var(--accent)" />
            <rect x="1" y="9" width="2.5" height="10" rx="1" fill="var(--accent)" />
            <rect x="24.5" y="9" width="2.5" height="10" rx="1" fill="var(--accent)" />
          </svg>
          <h1>Deadlift</h1>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className={`icon-btn${searchOpen ? ' active' : ''}`}
            onClick={() => setSearchOpen((v) => !v)}
            aria-pressed={searchOpen}
            title="Search & filter"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {searchOpen && (
        <TaskFilters
          allTags={allTags}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
        />
      )}

      <TaskForm onSubmit={(data) => addTask(user.uid, data)} allTags={allTags} />

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
  )
}

export default App
