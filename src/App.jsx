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
        <h1>Deadlift</h1>
        <div className="user-info">
          <span>{user.displayName}</span>
          <button onClick={signOut}>Sign out</button>
        </div>
      </header>
      <main>
        <TaskForm onSubmit={(data) => addTask(user.uid, data)} allTags={allTags} />
        <TaskFilters
          allTags={allTags}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
        />
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
      </main>
    </div>
  )
}

export default App
