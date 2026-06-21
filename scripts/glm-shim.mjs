#!/usr/bin/env node
/**
 * GLM-aware Anthropic↔OpenAI shim for Claudia2.
 *
 * Sits between the Claude CLI (Anthropic Messages API) and Nebius AI Studio
 * (OpenAI chat-completions, serving GLM-5.2). Replaces Claude Code Router for the
 * GLM path. Why it exists — ccr's streaming OpenAI→Anthropic conversion drops the
 * first tool_call argument fragment ~5-8% of the time (GLM's first tool_call delta
 * carries empty args; ccr's accumulator skips it, so when GLM packs real text there
 * the leading `{"command":"` is lost). This shim does the accumulation correctly and
 * keeps TRUE real-time streaming for text + thinking.
 *
 * Design:
 *  - Text + reasoning stream through in real time (text_delta / thinking_delta).
 *  - tool_call arguments are BUFFERED per tool and emitted as one complete, validated
 *    input_json_delta — no partial-JSON ever exposed, so tool calls are 100% clean.
 *  - Injects chat_template_kwargs {enable_thinking:true, reasoning_effort:"max"} so GLM
 *    reasons at its deepest, and surfaces that reasoning as Anthropic thinking blocks.
 *
 * Env:
 *  GLM_SHIM_PORT      (default 3457)
 *  GLM_SHIM_UPSTREAM  (default https://api.studio.nebius.com/v1/chat/completions)
 *  GLM_SHIM_API_KEY   (falls back to NEBIUS_API_KEY)
 *  GLM_SHIM_THINKING  ("0" to suppress thinking blocks; default on)
 *  GLM_SHIM_EFFORT    (default "max"; "high"|"medium"|"low"|"none")
 *  GLM_SHIM_DEBUG     ("1" to log translation to stderr)
 */
import http from "node:http";
import { randomUUID } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PORT = Number(process.env.GLM_SHIM_PORT || 3457);
const UPSTREAM = process.env.GLM_SHIM_UPSTREAM || "https://api.studio.nebius.com/v1/chat/completions";

// Resolve the Nebius key: explicit env first, then the Claudia launch-dir .env, then
// ~/.env — because the installed (GUI) app does not inherit the shell environment.
function readApiKey() {
  const direct = process.env.GLM_SHIM_API_KEY || process.env.NEBIUS_API_KEY;
  if (direct && direct.trim()) return direct.trim();
  const candidates = [];
  if (process.env.CLAUDIA_LAUNCH_DIR) candidates.push(join(process.env.CLAUDIA_LAUNCH_DIR, ".env"));
  if (process.env.HOME) candidates.push(join(process.env.HOME, ".env"));
  for (const p of candidates) {
    try {
      if (!existsSync(p)) continue;
      const m = readFileSync(p, "utf8").match(/^\s*(?:export\s+)?NEBIUS_API_KEY\s*=\s*["']?([^"'\n]+)["']?/m);
      if (m) return m[1].trim();
    } catch { /* ignore */ }
  }
  return "";
}
const API_KEY = readApiKey();
const THINKING = process.env.GLM_SHIM_THINKING !== "0";
// "high" reasons ~half as long as "max" with little quality loss — a better default
// for interactive use (max can think for 30s+ on follow-ups and feel stuck).
const EFFORT = process.env.GLM_SHIM_EFFORT || "high";
const DEBUG = process.env.GLM_SHIM_DEBUG === "1";

const dbg = (...a) => { if (DEBUG) process.stderr.write("[glm-shim] " + a.join(" ") + "\n"); };

// ---------- Anthropic → OpenAI request translation ----------

function blocksText(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content.filter((b) => b && b.type === "text").map((b) => b.text || "").join("");
}

function systemToString(system) {
  if (!system) return "";
  if (typeof system === "string") return system;
  if (Array.isArray(system)) return system.map((b) => (typeof b === "string" ? b : b.text || "")).join("\n");
  return "";
}

// Convert one tool_result block's content into a plain string for OpenAI tool role.
function toolResultToText(block) {
  const c = block.content;
  if (typeof c === "string") return c;
  if (Array.isArray(c)) {
    return c.map((p) => {
      if (typeof p === "string") return p;
      if (p.type === "text") return p.text || "";
      if (p.type === "image") return "[image]";
      return "";
    }).join("\n");
  }
  return "";
}

