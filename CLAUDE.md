# Kanban Project - Claude Code Automation Recommendations

## Codebase Profile
- **Type**: Frontend web application
- **Framework**: Next.js 16.2.1 with React 19.2.4
- **Key Libraries**: @dnd-kit (drag-and-drop), TypeScript, Jest, ESLint, Tailwind CSS

---

## 🔌 MCP Servers

### context7
**Why**: The codebase uses Next.js, React, and @dnd-kit libraries where documentation lookup would be valuable for understanding APIs, migration guides, and best practices
**Install**: `claude mcp add context7`

---

## 🎯 Skills

### frontend-design
**Why**: This is a frontend-heavy Next.js application with React components that could benefit from specialized frontend development assistance
**Create**: `.claude/skills/frontend-design/SKILL.md`
**Invocation**: Both
**Also available in**: frontend-design plugin
```yaml
---
name: frontend-design
description: Assist with frontend development tasks including component creation, styling, state management, and UI/UX improvements
disable-model-invocation: false
user-invocable: true
---
```

### gen-test
**Why**: The project has Jest tests but could benefit from automated test generation for the drag-and-drop functionality and component interactions
**Create**: `.claude/skills/gen-test/SKILL.md`
**Invocation**: User-only
```yaml
---
name: gen-test
description: Generate test files with example tests for components and utilities
disable-model-invocation: true
---
```

---

## ⚡ Hooks

### auto-format-on-edit
**Why**: ESLint is configured in the project, so automatic formatting on edit would maintain code consistency
**Where**: `.claude/settings.json`
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "tools": ["Edit", "Write"],
        "commands": ["npx eslint --fix"]
      }
    ]
  }
}
```

### pre-commit-validation
**Why**: Prevent committing code with lint errors or test failures
**Where**: `.claude/settings.json`
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash(git commit:*)",
        "tools": ["Bash"],
        "commands": ["npm run lint && npm test"]
      }
    ]
  }
}
```

---

## 🤖 Subagents

### code-reviewer
**Why**: The codebase has multiple components (KanbanBoard, Column, Card, etc.) that would benefit from parallel code review to maintain quality
**Where**: `.claude/agents/code-reviewer.md`
```yaml
name: code-reviewer
description: Review code for bugs, logic errors, security vulnerabilities, and code quality issues
tools: [*]
```

### test-writer
**Why**: The project has a tests directory but could benefit from automated test generation for new components and features
**Where**: `.claude/agents/test-writer.md`
```yaml
name: test-writer
description: Generate tests for new code and improve test coverage
tools: [Read, Write, Edit, Grep, Glob]
```

---

**Want more?** Ask for additional recommendations for any specific category (e.g., "show me more MCP server options" or "what other hooks would help?").

**Want help implementing any of these?** Just ask and I can help you set up any of the recommendations above.