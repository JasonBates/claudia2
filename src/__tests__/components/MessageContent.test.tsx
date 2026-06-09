import { cleanup, render, screen } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, describe, expect, it } from "vitest";
import MessageContent from "../../components/MessageContent";

describe("MessageContent", () => {
  afterEach(() => {
    cleanup();
  });

  it("escapes raw HTML instead of creating DOM nodes", () => {
    render(() => (
      <MessageContent content={'before <img src=x onerror="alert(1)"> after'} />
    ));

    expect(
      screen.getByText('before <img src=x onerror="alert(1)"> after')
    ).toBeInTheDocument();
    expect(document.querySelector("img")).toBeNull();
  });

  it("neutralizes unsafe javascript links", () => {
    render(() => (
      <MessageContent content={"[click me](javascript:alert(1))"} />
    ));

    const link = screen.getByRole("link", { name: "click me" });
    expect(link).toHaveAttribute("href", "#");
  });

  it("preserves safe https links", () => {
    render(() => (
      <MessageContent content={"[OpenAI](https://openai.com)"} />
    ));

    const link = screen.getByRole("link", { name: "OpenAI" });
    expect(link).toHaveAttribute("href", "https://openai.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("preserves DOM nodes of earlier blocks while content streams", () => {
    // Regression: blocks were keyed by object reference, so every streamed
    // token destroyed and recreated the DOM for ALL blocks in the message.
    const [content, setContent] = createSignal(
      "first paragraph\n\n```js\nconst a = 1;\n```\n\nsecond paragraph"
    );
    render(() => <MessageContent content={content()} />);

    const firstTextBlock = document.querySelector(".text-block");
    const codeBlock = document.querySelector(".code-block");
    expect(firstTextBlock).not.toBeNull();
    expect(codeBlock).not.toBeNull();

    // Simulate streaming: append to the trailing text block
    setContent(content() + " with more streamed text");

    // Earlier blocks must be the exact same DOM nodes
    expect(document.querySelector(".text-block")).toBe(firstTextBlock);
    expect(document.querySelector(".code-block")).toBe(codeBlock);
    // Trailing block received the new content
    expect(
      screen.getByText("second paragraph with more streamed text")
    ).toBeInTheDocument();
  });
});
