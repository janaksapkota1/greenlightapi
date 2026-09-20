# Greenlight frontend

A React + TypeScript (Vite) frontend for the Greenlight movies API.

## Features

- Browse, search, filter (by title/genres) and sort movies
- View movie details
- Sign up, activate account, log in (bearer token stored in `localStorage`)
- Create, edit and delete movies (requires the `movies:write` permission on your account)

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # adjust VITE_API_URL if the API isn't on localhost:4000
npm run dev
```

The app runs at http://localhost:5173 by default.

## Connecting to the API

The API must allow the frontend's origin via CORS. Run the API with the dev origin trusted:

```bash
go run ./cmd/api -cors-trusted-origins="http://localhost:5173"
```

By default, newly registered users only get the `movies:read` permission
(granted automatically on signup). To create/edit/delete movies from the UI,
grant your user the `movies:write` permission directly in the database:

```sql
INSERT INTO users_permissions (user_id, permission_id)
SELECT u.id, p.id FROM users u, permissions p
WHERE u.email = 'you@example.com' AND p.code = 'movies:write';
```

## Build

```bash
npm run build
```

Outputs a static bundle to `dist/`, which can be served by any static file host.
