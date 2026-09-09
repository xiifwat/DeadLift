import { useAuth } from './context/AuthContext'
import SignIn from './components/SignIn'
import './App.css'

function App() {
  const { user, loading, signOut } = useAuth()

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
        <p>Task list goes here — next: US-2.1 (add task).</p>
      </main>
    </div>
  )
}

export default App
