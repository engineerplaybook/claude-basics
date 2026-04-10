import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Basic agent that can use tools to accomplish tasks
 */
async function basicAgent(userMessage: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`User: ${userMessage}`);
  console.log("=".repeat(60));

  const tools: Anthropic.Messages.Tool[] = [
    {
      name: "get_weather",
      description: "Get the current weather for a location",
      input_schema: {
        type: "object" as const,
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "Unit for temperature",
          },
        },
        required: ["location"],
      },
    },
    {
      name: "get_time",
      description: "Get the current time for a location",
      input_schema: {
        type: "object" as const,
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
        },
        required: ["location"],
      },
    },
  ];

  const messages: Anthropic.Messages.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  let response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    tools,
    messages,
  });

  console.log(`\nInitial response stop_reason: ${response.stop_reason}`);

  // Agentic loop: keep going until the model stops using tools
  while (response.stop_reason === "tool_use") {
    const toolUseBlocks = response.content.filter(
      (block) => block.type === "tool_use"
    );

    if (toolUseBlocks.length === 0) break;

    // Add assistant response to messages
    messages.push({
      role: "assistant",
      content: response.content,
    });

    // Process each tool call
    const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];

    for (const toolUse of toolUseBlocks) {
      if (toolUse.type !== "tool_use") continue;

      console.log(`\nTool called: ${toolUse.name}`);
      console.log(`Input: ${JSON.stringify(toolUse.input, null, 2)}`);

      // Simulate tool execution
      const result = executeToolCall(toolUse.name, toolUse.input as Record<string, unknown>);
      console.log(`Result: ${JSON.stringify(result, null, 2)}`);

      toolResults.push({
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: JSON.stringify(result),
      });
    }

    // Add tool results to messages
    messages.push({
      role: "user",
      content: toolResults,
    });

    // Get next response
    response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      tools,
      messages,
    });

    console.log(`\nNext response stop_reason: ${response.stop_reason}`);
  }

  // Extract final text response
  const finalResponse = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n");

  console.log(`\nAssistant: ${finalResponse}`);
  return finalResponse;
}

function executeToolCall(
  toolName: string,
  input: Record<string, unknown>
): Record<string, unknown> {
  switch (toolName) {
    case "get_weather":
      return {
        location: input.location,
        temperature: 72,
        condition: "Sunny",
        unit: input.unit || "fahrenheit",
      };
    case "get_time":
      return {
        location: input.location,
        time: new Date().toLocaleTimeString(),
        timezone: "UTC",
      };
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

// Main execution
basicAgent(
  "What's the weather in San Francisco and what time is it there?"
).catch(console.error);
