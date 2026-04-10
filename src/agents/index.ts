/**
 * Agents module - Utilities and types for working with Claude agents
 */

import Anthropic from "@anthropic-ai/sdk";

export interface AgentConfig {
  model: string;
  maxTokens: number;
  maxIterations: number;
  tools: Anthropic.Messages.Tool[];
}

export interface AgentExecutionResult {
  finalResponse: string;
  messageHistory: Anthropic.Messages.MessageParam[];
  iterationsUsed: number;
  toolCallCount: number;
}

/**
 * Execute an agent loop with tools until completion
 */
export async function runAgentLoop(
  client: Anthropic,
  config: AgentConfig,
  initialMessages: Anthropic.Messages.MessageParam[],
  toolExecutor: (
    toolName: string,
    input: Record<string, unknown>
  ) => unknown | Promise<unknown>
): Promise<AgentExecutionResult> {
  const messages = [...initialMessages];
  let response = await client.messages.create({
    model: config.model,
    max_tokens: config.maxTokens,
    tools: config.tools,
    messages,
  });

  let iterations = 0;
  let toolCallCount = 0;

  while (response.stop_reason === "tool_use" && iterations < config.maxIterations) {
    iterations++;

    const toolUseBlocks = response.content.filter(
      (block) => block.type === "tool_use"
    );

    if (toolUseBlocks.length === 0) break;

    messages.push({
      role: "assistant",
      content: response.content,
    });

    const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];

    for (const toolUse of toolUseBlocks) {
      if (toolUse.type !== "tool_use") continue;

      toolCallCount++;
      const result = await toolExecutor(
        toolUse.name,
        toolUse.input as Record<string, unknown>
      );

      toolResults.push({
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: JSON.stringify(result),
      });
    }

    messages.push({
      role: "user",
      content: toolResults,
    });

    response = await client.messages.create({
      model: config.model,
      max_tokens: config.maxTokens,
      tools: config.tools,
      messages,
    });
  }

  const finalResponse = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n");

  return {
    finalResponse,
    messageHistory: messages,
    iterationsUsed: iterations,
    toolCallCount,
  };
}

/**
 * Create a basic agent configuration
 */
export function createAgentConfig(
  tools: Anthropic.Messages.Tool[],
  model = "claude-opus-4-6",
  maxTokens = 4096,
  maxIterations = 10
): AgentConfig {
  return {
    model,
    maxTokens,
    maxIterations,
    tools,
  };
}
