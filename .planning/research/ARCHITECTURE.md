# Kanban Project Architecture

## Overview
This document describes the recommended architecture for the Kanban project based on the requirements in AGENTS.md and the technology stack research.

## System Architecture
### High-Level Structure
```
Kanban App (Next.js)
├── frontend/ (Next.js application)
│   ├── app/ (App Router)
│   │   ├── layout.tsx (Root layout)
│   │   ├── page.tsx (Home page - Kanban board)
│   │   └── globals.css (Tailwind imports)
│   ├── components/
│   │   ├── KanbanBoard.tsx (Main board container)
│   │   ├── Column.tsx (Individual column)
│   │   ├── Card.tsx (Individual card)
│   │   ├── AddCardForm.tsx (Form for adding new cards)
│   │   ├── EditCardModal.tsx (Modal for editing card details)
│   │   ├── RenameColumnModal.tsx (Modal for renaming columns)
│   │   └── ui/ (Reusable UI components)
│   ├── lib/
│   │   ├── store.ts (React Context state management)
│   │   ├── types.ts (TypeScript interfaces)
│   │   └── utils.ts (Helper functions)
│   ├── styles/ (Global styles if needed)
│   ├── hooks/ (Custom React hooks)
│   ├── tests/ (Unit and integration tests)
│   ├── public/ (Static assets)
│   └── next.config.ts (Next.js configuration)
└── .planning/ (GSD planning artifacts)
```

## Architectural Decisions

### 1. Client-Side Only Architecture
- **Pattern**: Single Page Application (SPA) with client-side state management
- **Rationale**: 
  - Requirements specify no persistence and no user management
  - Eliminates need for backend complexity
  - Simplifies deployment (static hosting possible)
  - Matches MVP goal of simplicity
- **Implementation**:
  - All state stored in React Context
  - Initial data loaded from hardcoded dummy data
  - No API calls or data fetching

### 2. State Management Approach
- **Pattern**: React Context API with useReducer hook
- **Rationale**:
  - Simple state shape (board with columns and cards)
  - No need for external libraries
  - Built-in React solution reduces bundle size
  - Easy to debug and test
- **Implementation**:
  - Store contains: `{ columns: Column[], cards: Card[] }`
  - Actions: ADD_COLUMN, RENAME_COLUMN, ADD_CARD, UPDATE_CARD, DELETE_CARD, MOVE_CARD
  - useReducer for predictable state transitions
  - Context provider wraps entire application

### 3. Component Structure
- **Pattern**: Presentational and Container Component separation
- **Rationale**:
  - Clear separation of concerns
  - Reusable UI components
  - Easier testing
  - Follows React best practices
- **Implementation**:
  - **Container Components**: KanbanBoard (manages state, data flow)
  - **Presentational Components**: Column, Card, forms, modals (receive props, call callbacks)
  - **UI Library**: Reusable buttons, inputs, overlays in components/ui/

### 4. Data Flow
- **Pattern**: Unidirectional data flow with React Context
- **Rationale**:
  - Predictable state changes
  - Easy to trace updates
  - Simple debugging
  - Matches React mental model
- **Implementation**:
  - State flows down via Context
  - Actions flow up via callback props
  - Immutable state updates in reducer
  - Components re-render when relevant state changes

### 5. Drag and Drop Implementation
- **Pattern**: @dnd-kit with custom wrappers
- **Rationale**:
  - Library handles complex DND logic
  - Accessible by default (keyboard, screen readers)
  - Good performance with virtualization
  - Active maintenance and community support
- **Implementation**:
  - DndContext wraps KanbanBoard
  - Column and Card use Draggable and Droppable components
  - Custom drag overlay for visual feedback
  - Snap to grid for smooth animations
  - Accessibility labels and announcements

### 6. Styling Approach
- **Pattern**: Utility-first CSS with Tailwind
- **Rationale**:
  - Rapid UI development
  - Consistent design system
  - Minimal CSS bundle (purge unused styles)
  - Easy to maintain and modify
  - Matches specified color scheme exactly
