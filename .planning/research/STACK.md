# Kanban Project Technology Stack

## Overview
This document outlines the recommended technology stack for building a Kanban-style project management application as specified in the project requirements.

## Recommended Stack (2025)

### Frontend Framework
- **Next.js 16.2.1** - React framework for production-ready web applications
  - *Why*: Provides excellent developer performance, built-in optimization, and seamless deployment
  - *Version*: 16.2.1 (latest stable as of 2025)
  - *Alternatives considered*: Create React App, Vite, Remix
  - *What NOT to use*: Overly complex frameworks like Angular or enterprise solutions

### UI Library
- **React 19.2.4** - Core UI library
  - *Why*: Latest stable React with improved concurrent features and automatic batching
  - *Version*: 19.2.4
  - *Alternatives considered*: Preact, Inferno
  - *What NOT to use*: Outdated React versions (<18) or direct DOM manipulation

### Styling
- **Tailwind CSS** - Utility-first CSS framework
  - *Why*: Enables rapid UI development with consistent design system, minimal CSS bundle size
  - *Version*: Latest stable (4.x as of 2025)
  - *Alternatives considered*: CSS Modules, Styled Components, Emotion
  - *What NOT to use*: Global CSS, CSS-in-JS with runtime overhead

### State Management
- **React Context API + useReducer** - Built-in React state management
  - *Why*: Simple, lightweight, no additional dependencies needed for MVP scope
  - *Alternatives considered*: Redux, Zustand, Jotai, Recoil
  - *What NOT to use*: Over-engineered state management for simple UI state

### Drag and Drop
- **@dnd-kit/core** - Modern, accessible drag-and-drop toolkit
  - *Why*: Lightweight (~7KB gzipped), accessible, good performance, actively maintained
  - *Version*: Latest stable (6.x as of 2025)
  - *Alternatives considered*: React Beautiful DND (deprecated), react-dragula
  - *What NOT to use*: HTML5 drag-and-drop API directly (poor accessibility and browser inconsistency)

### Type Safety
- **TypeScript 5.4.x** - Typed superset of JavaScript
  - *Why*: Catch errors at compile time, improve developer experience, better refactoring
  - *Version*: 5.4.x (latest LTS)
  - *Alternatives considered*: JavaScript with PropTypes, Flow
  - *What NOT to use*: Plain JavaScript without type safety

### Testing
- **Jest** - JavaScript testing framework
  - *Why*: Popular, well-documented, great mocking capabilities, fast execution
  - *Version*: Latest stable (29.x as of 2025)
  - *Alternatives considered*: Vitest, Playwright (for unit testing overkill)
  - *What NOT to use*: Mocha/Chai (more setup), AVA (less community support)

### Linting
- **ESLint** - Pluggable JavaScript/TypeScript linter
  - *Why*: Industry standard, extensible, catches syntax errors and enforces code style
  - *Version*: Latest stable (9.x as of 2025)
  - *Configuration*: eslint-config-next + plugin:@typescript-eslint
  - *Alternatives considered*: JSHint (outdated), StandardJS (opinionated)
  - *What NOT to use*: No linting, inconsistent code style

### Development Tools
- **Next.js Dev Server** - Built-in development server with hot module replacement
- **VS Code** - Recommended IDE with extensions for TypeScript, Tailwind, ESLint
- **Git** - Version control (already initialized)

## Rationale Summary
This stack was chosen to:
1. **Maximize development speed** - Modern tools with excellent DX
2. **Ensure maintainability** - Type safety, linting, testing
3. **Keep bundle size small** - Essential libraries only, no bloat
4. **Follow best practices** - Accessibility, performance, security
5. **Align with requirements** - Simple, elegant UI focus without over-engineering

## Dependencies to Avoid
- State management libraries (Redux, MobX) - unnecessary for simple UI state
- CSS frameworks (Bootstrap, Material-UI) - overkill, harder to customize
- Complex animation libraries - not needed for basic drag-and-drop
- Form libraries - simple forms don't require abstraction
- Date libraries - no date handling in MVP
- HTTP clients (Axios) - no backend communication in MVP
- Icon libraries - SVG icons can be inlined or use simple alternatives