# Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Vercel                           │
│  ┌──────────────┐          ┌──────────────────────────┐ │
│  │  React SPA   │ ─────►   │  Express (Serverless     │ │
│  │  (Vite)      │  HTTPS   │  Functions / Node server)│ │
│  └──────────────┘          └────────────┬─────────────┘ │
└──────────────────────────────────────────┼──────────────┘
                                           │
                             ┌─────────────▼──────────┐
                             │     MongoDB Atlas       │
                             └────────────────────────┘
                   Auth
┌──────────────┐ ◄────────► ┌────────────────────────┐
│  React SPA   │            │  Firebase Auth          │
└──────────────┘            └────────────────────────┘
```

## Frontend (client/)

| Concern | Choice |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| State (auth) | React Context + Firebase SDK |
| State (server) | React Query (TanStack Query) |
| Styling | Tailwind CSS |
| Drag & Drop | @dnd-kit/core |
| HTTP client | Axios |

### Folder Structure
```
client/
├── public/
├── src/
│   ├── api/           # Axios instances + endpoint functions
│   ├── components/    # Reusable UI components
│   ├── context/       # AuthContext
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Route-level components
│   ├── utils/         # Helpers
│   └── main.jsx
```

## Backend (server/)

| Concern | Choice |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 4 |
| ODM | Mongoose |
| Auth middleware | firebase-admin (token verification) |
| Validation | zod |
| Deployment | Vercel Serverless (api/ directory) |

### Folder Structure
```
server/
├── api/               # Vercel entry point (index.js)
├── src/
│   ├── config/        # DB connection, Firebase admin init
│   ├── controllers/   # Request handlers
│   ├── middleware/     # Auth, role, error handlers
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express routers
│   ├── services/      # Business logic
│   └── app.js
```

## Data Flow — Authenticated Request

1. User logs in via Firebase SDK (client-side).
2. Firebase returns an ID token (JWT).
3. Client stores token in memory; attaches as `Authorization: Bearer <token>` on every request.
4. Express `authMiddleware` calls `firebaseAdmin.auth().verifyIdToken(token)`.
5. Decoded user UID is attached to `req.user`.
6. Role middleware looks up the user's role on the requested board from MongoDB.
7. Controller runs, queries MongoDB via Mongoose, returns JSON.

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel (static) |
| Backend | Vercel Serverless Functions |
| Database | MongoDB Atlas (M0 free tier for dev, M10+ for prod) |
| Auth | Firebase Authentication |

## Environment Variables

### Client
```
VITE_API_BASE_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
```

### Server
```
MONGODB_URI=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
CLIENT_ORIGIN=
```
