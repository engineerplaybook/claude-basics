---
description: Investigate, diagnose, and fix a bug with full root-cause analysis
---

Bug report: $ARGUMENTS

Investigate and fix this bug using the following process:

## Step 1 — Locate
- Identify the exact file(s), function(s), and line(s) involved
- Read all relevant code — do not guess; read before modifying

## Step 2 — Reproduce
- Describe exactly what the code does vs. what it should do
- Identify whether this is: logic error | type error | race condition | missing null check | missing guard | dependency issue

## Step 3 — Root Cause
- Identify the root cause, not just the symptom
- Check: could this affect other parts of the codebase?

## Step 4 — Fix
- Apply the minimal correct fix — do NOT refactor unrelated code
- Add a defensive check if the root cause is a missing guard

## Step 5 — Test
- Write or update a test that would have caught this bug
- Run `npm run lint` and `npm test`

## Step 6 — Summary
- One sentence: what was broken
- One sentence: what the fix does
- List any other files that may need a follow-up check
