# MCP Server Setup Guide

This guide covers configuring Model Context Protocol (MCP) servers for Claude Code and agents.

## What are MCPs?

MCPs (Model Context Protocol) servers provide tools and resources that Claude can use:
- **Tools**: Functions the model can call (search, fetch, execute)
- **Resources**: Accessible data and context (documents, APIs, databases)
- **Prompts**: Pre-built prompts for common tasks

## Available MCPs

### 1. Playwright Browser (built-in)

Browser automation for UI testing and web scraping.

**Tools**:
- `browser_open` — Open a URL
- `browser_click` — Click elements
- `browser_type` — Type in fields
- `browser_screenshot` — Take screenshots
- `browser_navigate` — Navigate to URL
- `browser_get_text` — Extract text

**Setup**: Already configured in `settings.local.json`

**Example**:
```bash
/run-in-browser "click the login button and screenshot"
```

### 2. Filesystem (Custom Implementation)

Access project files and structure.

**Tools**:
- `read_file` — Read file contents
- `write_file` — Create/update files
- `list_directory` — List files in a directory
- `search_files` — Search file contents

**Usage**: Already available via Claude Code's built-in tools.

### 3. Git Integration

Access git history, diffs, and repository information.

**Tools**:
- `git_log` — View commit history
- `git_diff` — See changes
- `git_status` — Repository status
- `git_blame` — Author attribution

**Usage**: Available via Claude Code's bash commands.

## Configuration

### Local Settings (`settings.local.json`)

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test)",
      "mcp__browser__browser_open",
      "mcp__browser__browser_screenshot"
    ]
  },
  "mcps": {
    "browser": {
      "command": "playwright",
      "args": ["run", "pw"]
    }
  }
}
```

### Adding a New MCP

1. **Define the MCP** in `settings.local.json`:
   ```json
   "mcps": {
     "myserver": {
       "command": "node",
       "args": ["/path/to/mcp/server.js"]
     }
   }
   ```

2. **Implement tools** in your MCP server

3. **Use in agents**:
   ```typescript
   const tools: Anthropic.Messages.Tool[] = [
     {
       name: "tool_name",
       description: "...",
       input_schema: { /* ... */ }
     }
   ];
   ```

## Security & Permissions

### Permission Levels

- **`allow`** — Explicitly permitted operations (whitelist)
- **`deny`** — Explicitly blocked operations
- **Default** — Require user approval per operation

### Safe Practices

1. **Limit tool access**: Only grant tools the agent needs
2. **Validate inputs**: Check all tool parameters
3. **Handle errors**: Never expose system details in errors
4. **Rate limiting**: Prevent resource exhaustion
5. **Audit logging**: Track all tool usage

Example safe permission:
```json
"allow": [
  "Bash(npm test)",
  "Bash(npm run lint)",
  "Bash(git status)",
  "mcp__browser__browser_open",
  "mcp__browser__browser_screenshot"
]
```

## Common Patterns

### Pattern 1: Research Agent

Uses multiple search and fetch tools:

```typescript
const tools = [
  { name: "search_docs", ... },
  { name: "fetch_url", ... },
  { name: "analyze_content", ... }
];
```

### Pattern 2: Automation Agent

Uses system commands and file operations:

```typescript
const tools = [
  { name: "run_command", ... },
  { name: "read_file", ... },
  { name: "write_file", ... },
  { name: "check_status", ... }
];
```

### Pattern 3: Testing Agent

Uses browser and test execution tools:

```typescript
const tools = [
  { name: "browser_open", ... },
  { name: "browser_interact", ... },
  { name: "run_tests", ... },
  { name: "check_coverage", ... }
];
```

## Troubleshooting

### Tool Not Available

**Issue**: Tool shows as unavailable in agent

**Solutions**:
1. Check `settings.local.json` permissions
2. Verify MCP server is running
3. Confirm tool name matches definition
4. Check for typos in tool name

### MCP Server Crash

**Issue**: MCP server exits unexpectedly

**Solutions**:
1. Check server logs for errors
2. Verify node/python version compatibility
3. Check for missing dependencies
4. Review resource usage (memory, CPU)

### Slow Tool Execution

**Issue**: Tools are slow to respond

**Solutions**:
1. Add caching for repeated queries
2. Optimize database queries
3. Use pagination for large results
4. Consider async execution for long tasks

## Resources

- [MCP Specification](https://modelcontextprotocol.io)
- [Playwright API](https://playwright.dev/docs/api)
- [Claude Agent Documentation](https://docs.anthropic.com)
