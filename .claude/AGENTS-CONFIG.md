# Agents Configuration Guide

Complete configuration guide for running Claude agents in this project.

## Quick Start

### 1. Set Your API Key

```bash
export ANTHROPIC_API_KEY=your_key_here
```

### 2. Run an Example Agent

```bash
npm run dev
# or run specific agents:
ts-node src/agents/basic-agent.ts
ts-node src/agents/workflow-agent.ts
ts-node src/agents/research-agent.ts
```

## Agent Configuration

Each agent can be configured via:

### Environment Variables
```bash
ANTHROPIC_API_KEY=sk-...
AGENT_MODEL=claude-opus-4-6
AGENT_MAX_TOKENS=4096
AGENT_MAX_ITERATIONS=10
```

### Programmatic Configuration

```typescript
import { createAgentConfig, runAgentLoop } from "./agents";

const config = createAgentConfig(tools, {
  model: "claude-opus-4-6",
  maxTokens: 4096,
  maxIterations: 10
});

const result = await runAgentLoop(client, config, messages, toolExecutor);
```

## Agent Types

### 1. Basic Agent
**File**: `src/agents/basic-agent.ts`

**Purpose**: Simple agent with tools that responds to queries

**Tools Available**:
- `get_weather` — Fetch weather data
- `get_time` — Get time for a location

**Example**:
```bash
ts-node src/agents/basic-agent.ts
```

**Use Case**: Learning the basics of agent loops and tool use

### 2. Workflow Agent
**File**: `src/agents/workflow-agent.ts`

**Purpose**: Manages tasks and coordinates multi-step processes

**Tools Available**:
- `list_tasks` — View all tasks with filtering
- `update_task` — Change task status or assignee
- `create_task` — Create new tasks
- `get_summary` — Get workflow progress summary

**Example**:
```bash
ts-node src/agents/workflow-agent.ts
```

**Use Case**: Task management, project workflows, process automation

### 3. Research Agent
**File**: `src/agents/research-agent.ts`

**Purpose**: Gathers and synthesizes information

**Tools Available**:
- `search_documents` — Search documentation
- `fetch_resource` — Retrieve specific resources
- `analyze_findings` — Synthesize insights from findings

**Example**:
```bash
ts-node src/agents/research-agent.ts
```

**Use Case**: Information gathering, documentation research, knowledge synthesis

## Building Custom Agents

### Step 1: Define Tools

```typescript
const tools: Anthropic.Messages.Tool[] = [
  {
    name: "my_tool",
    description: "What this tool does",
    input_schema: {
      type: "object",
      properties: {
        param: {
          type: "string",
          description: "Parameter description"
        }
      },
      required: ["param"]
    }
  }
];
```

### Step 2: Implement Tool Executor

```typescript
function executeMyTool(
  toolName: string,
  input: Record<string, unknown>
): unknown {
  switch (toolName) {
    case "my_tool":
      return { result: `Processed ${input.param}` };
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}
```

### Step 3: Run the Agent Loop

```typescript
const client = new Anthropic();

const messages: Anthropic.Messages.MessageParam[] = [
  {
    role: "user",
    content: "User request here"
  }
];

let response = await client.messages.create({
  model: "claude-opus-4-6",
  max_tokens: 4096,
  tools,
  messages
});

// Handle tool_use stop reason...
while (response.stop_reason === "tool_use") {
  // Process tool calls and add results
  // Get next response...
}
```

## Best Practices

### 1. Tool Design
- **One responsibility**: Each tool should do one thing well
- **Clear input schema**: Validate all inputs
- **Meaningful outputs**: Return structured, useful data
- **Error handling**: Never crash; return error messages

### 2. Agent Prompting
- **Clear instructions**: Tell the agent exactly what to do
- **Constraints**: Specify what NOT to do
- **Examples**: Show how to use tools effectively
- **Context**: Provide relevant background information

### 3. Iteration Limits
- Always set max iterations (default: 10)
- Prevents infinite loops
- Saves on token usage
- Improves predictability

```typescript
const config = createAgentConfig(tools, model, maxTokens, maxIterations);
```

### 4. Error Handling
- Catch tool execution errors
- Return useful error messages to the agent
- Log errors for debugging
- Never expose sensitive data in errors

### 5. Monitoring & Logging

```typescript
const result = await runAgentLoop(client, config, messages, toolExecutor);

console.log(`Iterations: ${result.iterationsUsed}`);
console.log(`Tool calls: ${result.toolCallCount}`);
console.log(`Final response: ${result.finalResponse}`);
```

## Common Issues

### Issue: Agent loops forever

**Solution**: 
- Lower `maxIterations` in config
- Check tool executor for issues
- Add more specific constraints to prompt

### Issue: Tool calls fail silently

**Solution**:
- Add error handling in tool executor
- Log all tool inputs and outputs
- Return descriptive error messages

### Issue: Slow agent execution

**Solution**:
- Optimize tool execution speed
- Reduce max tokens if not needed
- Use faster models for testing
- Add caching for repeated queries

### Issue: Agent gives wrong answer

**Solution**:
- Improve tool descriptions (be more specific)
- Add examples to the prompt
- Check tool output format
- Test individual tools separately

## Advanced Patterns

### Multi-Agent Coordination

```typescript
// Agent 1: Research
const researchResult = await runAgent(researchConfig, researchMessages);

// Agent 2: Synthesize
const synthesizeMessages = [
  ...synthesizeMessages,
  {
    role: "user",
    content: `Based on this research: ${researchResult}`
  }
];
const finalResult = await runAgent(synthesizeConfig, synthesizeMessages);
```

### Tool Caching

```typescript
const toolCache = new Map();

function executeToolWithCache(name: string, input: Record<string, unknown>) {
  const key = `${name}:${JSON.stringify(input)}`;
  if (toolCache.has(key)) {
    return toolCache.get(key);
  }
  const result = executeTool(name, input);
  toolCache.set(key, result);
  return result;
}
```

### Conditional Tool Loading

```typescript
const baseTools = [...commonTools];
const advancedTools = config.includeAdvanced ? [...advancedOnly] : [];
const allTools = [...baseTools, ...advancedTools];
```

## Testing Agents

### Unit Test Example

```typescript
import { runAgentLoop, createAgentConfig } from "../agents";

describe("MyAgent", () => {
  it("should complete basic task", async () => {
    const config = createAgentConfig(testTools);
    const messages: Anthropic.Messages.MessageParam[] = [
      { role: "user", content: "test request" }
    ];
    
    const result = await runAgentLoop(client, config, messages, testExecutor);
    
    expect(result.finalResponse).toContain("expected output");
    expect(result.iterationsUsed).toBeLessThan(5);
  });
});
```

## Resources

- [Claude API Docs](https://docs.anthropic.com)
- [Tool Use Guide](https://docs.anthropic.com/en/docs/build-a-system-with-claude/tool-use)
- [Agent Examples](../src/agents/)
- [MCP Setup](./MCP-SETUP.md)
