# Architecture Decision Records (ADR)

---

## ADR-001: Firebase Authentication over custom JWT

**Status:** Accepted

**Context:** The app needs secure user authentication without building token issuance, refresh, and password-reset flows from scratch.

**Decision:** Use Firebase Authentication for all identity operations. The backend only verifies Firebase ID tokens using `firebase-admin`; it never issues tokens.

**Consequences:**
- No custom auth code to maintain.
- Password reset and email verification are handled by Firebase out of the box.
- The app is coupled to Firebase; migrating off requires replacing the auth layer.

---

## ADR-002: MongoDB Atlas over a relational database

**Status:** Accepted

**Context:** Tasks, lists, and boards are hierarchical and evolve quickly. The data model is document-friendly.

**Decision:** Use MongoDB Atlas as the primary datastore with Mongoose as the ODM.

**Consequences:**
- Flexible schema evolution without migrations for most changes.
- Denormalizing `boardId` onto cards avoids costly joins for "my tasks" queries.
- Transactions (multi-document atomicity) must be used carefully; for v1 most writes are single-document.

---

## ADR-003: Position-index ordering over linked lists

**Status:** Accepted

**Context:** Lists and cards need a user-defined order that survives reorders.

**Decision:** Each list has a `position` number; each card has a `position` number within its list. Reorder endpoints accept an `orderedIds` array and bulk-update positions.

**Consequences:**
- Simple to query (sort by `position`).
- Reorder requires updating N documents atomically; acceptable for expected list/card counts.
- No fractional indexing (e.g., LexoRank) for v1 — positions are integers reassigned on each reorder.

---

## ADR-004: Board-scoped roles over global roles

**Status:** Accepted

**Context:** Employees need different access levels on different boards (e.g., admin on their own project, viewer on another team's board).

**Decision:** Roles (`admin`, `member`, `viewer`) are stored per-user per-board in `boards.members[]`, not as a global user attribute.

**Consequences:**
- Fine-grained access control per board.
- Role checks require looking up `boards.members` on every request — offset by indexing `members.user`.

---

## ADR-005: Vercel for both frontend and backend deployment

**Status:** Accepted

**Context:** The team wants a single deployment target to minimize DevOps overhead.

**Decision:** Deploy the React SPA as a Vercel static site and the Express API as Vercel Serverless Functions under the `api/` directory.

**Consequences:**
- Single `vercel.json` config for the whole stack.
- Serverless cold starts may add latency on the first request after idle periods.
- Persistent WebSocket connections are not supported — acceptable since real-time is out of scope for v1.

---

## ADR-006: React Query for server state, Context for auth state

**Status:** Accepted

**Context:** The app needs caching, background refetching, and loading/error states for API data without a heavyweight state manager.

**Decision:** Use TanStack React Query for all server data. Use React Context only for the authenticated user object from Firebase.

**Consequences:**
- No Redux or Zustand required for v1.
- React Query handles cache invalidation after mutations automatically when configured correctly.

---

## ADR-007: No real-time for v1

**Status:** Accepted

**Context:** Real-time collaboration (live card moves, presence) was evaluated.

**Decision:** Defer real-time features to a future version. All board data is fetched on page load and after mutations.

**Consequences:**
- Simpler architecture — no WebSocket server, no socket.io.
- Multiple users editing the same board simultaneously may see stale state until they refresh.
- Revisit when Vercel Serverless + Socket.io or a separate WebSocket service is evaluated.
