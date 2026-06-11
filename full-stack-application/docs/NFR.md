# Non-Functional Requirements (NFR)

## Performance
- **API response time:** p95 < 500ms for all read endpoints under normal load.
- **Page load:** Lighthouse Performance score ≥ 80 on desktop.
- **Board render:** A board with 10 lists × 20 cards must render without perceptible lag (<200ms to interactive).
- **MongoDB queries:** All frequently used queries must be covered by indexes (see `DATABASE_SCHEMA.md`). No collection scans on hot paths.

## Scalability
- The application must support up to **500 concurrent internal users** without degradation.
- MongoDB Atlas auto-scaling handles storage growth; no manual sharding required for v1.
- Vercel Serverless Functions scale horizontally by default.

## Availability
- Target uptime: **99.5%** (leverages Vercel + MongoDB Atlas SLAs).
- No custom HA infrastructure required for v1.

## Security
- See `SECURITY.md` for full details.
- All data in transit over HTTPS (TLS 1.2+).
- Firebase tokens validated on every request.

## Maintainability
- Test coverage: ≥ 70% on backend controllers and services.
- Code must pass ESLint with the project's config before merge.
- All environment-specific config via environment variables — no hardcoded URLs or secrets.

## Usability
- The UI must be accessible: WCAG 2.1 Level AA for core workflows.
- Keyboard navigable: users must be able to create and move cards without a mouse.
- The app must be fully usable on Chrome, Firefox, and Edge (latest 2 versions each).
- Responsive layout down to 1024px width (desktop-first; no mobile breakpoint required for v1).

## Reliability
- Failed API requests (network errors, 5xx) must display a user-friendly error message — no blank screens or raw error objects.
- Optimistic updates on card moves must be rolled back on failure.

## Data Integrity
- Deleting a board cascades and deletes its lists, cards, comments, and labels.
- Deleting a list cascades and deletes its cards and their comments.
- Card position indexes must stay consistent after reorder operations (atomic bulk updates).

## Build & Deploy
- CI pipeline must run lint + tests on every PR before merge.
- Zero-downtime deploys via Vercel's atomic deployment model.
- Frontend bundle size: < 500 KB gzipped for the initial chunk.
