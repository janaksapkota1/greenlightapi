import { apiFetch } from './client'
import type { Movie, MovieInput } from './types'

export interface MovieListParams {
  title?: string
  genres?: string[]
  page?: number
  page_size?: number
  sort?: string
}

export function listMovies(params: MovieListParams, token: string | null) {
  const qs = new URLSearchParams()
  if (params.title) qs.set('title', params.title)
  if (params.genres && params.genres.length > 0) qs.set('genres', params.genres.join(','))
  if (params.page) qs.set('page', String(params.page))
  if (params.page_size) qs.set('page_size', String(params.page_size))
  if (params.sort) qs.set('sort', params.sort)

  const query = qs.toString()
  return apiFetch<{ movies: Movie[] }>(`/movies${query ? `?${query}` : ''}`, { token })
}

export function getMovie(id: number, token: string | null) {
  return apiFetch<{ movie: Movie }>(`/movies/${id}`, { token })
}

export function createMovie(input: MovieInput, token: string | null) {
  return apiFetch<{ movie: Movie }>('/movies', { method: 'POST', body: input, token })
}

export function updateMovie(id: number, input: Partial<MovieInput>, token: string | null) {
  return apiFetch<{ movie: Movie }>(`/movies/${id}`, { method: 'PATCH', body: input, token })
}

export function deleteMovie(id: number, token: string | null) {
  return apiFetch<{ message: string }>(`/movies/${id}`, { method: 'DELETE', token })
}
