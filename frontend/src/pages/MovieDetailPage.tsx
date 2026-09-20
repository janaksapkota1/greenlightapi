import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteMovie, getMovie, updateMovie } from '../api/movies'
import { ApiError } from '../api/client'
import type { Movie } from '../api/types'
import { useAuth } from '../context/AuthContext'
import { ErrorMessage } from '../components/ErrorMessage'

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>()
  const movieId = Number(id)
  const { token, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: '', year: '', runtime: '', genres: '' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getMovie(movieId, token)
      .then((res) => {
        if (cancelled) return
        setMovie(res.movie)
        setForm({
          title: res.movie.title,
          year: String(res.movie.year),
          runtime: res.movie.runtime.replace(' mins', ''),
          genres: res.movie.genres.join(', '),
        })
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load movie')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [movieId, token])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    try {
      const res = await updateMovie(
        movieId,
        {
          title: form.title,
          year: Number(form.year),
          runtime: `${form.runtime} mins`,
          genres: form.genres.split(',').map((g) => g.trim()).filter(Boolean),
        },
        token,
      )
      setMovie(res.movie)
      setEditing(false)
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : 'Failed to save movie')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this movie? This cannot be undone.')) return
    setDeleting(true)
    setError(null)
    try {
      await deleteMovie(movieId, token)
      navigate('/')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete movie')
      setDeleting(false)
    }
  }

  if (loading) return <p className="page">Loading…</p>
  if (error) return <div className="page"><ErrorMessage message={error} /></div>
  if (!movie) return null

  return (
    <div className="page">
      <Link to="/">&larr; Back to movies</Link>

      {editing ? (
        <form className="movie-form" onSubmit={handleSave}>
          <h1>Edit movie</h1>
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
            <input value={form.genres} onChange={(e) => setForm({ ...form, genres: e.target.value })} required />
          </label>
          <ErrorMessage message={saveError} />
          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h1>{movie.title}</h1>
          <p>Year: {movie.year}</p>
          <p>Runtime: {movie.runtime}</p>
          <p>Genres: {movie.genres.join(', ')}</p>

          {isAuthenticated && (
            <div className="form-actions">
              <button type="button" onClick={() => setEditing(true)}>
                Edit
              </button>
              <button type="button" onClick={handleDelete} disabled={deleting} className="danger">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
