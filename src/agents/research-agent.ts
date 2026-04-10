import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Research agent that gathers information and synthesizes insights
 */
async function researchAgent(topic: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Topic: ${topic}`);
  console.log("=".repeat(60));

  const tools: Anthropic.Messages.Tool[] = [
    {
      name: "search_documents",
      description: "Search documentation for information about a topic",
      input_schema: {
        type: "object" as const,
        properties: {
          query: {
            type: "string",
            description: "Search query",
          },
          category: {
            type: "string",
            enum: ["api", "guides", "examples", "faq"],
            description: "Documentation category",
          },
        },
        required: ["query"],
      },
    },
    {
      name: "fetch_resource",
      description: "Fetch a specific resource or article",
      input_schema: {
        type: "object" as const,
        properties: {
          url: {
            type: "string",
            description: "URL or resource identifier",
          },
        },
        required: ["url"],
      },
    },
    {
      name: "analyze_findings",
      description:
        "Analyze gathered information and identify key patterns or insights",
      input_schema: {
        type: "object" as const,
        properties: {
          findings: {
            type: "array",
            items: { type: "string" },
            description: "List of findings to analyze",
          },
        },
        required: ["findings"],
      },
    },
  ];

  const messages: Anthropic.Messages.MessageParam[] = [
    {
      role: "user",
      content: `Research the topic: "${topic}". Search for relevant information, fetch key resources, and provide a comprehensive summary with insights.`,
    },
  ];

  let response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    tools,
    messages,
  });

  const findings: string[] = [];

  // Agentic loop with iteration limit
  let iterations = 0;
  const maxIterations = 10;

  while (response.stop_reason === "tool_use" && iterations < maxIterations) {
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

      console.log(`\nTool: ${toolUse.name}`);
      console.log(`Input: ${JSON.stringify(toolUse.input)}`);

      const result = executeResearchTool(
        toolUse.name,
        toolUse.input as Record<string, unknown>
      );
      console.log(`Result: ${JSON.stringify(result).substring(0, 200)}...`);

      if (typeof result === "object" && result !== null && "content" in result) {
        findings.push((result as Record<string, unknown>).content as string);
      }

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
      model: "claude-opus-4-6",
      max_tokens: 2048,
      tools,
      messages,
    });
  }

  if (iterations >= maxIterations) {
    console.log(`\nReached max iterations (${maxIterations})`);
  }

  const finalResponse = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n");

  console.log(`\nResearch Summary:\n${finalResponse}`);
  console.log(`\nFindings gathered: ${findings.length}`);

  return finalResponse;
}

function executeResearchTool(
  toolName: string,
  input: Record<string, unknown>
): unknown {
  switch (toolName) {
    case "search_documents": {
      const query = input.query as string;
      const category = (input.category as string) || "api";
      return {
        success: true,
        results: [
          {
            title: `${category}: ${query}`,
            url: `docs.example.com/${category}/${query.toLowerCase().replace(/\s+/g, "-")}`,
            summary: `Documentation about ${query} in the ${category} category`,
          },
          {
            title: `Guide to ${query}`,
            url: `guides.example.com/${query.toLowerCase().replace(/\s+/g, "-")}`,
            summary: `Comprehensive guide covering best practices for ${query}`,
          },
        ],
      };
    }
    case "fetch_resource": {
      const url = input.url as string;
      return {
        success: true,
        content: `Content from ${url}: This resource provides detailed information about the requested topic, including key concepts, best practices, and implementation examples.`,
        word_count: 500,
      };
    }
    case "analyze_findings": {
      const findings = input.findings as string[];
      return {
        success: true,
        key_insights: [
          "Common pattern emerged across findings",
          "Best practice recommendation identified",
          "Further research areas suggested",
        ],
        confidence: 0.85,
        summary: `Analyzed ${findings.length} findings and identified key patterns and insights`,
      };
    }
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

// Main execution
researchAgent("Claude API best practices").catch(console.error);
