import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/auth'
import { ApiError } from '../api/client'
import { ErrorMessage } from '../components/ErrorMessage'

export function RegisterPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await registerUser({ name, email, password })
      setDone(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to register')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="page narrow">
        <h1>Check your email</h1>
        <p>
          We sent an activation link to <strong>{email}</strong>. Enter the activation token on the{' '}
          <Link to="/activate">activation page</Link> to finish signing up.
        </p>
        <button type="button" onClick={() => navigate('/activate')}>
          Go to activation
        </button>
      </div>
    )
  }

  return (
    <div className="page narrow">
      <h1>Sign up</h1>
      <form className="movie-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>
        <ErrorMessage message={error} />
        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Signing up…' : 'Sign up'}
          </button>
        </div>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}
