---
description: Perform a thorough code review of staged changes or a specified file/PR
---

Review the following. If no argument is given, run `git diff --staged` first.

Target: $ARGUMENTS

Evaluate across these dimensions and output findings grouped by severity:

## Critical — must fix before merge
- Logic bugs or off-by-one errors
- Security vulnerabilities (XSS, exposed secrets, missing auth checks, open redirects)
- Data loss risks (missing error handling, fire-and-forget async calls)
- Breaking changes without a major version bump

## Major — should fix
- Missing error handling or unhandled promise rejections
- Functions exceeding 40 lines or doing more than one thing
- Missing TypeScript types (`any`, implicit `any`)
- Hardcoded values that should be env vars
- Accessibility issues (missing alt text, no keyboard navigation, poor contrast)

## Minor / Nit
- Naming inconsistencies or unclear variable names
- `console.log` left in code
- Redundant or dead code
- Missing JSDoc on exported functions/components

## Summary
End with:
- Files changed (list them)
- Risk level: Low / Medium / High
- One-line verdict: ready to merge or not
