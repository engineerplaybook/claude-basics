---
description: Create a GitHub pull request for the current branch with a clear description
---

$ARGUMENTS

1. Run these to understand the current state:
   - `git status`
   - `git log main..HEAD --oneline`
   - `git diff main...HEAD --stat`
   - `gh pr list --author "@me" --state open` (check if a PR already exists)

2. If a PR already exists for this branch, output the URL and stop.

3. Draft a PR using this template:

   **Title**: `<type>(<scope>): <imperative summary>` (max 70 chars)

   **Body**:
   ```
   ## What
   <1-3 bullets describing the change>

   ## Why
   <1-2 sentences on the motivation>

   ## How to test
   - [ ] <step 1>
   - [ ] <step 2>
   ```

4. Show me the draft and WAIT for my approval before creating the PR.

5. Once approved, run:
   ```
   git push -u origin HEAD
   gh pr create --title "<title>" --body "<body>"
   ```

6. Output the PR URL.
