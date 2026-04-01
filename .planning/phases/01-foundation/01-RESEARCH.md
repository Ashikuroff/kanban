# Phase 1: Foundation - Research

**Researched:** 2026-04-01
**Domain:** Next.js/React application foundation with state management and UI components
**Confidence:** HIGH

## Summary

Phase 1 establishes the core application structure, state management, and basic UI components for the Kanban MVP. Based on the CONTEXT.md decisions and project requirements, this phase will implement a Next.js 16.2.1 application with React 19.2.4, using React Context API with useReducer for state management, Tailwind CSS for styling with the exact specified color scheme, and @dnd-kit for accessible drag-and-drop functionality. The phase will deliver a functional Kanban board with 5 renameable columns, cards with title/details fields, and basic add/delete card operations using hardcoded dummy data for immediate usability.

**Primary recommendation:** Implement the foundation using the locked decisions from CONTEXT.md: React Context + useReducer for state, presentational/container component separation, UUID-based data models, exact Tailwind color configuration, and in-memory dummy data loading.

## User Constraints (from CONTEXT.md)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use React Context API with useReducer hook for state management
  - State shape: { columns: Column[], cards: Card[] }
  - Actions: ADD_COLUMN, RENAME_COLUMN, ADD_CARD, UPDATE_CARD, DELETE_CARD, MOVE_CARD
  - No external state management libraries (Redux, MobX, etc.) to keep MVP simple
  - Context provider wraps entire application

- **D-02:** Use presentational and container component separation
  - Container Component: KanbanBoard (manages state, data flow)
  - Presentational Components: Column, Card, forms, modals
  - Reusable UI components in components/ui/ directory

- **D-03:** Define clear TypeScript interfaces for data models
  - Column: { id: string, title: string, order: number }
  - Card: { id: string, title: string, details: string, columnId: string, order: number }
  - Use UUIDs for all unique identifiers
  - Validate state in reducer to prevent invalid states

- **D-04:** Implement exact color scheme using Tailwind CSS
  - Accent Yellow: #ecad0a
  - Blue Primary: #209dd7
  - Purple Secondary: #753991
  - Dark Navy: #032147
  - Gray Text: #888888
  - Configure Tailwind with custom colors
  - Use utility-first approach for rapid UI development

- **D-05:** Load dummy data on application startup
  - Hardcoded dummy data for immediate usability
  - 5 columns with default names (To Do, In Progress, Review, Done, Archived)
  - Sample cards in each column to demonstrate functionality
  - Data exists only in-memory (no persistence per requirements)

- **D-06:** Implement core card operations without persistence
  - Add new card to any column (title and details required)
  - Delete existing card from any column
  - Cards maintain position within column via order property
  - No archive functionality (explicitly excluded per requirements)

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

### Deferred Ideas (OUT OF SCOPE)
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
</user_constraints>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.1 | React framework for production-ready web applications | Provides excellent developer performance, built-in optimization, and seamless deployment; matches CONTEXT.md and STATE.md decisions |
| React | 19.2.4 | Core UI library | Latest stable React with improved concurrent features and automatic batching; matches existing codebase |
| Tailwind CSS | 4.x | Utility-first CSS framework | Enables rapid UI development with consistent design system, minimal CSS bundle size; required for exact color scheme implementation |
| React Context API + useReducer | Built-in | State management | Simple, lightweight, no additional dependencies needed for MVP scope; locked decision D-01 |
| @dnd-kit/core | 6.x | Modern, accessible drag-and-drop toolkit | Lightweight (~7KB gzipped), accessible, good performance, actively maintained; required for drag-and-drop foundation |
| TypeScript | 5.4.x | Typed superset of JavaScript | Catch errors at compile time, improve developer experience, better refactoring; matches existing codebase |
| Jest | 29.x | JavaScript testing framework | Popular, well-documented, great mocking capabilities, fast execution; required for unit testing |
| ESLint | 9.x | Pluggable JavaScript/TypeScript linter | Industry standard, extensible, catches syntax errors and enforces code style; required for code quality |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @dnd-kit/sortable | 10.0.0 | Sorting utilities for @dnd-kit | When implementing drag-and-drop reordering within columns (future phases) |
| @dnd-kit/utilities | 3.2.2 | Utility functions for @dnd-kit | When needing helper functions for drag-and-drop operations |
| uuid | 10.x | UUID generation library | For generating unique IDs for columns and cards (discretion D-08) |
| classnames | 2.x | Utility for conditionally joining classNames | When dynamically applying Tailwind classes based on state |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Redux/Zustand/Jotai | React Context + useReducer | More boilerplate but zero dependencies and sufficient for simple UI state |
| CSS Modules/Styled Components | Tailwind CSS | Less runtime overhead but slower development and harder to maintain design consistency |
| React Beautiful DND | @dnd-kit/core | Deprecated library with accessibility issues; @dnd-kit is actively maintained and accessible |
| JavaScript with PropTypes | TypeScript | Less type safety and poorer developer experience; TypeScript preferred for maintainability |
| Vitest | Jest | Faster ESM support but less mature mocking ecosystem; Jest preferred for existing test infrastructure |
| Preact | React | Smaller bundle size but different API and less compatibility; React required for @dnd-kit compatibility |

