export interface Movie {
  id: number
  title: string
  year: number
  runtime: string
  genres: string[]
  version: number
}

export interface MovieInput {
  title: string
  year: number
  runtime: string
  genres: string[]
}

export interface User {
  id: number
  created_at: string
  name: string
  email: string
  activated: boolean
}

export interface AuthToken {
  token: string
  expiry: string
}

export type ValidationErrors = Record<string, string>
