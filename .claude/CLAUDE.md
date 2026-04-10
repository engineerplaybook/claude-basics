# Claude Basics — Project Guidelines

Local project-specific instructions for Claude Code. Overrides global `~/.claude/CLAUDE.md` when relevant.

## Project Context

**Purpose**: Learning and examples for Claude API, Claude Code, and Anthropic SDK patterns.

**Key directories**:
- `src/` — Main source code
- `src/examples/` — Claude API usage examples
- `tests/` — Test files (co-located with source: `file.test.ts`)

## Conventions

### Code Style
- TypeScript with `strict: true` — mandatory
- Functional style: arrow functions, avoid classes unless necessary
- Functions should be ≤ 40 lines and do one thing
- Use clear variable names: `userToken` not `t`, `isLoading` not `flag`
- Prefer `const` over `let`; never use `var`

### Error Handling
- Always handle errors explicitly — never swallow exceptions silently
- Use try-catch for async operations
- Throw descriptive errors with context

### TypeScript
- No `any` without a comment explaining why (e.g. `// any: third-party lib lacks types`)
- Prefer interfaces over types for public APIs
- Use strict null checks — handle null/undefined explicitly

### Testing
- Jest for unit tests
- React Testing Library for component tests (if applicable)
- Test files co-located: `utils.ts` → `utils.test.ts`
- Target 80%+ coverage on critical paths
- Test behavior, not implementation

### Git Workflow
- Never commit directly to `main` — always open a PR
- Branch naming: `feat/`, `fix/`, `chore/`, `docs/`
- Conventional Commits format: `feat(scope): short description`
- Run `npm run lint` and `npm test` before committing
- No force-pushing to `main`

## Defaults for Claude Code

### When Reviewing Code
Apply these checks:
- Logic correctness (off-by-one errors, type mismatches)
- Security (XSS, secrets, auth checks, open redirects)
- Error handling (missing try-catch, unhandled rejections)
- Performance (N+1 queries, unnecessary re-renders)
- Accessibility (alt text, keyboard nav, contrast)

### When Writing Code
- Prefer diffs over full rewrites for small changes
- Don't add features beyond what was requested
- Don't add comments/docstrings unless logic is non-obvious
- Avoid premature abstractions
- Delete unused code cleanly; don't leave commented-out code

### When Debugging
- Read error messages and stack traces carefully
- Check assumptions: read the code before proposing fixes
- Diagnose root cause, not just symptoms
- Write a test that would have caught the bug

## Build & Test

```bash
# Install dependencies
npm install

# Run linter
npm run lint

# Run tests
npm test

# Build (if applicable)
npm run build
```

## Resources

- [Claude API Reference](https://docs.anthropic.com/en/api)
- [Engineer Playbook](https://engineerplaybook.io)
- Global instructions: `~/.claude/CLAUDE.md`
