import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createMovie } from '../api/movies'
import { ApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { ErrorMessage } from '../components/ErrorMessage'

export function MovieCreatePage() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ title: '', year: '', runtime: '', genres: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await createMovie(
        {
          title: form.title,
          year: Number(form.year),
          runtime: `${form.runtime} mins`,
          genres: form.genres.split(',').map((g) => g.trim()).filter(Boolean),
        },
        token,
      )
      navigate(`/movies/${res.movie.id}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create movie')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <h1>Add a movie</h1>
      <form className="movie-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </label>
        <label>
          Year
          <input
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            required
          />
        </label>
        <label>
          Runtime (minutes)
          <input
            type="number"
            value={form.runtime}
            onChange={(e) => setForm({ ...form, runtime: e.target.value })}
            required
          />
        </label>
        <label>
          Genres (comma separated)
          <input
            value={form.genres}
            onChange={(e) => setForm({ ...form, genres: e.target.value })}
            placeholder="drama, comedy"
            required
          />
        </label>
        <ErrorMessage message={error} />
        <div className="form-actions">
          <button type="submit" disabled={saving}>
            {saving ? 'Creating…' : 'Create movie'}
          </button>
        </div>
      </form>
    </div>
  )
}
