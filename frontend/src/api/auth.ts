import { apiFetch } from './client'
import type { AuthToken, User } from './types'

export function registerUser(input: { name: string; email: string; password: string }) {
  return apiFetch<{ user: User }>('/users', { method: 'POST', body: input })
}

export function activateUser(token: string) {
  return apiFetch<{ user: User }>('/users/activated', { method: 'PUT', body: { token } })
}

export function login(email: string, password: string) {
  return apiFetch<{ authentication_token: AuthToken }>('/tokens/authentication', {
    method: 'POST',
    body: { email, password },
  })
}
