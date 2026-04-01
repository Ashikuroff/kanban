---
wave: 1
depends_on: []
files_modified:
  - frontend/src/lib/store.ts
  - frontend/src/types.ts
  - frontend/src/components/KanbanBoard.tsx
  - frontend/src/components/Column.tsx
  - frontend/src/components/Card.tsx
  - frontend/src/components/ui/AddCardForm.tsx
  - frontend/src/components/ui/Modal.tsx
  - frontend/src/app/page.tsx
  - frontend/src/app/layout.tsx
autonomous: false
---

<planning_context>
**Phase:** 1
**Mode:** standard
</planning_context>

<deep_work_rules>
## Anti-Shallow Execution Rules (MANDATORY)

Every task MUST include these fields — they are NOT optional:

1. **`<read_first>`** — Files the executor MUST read before touching anything. Always include:
   - The file being modified (so executor sees current state, not assumptions)
   - Any "source of truth" file referenced in CONTEXT.md (reference implementations, existing patterns, config files, schemas)
   - Any file whose patterns, signatures, types, or conventions must be replicated or respected

2. **`<acceptance_criteria>`** — Verifiable conditions that prove the task was done correctly. Rules:
   - Every criterion must be checkable with grep, file read, test command, or CLI output
   - NEVER use subjective language ("looks correct", "properly configured", "consistent with")
   - ALWAYS include exact strings, patterns, values, or command outputs that must be present
   - Examples:
     - Code: `auth.py contains def verify_token(` / `test_auth.py exits 0`
     - Config: `.env.example contains DATABASE_URL=` / `Dockerfile contains HEALTHCHECK`
     - Docs: `README.md contains '## Installation'` / `API.md lists all endpoints`
     - Infra: `deploy.yml has rollback step` / `docker-compose.yml has healthcheck for db`

3. **`<action>`** — Must include CONCRETE values, not references. Rules:
   - NEVER say "align X with Y", "match X to Y", "update to be consistent" without specifying the exact target state
   - ALWAYS include the actual values: config keys, function signatures, SQL statements, class names, import paths, env vars, etc.
   - If CONTEXT.md has a comparison table or expected values, copy them into the action verbatim
   - The executor should be able to complete the task from the action text alone, without needing to read CONTEXT.md or reference files (read_first is for verification, not discovery)

**Why this matters:** Executor agents work from the plan text. Vague instructions like "update the config to match production" produce shallow one-line changes. Concrete instructions like "add DATABASE_URL=postgresql://... , set POOL_SIZE=20, add REDIS_URL=redis://..." produce complete work. The cost of verbose plans is far less than the cost of re-doing shallow execution.
</deep_work_rules>

<quality_gate>
- [ ] PLAN.md files created in phase directory
- [ ] Each plan has valid frontmatter
- [ ] Tasks are specific and actionable
- [ ] Every task has `<read_first>` with at least the file being modified
- [ ] Every task has `<acceptance_criteria>` with grep-verifiable conditions
- [ ] Every `<action>` contains concrete values (no "align X with Y" without specifying what)
- [ ] Dependencies correctly identified
- [ ] Waves assigned for parallel execution
- [ ] must_haves derived from phase goal
</quality_gate>

<tasks>
<task>
<read_first>
- .planning/phases/01-foundation/01-foundation-CONTEXT.md
- .planning/REQUIREMENTS.md
- frontend/src/types.ts (if exists)
- frontend/src/lib/store.ts (if exists)
</read_first>
<action>
Create TypeScript interfaces for Column and Card models in frontend/src/types.ts:
- Column: { id: string, title: string, order: number }
- Card: { id: string, title: string, details: string, columnId: string, order: number }
- BoardState: { columns: Column[], cards: Card[] }
- Define UUID generation utility function
</action>
<acceptance_criteria>
- File frontend/src/types.ts exists with the specified interfaces
- Interface Column has properties id (string), title (string), order (number)
- Interface Card has properties id (string), title (string), details (string), columnId (string), order (number)
- Interface BoardState has properties columns (Column[]), cards (Card[])
- File exports a function generateId() that returns string UUIDs
</action>
</task>

