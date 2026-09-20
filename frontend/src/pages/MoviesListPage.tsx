import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { listMovies } from '../api/movies'
import { ApiError } from '../api/client'
import type { Movie } from '../api/types'
import { useAuth } from '../context/AuthContext'
import { ErrorMessage } from '../components/ErrorMessage'

const PAGE_SIZE = 12

const SORT_OPTIONS = [
  { value: 'id', label: 'Oldest first' },
  { value: '-id', label: 'Newest first' },
  { value: 'title', label: 'Title (A-Z)' },
  { value: '-title', label: 'Title (Z-A)' },
  { value: 'year', label: 'Year (oldest)' },
  { value: '-year', label: 'Year (newest)' },
  { value: 'runtime', label: 'Runtime (shortest)' },
  { value: '-runtime', label: 'Runtime (longest)' },
]

export function MoviesListPage() {
  const { token } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const title = searchParams.get('title') ?? ''
  const genres = searchParams.get('genres') ?? ''
  const sort = searchParams.get('sort') ?? 'id'
  const page = Number(searchParams.get('page') ?? '1')

  const [titleInput, setTitleInput] = useState(title)
  const [genresInput, setGenresInput] = useState(genres)

  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTitleInput(title)
    setGenresInput(genres)
  }, [title, genres])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    listMovies(
      {
        title: title || undefined,
        genres: genres ? genres.split(',').map((g) => g.trim()).filter(Boolean) : undefined,
        sort,
        page,
        page_size: PAGE_SIZE,
      },
      token,
    )
      .then((res) => {
        if (!cancelled) setMovies(res.movies)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load movies')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [title, genres, sort, page, token])

  function applyFilters(e: React.FormEvent) {
    e.preventDefault()
    const next = new URLSearchParams()
    if (titleInput) next.set('title', titleInput)
    if (genresInput) next.set('genres', genresInput)
    if (sort !== 'id') next.set('sort', sort)
    setSearchParams(next)
  }

  function updateSort(value: string) {
    const next = new URLSearchParams(searchParams)
    if (value === 'id') next.delete('sort')
    else next.set('sort', value)
    next.delete('page')
    setSearchParams(next)
  }

  function goToPage(nextPage: number) {
    const next = new URLSearchParams(searchParams)
    if (nextPage <= 1) next.delete('page')
    else next.set('page', String(nextPage))
    setSearchParams(next)
  }

  return (
    <div className="page">
      <h1>Movies</h1>

      <form className="filters" onSubmit={applyFilters}>
        <input
          type="text"
          placeholder="Search by title"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Genres (comma separated)"
          value={genresInput}
          onChange={(e) => setGenresInput(e.target.value)}
        />
        <select value={sort} onChange={(e) => updateSort(e.target.value)}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button type="submit">Search</button>
      </form>

      <ErrorMessage message={error} />

      {loading ? (
        <p>Loading…</p>
      ) : movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <ul className="movie-grid">
          {movies.map((movie) => (
            <li key={movie.id} className="movie-card">
              <Link to={`/movies/${movie.id}`}>
                <h3>{movie.title}</h3>
                <p>{movie.year}</p>
                <p>{movie.runtime}</p>
                <p className="genres">{movie.genres.join(', ')}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination">
        <button type="button" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
          Previous
        </button>
        <span>Page {page}</span>
        <button type="button" disabled={movies.length < PAGE_SIZE} onClick={() => goToPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  )
}
