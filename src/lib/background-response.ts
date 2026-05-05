import type { NormalizedEvent } from "./claude-event-normalizer";
import { parseToolInput } from "./json-streamer";
import { actions, type Action } from "./store/actions";
import type { ContentBlock, ToolUse } from "./types";

export interface BackgroundResponseHandler {
  handle: (event: NormalizedEvent) => boolean;
  reset: () => void;
}

interface BackgroundResponseHandlerDeps {
  dispatch: (action: Action) => void;
  generateMessageId: () => string;
}

export function createBackgroundResponseHandler(
  deps: BackgroundResponseHandlerDeps
): BackgroundResponseHandler {
  let messageId: string | null = null;
  let content = "";
  let blocks: ContentBlock[] = [];
  let tools: ToolUse[] = [];
  let currentToolId: string | null = null;
  let toolInputBuffer = "";
  const toolIndexById = new Map<string, number>();
  const toolBlockIndexById = new Map<string, number>();

  const cloneTool = (tool: ToolUse): ToolUse => ({
    ...tool,
    subagent: tool.subagent
      ? {
          ...tool.subagent,
          nestedTools: [...tool.subagent.nestedTools],
        }
      : undefined,
  });

  const blockSnapshot = (): ContentBlock[] =>
    blocks.map((block) => {
      if (block.type === "tool_use") {
        return { type: "tool_use", tool: cloneTool(block.tool) };
      }
      return { ...block };
    });

  const ensureMessage = () => {
    if (messageId) return;
    messageId = deps.generateMessageId();
    deps.dispatch(actions.addMessage({
      id: messageId,
      role: "assistant",
      content: "",
    }));
  };

  const publishMessage = () => {
    if (!messageId) return;

    deps.dispatch(actions.updateMessage(messageId, {
      content,
      contentBlocks: blocks.length > 0 ? blockSnapshot() : undefined,
      toolUses: tools.length > 0 ? tools.map(cloneTool) : undefined,
    }));
  };

  const reset = () => {
    messageId = null;
    content = "";
    blocks = [];
    tools = [];
    currentToolId = null;
    toolInputBuffer = "";
    toolIndexById.clear();
    toolBlockIndexById.clear();
  };

  const appendTextBlock = (text: string) => {
    if (!text) return;
    ensureMessage();
    content += text;

    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock?.type === "text") {
      blocks[blocks.length - 1] = {
        type: "text",
        content: lastBlock.content + text,
      };
    } else {
      blocks.push({ type: "text", content: text });
    }

    publishMessage();
  };

  const appendThinkingBlock = (thinking: string) => {
    if (!thinking) return;
    ensureMessage();

    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock?.type === "thinking") {
      blocks[blocks.length - 1] = {
        type: "thinking",
        content: lastBlock.content + thinking,
      };
    } else {
      blocks.push({ type: "thinking", content: thinking });
    }

    publishMessage();
  };

  const updateTool = (toolId: string, updates: Partial<ToolUse>) => {
    const toolIndex = toolIndexById.get(toolId);
    if (toolIndex === undefined) return;

    const updatedTool = { ...tools[toolIndex], ...updates };
    tools[toolIndex] = updatedTool;

    const blockIndex = toolBlockIndexById.get(toolId);
    if (blockIndex !== undefined) {
      blocks[blockIndex] = {
        type: "tool_use",
        tool: updatedTool,
      };
    }
  };

  const handle = (event: NormalizedEvent): boolean => {
    switch (event.type) {
      case "thinking_start":
        return true;

      case "thinking_delta":
        appendThinkingBlock(event.thinking || "");
        return true;

      case "text_delta":
        appendTextBlock(event.text || "");
        return true;

      case "tool_start": {
        ensureMessage();
        const toolId = event.id || `bg-tool-${Date.now()}-${tools.length}`;
        currentToolId = toolId;
        toolInputBuffer = "";

        const tool: ToolUse = {
          id: toolId,
          name: event.name || "unknown",
          input: {},
          isLoading: true,
        };

        toolIndexById.set(toolId, tools.length);
        toolBlockIndexById.set(toolId, blocks.length);
        tools.push(tool);
        blocks.push({ type: "tool_use", tool });
        publishMessage();
        return true;
      }

      case "tool_input":
        if (currentToolId) {
          toolInputBuffer += event.json || "";
          updateTool(currentToolId, {
            input: parseToolInput(toolInputBuffer),
          });
          publishMessage();
        }
        return true;

      case "tool_pending":
        if (currentToolId) {
          updateTool(currentToolId, {
            input: parseToolInput(toolInputBuffer),
          });
          publishMessage();
        }
        return true;

      case "tool_result": {
        const toolId = event.toolUseId || currentToolId;
        if (toolId) {
          const result = event.isError
            ? `Error: ${event.stderr || event.stdout}`
            : event.stdout || event.stderr || "";
          updateTool(toolId, {
            result,
            isLoading: false,
            completedAt: Date.now(),
          });
          publishMessage();
        }
        return true;
      }

      case "block_end":
        return true;

      case "result":
        reset();
        return true;

      case "done":
      case "interrupted":
        reset();
        return true;

      default:
        return false;
    }
  };

  return { handle, reset };
}