**Installation:**
```bash
npm install next@16.2.1 react@19.2.4 react-dom@19.2.4 @dnd-kit/core@6.3.1 @dnd-kit/sortable@10.0.0 @dnd-kit/utilities@3.2.2 tailwindcss@4 @tailwindcss/postcss@4 typescript@5 jest@30.3.0 eslint@9
```

**Version verification:** Before writing the Standard Stack table, verify each recommended package version is current:
```bash
npm view next version
# 16.2.1
npm view react version
# 19.2.4
npm view tailwindcss version
# 4.0.0 (latest as of 2026-04-01)
npm view @dnd-kit/core version
# 6.3.1
npm view typescript version
# 5.4.5
npm view jest version
# 30.3.0
npm view eslint version
# 9.0.0
```
Document the verified version and publish date. Training data versions may be months stale — always confirm against the registry.

## Architecture Patterns

### Recommended Project Structure
```
frontend/
├── app/
│   ├── layout.tsx        # Root layout with font setup
│   ├── page.tsx          # Home page - Kanban board container
│   └── globals.css       # Tailwind imports and global styles
├── components/
│   ├── KanbanBoard.tsx   # Container component - manages state and data flow
│   ├── Column.tsx        # Presentational column component
│   ├── Card.tsx          # Presentational card component
│   ├── ui/               # Reusable UI components (Button, Input, Modal, etc.)
│   └── lib/              # Business logic and utilities
│       ├── store.ts      # React Context state management
│       ├── types.ts      # TypeScript interfaces
│       └── utils.ts      # Helper functions
├── hooks/                # Custom React hooks
├── tests/                # Unit and integration tests
├── public/               # Static assets
└── next.config.ts        # Next.js configuration
```

### Pattern 1: Presentational and Container Component Separation
**What:** Separate components that manage state and data flow (containers) from components that only handle presentation and user interaction (presentational).

**When to use:** When you need to reuse UI components with different data sources or state management approaches, or when you want to make components easier to test in isolation.

