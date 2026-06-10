/**
 * Tool-input JSON parsing helper.
 *
 * NOTE: this module used to contain a full streaming JSON accumulator
 * (createJsonAccumulator, safeJsonParse, type-guard helpers). Production code
 * only ever used parseToolInput; the rest was test-only dead code and was
 * removed. See git history if the accumulator is ever needed again.
 */

/**
 * Parse tool input JSON, falling back to { raw: input } for invalid JSON
 *
 * This matches the existing pattern in App.tsx for handling tool input
 * that might not be valid JSON.
 */
export function parseToolInput(input: string): unknown {
  if (!input.trim()) {
    return {};
  }
  try {
    return JSON.parse(input);
  } catch {
    return { raw: input };
  }
}
