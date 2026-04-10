# Quick Start Guide

Get up and running with Claude basics in 5 minutes.

## Prerequisites

- Node.js 18+ (`node --version`)
- npm 9+ (`npm --version`)
- Claude API key from [Anthropic Console](https://console.anthropic.com)

## Setup

### 1. Clone and Install

```bash
cd /Users/anmolthukral/projects/claude-basics/claude-basics
npm install
```

### 2. Set API Key

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Or create `.env` file:
```
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run Examples

```bash
# Run all basic examples
npm run dev

# Run specific agent
ts-node src/agents/basic-agent.ts
ts-node src/agents/workflow-agent.ts
ts-node src/agents/research-agent.ts

# Run tests
npm test

# Check code quality
npm run lint
```

## Project Structure

```
claude-basics/
├── src/
│   ├── index.ts                 # Basic API examples
│   ├── agents/
│   │   ├── index.ts            # Agent utilities
│   │   ├── basic-agent.ts       # Simple tool use example
│   │   ├── workflow-agent.ts    # Task management agent
│   │   └── research-agent.ts    # Information gathering agent
│   └── examples/                 # Additional examples (optional)
├── .claude/
│   ├── CLAUDE.md                # Project guidelines
│   ├── AGENTS.md                # Agent SDK guide
│   ├── AGENTS-CONFIG.md         # Agent configuration
│   ├── MCP-SETUP.md             # MCP servers guide
│   ├── settings.local.json      # Claude Code settings
│   └── commands/                # Custom Claude Code skills
│       ├── test.md
│       ├── review.md
│       ├── bug.md
│       ├── commit.md
│       ├── pr.md
│       ├── standup.md
│       └── run-in-browser.md
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc.json
└── README.md
```

## Common Tasks

### Run a Simple API Call

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const message = await client.messages.create({
  model: "claude-opus-4-6",
  max_tokens: 1024,
  messages: [
    { role: "user", content: "Hello, Claude!" }
  ]
});

console.log(message.content);
```

### Use Tools with Agents

```typescript
const tools = [
  {
    name: "my_tool",
    description: "What it does",
    input_schema: { /* ... */ }
  }
];

let response = await client.messages.create({
  model: "claude-opus-4-6",
  max_tokens: 4096,
  tools,
  messages: [{ role: "user", content: "user request" }]
});

// Handle tool_use stop reason and process tool calls
while (response.stop_reason === "tool_use") {
  // ... process tool calls ...
}
```

### Test Code Quality

```bash
# Lint
npm run lint

# Run tests
npm test

# Fix lint errors
npm run lint:fix
```

### Use Claude Code Skills

In Claude Code, type:

```
/test src/utils.ts
/bug "describe the bug"
/review
/commit
/pr
```

## Next Steps

1. **Learn basics**: Read [README.md](README.md)
2. **Understand agents**: Read [.claude/AGENTS.md](.claude/AGENTS.md)
3. **Configure agents**: Follow [.claude/AGENTS-CONFIG.md](.claude/AGENTS-CONFIG.md)
4. **Setup MCPs**: Review [.claude/MCP-SETUP.md](.claude/MCP-SETUP.md)
5. **Project guidelines**: Check [.claude/CLAUDE.md](.claude/CLAUDE.md)

## Useful Resources

- [Claude API Docs](https://docs.anthropic.com)
- [API Reference](https://docs.anthropic.com/en/api/getting-started)
- [Tool Use Guide](https://docs.anthropic.com/en/docs/build-a-system-with-claude/tool-use)
- [MCP Specification](https://modelcontextprotocol.io)

## Troubleshooting

### API Key Error
```
Error: API key not found. Set ANTHROPIC_API_KEY environment variable.
```
**Solution**: Check `.env` file or terminal environment variable:
```bash
echo $ANTHROPIC_API_KEY
```

### Module Not Found
```
Error: Cannot find module '@anthropic-ai/sdk'
```
**Solution**: Install dependencies:
```bash
npm install
```

### TypeScript Errors
```
error TS2322: Type 'string' is not assignable to type 'string'
```
**Solution**: Check tsconfig.json and rebuild:
```bash
npm run build
```

### Agent Loops Forever
```
Agent keeps calling tools without stopping
```
**Solution**: Check `maxIterations` in agent config (default: 10)

## Tips

1. **Start with basic examples** before running agents
2. **Use `max_tokens: 4096`** for agents with tools
3. **Always set `maxIterations`** to prevent infinite loops
4. **Log tool calls** for debugging: `console.log(toolName, input)`
5. **Test tools individually** before using in agents
6. **Use streaming** for better user experience

## Getting Help

- Check [.claude/AGENTS-CONFIG.md](.claude/AGENTS-CONFIG.md) for common issues
- Review agent examples in `src/agents/`
- Search [Claude docs](https://docs.anthropic.com)
- Report issues at [Engineer Playbook](https://engineerplaybook.io)

## What to Build Next

1. **Data Processing Agent**: Read CSV, transform data, write output
2. **Email Analyzer**: Classify emails, extract insights
3. **Code Review Bot**: Analyze PRs, suggest improvements
4. **Documentation Generator**: Create docs from code
5. **Customer Support Chatbot**: Answer questions from knowledge base

Happy building! 🚀
