/**
 * Claude Basics - Main entry point
 * Examples and utilities for Claude API and agents
 */

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Simple API example - Text generation
 */
async function simpleExample() {
  console.log("\n=== Simple Text Generation ===\n");

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content:
          "Explain Claude AI in one paragraph for someone who has never heard of it.",
      },
    ],
  });

  const responseText = message.content
    .filter((block) => block.type === "text")
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n");

  console.log(responseText);
}

/**
 * Tool use example - Using Claude with tools
 */
async function toolUseExample() {
  console.log("\n=== Tool Use Example ===\n");

  const tools: Anthropic.Messages.Tool[] = [
    {
      name: "calculator",
      description: "Perform basic arithmetic operations",
      input_schema: {
        type: "object" as const,
        properties: {
          operation: {
            type: "string",
            enum: ["add", "subtract", "multiply", "divide"],
            description: "The operation to perform",
          },
          a: {
            type: "number",
            description: "First operand",
          },
          b: {
            type: "number",
            description: "Second operand",
          },
        },
        required: ["operation", "a", "b"],
      },
    },
  ];

  const messages: Anthropic.Messages.MessageParam[] = [
    {
      role: "user",
      content: "What is 42 multiplied by 7?",
    },
  ];

  let response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    tools,
    messages,
  });

  console.log("Initial response:");

  // Process tool calls
  if (response.stop_reason === "tool_use") {
    const toolUse = response.content.find((block) => block.type === "tool_use");

    if (toolUse && toolUse.type === "tool_use") {
      console.log(`Tool called: ${toolUse.name}`);
      console.log(`Input: ${JSON.stringify(toolUse.input)}`);

      // Simulate tool execution
      const input = toolUse.input as Record<string, unknown>;
      let result: number;

      switch (input.operation) {
        case "add":
          result = (input.a as number) + (input.b as number);
          break;
        case "subtract":
          result = (input.a as number) - (input.b as number);
          break;
        case "multiply":
          result = (input.a as number) * (input.b as number);
          break;
        case "divide":
          result = (input.a as number) / (input.b as number);
          break;
        default:
          result = 0;
      }

      console.log(`Result: ${result}\n`);

      // Add assistant response and tool result to messages
      messages.push({
        role: "assistant",
        content: response.content,
      });

      messages.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: JSON.stringify({ result }),
          },
        ],
      });

      // Get final response
      response = await client.messages.create({
        model: "claude-opus-4-6",
        max_tokens: 1024,
        tools,
        messages,
      });
    }
  }

  const finalResponse = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n");

  console.log("Final response:");
  console.log(finalResponse);
}

/**
 * Streaming example - Streaming responses
 */
async function streamingExample() {
  console.log("\n=== Streaming Example ===\n");

  const stream = client.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content:
          "Write a short haiku about artificial intelligence.",
      },
    ],
  });

  console.log("Streaming response:\n");

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      process.stdout.write(chunk.delta.text);
    }
  }

  console.log("\n");
}

/**
 * Main execution
 */
async function main() {
  console.log("Claude Basics - Examples\n");

  try {
    await simpleExample();
    await toolUseExample();
    await streamingExample();

    console.log("\n=== All examples completed ===\n");
    console.log("Next steps:");
    console.log("- Check src/agents/ for agent examples");
    console.log("- Read .claude/AGENTS-CONFIG.md for agent setup");
    console.log("- Run: npm run dev");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
