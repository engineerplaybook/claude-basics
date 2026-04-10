import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface WorkflowTask {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  assignee?: string;
}

/**
 * Workflow agent that manages tasks and coordinates multi-step processes
 */
async function workflowAgent(userRequest: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Request: ${userRequest}`);
  console.log("=".repeat(60));

  // In-memory task storage for this example
  const tasks: Map<string, WorkflowTask> = new Map([
    [
      "task-1",
      { id: "task-1", title: "Design API", status: "in_progress", assignee: "Alice" },
    ],
    [
      "task-2",
      { id: "task-2", title: "Implement auth", status: "pending", assignee: "Bob" },
    ],
    ["task-3", { id: "task-3", title: "Write tests", status: "pending" }],
  ]);

  const tools: Anthropic.Messages.Tool[] = [
    {
      name: "list_tasks",
      description: "List all tasks with their current status",
      input_schema: {
        type: "object" as const,
        properties: {
          filter_status: {
            type: "string",
            enum: ["all", "pending", "in_progress", "completed"],
            description: "Filter tasks by status",
          },
        },
      },
    },
    {
      name: "update_task",
      description: "Update a task's status or assignee",
      input_schema: {
        type: "object" as const,
        properties: {
          task_id: {
            type: "string",
            description: "The task ID to update",
          },
          status: {
            type: "string",
            enum: ["pending", "in_progress", "completed"],
            description: "New status",
          },
          assignee: {
            type: "string",
            description: "Person to assign the task to",
          },
        },
        required: ["task_id"],
      },
    },
    {
      name: "create_task",
      description: "Create a new task",
      input_schema: {
        type: "object" as const,
        properties: {
          title: {
            type: "string",
            description: "Task title",
          },
          assignee: {
            type: "string",
            description: "Person to assign to",
          },
        },
        required: ["title"],
      },
    },
    {
      name: "get_summary",
      description: "Get a summary of workflow progress",
      input_schema: {
        type: "object" as const,
        properties: {},
      },
    },
  ];

  const messages: Anthropic.Messages.MessageParam[] = [
    { role: "user", content: userRequest },
  ];

  let response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    tools,
    messages,
  });

  // Agentic loop
  while (response.stop_reason === "tool_use") {
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
      const result = executeWorkflowTool(
        toolUse.name,
        toolUse.input as Record<string, unknown>,
        tasks
      );
      console.log(`Result: ${JSON.stringify(result, null, 2)}`);

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

  const finalResponse = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("\n");

  console.log(`\nFinal Response:\n${finalResponse}`);
  return finalResponse;
}

function executeWorkflowTool(
  toolName: string,
  input: Record<string, unknown>,
  tasks: Map<string, WorkflowTask>
): unknown {
  switch (toolName) {
    case "list_tasks": {
      const filterStatus = input.filter_status as string;
      const allTasks = Array.from(tasks.values());
      if (filterStatus === "all") return allTasks;
      return allTasks.filter((t) => t.status === filterStatus);
    }
    case "update_task": {
      const taskId = input.task_id as string;
      const task = tasks.get(taskId);
      if (!task) return { error: "Task not found" };
      if (input.status) task.status = input.status as WorkflowTask["status"];
      if (input.assignee) task.assignee = input.assignee as string;
      return { success: true, task };
    }
    case "create_task": {
      const newId = `task-${tasks.size + 1}`;
      const newTask: WorkflowTask = {
        id: newId,
        title: input.title as string,
        status: "pending",
        assignee: input.assignee as string | undefined,
      };
      tasks.set(newId, newTask);
      return { success: true, task: newTask };
    }
    case "get_summary": {
      const allTasks = Array.from(tasks.values());
      return {
        total: allTasks.length,
        pending: allTasks.filter((t) => t.status === "pending").length,
        in_progress: allTasks.filter((t) => t.status === "in_progress").length,
        completed: allTasks.filter((t) => t.status === "completed").length,
      };
    }
    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

// Main execution
workflowAgent(
  "Show me all pending tasks, mark the auth task as in progress and assign it to Charlie, then summarize our progress"
).catch(console.error);
