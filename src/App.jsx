import { useEffect, useState } from 'react'
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
import TaskList from './components/TaskList'
import './App.css'

function App() {
  const { user, loading, signOut } = useAuth()
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (!user) return
    return subscribeToTasks(user.uid, setTasks)
  }, [user])

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
        <TaskForm onSubmit={(data) => addTask(user.uid, data)} />
        <TaskList
          tasks={tasks}
          uid={user.uid}
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
