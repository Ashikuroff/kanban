# Kanban Project

## Core Value
An MVP of a Kanban style Project Management application as a web app with a slick, professional, gorgeous UI/UX and very simple features.

## Stakeholders
- End users who need a simple project management tool
- Developers building the application

## Constraints
- No persistence (in-memory only)
- No user management for MVP
- Only 1 board with fixed 5 columns that can be renamed
- Each card has title and details only
- Drag and drop interface to move cards between columns
- Add new card to column; delete existing card
- No archive, no search/filter functionality
- Must be implemented as a modern NextJS app in frontend subdirectory
- Use popular libraries
- As simple as possible with elegant UI
- App opens with dummy data populated for single board

## Success Criteria
- Board with 5 columns that can be renamed
- Drag and drop functionality for cards between columns
- Add and delete cards
- Professional UI/UX with specified color scheme
- Dummy data on app load
- No extra features beyond MVP scope

## Key Decisions
| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Next.js 16.2.1 with React 19.2.4 | Modern framework with good performance and ecosystem | Pending |
| Use @dnd-kit for drag-and-drop | Popular, well-maintained library for drag interactions | Pending |
| Use TypeScript | Type safety and better developer experience | Pending |
| Use Jest and ESLint | Testing and code quality standards | Pending |
| Use Tailwind CSS | Utility-first CSS for rapid UI development | Pending |
| No persistence layer | Keep MVP simple, focus on UI/UX | Pending |
| No user management | Reduce scope for MVP | Pending |
| Fixed 5 columns | Simplify implementation while providing usefulness | Pending |
| Renameable columns | Add basic customization without complexity | Pending |
| Title and details only for cards | Keep card model simple | Pending |
| Dummy data on load | Immediate usability without backend | Pending |

---
*Last updated: 2026-04-01 after initialization*

## Evolution
This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state