- **Implementation**:
  - Tailwind configured with custom colors from AGENTS.md
  - Custom CSS for animations and transitions
  - Responsive design with mobile-first breakpoints
  - Dark mode intentionally NOT implemented (per simplicity)

### 7. State Persistence (In-Memory Only)
- **Pattern**: State exists only during browser session
- **Rationale**:
  - Explicit requirement: "No persistence"
  - Simplifies implementation
  - Focuses effort on UI/UX rather than data layer
  - Matches MVP scope
- **Implementation**:
  - State initialized with dummy data on load
  - No localStorage, cookies, or API calls
  - State resets on page refresh (intentional per requirements)

### 8. Error Handling Approach
- **Pattern**: Fail silently with console warnings for MVP
- **Rationale**:
  - Simple application with low complexity
  - No user accounts or critical data
  - Development-time errors sufficient for MVP
  - Keep code simple per requirements
- **Implementation**:
  - Basic validation in reducers (prevent invalid states)
  - Console.warn for unexpected conditions
  - No user-facing error messages for edge cases
  - Assume well-formed data from user interactions

### 9. Performance Considerations
- **Pattern**: Optimize for typical usage patterns
- **Rationale**:
  - Small data sets (dozens of cards max)
  - Modern browsers handle React re-renders efficiently
  - @dnd-kit optimized for performance
  - Tailwind purges unused CSS in production
- **Implementation**:
  - useCallback and useMemo where beneficial
  - Virtual scrolling not needed for small lists
  - Debounce expensive operations (none identified)
  - Image optimization for any future assets
  - Next.js automatic code splitting

### 10. Testing Strategy
- **Pattern**: Unit testing with Jest and React Testing Library
- **Rationale**:
  - Requirements mention rigorous unit testing
  - Focus on component behavior and state transitions
  - Integration testing less critical for simple UI
  - Snapshot testing for UI regression prevention
- **Implementation**:
  - Test individual components (Column, Card, forms)
  - Test state reducer actions
  - Test custom hooks
  - Test drag and drop interactions (simulated)
  - Test UI rendering with correct props and state
  - Aim for 80%+ coverage on critical paths

## Component Dependencies
```
KanbanBoard
├── uses: React Context (state and actions)
├── renders: Column[] (mapped from state)
├── uses: @dnd-kit DndContext, DragOverlay
└── provides: drag-and-drop callbacks to children

Column
├── receives: column object, cards array, drag callbacks
├── renders: column header, Card[] (mapped), add card form
├── uses: @dnd-kit Droppable, Draggable (for header)
└── provides: drag callbacks to Card components

Card
├── receives: card object, drag callbacks, edit/delete callbacks
├── renders: card title, details, action buttons
├── uses: @dnd-kit Draggable
├── provides: drag handle for drag initiation
└── calls: edit/delete callbacks on button clicks

AddCardForm
├── receives: onAdd callback, current column ID
├── renders: form with title/details inputs, submit button
├── provides: form state management
└── calls: onAdd callback on submit

EditCardModal
├── receives: card object, onUpdate, onClose callbacks
├── renders: form with pre-filled inputs, save/cancel buttons
├── provides: form state management
└── calls: onUpdate on save, onClose on cancel

RenameColumnModal
├── receives: column object, onRename, onClose callbacks
├── renders: form with pre-filled input, save/cancel buttons
├── provides: form state management
└── calls: onRename on save, onClose on cancel
```

## Data Models

### Column Interface
```typescript
interface Column {
  id: string;           // Unique identifier (uuid)
  title: string;        // Column title (editable)
  order: number;        // Position in board (0-4)
}
```

### Card Interface
```typescript
interface Card {
  id: string;           // Unique identifier (uuid)
  title: string;        // Card title (editable)
  details: string;      // Card details (editable)
  columnId: string;     // ID of column this card belongs to
  order: number;        // Position within column
}
```

