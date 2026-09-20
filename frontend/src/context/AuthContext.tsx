import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface StoredAuth {
  token: string
  email: string
  expiry: string
}

interface AuthContextValue {
  token: string | null
  email: string | null
  expiry: string | null
  isAuthenticated: boolean
  login: (auth: StoredAuth) => void
  logout: () => void
}

const STORAGE_KEY = 'greenlight.auth'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredAuth
    if (new Date(parsed.expiry).getTime() <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => readStoredAuth())

  useEffect(() => {
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [auth])

  const value = useMemo<AuthContextValue>(
    () => ({
      token: auth?.token ?? null,
      email: auth?.email ?? null,
      expiry: auth?.expiry ?? null,
      isAuthenticated: auth !== null,
      login: (next) => setAuth(next),
      logout: () => setAuth(null),
    }),
    [auth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
