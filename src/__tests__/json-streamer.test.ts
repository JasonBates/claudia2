import { describe, it, expect } from "vitest";
import { parseToolInput } from "../lib/json-streamer";

describe("parseToolInput", () => {
  it("should parse valid JSON tool input", () => {
    expect(parseToolInput('{"file_path":"/test.txt"}')).toEqual({
      file_path: "/test.txt",
    });
  });

  it("should return { raw } for invalid JSON", () => {
    expect(parseToolInput("not json")).toEqual({ raw: "not json" });
  });

  it("should return empty object for empty input", () => {
    expect(parseToolInput("")).toEqual({});
  });

  it("should return empty object for whitespace", () => {
    expect(parseToolInput("   ")).toEqual({});
  });
});