### Root State Interface
```typescript
interface BoardState {
  columns: Column[];    // Array of exactly 5 columns
  cards: Card[];        // Array of cards (can be empty)
}
```

## File Organization Principles

### 1. Feature-Based Organization
- Group related files by feature rather than type
- Example: All column-related components in components/column/
- Scales better as features grow
- Easier to locate related code

### 2. Separation of Concerns
- Keep UI components dumb and reusable
- Put business logic in custom hooks or lib/
- Separate types, utils, and constants
- Makes code easier to test and maintain

### 3. Consistency Patterns
- Consistent naming conventions (PascalCase for components, camelCase for props)
- Consistent file extensions (.tsx for React components, .ts for logic)
- Consistent import ordering (React, third-party, local)
- Consistent export patterns (named exports preferred)

### 4. Scalability Considerations
- Leave room for future features without major refactoring
- Use TypeScript interfaces to define clear contracts
- Design state shape to be extensible
- Keep component props focused and minimal

## Build and Deployment

### Development Setup
- `npm run dev` - Start Next.js dev server on localhost:3000
- Fast Refresh enabled for instant component updates
- ESLint runs on save via editor integration
- Jest watch mode for TDD (`npm test -- --watch`)

### Production Build
- `npm run build` - Create optimized production build
- `npm run start` - Start Next.js production server
- Automatic code splitting and bundling
- Tailwind CSS purged in production (~10-20KB CSS)
- Static export possible (no server needed)

### Environment Variables
- None required for MVP (no external APIs)
- Future: NEXT_PUBLIC_API_URL for backend integration
- Future: NODE_ENV for development/production toggles

## Architectural Trade-offs

### Chose Client-Side Only Over Client-Server
- **Gain**: Simplicity, faster iteration, easier deployment
- **Loss**: No persistence, no sharing, limited scalability
- **Justification**: Matches explicit requirements for MVP simplicity

### Chose React Context Over External State Library
- **Gain**: Zero dependencies, built-in, sufficient for scope
- **Loss**: Less devtools support, more verbose for complex state
- **Justification**: State shape is simple, no need for advanced features

### Chose @dnd-kit Over HTML5 Drag and Drop
- **Gain**: Accessibility, touch support, better UX, less boilerplate
- **Loss**: Small package size (~7KB gzipped)
- **Justification**: Accessibility and UX are important, cost is minimal

### Chose Tailwind Over CSS Modules/Styled Components
- **Gain**: Faster development, consistent styling, smaller CSS
- **Loss**: Learning curve, longer class names in JSX
- **Justification**: Matches modern React development practices

## Risks and Mitigations

### Risk: State Loss on Refresh
- **Impact**: Users lose work when refreshing or closing tab
- **Mitigation**: Explicitly accepted per requirements (no persistence)
- **Future**: Could add localStorage as v2 feature

### Risk: Over-Reliance on Third-Party Library
- **Impact**: If @dnd-kit has breaking changes or is abandoned
- **Mitigation**: Library is actively used, MIT licensed, small core
- **Alternative**: Could revert to custom HTML5 DND if needed

### Risk: Bundle Size Growth
- **Impact**: Slow loading times, poor performance on mobile
- **Mitigation**: Next.js code splitting, Tailwind purging, lazy loading
- **Monitor**: Use webpack bundle analyzer in development

### Risk: State Management Complexity
- **Impact**: Difficult to debug or extend state logic
- **Mitigation**: Use Immer or immer-like patterns in reducer
- **Alternative**: Split state into multiple contexts if grows significantly

### Risk: Accessibility Gaps
- **Impact**: Excludes users with disabilities, legal compliance issues
- **Mitigation**: @dnd-kit provides accessibility, test with screen readers
- **Process**: Include a11y testing in definition of done

## Conclusion
This architecture provides a solid foundation for building the Kanban MVP according to requirements. It prioritizes simplicity, maintainability, and alignment with the specified tech stack while leaving clear paths for future enhancements. The client-side only approach matches the explicit requirements and allows focus on delivering an excellent UI/UX experience.