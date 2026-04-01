# Kanban Project Pitfalls Analysis

## Overview
This document outlines common mistakes and pitfalls to avoid when building a Kanban-style project management application, based on industry best practices and the specific requirements of this MVP.

## Critical Mistakes to Avoid

### 1. Over-Engineering State Management
**Pitfall**: Introducing Redux, MobX, Zustand, or other state management libraries for simple UI state.
**Warning Signs**: 
- Creating store.ts with complex middleware before having any components
- Spending more time on state setup than UI implementation
- Using useSelector/useDispatch for prop drilling that could use context
**Prevention Strategy**: 
- Start with React Context + useReducer
- Only consider external libraries if state becomes genuinely complex (nested objects, frequent updates, devtools needed)
- **Phase to Address**: Phase 1 (Foundation) - keep state management simple from the start

### 2. Ignoring Accessibility in Drag and Drop
**Pitfall**: Implementing drag and drop that only works with mouse, excluding keyboard and screen reader users.
**Warning Signs**:
- No keyboard operable drag handles
- Missing ARIA labels and announcements
- No focus management during drag operations
- Visual-only feedback without alternatives
**Prevention Strategy**:
- Use @dnd-kit which provides accessibility out of the box
- Test with screen readers (VoiceOver, NVDA) and keyboard-only navigation
- Ensure all drag operations have visible focus states
- **Phase to Address**: Phase 1 (Foundation) - implement accessible DND from the beginning

### 3. Incorrect Data Modeling
**Pitfall**: Creating overly complex card/column models or violating data integrity.
**Warning Signs**:
- Cards belonging to multiple columns
- Missing unique identifiers leading to rendering issues
- Order values not maintained correctly during moves
- Allowing invalid states (duplicate column names, negative orders)
**Prevention Strategy**:
- Use UUIDs for all IDs
- Validate state in reducer (prevent duplicates, maintain order constraints)
- Use TypeScript interfaces to enforce data shape
- **Phase to Address**: Phase 1 (Foundation) - establish correct data models early

### 4. Performance Anti-Patterns
**Pitfall**: Introducing unnecessary optimizations that complicate code without benefit.
**Warning Signs**:
- Premature use of useCallback/useMemo everywhere
- Over-engineering component splitting
- Complex memoization strategies for small lists
- Ignoring React's automatic optimizations
**Prevention Strategy**:
- Measure before optimizing
- Keep components simple and focused
- Let React handle re-renders for small data sets (<100 items)
- Use React DevTools Profiler to identify actual bottlenecks
- **Phase to Address**: Phase 2 (Optimization) - optimize only after identifying real issues

### 5. Scope Creep Through "Just One More Feature"
**Pitfall**: Adding features beyond the MVP scope because they seem small or easy.
**Warning Signs**:
- Thinking "I'll just add due dates quickly"
- Considering "it would be nice to have labels"
- Starting to build search/filter because "everyone expects it"
- Adding persistence because "users will lose their work"
**Prevention Strategy**:
- Refer back to AGENTS.md requirements constantly
- Ask: "Is this explicitly required for the MVP?"
- Remember: "No archive, no search/filter. Keep it simple."
- Use explicit "out of scope" lists to deflect feature requests
- **Phase to Address**: All phases - maintain discipline throughout

### 6. Poor Error Handling Leading to Confusing UX
**Pitfall**: Either ignoring errors completely or showing technical error messages to users.
**Warning Signs**:
- Silent failures that leave users confused
- Console errors that users might see in dev tools
- Stack traces or technical details shown in UI
- No feedback when operations fail
**Prevention Strategy**:
- Validate inputs and show user-friendly messages when appropriate
- For MVP, assume well-formed user input and fail gracefully
- Log unexpected states to console for developers
- **Phase to Address**: Phase 1 (Foundation) - establish error handling approach

### 7. Inconsistent UI/Violating Design System
**Pitfall**: Creating UI that doesn't match the specified color scheme or feels inconsistent.
**Warning Signs**:
- Using hardcoded colors instead of theme variables
- Inconsistent spacing or typography
- Mixing different button styles
- Not following the color scheme from AGENTS.md
**Prevention Strategy**:
- Define Tailwind config with exact colors from requirements
- Create reusable UI components (Button, Input, Modal)
- Use component library approach for consistency
- Regular UI reviews against specification
- **Phase to Address**: Phase 1 (Foundation) - establish design system early

### 8. Over-Complex Drag and Drop Implementation
**Pitfall**: Building custom drag and drop when a library would suffice.
**Warning Signs**:
- Spending more than a day on DND implementation
- Complex state tracking for drag operations
- Reinventing drag overlay, animations, snap behavior
- Poor touch device support
**Prevention Strategy**:
- Use @dnd-kit or similar established library
- Focus on configuring the library, not reimplementing it
- Leverage library features (virtualization, accessibility, performance)
- **Phase to Address**: Phase 1 (Foundation) - use established DND solution

