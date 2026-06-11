# Product Requirements Document (PRD)

## 1. Product Summary
An internal Trello-like task management application for employees to organize work using boards, lists, and cards. Teams can collaborate, assign tasks, set due dates, and track progress across projects.

## 2. Goals
- Replace ad-hoc task tracking (email, spreadsheets) with a unified tool.
- Give managers visibility into team workloads and project status.
- Enable employees to self-organize and track their own tasks.

## 3. Non-Goals (v1)
- No file/attachment uploads.
- No real-time collaboration (no live cursors or sockets).
- No external integrations (Slack, calendar, etc.).
- No mobile native app.

## 4. Users
| Persona | Description |
|---|---|
| Admin | Creates and manages boards, manages users and roles |
| Member | Creates and manages tasks on boards they belong to |
| Viewer | Read-only access to specific boards |

## 5. Core Features

### 5.1 Authentication
- Sign in / sign up via Firebase Auth (email + password).
- Password reset via Firebase.
- Session persisted via Firebase ID tokens.

### 5.2 Boards
- Create, rename, delete boards.
- Boards are private by default; admin invites members.
- Board has a title, description, and background color.

### 5.3 Lists
- Each board contains ordered lists (columns).
- Create, rename, reorder, and delete lists.
- Lists have a title and position index.

### 5.4 Cards (Tasks)
- Cards live inside lists.
- Each card has: title, description, assignee(s), due date, priority (Low / Medium / High), labels, and status (derived from list position).
- Cards can be moved between lists (drag-and-drop or move menu).
- Cards can be reordered within a list.

### 5.5 Comments
- Members can comment on cards.
- Comments show author name and timestamp.
- Author can edit or delete their own comments.

### 5.6 Labels
- Color-coded labels that can be attached to cards.
- Labels are board-scoped (defined per board, reused across its cards).

### 5.7 User Management (Admin only)
- Invite users to boards by email.
- Assign or change roles (member / viewer).
- Remove users from a board.

### 5.8 Dashboard / My Tasks
- A personal view showing all cards assigned to the logged-in user across boards.
- Filterable by due date, priority, and board.

## 6. Out of Scope for v1
- Subtasks / checklists
- Attachments
- Activity log / audit trail
- Notifications
- Search
