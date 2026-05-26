# Auth App

> Developed by Rahul

## Author

Rahul

## Runtime Versions

* Java 17
* Spring Boot 3.5.7
* MySQL 8.x-compatible local database

## Overview

This is a full-stack authentication app built with a React + Vite frontend and a Spring Boot backend. It supports email/password registration and login, Google and GitHub OAuth2 login, JWT-based sessions, refresh-token rotation, and a protected dashboard with a profile section.

The project is split into two apps:

* [auth-backend](auth-backend)
* [auth-front](auth-front)

## Actual Project Flow

```mermaid
flowchart TB
  subgraph Public[Public Area]
    H[Home /]
    S[Signup /signup]
    L[Login /login]
    A[About /about]
    V[Services /services]
  end

  subgraph Frontend[React Frontend]
    N[Navbar with auth-aware links]
    ST[Zustand auth store<br/>persisted as app_state]
    AX[Axios client with request + response interceptors]
    O1[OAuth success /oauth/success]
    O2[OAuth failure /oauth/failure]
  end

  subgraph Backend[Spring Boot Backend]
    R1[POST /api/v1/auth/register]
    R2[POST /api/v1/auth/login]
    R3[POST /api/v1/auth/refresh]
    R4[POST /api/v1/auth/logout]
    U1[GET /api/v1/users/email/{email}]
    U2[User + refresh-token persistence]
    J1[JWT access token]
    J2[Refresh cookie]
  end

  subgraph Protected[Protected Area]
    D[Dashboard /dashboard]
    P[Profile /dashboard/profile]
  end

  H --> N
  S --> R1
  L --> R2
  L --> O1
  L --> O2
  R1 --> U2
  R2 --> J1
  R2 --> J2
  R3 --> J1
  R3 --> J2
  R4 --> J2
  J1 --> ST
  J2 --> AX
  ST --> AX
  AX --> D
  D --> P
  AX --> R3
  U1 --> P
  N --> D
```

## Frontend Routes

| Route | Screen | Notes |
| --- | --- | --- |
| `/` | Home | Public landing page |
| `/login` | Login | Email/password + OAuth buttons |
| `/signup` | Signup | User registration |
| `/about` | About | Public info page |
| `/services` | Services | Public info page |
| `/dashboard` | Dashboard | Protected overview |
| `/dashboard/profile` | Profile | Protected profile section |
| `/oauth/success` | OAuth success | OAuth callback success screen |
| `/oauth/failure` | OAuth failure | OAuth callback failure screen |

## Profile Section

The profile page is the main user settings area. It currently includes:

* Avatar display
* Editable profile UI state
* Full name field
* Email field
* Provider field
* Enabled status field
* Change password action
* Delete account action

The page is wired to the auth store, so it reads the current logged-in user directly from Zustand.

## Local Setup

### Backend

```bash
cd auth-backend
./mvnw spring-boot:run
```

On Windows:

```bash
cd auth-backend
mvnw.cmd spring-boot:run
```

The backend runs on port `8083` by default.

### Frontend

```bash
cd auth-front
npm install
npm run dev
```

The frontend runs on port `5173` by default.

## Notes

* The auth state is stored with Zustand persistence using the key `app_state`.
* Refresh tokens are rotated on refresh.
* The profile page currently focuses on display and UI actions, not a completed save API.
* The home page is implemented in `auth-front/src/components/home/FuturisticAuthHome.tsx`.

## Recent Changes (2026-05-26)

- Added a new backend endpoint `GET /api/v1/users/{userId}/stats` which returns JSON: `{ "totalLogins": number, "securityScore": number, "activeSessions": number }`.
- Frontend now fetches the stats and renders them on the dashboard; see `auth-front/src/pages/users/Userhome.tsx` and `auth-front/src/services/AuthService.ts`.
- Backend implements `UserStats` DTO and counts refresh-token records to compute `totalLogins` and `activeSessions`; also adds a simple heuristic for `securityScore`.
- Security config updated so authenticated users can fetch their own `/users/{id}/stats` endpoint; admin-restricted routes remain protected.

Build note: Backend compiled successfully after these changes.
