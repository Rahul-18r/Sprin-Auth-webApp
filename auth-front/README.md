# auth-front — React + TypeScript + Vite

Lightweight frontend for the Auth App built with React 19, TypeScript, Vite and Tailwind.

## Quick Start

```bash
cd auth-front
npm install
npm run dev
```

Dev server runs at `http://localhost:5173` by default.

## What this frontend does

- Provides login and signup screens (email/password)
- OAuth2 buttons (Google / GitHub) that redirect to backend OAuth flow
- Stores access token in-memory and user info in a Zustand store
- Calls backend APIs via `src/config/apiClient.ts` which handles token refresh
- Displays a protected Dashboard and Profile pages after authentication

## Dashboard: dynamic stats

The dashboard fetches user stats from the backend endpoint:

```
GET /api/v1/users/{userId}/stats
```

The frontend wrapper `src/services/AuthService.ts` exposes `getUserStats` used by `src/pages/users/Userhome.tsx`.

If you see `403 Forbidden` when loading the dashboard, ensure that:

1. Backend is running on `http://localhost:8083`.
2. The user is signed in and the access token is available (check DevTools → Application / Local Storage and the network Authorization header).

## Useful commands

- `npm run dev` — start dev server
- `npm run build` — production build

---

If you'd like, I can add a short demo GIF, deployment notes, or a sample `.env.example` for both apps.
