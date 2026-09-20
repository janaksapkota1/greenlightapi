import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { activateUser } from '../api/auth'
import { ApiError } from '../api/client'
import { ErrorMessage } from '../components/ErrorMessage'

export function ActivatePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [token, setToken] = useState(searchParams.get('token') ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await activateUser(token)
      setDone(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to activate account')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="page narrow">
        <h1>Account activated</h1>
        <p>Your account is now active. You can log in.</p>
        <button type="button" onClick={() => navigate('/login')}>
          Go to login
        </button>
      </div>
    )
  }

  return (
    <div className="page narrow">
      <h1>Activate your account</h1>
      <p>Paste the activation token from your welcome email below.</p>
      <form className="movie-form" onSubmit={handleSubmit}>
        <label>
          Activation token
          <input value={token} onChange={(e) => setToken(e.target.value)} required />
        </label>
        <ErrorMessage message={error} />
        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Activating…' : 'Activate'}
          </button>
        </div>
      </form>
      <p>
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  )
}
