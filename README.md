# Claude Basics

A repository for learning and experimenting with Claude Code, Claude API, and Anthropic SDK patterns.

## What's Here

- **Examples** in `src/index.ts` demonstrating Claude API patterns:
  - Text generation with basic messages
  - Tool use (function calling) with a calculator example
  - Response streaming for real-time output
- **Custom Claude Code skills** for automating common workflows
- **MCP configurations** including Playwright for browser automation
- **Agents guide** for building with Claude Agent SDK

## Quick Start

### Prerequisites
- Node.js 18+
- Claude API key (for API examples)
- GitHub CLI (`gh`) for PR/commit workflows

### Setup
```bash
npm install
export ANTHROPIC_API_KEY=your_api_key_here
```

### Running Examples
```bash
# Run all examples (text generation, tool use, streaming)
npm run dev
```

This will execute:
- **Simple text generation** — Basic message to Claude
- **Tool use example** — Claude calling a calculator tool to solve math problems
- **Streaming example** — Real-time streaming of Claude's response

### Available Skills

Use these custom skills via `/skillname` in Claude Code:

- `/test` — Write Jest unit tests for a file or function
- `/bug` — Investigate and fix a bug with root-cause analysis
- `/review` — Perform a thorough code review
- `/commit` — Create a Conventional Commits message from staged changes
- `/pr` — Create a GitHub pull request with a clear description
- `/standup` — Generate a stand-up summary from git history and open PRs
- `/run-in-browser` — Test UI flows using browser automation

## Configuration

### Claude Code Settings
- **Skills**: Located in `.claude/commands/`
- **MCPs**: Configured in `.claude/settings.local.json`
  - Includes Playwright for browser automation
  - Browser automation tools for testing

### Agents Guide
See [AGENTS.md](.claude/AGENTS.md) for guidance on building with Claude Agent SDK.

## Conventions

This repo follows these conventions:

- **TypeScript strict mode** — always
- **Functional style** — arrow functions, map/filter/reduce
- **Functions ≤ 40 lines** — single responsibility principle
- **Explicit error handling** — never swallow exceptions
- **No `any` types** — unless documented with a comment
- **Jest + React Testing Library** — for unit and component tests
- **Conventional Commits** — `feat(scope): description`

See [.claude/CLAUDE.md](.claude/CLAUDE.md) for full project guidance.

## Resources

- [Claude API Docs](https://docs.anthropic.com)
- [Claude Agent SDK](https://github.com/anthropics/anthropic-sdk-python)
- [Engineer Playbook](https://engineerplaybook.io)

## License

MIT