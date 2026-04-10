---
description: Write unit tests for a given file or function, co-located with the source
---

Target: $ARGUMENTS

Write Jest unit tests (+ React Testing Library for components) for the specified file or function.

## Step 1 — Read the source
- Read the target file in full before writing any tests
- Identify: exported functions / components, their inputs, outputs, and side effects
- Note any dependencies to mock (API calls, modules, context providers)

## Step 2 — Identify test cases
For each export, cover:
- Happy path — expected input produces expected output
- Edge cases — empty input, null, undefined, boundary values
- Error paths — thrown errors, rejected promises, invalid args
- For React components: renders correctly, user interactions (click, type, submit), conditional rendering

## Step 3 — Write tests
- Place the test file at: same directory as source, named `<filename>.test.ts` or `<filename>.test.tsx`
- Import from the source file using relative paths
- Mock external dependencies with `jest.mock()` — do not make real network calls
- Use `describe` blocks grouped by function/component name
- Use plain English `it('...')` descriptions: `it('returns null when list is empty')`
- No `any` in test code; type all mock return values

## Step 4 — Run and verify
- Run `npm test -- --testPathPattern=<filename>` inside the relevant app
- Fix any failures before finishing
- Report: number of tests written, coverage of the target file (if measurable), any edge cases skipped and why