function userContentToOpenAI(content) {
  // Returns { text: string|array, toolMsgs: [{role:tool,...}] }
  if (typeof content === "string") return { text: content, toolMsgs: [] };
  const parts = [];
  const toolMsgs = [];
  for (const b of content || []) {
    if (!b || !b.type) continue;
    if (b.type === "text") parts.push({ type: "text", text: b.text || "" });
    else if (b.type === "image" && b.source) {
      const src = b.source;
      const url = src.type === "base64" ? `data:${src.media_type};base64,${src.data}` : src.url;
      if (url) parts.push({ type: "image_url", image_url: { url } });
    } else if (b.type === "tool_result") {
      toolMsgs.push({ role: "tool", tool_call_id: b.tool_use_id, content: toolResultToText(b) });
    }
  }
  // If only text parts, collapse to a string (simpler, more compatible).
  if (parts.every((p) => p.type === "text")) return { text: parts.map((p) => p.text).join(""), toolMsgs };
  return { text: parts, toolMsgs };
}

function assistantContentToOpenAI(content) {
  if (typeof content === "string") return { content, tool_calls: undefined };
  let text = "";
  const toolCalls = [];
  for (const b of content || []) {
    if (!b || !b.type) continue;
    if (b.type === "text") text += b.text || "";
    else if (b.type === "tool_use") {
      toolCalls.push({
        id: b.id,
        type: "function",
        function: { name: b.name, arguments: JSON.stringify(b.input ?? {}) },
      });
    }
    // thinking / redacted_thinking blocks are dropped (OpenAI input has no equivalent).
  }
  return { content: text || null, tool_calls: toolCalls.length ? toolCalls : undefined };
}

function translateMessages(anthropicMessages, system) {
  const out = [];
  const sys = systemToString(system);
  if (sys) out.push({ role: "system", content: sys });
  for (const m of anthropicMessages || []) {
    if (m.role === "user") {
      const { text, toolMsgs } = userContentToOpenAI(m.content);
      // tool results must come as their own tool-role messages; any remaining text
      // becomes a user message. Emit tool messages first (they answer prior calls).
      for (const tm of toolMsgs) out.push(tm);
      const hasText = typeof text === "string" ? text.length > 0 : text.length > 0;
      if (hasText) out.push({ role: "user", content: text });
    } else if (m.role === "assistant") {
      const { content, tool_calls } = assistantContentToOpenAI(m.content);
      const msg = { role: "assistant" };
      if (content != null) msg.content = content;
      if (tool_calls) msg.tool_calls = tool_calls;
      if (msg.content == null && !msg.tool_calls) msg.content = ""; // never an empty assistant turn
      out.push(msg);
    }
  }
  return out;
}

function translateTools(tools) {
  if (!Array.isArray(tools)) return undefined;
  return tools.map((t) => ({
    type: "function",
    function: { name: t.name, description: t.description || "", parameters: t.input_schema || { type: "object", properties: {} } },
  }));
}

function translateToolChoice(tc) {
  if (!tc) return undefined;
  if (tc.type === "auto") return "auto";
  if (tc.type === "any") return "required"; // Nebius rejects "any"
  if (tc.type === "none") return "none";
  if (tc.type === "tool" && tc.name) return { type: "function", function: { name: tc.name } };
  return undefined;
}

function translateRequest(a) {
  const body = {
    model: a.model,
    messages: translateMessages(a.messages, a.system),
    max_tokens: a.max_tokens,
    stream: a.stream === true,
  };
  if (typeof a.temperature === "number") body.temperature = a.temperature;
  if (typeof a.top_p === "number") body.top_p = a.top_p;
  if (Array.isArray(a.stop_sequences) && a.stop_sequences.length) body.stop = a.stop_sequences;
  const tools = translateTools(a.tools);
  if (tools) body.tools = tools;
  const tc = translateToolChoice(a.tool_choice);
  if (tc) body.tool_choice = tc;
  if (body.stream) body.stream_options = { include_usage: true };
  // GLM reasoning control (the param ccr never sends).
  body.chat_template_kwargs = { enable_thinking: THINKING, reasoning_effort: EFFORT };
  return body;
}

// ---------- OpenAI → Anthropic response translation ----------

function mapStopReason(finish) {
  switch (finish) {
    case "tool_calls": return "tool_use";
    case "length": return "max_tokens";
    case "stop": return "end_turn";
    case "stop_sequence": return "stop_sequence";
    default: return "end_turn"; // content_filter, null, unknown -> end_turn (valid Anthropic value)
  }
}

// Best-effort repair of an assembled tool-arguments string into valid JSON.
function repairToolArgs(s) {
  if (!s || !s.trim()) return "{}";
  try { JSON.parse(s); return s; } catch { /* try repairs */ }
  try { return JSON.stringify(JSON.parse(s.replace(/,\s*([}\]])/g, "$1"))); } catch { /* drop trailing commas */ }
  return "{}"; // unrecoverable -> safe empty object (model sees a no-arg call and can retry)
}

