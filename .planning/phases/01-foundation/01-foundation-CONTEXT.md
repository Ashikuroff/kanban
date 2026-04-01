# Phase 1: Foundation - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary
Phase 1 establishes the core application structure, state management, and basic UI components for the Kanban MVP. This phase delivers the foundation upon which drag-and-drop functionality and UI polish will be built in subsequent phases.

Specifically, Phase 1 includes:
- Application structure with proper Next.js setup
- State management using React Context and useReducer
- Basic UI components: KanbanBoard, Column, Card
- Initial data loading with dummy data
- Implementation of the specified color scheme
- Basic card operations: add and delete cards
</domain>

<decisions>
## Implementation Decisions

### State Management Approach
- **D-01:** Use React Context API with useReducer hook for state management
  - State shape: { columns: Column[], cards: Card[] }
  - Actions: ADD_COLUMN, RENAME_COLUMN, ADD_CARD, UPDATE_CARD, DELETE_CARD, MOVE_CARD
  - No external state management libraries (Redux, MobX, etc.) to keep MVP simple
  - Context provider wraps entire application

### Component Structure
- **D-02:** Use presentational and container component separation
  - Container Component: KanbanBoard (manages state, data flow)
  - Presentational Components: Column, Card, forms, modals
  - Reusable UI components in components/ui/ directory

### Data Models
- **D-03:** Define clear TypeScript interfaces for data models
  - Column: { id: string, title: string, order: number }
  - Card: { id: string, title: string, details: string, columnId: string, order: number }
  - Use UUIDs for all unique identifiers
  - Validate state in reducer to prevent invalid states

### Styling Approach
- **D-04:** Implement exact color scheme using Tailwind CSS
  - Accent Yellow: #ecad0a
  - Blue Primary: #209dd7
  - Purple Secondary: #753991
  - Dark Navy: #032147
  - Gray Text: #888888
  - Configure Tailwind with custom colors
  - Use utility-first approach for rapid UI development

### Initial Data Loading
- **D-05:** Load dummy data on application startup
  - Hardcoded dummy data for immediate usability
  - 5 columns with default names (To Do, In Progress, Review, Done, Archived)
  - Sample cards in each column to demonstrate functionality
  - Data exists only in-memory (no persistence per requirements)

### Basic Card Operations
- **D-06:** Implement core card operations without persistence
  - Add new card to any column (title and details required)
  - Delete existing card from any column
  - Cards maintain position within column via order property
  - No archive functionality (explicitly excluded per requirements)

### UI/UX Foundation
- **D-07:** Create responsive, professional layout
  - Mobile-first approach with Tailwind breakpoints
  - Header with application title
  - Main board area with proper spacing
  - Visual hierarchy that follows the specified color scheme
  - No search/filter functionality (explicitly excluded per requirements)

### Claude's Discretion
- **D-08:** Specific implementation approaches for reusable components
  - Choice of UUID library (or custom implementation)
  - Form validation approach for add card inputs
  - Animation approach for card additions/removals
  - Specific breakpoint values for responsive design
  - Error handling strategy for edge cases

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Requirements
- `.planning/REQUIREMENTS.md` — Complete v1 and v2 requirements with out-of-scope items
- `.planning/PROJECT.md` — Project vision, constraints, stakeholder information
- `.planning/ROADMAP.md` — Overall phase structure and success criteria

### Technical Research
- `.planning/research/STACK.md` — Recommended technology stack for 2025
- `.planning/research/FEATURES.md` — Feature analysis including table stakes and differentiators
- `.planning/research/ARCHITECTURE.md` — Detailed architectural recommendations
- `.planning/research/PITFALLS.md` — Common mistakes to avoid during implementation
- `.planning/research/SUMMARY.md` — Key findings and recommendations from research

### Existing Codebase Patterns
- `frontend/src/app/layout.tsx` — Root layout with header structure
- `frontend/src/app/globals.css` — Global CSS and Tailwind imports
- `frontend/src/types.ts` — Existing TypeScript interfaces
- `frontend/src/components/Card.tsx` — Existing card component implementation
- `frontend/src/components/Column.tsx` — Existing column component implementation
- `frontend/src/components/KanbanBoard.tsx` — Existing kanban board component
- `frontend/src/components/Modal.tsx` — Reusable modal component
- `frontend/src/hooks/useModal.ts` — Custom hook for modal management
- `frontend/src/hooks/useLocalStorage.ts` — Existing localStorage hook (to be ignored per no persistence requirement)

</canonical_refs>

<specifics>
## Specific Ideas

- Use uuidv4() for generating unique IDs for columns and cards
- Initial dummy data should include 3-5 cards per column to demonstrate usage
- Column order should be fixed at 0-4 left-to-right matching the 5 columns
- Card order within columns should start at 0 and increment for each card
- Use Tailwind's responsive prefixes (sm:, md:, lg:) for adaptive layouts
- Implement card deletion with confirmation to prevent accidental data loss
- Use the existing Modal component as base for add/edit/rename modals
- Follow existing code style and patterns from the current codebase
</specifics>

<deferred>
## Deferred Ideas

- Drag and drop functionality between columns and within columns
- Card editing capabilities (title and details)
- Column renaming functionality
- Visual feedback during drag operations (dragging item, drop zone highlighting)
- Keyboard and screen reader accessibility for drag and drop
- Advanced UI polish and animations
- Comprehensive unit testing beyond basic functionality
- Local storage persistence (explicitly excluded for MVP)
- Multiple board support
- Advanced card features (due dates, labels, checklists, attachments, comments)
- Archive functionality for completed cards
- Search and filter capabilities
- Undo/redo functionality
- Keyboard shortcuts for common operations
- Real-time collaboration features
- User accounts and authentication systems
</deferred>

---
*Phase: 01-foundation*
*Context gathered: 2026-04-01 via discuss-phase*