# Agents Guide — Building with Claude Agent SDK

Reference guide for building Claude agents using the Anthropic SDK.

## Overview

Claude agents are autonomous programs that can:
- Think through problems step-by-step
- Use tools to gather information and take actions
- Iterate until they achieve their goal
- Handle complex, multi-step workflows

## Getting Started

### Basic Setup

```python
from anthropic import Anthropic

client = Anthropic()

def create_agent(tools=None):
    """Create a basic agent that can use tools"""
    return {
        "model": "claude-opus-4-6",
        "tools": tools or [],
        "max_tokens": 4096
    }
```

### Tool Definition

Tools are functions the agent can call to interact with the world:

```python
tools = [
    {
        "name": "search_documentation",
        "description": "Search the API documentation for answers",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query"
                }
            },
            "required": ["query"]
        }
    }
]
```

### Agentic Loop

The core loop for agent execution:

```python
def run_agent(user_message, tools):
    """Run an agent in a loop until completion"""
    messages = [{"role": "user", "content": user_message}]
    
    while True:
        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )
        
        # Check if agent wants to use a tool
        if response.stop_reason == "tool_use":
            # Process tool calls and add results to messages
            messages.append({"role": "assistant", "content": response.content})
            # ... handle tool execution ...
            messages.append({"role": "user", "content": tool_results})
        else:
            # Agent is done
            return response.content
```

## Best Practices

### Agent Design
- **Clear purpose**: Each agent should have a well-defined responsibility
- **Focused tools**: Give agents only the tools they actually need
- **Error handling**: Plan for tool failures and edge cases
- **Iteration limits**: Set max iterations to prevent infinite loops

### Tool Implementation
- **Deterministic**: Tools should return consistent results
- **Descriptive errors**: Include context when tools fail
- **Type safety**: Validate tool inputs before execution
- **Performance**: Minimize tool latency for better UX

### Prompting
- **System instructions**: Provide clear context about the agent's role
- **Examples**: Show the agent how to use tools effectively
- **Constraints**: Specify what the agent should NOT do
- **Reasoning**: Ask the agent to explain its approach

## Common Patterns

### Workflow Agent
An agent that orchestrates multi-step workflows:

```python
tools = [
    {"name": "fetch_data", "description": "..."},
    {"name": "process_data", "description": "..."},
    {"name": "save_results", "description": "..."}
]
```

### Research Agent
An agent that gathers information and synthesizes insights:

```python
tools = [
    {"name": "search_web", "description": "..."},
    {"name": "fetch_document", "description": "..."},
    {"name": "analyze_content", "description": "..."}
]
```

### Coding Agent
An agent that can read, write, and test code:

```python
tools = [
    {"name": "read_file", "description": "..."},
    {"name": "write_file", "description": "..."},
    {"name": "run_tests", "description": "..."}
]
```

## Debugging & Monitoring

### Logging
Track agent decisions and tool calls:

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info(f"Agent thinking: {response.content}")
logger.info(f"Tool called: {tool_use.name}")
```

### Tracing
Record the full agent execution:

```python
def log_execution(messages, response):
    """Log the execution trace"""
    for msg in messages:
        logger.debug(f"Message: {msg['role']} - {msg['content'][:100]}...")
    logger.debug(f"Response: {response.stop_reason}")
```

## Examples

See `src/examples/` for working examples:
- `basic_agent.ts` — Simple agent with one tool
- `workflow_agent.ts` — Multi-step workflow automation
- `research_agent.ts` — Information gathering and synthesis

## Resources

- [Agent API Reference](https://docs.anthropic.com/en/api)
- [Tool Use Guide](https://docs.anthropic.com/en/docs/build-a-system-with-claude/tool-use)
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-python)