// Translate an upstream (OpenAI/Nebius) error body into an Anthropic-shaped error.
function anthropicError(status, text) {
  let message = text;
  try { const j = JSON.parse(text); message = (j.error && (j.error.message || j.error)) || j.message || text; } catch { /* keep raw */ }
  if (typeof message !== "string") message = JSON.stringify(message);
  const type =
    status === 400 ? "invalid_request_error" :
    status === 401 ? "authentication_error" :
    status === 403 ? "permission_error" :
    status === 404 ? "not_found_error" :
    status === 429 ? "rate_limit_error" :
    status >= 500 ? "api_error" : "api_error";
  return { type: "error", error: { type, message } };
}

function sse(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

// Streaming translator. Text + reasoning stream in real time; tool_calls are
// accumulated per OpenAI index and emitted as complete tool_use blocks at the end —
// which handles single, parallel and interleaved tool calls uniformly, and means a
// tool's argument JSON is never exposed partially (so it can't be corrupted).
async function streamTranslate(res, upstream, model) {
  res.writeHead(200, { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-cache", connection: "keep-alive" });
  const msgId = "msg_" + randomUUID().replace(/-/g, "");
  sse(res, "message_start", {
    type: "message_start",
    message: { id: msgId, type: "message", role: "assistant", model, content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 0, output_tokens: 0 } },
  });
  sse(res, "ping", { type: "ping" });

  let blockIndex = -1;          // index of the last-opened anthropic block
  let openKind = null;          // currently-open STREAMING block: "thinking" | "text" | null
  const tools = new Map();      // openai tool index -> { id, name, args }
  let stopReason = "end_turn";
  let usage = { input_tokens: 0, output_tokens: 0 };

  const closeOpen = () => {
    if (openKind === null) return;
    sse(res, "content_block_stop", { type: "content_block_stop", index: blockIndex });
    openKind = null;
  };
  const openStream = (kind, contentBlock) => {
    closeOpen();
    blockIndex += 1;
    openKind = kind;
    sse(res, "content_block_start", { type: "content_block_start", index: blockIndex, content_block: contentBlock });
  };

  const reader = upstream.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop();
      for (const line of lines) {
        const t = line.trim();
        if (!t.startsWith("data:")) continue;
        const payload = t.slice(5).trim();
        if (payload === "[DONE]") continue;
        let ev;
        try { ev = JSON.parse(payload); } catch { continue; }
        if (ev.usage) usage = { input_tokens: ev.usage.prompt_tokens ?? 0, output_tokens: ev.usage.completion_tokens ?? 0 };
        const choice = ev.choices && ev.choices[0];
        if (!choice) continue;
        const d = choice.delta || {};
        if (d.reasoning && THINKING) {
          if (openKind !== "thinking") openStream("thinking", { type: "thinking", thinking: "" });
          sse(res, "content_block_delta", { type: "content_block_delta", index: blockIndex, delta: { type: "thinking_delta", thinking: d.reasoning } });
        }
        if (d.content) {
          if (openKind !== "text") openStream("text", { type: "text", text: "" });
          sse(res, "content_block_delta", { type: "content_block_delta", index: blockIndex, delta: { type: "text_delta", text: d.content } });
        }
        if (Array.isArray(d.tool_calls)) {
          for (const tc of d.tool_calls) {
            const idx = tc.index ?? 0;
            if (!tools.has(idx)) tools.set(idx, { id: tc.id || "call_" + randomUUID().replace(/-/g, "").slice(0, 16), name: tc.function?.name || "tool", args: "" });
            const e = tools.get(idx);
            if (tc.id) e.id = tc.id;
            if (tc.function?.name) e.name = tc.function.name;
            if (typeof tc.function?.arguments === "string") e.args += tc.function.arguments;
          }
        }
        if (choice.finish_reason) stopReason = mapStopReason(choice.finish_reason);
      }
    }
  } catch (e) {
    dbg("upstream stream error:", e.message); // finalize the stream cleanly below
  }

  closeOpen(); // close any open thinking/text block

  // Guard against a truly empty assistant turn (no blocks, no tools) — emit an empty
  // text block so the CLI always gets a well-formed message.
  if (blockIndex === -1 && tools.size === 0) {
    blockIndex += 1;
    sse(res, "content_block_start", { type: "content_block_start", index: blockIndex, content_block: { type: "text", text: "" } });
    sse(res, "content_block_stop", { type: "content_block_stop", index: blockIndex });
  }

  // Emit accumulated tool calls as complete tool_use blocks, in tool-index order.
  for (const [, e] of [...tools.entries()].sort((a, b) => a[0] - b[0])) {
    blockIndex += 1;
    sse(res, "content_block_start", { type: "content_block_start", index: blockIndex, content_block: { type: "tool_use", id: e.id, name: e.name, input: {} } });
    sse(res, "content_block_delta", { type: "content_block_delta", index: blockIndex, delta: { type: "input_json_delta", partial_json: repairToolArgs(e.args) } });
    sse(res, "content_block_stop", { type: "content_block_stop", index: blockIndex });
  }
  if (tools.size && stopReason === "end_turn") stopReason = "tool_use";

  sse(res, "message_delta", { type: "message_delta", delta: { stop_reason: stopReason, stop_sequence: null }, usage: { input_tokens: usage.input_tokens, output_tokens: usage.output_tokens } });
  sse(res, "message_stop", { type: "message_stop" });
  res.end();
}

