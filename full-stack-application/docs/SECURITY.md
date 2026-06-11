# Security

## Authentication
- All authentication is handled by **Firebase Authentication**.
- Clients receive a short-lived Firebase ID token (JWT, 1-hour TTL) after login.
- The token is stored **in memory only** (React state / React Query cache) — never in `localStorage` or `sessionStorage` to prevent XSS token theft.
- Every API request attaches the token as `Authorization: Bearer <token>`.
- The backend verifies the token on every request using `firebase-admin` SDK (`verifyIdToken`). Expired or invalid tokens return `401`.

## Authorization
- Role-based access control (RBAC) is enforced at the **middleware layer**, not in controllers.
- Roles are board-scoped: a user can be `admin` on Board A and `viewer` on Board B.
- Role hierarchy: `admin > member > viewer`.
- All mutating endpoints (POST/PATCH/DELETE) check that the caller has at least `member` role on the relevant board, except admin-only actions which require `admin`.
- Board membership is checked on every board-scoped request — direct access to a board by ID without membership returns `403`.

## Input Validation
- All request bodies are validated with **zod** schemas before reaching controllers.
- Validation errors return `400` with a structured error list.
- MongoDB queries use Mongoose typed schemas — raw user strings are never interpolated into queries.

## CORS
- The Express server restricts `Access-Control-Allow-Origin` to `CLIENT_ORIGIN` env var only (the Vercel frontend URL).
- Credentials are not used (token is in `Authorization` header, not cookies).

## Rate Limiting
- Vercel Serverless Functions apply request-level limits per deployment.
- For v1, no custom rate limiter is added; revisit if abuse patterns emerge.

## Data Exposure
- MongoDB `_id` is always mapped to `id` in responses; internal fields (`__v`) are stripped.
- User documents never expose the Firebase `uid` in list responses — only in the authenticated user's own `/me` endpoint.
- Passwords are never stored — Firebase handles credentials.

## Dependencies
- `npm audit` must pass with no high/critical vulnerabilities before merging to main.
- Dependabot or Renovate should be enabled on the repository.

## Secrets Management
- All secrets (MongoDB URI, Firebase service account) are stored as **Vercel Environment Variables** — never committed to the repo.
- `.env` files are in `.gitignore`.
- Firebase service account key is stored as individual env vars (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`), not as a JSON file.

## Transport Security
- All traffic is HTTPS via Vercel's TLS termination.
- HTTP requests are redirected to HTTPS automatically by Vercel.
