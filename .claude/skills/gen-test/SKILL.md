---
name: gen-test
description: Generate test files with example tests for components and utilities
disable-model-invocation: true
---

# Test Generation Skill

This skill generates test files with example tests for components and utilities, helping to improve test coverage and establish testing patterns.

## Capabilities

- Generate test files for React components
- Create unit tests for utility functions
- Generate test files following Jest conventions
- Create test templates with common patterns
- Generate mocks and test data
- Set up testing utilities and helpers

## Usage

This skill is user-only and can be invoked with:
```
/gen-test [target file or description]
```

Examples:
- `/gen-test src/components/Button.tsx`
- `/gen-test src/utils/formatDate.ts`
- `/gen-test Create tests for the KanbanBoard component`

## Guidelines

When generating tests:
1. Follow the existing testing patterns in the codebase (Jest + React Testing Library)
2. Generate meaningful test names that describe behavior
3. Test both positive and negative cases
4. Include edge cases where appropriate
5. Mock external dependencies appropriately
6. Keep tests focused and isolated
7. Use appropriate assertions for the functionality being tested

## Test Patterns

For React components, generate tests that:
- Render the component successfully
- Test interactive elements (buttons, inputs, etc.)
- Verify state changes and UI updates
- Test props and their effects
- Check accessibility attributes when relevant

For utility functions, generate tests that:
- Cover normal input cases
- Test edge cases and boundary conditions
- Verify error handling
- Check return types and values