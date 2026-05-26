# auth-backend

## What this backend is

This backend is the authentication and user-management service for the React frontend. It is responsible for:

* registering users with email and password
* logging users in with JWT access tokens and refresh tokens
* handling Google and GitHub OAuth2 sign-in
* storing refresh tokens and rotating them when they are refreshed
* protecting user and admin APIs with Spring Security
* exposing the current user data used by the dashboard and profile screen

## How it works

### 1. Security layer

Spring Security is configured in [SecurityConfig.java](src/main/java/com/substring/auth/app/auth/config/SecurityConfig.java) to run in stateless mode. That means the backend does not keep a server session for login state.

The security filter chain:

* permits public auth routes under `/api/v1/auth/**`
* protects user routes under `/api/v1/users/**`
* adds the JWT filter before `UsernamePasswordAuthenticationFilter`
* enables OAuth2 login with a success handler
* returns JSON errors for `401` and `403` responses

### 2. JWT access token flow

When the user logs in with email and password, [AuthController.java](src/main/java/com/substring/auth/app/auth/controllers/AuthController.java) does the following:

* authenticates the credentials with `AuthenticationManager`
* loads the user record from the database
* creates a refresh-token record in the database
* generates a short-lived JWT access token
* generates a refresh token tied to the saved refresh-token row
* sends the refresh token as an HTTP-only cookie

The JWT itself is built in [JwtService.java](src/main/java/com/substring/auth/app/auth/services/impl/JwtService.java). It stores:

* the user ID as the subject
* the user email
* the user roles
* a token type flag such as `access` or `refresh`

### 3. Request authentication

Incoming requests are checked by [JwtAuthenticationFilter.java](src/main/java/com/substring/auth/app/auth/config/JwtAuthenticationFilter.java).

The filter:

* reads the `Authorization: Bearer ...` header
* ignores non-access tokens
* validates the signed JWT
* loads the user from the database
* places the authenticated user into the Spring Security context

That is why the backend can protect endpoints without keeping a session.

### 4. Refresh-token rotation

When the access token expires, the frontend calls `POST /api/v1/auth/refresh`.

The refresh endpoint:

* reads the refresh token from the cookie, body, or header
* validates the token type and database record
* checks whether the token has been revoked or expired
* revokes the old refresh-token record
* saves a new refresh-token record
* issues a new access token and refresh token
* sets the new refresh cookie on the response

This gives the app a rotating-token flow instead of reusing the same refresh token forever.

### 5. OAuth2 login

Google and GitHub sign-in are handled by Spring Security OAuth2.

When OAuth2 login succeeds, [OAuth2SuccessHandler.java](src/main/java/com/substring/auth/app/auth/config/OAuth2SuccessHandler.java):

* reads the provider identity data
* maps the provider response into a local `User`
* creates the user if it does not already exist
* creates and stores a refresh-token row
* generates new JWT tokens
* writes the refresh cookie
* redirects the browser to the frontend success page

The frontend then exchanges that success state for its normal app session and redirects the user into the dashboard.

## Local runtime

* Profile: `dev`
* Server port: `8083`
* Database schema: `auth_app_db`
* MySQL URL: `jdbc:mysql://localhost:3307/auth_app_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC`

## IntelliJ environment variables

```text
SPRING_PROFILES_ACTIVE=dev
DB_URL=jdbc:mysql://localhost:3307/auth_app_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=root
```

## Main API endpoints

| Method | Endpoint | What it does |
| --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Login with email/password |
| `POST` | `/api/v1/auth/refresh` | Rotate the refresh token and issue a new access token |
| `POST` | `/api/v1/auth/logout` | Revoke the refresh token and clear the cookie |
| `GET` | `/api/v1/users/email/{email}` | Fetch the signed-in user profile |
| `GET` | `/api/v1/users` | List all users |
| `PUT` | `/api/v1/users/{userId}` | Update a user |
| `DELETE` | `/api/v1/users/{userId}` | Delete a user |

### New endpoint (2026-05-26)

| `GET` | `/api/v1/users/{userId}/stats` | Returns a small dashboard payload for the user: `totalLogins`, `securityScore`, `activeSessions`. Authenticated users may fetch their own stats; admins retain full access. |

Notes:

- `totalLogins` is computed from the count of refresh-token records for the user.
- `activeSessions` is the count of non-revoked refresh tokens that haven't expired.
- `securityScore` is a simple heuristic value currently computed server-side.

## Google OAuth callback

```text
http://localhost:8083/login/oauth2/code/google
```

## Files that matter most

* [SecurityConfig.java](src/main/java/com/substring/auth/app/auth/config/SecurityConfig.java) - security rules, CORS, JWT filter registration
* [JwtAuthenticationFilter.java](src/main/java/com/substring/auth/app/auth/config/JwtAuthenticationFilter.java) - validates access tokens on every request
* [OAuth2SuccessHandler.java](src/main/java/com/substring/auth/app/auth/config/OAuth2SuccessHandler.java) - handles Google/GitHub login success
* [AuthController.java](src/main/java/com/substring/auth/app/auth/controllers/AuthController.java) - login, refresh, register, logout
* [JwtService.java](src/main/java/com/substring/auth/app/auth/services/impl/JwtService.java) - creates and validates JWTs
* [CookieService.java](src/main/java/com/substring/auth/app/auth/services/impl/CookieService.java) - writes and clears the refresh cookie

## Why the backend is structured this way

This design keeps the frontend simple and the backend secure:

* the frontend only needs to store the access token and user info
* refresh tokens stay in secure cookies instead of local storage
* JWTs make the API stateless and fast
* OAuth2 and password login both end up in the same user model
* the dashboard and profile pages can reuse the same user payload

