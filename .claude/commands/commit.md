---
description: Generate a Conventional Commits message from staged changes and commit
---

$ARGUMENTS

1. Run `git diff --staged`. If nothing is staged, run `git status` and `git diff HEAD`,
   then stage all relevant changes with `git add -A` (excluding .env, secrets, DS_Store).

2. Draft a commit message following Conventional Commits:
   - Format: `<type>(<scope>): <short imperative description>`
   - Types: `feat` | `fix` | `docs` | `style` | `refactor` | `perf` | `test` | `chore` | `ci`
   - Body (optional): bullet points explaining WHY, not what
   - Footer: `BREAKING CHANGE: <description>` if applicable

3. Show me the proposed commit message and WAIT for my approval before committing.

4. Once I approve (reply "ok", "yes", or "go"), run:
   ```
   git commit -m "<approved message>"
   ```

5. Show the commit hash and one-line summary.
