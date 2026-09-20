const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/v1'

export class ApiError extends Error {
  status: number
  fieldErrors?: Record<string, string>

  constructor(status: number, message: string, fieldErrors?: Record<string, string>) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  token?: string | null
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (options.body !== undefined) headers['Content-Type'] = 'application/json'
  if (options.token) headers['Authorization'] = `Bearer ${options.token}`

  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new ApiError(0, `Could not reach the API at ${API_URL}. Is the server running?`)
  }

  const text = await res.text()
  const data = text ? JSON.parse(text) : undefined

  if (!res.ok) {
    const errPayload = data?.error
    if (typeof errPayload === 'string') {
      throw new ApiError(res.status, errPayload)
    }
    if (errPayload && typeof errPayload === 'object') {
      const firstMessage = Object.values(errPayload)[0]
      throw new ApiError(
        res.status,
        typeof firstMessage === 'string' ? firstMessage : 'Validation failed',
        errPayload as Record<string, string>,
      )
    }
    throw new ApiError(res.status, `Request failed with status ${res.status}`)
  }

  return data as T
}