<task>
<read_first>
- .planning/phases/01-foundation/01-foundation-CONTEXT.md
- .planning/REQUIREMENTS.md
- frontend/src/lib/store.ts (if exists)
- frontend/src/types.ts
</read_first>
<action>
Create React Context state management in frontend/src/lib/store.ts:
- Create BoardContext using React.createContext
- Define initialState with 5 columns and sample cards
- Implement boardReducer with ADD_CARD and DELETE_CARD actions
- Create BoardProvider component that wraps children with context
- Create useBoard hook for consuming context
- Use TypeScript interfaces from types.ts
</action>
<acceptance_criteria>
- File frontend/src/lib/store.ts exists
- Exports BoardContext, BoardProvider, useBoard hook
- Contains initialState with 5 columns (To Do, In Progress, Review, Done, Archived) and sample cards
- Reducer handles ADD_CARD and DELETE_CARD actions correctly
- Uses TypeScript interfaces for state shape
- BoardProvider wraps children with context value
</action>
</task>

<task>
<read_first>
- .planning/phases/01-foundation/01-foundation-CONTEXT.md
- .planning/REQUIREMENTS.md
- frontend/src/lib/store.ts
- frontend/src/types.ts
- frontend/src/components/KanbanBoard.tsx (if exists)
</read_first>
<action>
Create or update KanbanBoard container component in frontend/src/components/KanbanBoard.tsx:
- Import useBoard hook from '../lib/store'
- Use useBoard to get state and dispatch
- Render header with application title
- Display columns in responsive grid (1 column on mobile, 5 columns on desktop)
- For each column, render Column component with column data and filtered cards
- Render AddCardForm component at bottom for adding new cards
- Apply Tailwind styling with specified color scheme
</action>
<acceptance_criteria>
- File frontend/src/components/KanbanBoard.tsx exists
- Uses useBoard hook to access state and dispatch
- Renders header with text "Kanban Board" in dark navy (#032147)
- Displays columns in responsive layout (mobile: 1 column, desktop: 5 columns)
- Maps over state.columns and for each column filters state.cards by columnId
- Passes column data and cards to Column component
- Renders AddCardForm component
- Uses Tailwind classes with colors from specification:
  - Dark navy for heading: #032147
  - Purple secondary for buttons: #753991
</action>
</task>

<task>
<read_first>
- .planning/phases/01-foundation/01-foundation-CONTEXT.md
- .planning/REQUIREMENTS.md
- frontend/src/lib/store.ts
- frontend/src/types.ts
- frontend/src/components/Column.tsx (if exists)
</read_first>
<action>
Create or update Column presentational component in frontend/src/components/Column.tsx:
- Accept props: column (object), cards (array), onAddCard (function), onDeleteCard (function)
- Render column title in dark navy
- Map over cards array and render Card component for each card
- Render AddCardForm component for adding cards to this column
- Apply styling: border, rounded, padding, background white
- Use Tailwind spacing and typography
</action>
<acceptance_criteria>
- File frontend/src/components/Column.tsx exists
- Component accepts column, cards, onAddCard, onDeleteCard props
- Renders column title with dark navy text color (#032147)
- Maps over cards prop and renders Card component for each
- Renders AddCardForm component for adding new cards
- Has border, rounded corners, padding, white background
- Uses Tailwind utility classes for styling
</action>
</task>

<task>
<read_first>
- .planning/phases/01-foundation/01-foundation-CONTEXT.md
- .planning/REQUIREMENTS.md
- frontend/src/lib/store.ts
- frontend/src/types.ts
- frontend/src/components/Card.tsx (if exists)
</read_first>
<action>
Create or update Card presentational component in frontend/src/components/Card.tsx:
- Accept props: card (object), onDeleteCard (function)
- Render card title as heading
- Render card details as paragraph
- Render delete button with purple secondary background
- On delete button click, call onDeleteCard with card.id
- Apply styling: border, rounded, padding, shadow, white background
- Use Tailwind spacing and hover effects
</action>
<acceptance_criteria>
- File frontend/src/components/Card.tsx exists
- Component accepts card and onDeleteCard props
- Renders card title as heading element
- Renders card details as paragraph element
- Renders delete button that calls onDeleteCard(card.id) on click
- Delete button has purple secondary background (#753991) with white text
- Button has hover effect (opacity change)
- Card has border, rounded corners, padding, shadow, white background
- Uses Tailwind utility classes for styling and spacing
</action>
</task>

<task>
<read_first>
- .planning/phases/01-foundation/01-foundation-CONTEXT.md
- .planning/REQUIREMENTS.md
- frontend/src/components/ui/Modal.tsx (if exists)
- frontend/src/hooks/useModal.ts (if exists)
</read_first>
<action>
Create AddCardForm component in frontend/src/components/ui/AddCardForm.tsx:
- Form with two text inputs: title and details
- Submit button labeled "Add Card"
- On submit, prevent default, validate inputs not empty
- Call onAddCard callback with title and details
- Clear form inputs after successful submission
- Apply styling: form layout, input styling, button styling
- Use existing Modal component if needed for future enhancements
</action>
<acceptance_criteria>
- File frontend/src/components/ui/AddCardForm.tsx exists
- Contains form with title and details text inputs
- Has submit button labeled "Add Card"
- On form submit: prevents default, validates inputs not empty
- Calls onAddCard callback with title and details when valid
- Clears form inputs after successful submission
- Inputs have proper styling (border, padding, focus states)
- Button has purple secondary background (#753991) with white text
- Button has hover effect
- Form uses flex or grid layout for proper alignment
</action>
</task>

<task>
<read_first>
- .planning/phases/01-foundation/01-foundation-CONTEXT.md
- .planning/REQUIREMENTS.md
- frontend/src/app/layout.tsx
- frontend/src/app/globals.css
</read_first>
<action>
Update frontend/src/app/layout.tsx to wrap application with BoardProvider:
- Import BoardProvider from '../lib/store'
- Wrap children with BoardProvider component
- Ensure proper document structure with html and body tags
</action>
<acceptance_criteria>
- File frontend/src/app/layout.tsx exists
- Imports BoardProvider from '../lib/store'
- Wraps {children} with <BoardProvider> component
- Maintains existing HTML structure (html, body, etc.)
- No syntax errors in TypeScript
</action>
</task>

<task>
<read_first>
- .planning/phases/01-foundation/01-foundation-CONTEXT.md
- .planning/REQUIREMENTS.md
- frontend/src/app/globals.css
</read_first>
<action>
Update frontend/src/app/globals.css to include Tailwind configuration for custom colors:
- Add custom color definitions for the specified color scheme:
  - Accent Yellow: #ecad0a
  - Blue Primary: #209dd7
  - Purple Secondary: #753991
  - Dark Navy: #032147
  - Gray Text: #888888
- Configure Tailwind to use these colors in the design system
</action>
<acceptance_criteria>
- File frontend/src/app/globals.css exists
- Contains Tailwind directive @tailwind base; @tailwind components; @tailwind utilities;
- Includes custom color configuration for:
  - accent-yellow: #ecad0a
  - blue-primary: #209dd7
  - purple-secondary: #753991
  - dark-navy: #032147
  - gray-text: #888888
- Uses proper Tailwind CSS syntax for custom colors
</action>
</task>

<task>
<read_first>
- .planning/phases/01-foundation/01-foundation-CONTEXT.md
- .planning/REQUIREMENTS.md
- frontend/src/app/page.tsx
</read_first>
<action>
Verify or update frontend/src/app/page.tsx to render KanbanBoard:
- Ensure it imports KanbanBoard from '../components/KanbanBoard'
- Ensure it returns div with min-h-screen bg-gray-100
- Ensure it renders header with title
- Ensure it renders KanbanBoard component
</action>
<acceptance_criteria>
- File frontend/src/app/page.tsx exists
- Imports KanbanBoard from '../components/KanbanBoard'
- Returns div with classes min-h-screen bg-gray-100
- Renders header with h1 containing "Kanban Board" in dark navy text
- Renders KanbanBoard component below header
- No syntax errors in TypeScript
</action>
</task>
</tasks>