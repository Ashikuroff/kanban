# Code Review — `pr/kanban-mvp`

Reviewed branch `pr/kanban-mvp` against `main`. Found 3 issues.

---

## Issues

### 1. localStorage persistence violates the explicit "no persistence" MVP requirement

`.planning/REQUIREMENTS.md` lists "No persistence (in-memory only)" as an in-scope constraint and defers localStorage to `UI-V2-01`. The entire `useLocalStorage` hook was added via commit `eacf80e` ("Persist board state across refreshes"), directly against the locked requirement. `BoardProvider` should use plain `useState` + `useReducer`.

**File:** `frontend/src/lib/store.tsx`, line 169

```ts
const [state, setState] = useLocalStorage<BoardState>('kanban-board', initialState);
```

https://github.com/Ashikuroff/kanban/blob/eacf80e8bfe76d9c34475533e0defaf3f5dee7f8/frontend/src/lib/store.tsx#L168-L171

---

### 2. `SearchBar` implements explicitly forbidden search/filter functionality

`.planning/REQUIREMENTS.md` UI-05 states "No search/filter functionality", and the Features research lists it under Anti-Features. The component is also dead code — not imported anywhere in the component tree.

**File:** `frontend/src/components/SearchBar.tsx`, lines 5–15

```tsx
interface SearchBarProps {
  onSearch: (query: string) => void;
  ...
}
export function SearchBar({ onSearch, placeholder = 'Search cards...' }: SearchBarProps) {
```

https://github.com/Ashikuroff/kanban/blob/eacf80e8bfe76d9c34475533e0defaf3f5dee7f8/frontend/src/components/SearchBar.tsx#L5-L15

---

### 3. No card deletion confirmation despite README claiming it exists

`Card.tsx` calls `onDeleteCard(card.id)` directly on click with no confirmation step, but `frontend/README.md` explicitly claims "Confirmation Prompts: Prevents accidental deletions" and "Delete Cards: Click the '✕' button (with confirmation)". The `Modal`/`useModal` infrastructure added in this branch is never wired into `Card.tsx`.

**File:** `frontend/src/components/Card.tsx`, lines 58–65

```tsx
onClick={() => onDeleteCard(card.id)}
```

https://github.com/Ashikuroff/kanban/blob/eacf80e8bfe76d9c34475533e0defaf3f5dee7f8/frontend/src/components/Card.tsx#L58-L65

---

## Filtered Issues (score < 80)

The following were found but scored below the confidence threshold:

| Issue | Score | Reason |
|-------|-------|--------|
| Double-write in `useLocalStorage` (side effect inside state updater + useEffect) | 75 | Real but lower practical impact |
| `hasHydrated` return value discarded in `store.tsx` line 169 | 75 | Real but affects only initial render flash |
| Off-by-one in same-column drag reorder (`KanbanBoard.tsx` lines 83–101) | 75 | Real but affects only downward intra-column drags |

---

*Generated with [Claude Code](https://claude.ai/code)*
