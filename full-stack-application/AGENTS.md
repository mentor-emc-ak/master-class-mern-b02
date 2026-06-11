# AGENTS.md

## Project Overview
A Trello-like internal task manager built with the MERN stack (MongoDB, Express, React, Node.js) with Firebase Authentication. Designed for internal employee use with role-based access control.

## Tech Stack
- **Frontend:** React (Vite), deployed on Vercel
- **Backend:** Node.js + Express, deployed on Vercel Serverless Functions
- **Database:** MongoDB Atlas
- **Auth:** Firebase Authentication

## Repository Structure
```
full-stack-application/
├── client/          # React frontend
├── server/          # Express backend
└── docs/            # Project documentation
```

## Agent Guidelines

### General
- Follow RESTful conventions for all API endpoints.
- Use async/await throughout; no raw Promise chains.
- All routes require Firebase ID token verification via middleware unless explicitly public.
- MongoDB documents use camelCase field names.
- Return consistent JSON shapes: `{ success, data, message }`.

### Frontend
- Use React functional components with hooks only.
- State management: React Context for auth; local state or React Query for data fetching.
- Tailwind CSS for styling.
- All API calls go through a centralized `api/` service layer, never inline `fetch`/`axios` in components.

### Backend
- Validate all request bodies before processing (use express-validator or zod).
- Never expose raw MongoDB `_id` without also mapping to `id` in responses.
- Role checks happen in middleware, not inside controller logic.
- No business logic in route files — use controller + service pattern.

### Roles
- `admin` — full CRUD on all boards, lists, tasks, and users.
- `member` — CRUD on tasks they are assigned to or created; read-only on other boards they are invited to.
- `viewer` — read-only access to boards they are explicitly added to.

### Testing
- Backend: Jest + Supertest.
- Frontend: Vitest + React Testing Library.
- Write tests for all controllers and critical React components.

### Do Not
- Store Firebase tokens in localStorage; use httpOnly cookies or memory.
- Commit `.env` files.
- Use `var`; use `const`/`let` only.
- Write mongoose queries directly in route handlers.
