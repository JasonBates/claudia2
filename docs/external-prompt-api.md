# External Prompt API

Run a prompt through Claudia2 from another process and capture the assistant's reply, while the resulting window stays open for interactive follow-up.

## Quick start

Wrapper script: `scripts/claudia-prompt`

```bash
# One-shot prompt, prints final assistant text on stdout
./scripts/claudia-prompt -d /path/to/project "summarize the README"

# Capture the session ID so a follow-up call can extend the conversation
./scripts/claudia-prompt -d /path/to/project \
    --session-out /tmp/sid.txt \
    "list the files in this repo"

./scripts/claudia-prompt -d /path/to/project \
    --session-id "$(cat /tmp/sid.txt)" \
    "now read the package.json and tell me the version"
```

The wrapper exits when the assistant's response is complete. The Claudia2 window it spawned stays open — you (or the user at the keyboard) can keep talking to it.

## Requirements

- macOS (Unix domain sockets + `open -a`)
- Claudia2 installed at `/Applications/Claudia2.app` (or `~/Applications/Claudia2.app`)
- Claude Code CLI installed and on the app's resolution path
- Python 3 (no third-party deps; only stdlib)

## Wrapper interface

```
claudia-prompt -d DIRECTORY [options] PROMPT

  -d, --directory PATH       Working directory for the session (required)
  --session-id ID            Resume an existing Claude session before submitting
  --session-out PATH         Write the resulting session_id to PATH (when known)
  --connect-timeout SECONDS  Wait for app connect (default: 60)
  --response-timeout SECONDS Wait for response after connect (default: 600)
  --raw                      Emit raw JSONL events on stdout instead of final text
```

### Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success — final text on stdout |
| 1 | Runtime error (connect failed, app errored, missing directory) |
| 2 | At concurrency limit (3 simultaneous calls already running) |
| 3 | Timeout (connect or response phase) |
| 130 | Interrupted (SIGINT) |

### Concurrency cap

At most **3 simultaneous `claudia-prompt` invocations**. Slot reservation uses PID-keyed slot files in `~/.claudia/slots/` guarded by `flock`; dead callers free their slots automatically on the next invocation. A 4th call gets exit code 2 with a stderr message.

This is a guardrail on the supported entrypoint, matching the project rule that Claude Code is for personal interactive use, not scaled automation. It is **policy on the wrapper, not a security boundary** — anyone writing their own caller against the raw protocol bypasses it.

## How it works

```
caller                                    claudia2
------                                    --------
1. listen on /tmp/claudia-XXX.sock
2. write ~/.claudia/pending-launch-*.json
   { directory, prompt, resultSocket,
     timestamp, [sessionId] }
3. open -a Claudia2 --args <directory>
                                          4. read intent file (lib.rs setup hook)
                                          5. open window in <directory>
                                          6. auto-submit prompt via handleSubmit
                                          7. connect() to resultSocket
                                          8. send `started`
                                          9. accumulate TextDelta events
                                         10. send `done` with full text + session_id
                                         11. close socket (caller sees EOF)
12. read JSONL until EOF
13. print final text → stdout, exit 0
                                         (window stays open for follow-up)
```

The auto-submitted prompt traverses the same `handleSubmit` → `sendMessage` → bridge path as a typed message, so the session is indistinguishable from one a human started: real transcript bubble, real session file in `~/.claude/...`, visible in the sidebar.

## Wire protocol

JSONL on the Unix domain socket. v1 events:

```json
{"type":"started"}
{"type":"done", "text": "<full assistant text>", "session_id": "<uuid-or-null>"}
{"type":"error", "message": "...", "code": "process_died"}
```

The socket is closed by the app after the terminal event; the caller's read returns EOF cleanly. Unknown event types are forwarded by `--raw` and ignored otherwise — adding `text_delta`, `tool_start`, etc. in v2 would not break v1 callers.

## Launch-intent file schema