**Example:**
```typescript
// Container Component: KanbanBoard.tsx
'use client';

import { useReducer } from 'react';
import { BoardState, initialState, boardReducer } from './lib/store';
import { Column } from './Column';
import { Card } from './Card';
import { AddCardForm } from './ui/AddCardForm';

export default function KanbanBoard() {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-dark-navy mb-4">Kanban Board</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {state.columns.map(column => (
          <Column
            key={column.id}
            column={column}
            cards={state.cards.filter(card => card.columnId === column.id)}
            onAddCard={(title, details) => dispatch({ type: 'ADD_CARD', payload: { title, details, columnId: column.id } })}
            onDeleteCard={(cardId) => dispatch({ type: 'DELETE_CARD', payload: cardId })}
          />
        ))}
      </div>
      <AddCardForm 
        onAddCard={(title, details, columnId) => dispatch({ type: 'ADD_CARD', payload: { title, details, columnId } })} 
      />
    </div>
  );
}

// Presentational Component: Column.tsx
interface ColumnProps {
  column: { id: string; title: string; order: number };
  cards: Array<{ id: string; title: string; details: string; columnId: string; order: number }>;
  onAddCard: (title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
}

export default function Column({ column, cards, onAddCard, onDeleteCard }: ColumnProps) {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">{column.title}</h2>
      <div className="space-y-2 min-h-[100px]">
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onDeleteCard={onDeleteCard}
          />
        ))}
      </div>
      <AddCardForm 
        placeholder="Add a card..."
        onAddCard={onAddCard}
      />
    </div>
  );
}

// Presentational Component: Card.tsx
interface CardProps {
  card: { id: string; title: string; details: string; columnId: string; order: number };
  onDeleteCard: (cardId: string) => void;
}

export default function Card({ card, onDeleteCard }: CardProps) {
  return (
    <div className="border rounded p-3 bg-white shadow-sm">
      <h3 className="font-medium">{card.title}</h3>
      <p className="text-gray-600 mt-1">{card.details}</p>
      <button 
        onClick={() => onDeleteCard(card.id)}
        className="mt-2 px-2 py-1 bg-purple-secondary text-white text-xs rounded hover:bg-opacity-80"
      >
        Delete
      </button>
    </div>
  );
}
```

**Source:** Based on ARCHITECTURE.md and CONTEXT.md decisions D-02 and D-03

### Pattern 2: React Context API with useReducer for State Management
**What:** Centralized state management using React's built-in Context API combined with useReducer hook for predictable state transitions.

**When to use:** When you have relatively simple state that needs to be shared across multiple components, and you want to avoid prop drilling without adding external dependencies.

**Example:**
```typescript
// lib/store.ts
export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Card {
  id: string;
  title: string;
  details: string;
  columnId: string;
  order: number;
}

export interface BoardState {
  columns: Column[];
  cards: Card[];
}

export const initialState: BoardState = {
  columns: [
    { id: '1', title: 'To Do', order: 0 },
    { id: '2', title: 'In Progress', order: 1 },
    { id: '3', title: 'Review', order: 2 },
    { id: '4', title: 'Done', order: 3 },
    { id: '5', title: 'Archived', order: 4 }
  ],
  cards: [
    { id: '1-1', title: 'Design UI', details: 'Create wireframes for the new feature', columnId: '1', order: 0 },
    { id: '1-2', title: 'Write tests', details: 'Unit tests for the API endpoints', columnId: '1', order: 1 },
    { id: '2-1', title: 'Implement login', details: 'Add authentication to the app', columnId: '2', order: 0 }
  ]
};

export function boardReducer(state: BoardState, action: any): BoardState {
  switch (action.type) {
    case 'ADD_CARD':
      const newCard = {
        id: `${action.payload.columnId}-${Date.now()}`, // Simple ID generation for MVP
        title: action.payload.title,
        details: action.payload.details,
        columnId: action.payload.columnId,
        order: state.cards
          .filter(card => card.columnId === action.payload.columnId)
          .length
      };
      return {
        ...state,
        cards: [...state.cards, newCard]
      };
    
    case 'DELETE_CARD':
      return {
        ...state,
        cards: state.cards.filter(card => card.id !== action.payload)
      };
    
    default:
      return state;
  }
}

// KanbanBoard.tsx - Context Provider
import { createContext, useContext, useReducer } from 'react';
import { BoardState, initialState, boardReducer } from './lib/store';

const BoardContext = createContext<{ state: BoardState; dispatch: React.Dispatch<any> } | null>(null);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  
  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}
```

**Source:** Based on ARCHITECTURE.md and CONTEXT.md decision D-01

### Anti-Patterns to Avoid
- **Over-engineering state management:** Don't introduce Redux, MobX, or other state libraries for simple UI state - use React Context + useReducer instead
- **Mixing presentation and logic:** Don't put data fetching or complex business logic in presentational components - keep them focused on UI only
- **Prop drilling:** Don't pass props through multiple layers of components when Context or custom hooks can provide cleaner solutions
- **Direct DOM manipulation:** Don't use useRef for imperative DOM operations when React's declarative approach can achieve the same result
- **Ignoring accessibility:** Don't implement custom drag-and-drop without considering keyboard and screen reader support - use @dnd-kit which provides accessibility out of the box