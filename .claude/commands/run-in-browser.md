---
description: Open the app in a browser, run a UI flow, and report what happened
---

Target: $ARGUMENTS

Use the browser MCP tool to test the UI. Infer the local dev URL from app context or use the provided URL.

## Step 1 — Open
- Navigate to the target URL
- Take a screenshot to confirm the page loaded correctly
- Report: page title, any console errors, any visible layout issues

## Step 2 — Run the flow
- If $ARGUMENTS describes a specific flow (e.g. "click the login button", "fill in the contact form"), execute it step by step
- After each meaningful action, take a screenshot
- If no flow is specified, do a basic smoke test: scroll the page, click the primary CTA, check nav links

## Step 3 — Report
Output a concise report:
- URL tested
- Steps executed (numbered)
- Pass / Fail for each step with a one-line reason
- Any JS console errors or network failures observed
- Screenshot filenames (if saved)
- Overall verdict: working / broken / needs investigation
