# Database Schema

MongoDB Atlas. All collections use Mongoose. Timestamps (`createdAt`, `updatedAt`) are enabled on all schemas.

---

## Collection: `users`

Mirrors Firebase Auth; created/updated on first login via `/api/v1/users/sync`.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `uid` | String | Firebase UID — unique, indexed |
| `name` | String | |
| `email` | String | Unique, indexed |
| `createdAt` | Date | |
| `updatedAt` | Date | |

---

## Collection: `boards`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `title` | String | Required |
| `description` | String | |
| `color` | String | Hex color, default `#0079BF` |
| `owner` | ObjectId ref `users` | Required |
| `members` | Array of `{ user: ObjectId ref users, role: enum['admin','member','viewer'] }` | Indexed on `members.user` |
| `createdAt` | Date | |
| `updatedAt` | Date | |

---

## Collection: `lists`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `title` | String | Required |
| `boardId` | ObjectId ref `boards` | Required, indexed |
| `position` | Number | Required; used for ordering |
| `createdAt` | Date | |
| `updatedAt` | Date | |

Index: `{ boardId: 1, position: 1 }`

---

## Collection: `cards`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `title` | String | Required |
| `description` | String | |
| `listId` | ObjectId ref `lists` | Required, indexed |
| `boardId` | ObjectId ref `boards` | Denormalized for efficient "my tasks" queries; indexed |
| `assignees` | Array of ObjectId ref `users` | Indexed |
| `labels` | Array of ObjectId ref `labels` | |
| `priority` | String enum `['low','medium','high']` | Default `'medium'` |
| `dueDate` | Date | |
| `position` | Number | Required; used for ordering within list |
| `createdBy` | ObjectId ref `users` | |
| `createdAt` | Date | |
| `updatedAt` | Date | |

Indexes:
- `{ listId: 1, position: 1 }`
- `{ boardId: 1 }`
- `{ assignees: 1 }`

---

## Collection: `comments`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `cardId` | ObjectId ref `cards` | Required, indexed |
| `author` | ObjectId ref `users` | Required |
| `body` | String | Required |
| `createdAt` | Date | |
| `updatedAt` | Date | |

Index: `{ cardId: 1, createdAt: 1 }`

---

## Collection: `labels`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `boardId` | ObjectId ref `boards` | Required, indexed |
| `name` | String | Required |
| `color` | String | Hex color, required |
| `createdAt` | Date | |
| `updatedAt` | Date | |

---

## Relationships Summary

```
users
  └── owns many boards (boards.owner)
  └── member of many boards (boards.members[].user)
  └── assigned to many cards (cards.assignees[])
  └── authors many comments (comments.author)

boards
  └── has many lists (lists.boardId)
  └── has many labels (labels.boardId)

lists
  └── has many cards (cards.listId)

cards
  └── has many comments (comments.cardId)
  └── has many labels (cards.labels[])
```
