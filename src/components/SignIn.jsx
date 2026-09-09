import { useAuth } from '../context/AuthContext'

export default function SignIn() {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="signin-screen">
      <h1>Deadlift</h1>
      <p>Tasks ranked by priority and how close the deadline is.</p>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  )
}