### 9. Neglecting Edge Cases in Card Operations
**Pitfall**: Not considering what happens when users perform unexpected actions.
**Warning Signs**:
- No validation when adding empty cards
- Cards disappearing when moved rapidly
- Unable to rename columns to same name (should be allowed)
- No handling of rapid successive actions
**Prevention Strategy**:
- Think through user flows: add, edit, delete, move, rename
- Consider rapid succession of same action
- Test boundary conditions (empty strings, special characters)
- **Phase to Address**: Phase 1 (Foundation) - consider edge cases during implementation

### 10. Inadequate Testing Leading to Regressions
**Pitfall**: Writing code without tests, leading to bugs when making changes.
**Warning Signs**:
- No test files created alongside components
- Manual testing only
- Fear of changing code because "it might break something"
- No confidence when refactoring
**Prevention Strategy**:
- Write tests as you develop (TDD or test-after)
- Test component behavior, not just rendering
- Test state transitions and edge cases
- Aim for meaningful coverage, not just line coverage
- **Phase to Address**: Phase 1 (Foundation) - test from the beginning

## Domain-Specific Pitfalls for Kanban Applications

### 11. Misunderstanding Column Purpose
**Pitfall**: Treating columns as statuses only, missing their workflow meaning.
**Warning Signs**:
- Columns named generically like "Column 1", "Column 2"
- No semantic meaning to column progression
- Ignoring that columns often represent workflow stages
**Prevention Strategy**:
- Remember columns can be renamed - they represent workflow stages
- Initial dummy data should show meaningful column names
- **Phase to Address**: Phase 1 (Foundation) - set up meaningful initial state

### 12. Poor Card Density Management
**Pitfall**: Allowing UI to become cluttered with too many cards or overly wide cards.
**Warning Signs**:
- Cards wrapping poorly in narrow columns
- No visual hierarchy within cards
- Long titles/details breaking layout
- No way to collapse or summarize cards
**Prevention Strategy**:
- Implement reasonable max-width for cards
- Use text truncation with tooltip on hover
- Consider card density in initial styling
- **Phase to Address**: Phase 1 (Foundation) - design for usable card density

### 13. Ignoring Drag and Drop Feedback
**Pitfall**: Providing insufficient feedback during drag operations.
**Warning Signs**:
- No visual indication of what is being dragged
- No drop zone highlighting
- No indication of where card will be inserted
- Jerky or unresponsive drag motion
**Prevention Strategy**:
- Use @dnd-kit's built-in feedback mechanisms
- Customize drag overlay for visual clarity
- Ensure smooth animations (60fps)
- **Phase to Address**: Phase 1 (Foundation) - implement proper DND feedback

### 14. Overlooking Mobile Touch Experience
**Pitfall**: Assuming drag and drop works the same on touch as mouse.
**Warning Signs**:
- Small drag handles hard to touch
- No touch-specific optimizations
- Ignoring that fingers are less precise than mouse cursors
- Not testing on actual touch devices
**Prevention Strategy**:
- Ensure minimum touch target size (48x48px)
- Test on iOS/Android devices or simulators
- Consider larger drag handles for touch
- **Phase to Address**: Phase 1 (Foundation) - design for touch from start

### 15. Incorrect Assumptions About Data Volume
**Pitfall**: Designing for hundreds or thousands of cards when MVP needs dozens.
**Warning Signs**:
- Implementing virtual scrolling, pagination, or infinite scroll
- Complex filtering/sorting implementations
- Server-side processing assumptions
- Over-engineering for scale that won't exist in MVP
**Prevention Strategy**:
- Design for tens of cards, not thousands
- Keep implementations simple for small data sets
- Optimize only if performance becomes an issue
- **Phase to Address**: Phase 2 (Optimization) - optimize for actual usage

## Prevention Checklist for Each Phase

### Phase 1: Foundation
- [ ] Use React Context + useReducer for state
- [ ] Implement accessible drag and drop with @dnd-kit
- [ ] Establish correct data models with UUIDs
- [ ] Follow specified color scheme exactly
- [ ] Keep scope strictly to MVP requirements
- [ ] Write tests alongside components
- [ ] Validate inputs and prevent invalid states
- [ ] Use established libraries, don't reinvent
- [ ] Consider edge cases in user flows
- [ ] Design for touch and mouse equally

### Phase 2: Polish and Optimization
- [ ] Measure actual performance before optimizing
- [ ] Refine UI/UX based on testing
- [ ] Address any accessibility issues found
- [ ] Improve error handling and user feedback
- [ ] Optimize only proven bottlenecks
- [ ] Add polish animations and transitions
- [ ] Ensure responsive design works well
- [ ] Clean up any temporary or debug code
- [ ] Verify all requirements are met
- [ ] Prepare for handoff or next phase

## Conclusion
By being aware of these pitfalls and implementing the prevention strategies outlined, the Kanban project can avoid common mistakes and deliver a high-quality MVP that meets the specified requirements. The key is maintaining discipline around simplicity, accessibility, and following the explicit constraints in AGENTS.md.