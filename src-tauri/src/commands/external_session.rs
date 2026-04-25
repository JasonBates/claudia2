//! External session: streams JSONL events over a Unix domain socket back to a
//! caller that kicked off the window via a launch-intent file.
//!
//! The caller owns the socket (it listens, app connects). We emit one of:
//!
//!   {"type":"started"}
//!   {"type":"done", "text": "<full assistant text>", "session_id": "<uuid>"}
//!   {"type":"error", "message": "...", "code": "..."}
//!
//! v1 deliberately ships only these three events. Streaming intermediate
//! events (text_delta, tool_start, etc.) would be additive — callers that
//! only key on `done` wouldn't break.

use serde::Serialize;
use tokio::io::AsyncWriteExt;
use tokio::net::UnixStream;

use super::cmd_debug_log;

/// JSONL event payload sent over the result socket.
#[derive(Debug, Serialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum ExternalEvent<'a> {
    /// Sent immediately after the app connects, before the prompt runs.
    /// Lets the caller distinguish "the app picked us up" from "still waiting."
    Started,

    /// Sent once the assistant's response is complete. `text` is the joined
    /// stream of TextDelta events for the auto-submitted prompt's response.
    Done {
        text: &'a str,
        session_id: Option<&'a str>,
    },

    /// Sent when something goes wrong before `done` is emitted. After this,
    /// the writer is closed.
    Error {
        message: &'a str,
        code: &'a str,
    },
}

/// Owns the connected socket writer. Drop = socket closed = caller's read returns EOF.
pub struct ExternalSession {
    stream: UnixStream,
}

impl ExternalSession {
    /// Connect to the caller's listening socket. Returns None if the connect
    /// fails — the caller may have given up, in which case the app continues
    /// normally without external mirroring.
    pub async fn connect(socket_path: &str) -> Option<Self> {
        match UnixStream::connect(socket_path).await {
            Ok(stream) => {
                cmd_debug_log("EXTERNAL", &format!("Connected to result socket: {}", socket_path));
                Some(Self { stream })
            }
            Err(e) => {
                cmd_debug_log("EXTERNAL", &format!(
                    "Failed to connect to result socket {}: {} — proceeding without external session",
                    socket_path, e
                ));
                None
            }
        }
    }

    /// Write a single JSONL event. Errors are logged but not propagated — a
    /// dead caller shouldn't break the GUI session.
    pub async fn send(&mut self, event: ExternalEvent<'_>) {
        let line = match serde_json::to_string(&event) {
            Ok(s) => s,
            Err(e) => {
                cmd_debug_log("EXTERNAL", &format!("Failed to serialize event: {}", e));
                return;
            }
        };
        if let Err(e) = self.stream.write_all(line.as_bytes()).await {
            cmd_debug_log("EXTERNAL", &format!("Socket write failed: {}", e));
            return;
        }
        if let Err(e) = self.stream.write_all(b"\n").await {
            cmd_debug_log("EXTERNAL", &format!("Socket write (newline) failed: {}", e));
            return;
        }
        if let Err(e) = self.stream.flush().await {
            cmd_debug_log("EXTERNAL", &format!("Socket flush failed: {}", e));
        }
    }
}
