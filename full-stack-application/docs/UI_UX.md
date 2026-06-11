# UI/UX Design Guide

## Design Principles
1. **Clarity over cleverness** — every action should be obvious without tooltips.
2. **Minimal friction** — creating a card or list requires one click and a title, nothing more.
3. **Trello-familiarity** — follow Trello's mental model so employees need no training.

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#0079BF` | Buttons, links, active states |
| `primary-dark` | `#005F99` | Hover states |
| `danger` | `#EB5A46` | Delete actions, overdue indicators |
| `success` | `#61BD4F` | Completion, success toasts |
| `warning` | `#F2D600` | Due-soon indicator |
| `neutral-50` | `#F9FAFB` | Page background |
| `neutral-100` | `#F3F4F6` | Board background |
| `neutral-700` | `#374151` | Body text |
| `neutral-900` | `#111827` | Headings |

---

## Typography
- Font: **Inter** (Google Fonts)
- Base size: 14px
- Headings: 18–24px, `font-semibold`
- Card titles: 14px, `font-medium`
- Meta text (dates, labels): 12px, `text-neutral-500`

---

## Page Layouts

### Login / Sign-up Page
- Centered card on a dark blue (`#0079BF`) background.
- Logo + app name at top.
- Email + password fields, submit button, "Forgot password?" link.
- Toggle between Login and Sign-up.

### Home / My Boards
- Top navbar: logo, "My Tasks" link, user avatar + dropdown (profile, logout).
- Grid of board cards (3 columns on desktop).
- "+ Create Board" card at the end of the grid.

### Board View
- Full-width horizontal scroll of list columns.
- Each list is a fixed-width (280px) card with:
  - List title (editable inline on click).
  - Scrollable card stack.
  - "+ Add a card" button at the bottom.
  - `•••` menu (rename, delete).
- "+ Add another list" button at the far right.
- Board header: board title, background color picker, "Invite" button, member avatars.

### Card Detail Modal
- Opens as an overlay modal (not a new page).
- Left column (wide): title (editable), description (markdown-lite textarea).
- Right sidebar: assignees, labels, priority selector, due date picker, move-to-list dropdown, delete button.
- Comments section below description: list of comments, add-comment textarea at bottom.

### My Tasks Page
- Table/list view of all cards assigned to the current user.
- Columns: Card title, Board, List, Priority, Due Date.
- Filter bar: Board dropdown, Priority dropdown, Due Date range.
- Clicking a row opens the Card Detail Modal.

---

## Components

| Component | Notes |
|---|---|
| `BoardCard` | Board thumbnail with color strip, title, member count |
| `ListColumn` | Fixed-width column, scrollable card list, add-card form |
| `CardItem` | Compact card: title, label dots, due date chip, assignee avatars |
| `CardModal` | Full card detail overlay |
| `LabelBadge` | Colored pill with label name |
| `PriorityBadge` | Icon + text: Low / Medium / High |
| `MemberAvatar` | Circular avatar with initials fallback |
| `CommentItem` | Author avatar, name, timestamp, body, edit/delete actions |
| `AddCardForm` | Inline textarea + Save/Cancel that appears below list |
| `Toast` | Success/error notifications, auto-dismiss at 4s |

---

## Interactions & Feedback
- **Drag and drop:** Cards draggable between lists and within lists via `@dnd-kit`. Lists draggable on the board. Drag handles appear on hover.
- **Inline editing:** List titles and card titles edit in-place on click; blur or Enter saves.
- **Optimistic updates:** Card moves update UI immediately; revert on API failure with a toast error.
- **Loading states:** Skeleton placeholders for board and list data on initial load.
- **Empty states:** Empty list shows dashed border + "No cards yet" text. Empty boards page shows illustration + "Create your first board".
- **Confirmation dialogs:** Destructive actions (delete board, delete list, delete card) require a confirmation popover/dialog.

---

## Accessibility
- All interactive elements have visible focus rings.
- Buttons and icons have `aria-label` where text is absent.
- Color is never the sole indicator of state (priority also uses text labels).
- Modal traps focus and is dismissable with Escape.
