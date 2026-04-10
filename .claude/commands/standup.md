---
description: Generate today's stand-up summary from recent git history and open PRs
---

1. Run: `git log --oneline --since="yesterday 9am" --author="$(git config user.email)"`
2. Run: `gh pr list --author "@me" --state open` (if gh CLI is available)
3. Check for any TODO/FIXME left in source: `grep -r "TODO\|FIXME" src --include="*.ts" --include="*.tsx" -l 2>/dev/null`

Write a stand-up in this format (5 bullets max per section):

**Yesterday**
What I actually completed (from git log — be specific)

**Today**
What I plan to work on (infer from open PRs, branch names, or ask me)

**Blockers**
$ARGUMENTS (use "none" if I haven't mentioned any)

Rules:
- Keep the whole stand-up under 150 words
- Format it ready to paste into Slack
- No emojis