// Non-streaming translator: complete OpenAI response → complete Anthropic message.
function translateNonStream(oai, model) {
  const choice = (oai.choices && oai.choices[0]) || {};
  const m = choice.message || {};
  const content = [];
  if (m.reasoning && THINKING) content.push({ type: "thinking", thinking: m.reasoning, signature: "" });
  if (m.content) content.push({ type: "text", text: m.content });
  for (const tc of m.tool_calls || []) {
    let input = {};
    try { input = JSON.parse(repairToolArgs(tc.function?.arguments || "{}")); } catch { input = {}; }
    content.push({ type: "tool_use", id: tc.id || "call_" + randomUUID().replace(/-/g, "").slice(0, 16), name: tc.function?.name || "tool", input });
  }
  if (!content.length) content.push({ type: "text", text: "" }); // never emit an empty message
  let stop_reason = mapStopReason(choice.finish_reason);
  if ((m.tool_calls || []).length && stop_reason === "end_turn") stop_reason = "tool_use";
  return {
    id: "msg_" + randomUUID().replace(/-/g, ""),
    type: "message",
    role: "assistant",
    model,
    content,
    stop_reason,
    stop_sequence: null,
    usage: { input_tokens: oai.usage?.prompt_tokens ?? 0, output_tokens: oai.usage?.completion_tokens ?? 0 },
  };
}

// ---------- HTTP server ----------

async function callUpstream(body) {
  return fetch(UPSTREAM, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify(body),
  });
}

function sendError(res, status, message) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify({ type: "error", error: { type: "api_error", message } }));
}

const server = http.createServer((req, res) => {
  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", async () => {
    // Health / token-count endpoints: respond simply.
    if (req.method === "GET") { res.writeHead(200, { "content-type": "application/json" }); return res.end('{"status":"ok"}'); }
    if (!/^\/v1\/messages(\?|$)/.test(req.url)) {
      // count_tokens: Nebius has no token-count endpoint, so estimate (~chars/4) from
      // the body. The CLI uses this for context-window management on long sessions, so
      // a rough non-zero estimate is much better than 0.
      if (req.url.includes("count_tokens")) {
        let est = 0;
        try {
          const b = JSON.parse(Buffer.concat(chunks).toString("utf8"));
          const acc = (x) => {
            if (typeof x === "string") est += x.length;
            else if (Array.isArray(x)) x.forEach(acc);
            else if (x && typeof x === "object") { if (typeof x.text === "string") est += x.text.length; if (x.content !== undefined) acc(x.content); }
          };
          acc(b.system);
          (b.messages || []).forEach((m) => acc(m.content));
          (b.tools || []).forEach((t) => { if (t.description) est += t.description.length; est += JSON.stringify(t.input_schema || {}).length; });
        } catch { /* ignore */ }
        res.writeHead(200, { "content-type": "application/json" });
        return res.end(JSON.stringify({ input_tokens: Math.max(1, Math.ceil(est / 4)) }));
      }
      return sendError(res, 404, "not found: " + req.url);
    }
    if (!API_KEY) return sendError(res, 401, "GLM_SHIM: NEBIUS_API_KEY not set in environment");
    let a;
    try { a = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch (e) { return sendError(res, 400, "bad JSON: " + e.message); }
    const oaiBody = translateRequest(a);
    dbg("request model", oaiBody.model, "stream", oaiBody.stream, "tools", (oaiBody.tools || []).length);
    let up;
    try { up = await callUpstream(oaiBody); } catch (e) { return sendError(res, 502, "upstream fetch failed: " + e.message); }
    if (!up.ok) { const txt = await up.text(); dbg("upstream error", up.status, txt.slice(0, 200)); res.writeHead(up.status, { "content-type": "application/json" }); return res.end(JSON.stringify(anthropicError(up.status, txt))); }
    if (oaiBody.stream) {
      try { await streamTranslate(res, up, a.model); } catch (e) { dbg("stream error", e.message); if (!res.headersSent) sendError(res, 502, "stream error: " + e.message); else res.end(); }
    } else {
      const oai = await up.json();
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(translateNonStream(oai, a.model)));
    }
  });
});

server.listen(PORT, "127.0.0.1", () => {
  process.stdout.write(`glm-shim listening on http://127.0.0.1:${PORT} -> ${UPSTREAM} (thinking=${THINKING}, effort=${EFFORT})\n`);
});