`~/.claudia/pending-launch-<uuid>.json`:

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `directory` | string | no | Working directory for the session |
| `sessionId` | string | no | Resume this Claude session before submitting |
| `prompt` | string | no | Auto-submit this text after the session is ready |
| `resultSocket` | string | no | Connect to this Unix socket and stream events |
| `timestamp` | string | yes | ISO 8601 — files older than 30s are ignored as stale |

Files are picked up once at app startup and deleted (along with all other pending files) regardless of whether they were used. The 30s freshness window is a forgiving upper bound on cold-launch + first-paint; callers using `resultSocket` should set their own deadline on the socket read.

## Calling the API directly (bypassing the wrapper)

If you need behavior the wrapper doesn't expose — e.g., raw streaming, custom timeouts, no concurrency cap — call the protocol directly:

```python
import json, socket, subprocess, tempfile, uuid
from datetime import datetime, timezone
from pathlib import Path

run_id = uuid.uuid4().hex[:12]
sock_path = f"{tempfile.gettempdir()}/claudia-{run_id}.sock"

srv = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
srv.bind(sock_path)
srv.listen(1)

intent = Path.home() / ".claudia" / f"pending-launch-{run_id}.json"
intent.parent.mkdir(parents=True, exist_ok=True)
intent.write_text(json.dumps({
    "directory": "/path/to/project",
    "prompt": "your prompt",
    "resultSocket": sock_path,
    "timestamp": datetime.now(timezone.utc).isoformat(),
}))

subprocess.Popen(["open", "-a", "/Applications/Claudia2.app",
                  "--args", "/path/to/project"])

conn, _ = srv.accept()
with conn.makefile("rb") as r:
    for line in r:
        ev = json.loads(line)
        if ev["type"] == "done":
            print(ev["text"])
            break
        elif ev["type"] == "error":
            raise RuntimeError(ev["message"])
```

If you do this, **do not loop or batch** — the project rule is no Claude Code automation at scale. Use this for one-off integrations, not throughput.

## Using this from a Claude Code agent

An agent that has shell access can invoke the wrapper as a Bash tool call:

```bash
./scripts/claudia-prompt -d "$(pwd)" "the prompt the agent wants to ask"
```

The stdout is the assistant's reply; the agent reads it as the tool result. To chain prompts across multiple tool calls, capture the session_id once with `--session-out` and pass it via `--session-id` on subsequent calls.

For `--raw` mode, the agent receives JSONL on stdout — useful when surfacing tool calls / thinking deltas to the user mid-stream.

## Failure modes worth knowing

- **Concurrent calls can race on the intent file.** The setup hook reads ALL `~/.claudia/pending-launch-*.json` files, picks the freshest, deletes them all. Two wrappers firing within milliseconds means one window starts with no intent and never auto-submits — the losing wrapper times out at `--connect-timeout`. The 3-slot cap makes this rare in practice but possible. A future fix could pass an explicit intent ID via `--args` so each window matches only its own file.
- **Project picker.** If `directory` resolves to a path Claudia2 doesn't know about and there are multiple projects, the picker shows on startup. The auto-submit only fires after the picker is dismissed (or skipped via the `wasExplicitlyLaunched` path, which the intent file's `directory` field triggers).
- **Bridge warmup race.** Historically, the bridge's 100ms startup warmup (`/status` priming) could swallow an auto-submitted prompt's response. Fixed in `sdk-bridge-v2.mjs` via the `userInputSeen` flag — warmup is skipped when a real `__MSG__` arrives in the first 100ms.

## Code map

| Concern | File |
|---------|------|
| Intent file parsing | `src-tauri/src/lib.rs` (`read_pending_launch`) |
| AppState fields | `src-tauri/src/commands/mod.rs` |
| Socket writer | `src-tauri/src/commands/external_session.rs` |
| Event mirroring | `src-tauri/src/commands/messaging.rs` (`send_message`) |
| Auto-submit hook | `src/App.tsx` (after `continueWithStartup`) |
| Wrapper | `scripts/claudia-prompt` |
| Bridge warmup race fix | `sdk-bridge-v2.mjs` (`userInputSeen` flag) |
