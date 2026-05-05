import { describe, expect, it, vi } from "vitest";
import { createBackgroundResponseHandler } from "../lib/background-response";
import type { Action } from "../lib/store/actions";

function createHarness() {
  const actions: Action[] = [];
  let nextId = 1;
  const handler = createBackgroundResponseHandler({
    dispatch: vi.fn((action: Action) => actions.push(action)),
    generateMessageId: () => `bg-msg-${nextId++}`,
  });

  return { actions, handler };
}

describe("background response handler", () => {
  it("captures late background text as a normal assistant message", () => {
    const { actions, handler } = createHarness();

    expect(handler.handle({ type: "text_delta", text: "Hello " })).toBe(true);
    expect(handler.handle({ type: "text_delta", text: "from background" })).toBe(true);
    expect(handler.handle({ type: "done" })).toBe(true);

    expect(actions[0]).toEqual({
      type: "ADD_MESSAGE",
      payload: {
        id: "bg-msg-1",
        role: "assistant",
        content: "",
      },
    });
    expect(actions).toContainEqual({
      type: "UPDATE_MESSAGE",
      payload: {
        id: "bg-msg-1",
        updates: {
          content: "Hello from background",
          contentBlocks: [{ type: "text", content: "Hello from background" }],
          toolUses: undefined,
        },
      },
    });
  });

  it("resets on done so a later background response creates a new message", () => {
    const { actions, handler } = createHarness();

    handler.handle({ type: "text_delta", text: "First" });
    handler.handle({ type: "done" });
    handler.handle({ type: "text_delta", text: "Second" });

    const addedIds = actions
      .filter((action) => action.type === "ADD_MESSAGE")
      .map((action) => action.payload.id);

    expect(addedIds).toEqual(["bg-msg-1", "bg-msg-2"]);
  });

  it("preserves background tool calls in ordered content blocks", () => {
    const { actions, handler } = createHarness();

    handler.handle({ type: "tool_start", id: "tool-1", name: "Bash" });
    handler.handle({ type: "tool_input", json: "{\"command\":\"pwd\"}" });
    handler.handle({ type: "tool_pending" });
    handler.handle({
      type: "tool_result",
      toolUseId: "tool-1",
      stdout: "/tmp/project",
      stderr: "",
      isError: false,
    });

    const lastUpdate = [...actions]
      .reverse()
      .find((action) => action.type === "UPDATE_MESSAGE");

    expect(lastUpdate).toMatchObject({
      type: "UPDATE_MESSAGE",
      payload: {
        id: "bg-msg-1",
        updates: {
          content: "",
          contentBlocks: [
            {
              type: "tool_use",
              tool: {
                id: "tool-1",
                name: "Bash",
                input: { command: "pwd" },
                result: "/tmp/project",
                isLoading: false,
              },
            },
          ],
          toolUses: [
            {
              id: "tool-1",
              name: "Bash",
              input: { command: "pwd" },
              result: "/tmp/project",
              isLoading: false,
            },
          ],
        },
      },
    });
  });

  it("does not consume background task lifecycle events", () => {
    const { actions, handler } = createHarness();

    expect(handler.handle({
      type: "bg_task_result",
      taskId: "task-1",
      toolUseId: "tool-1",
      result: "Final",
      status: "completed",
      agentType: "Explore",
      duration: 100,
      toolCount: 1,
    })).toBe(false);
    expect(actions).toEqual([]);
  });

  it("drops result fallback content instead of creating a duplicate message", () => {
    const { actions, handler } = createHarness();

    expect(handler.handle({
      type: "result",
      content: "Already rendered foreground response",
      cost: 0,
      duration: 0,
      turns: 1,
      inputTokens: 0,
      outputTokens: 0,
      cacheRead: 0,
      cacheWrite: 0,
    })).toBe(true);

    expect(actions).toEqual([]);
  });
});
