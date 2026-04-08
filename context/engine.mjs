/**
 * ContextEngine — Orchestrates memory layers for Claudia
 *
 * Manages ZepLoop (and later MemoryStore), handles toggle state,
 * and assembles the context blocks injected into conversations.
 *
 * Integration point: the SDK bridge calls these hooks at the right
 * moments in the message lifecycle.
 */

import { ZepLoop } from "./zep-loop.mjs";

export class ContextEngine {
  /**
   * @param {object} config
   * @param {object} [config.zep] - Zep config: { apiKey, userId, defaultTemplate }
   * @param {boolean} [config.defaultActive=true] - Default toggle state for new conversations
   */
  constructor(config = {}) {
    this.zepLoop = null;
    this.active = config.defaultActive !== false;
    this._lastContext = null;
    this._sessionStartPromise = null; // Tracks in-flight session start

    // Initialize Zep if configured
    if (config.zep?.apiKey) {
      this.zepLoop = new ZepLoop({
        apiKey: config.zep.apiKey,
        userId: config.zep.userId || "jason",
        defaultTemplate: config.zep.defaultTemplate || "general",
      });
    }
  }

  /** Toggle the pipeline on/off. Only affects Zep per-turn ingestion. */
  setActive(active) {
    this.active = active;
  }

  /** @returns {boolean} Current toggle state */
  isActive() {
    return this.active;
  }

  /**
   * Called when a new conversation session starts.
   * Initializes Zep thread. Fire-and-forget — first turn awaits if needed.
   *
   * @param {string} sessionId - Claude session ID
   * @param {string} [sessionType="general"] - "general", "book-work", "coaching"
   */
  async onSessionStart(sessionId, sessionType = "general") {
    if (!this.active || !this.zepLoop) return null;

    this._sessionStartPromise = this.zepLoop.start(sessionId, sessionType)
      .catch((err) => {
        console.error("[ContextEngine] Session start failed:", err.message);
      });

    return null;
  }

  /**
   * Called before a user message is sent to Claude.
   * Ingests the message to Zep and retrieves context in a single API call.
   * ~300ms blocking — Zep sees the message and selects relevant facts.
   *
   * @param {string} message - User message text
   * @returns {Promise<string|null>} Context block to prepend to user message
   */
  async onUserMessage(message) {
    if (!this.active || !this.zepLoop) {
      return null;
    }

    // If session start is still in flight, wait for it (only affects turn 1)
    if (this._sessionStartPromise) {
      await this._sessionStartPromise;
      this._sessionStartPromise = null;
    }

    // Single API call: ingest message + get context shaped by it
    const ctx = await this.zepLoop.ingestAndRetrieve(message);
    this._lastContext = ctx;
    return this._formatContextBlock(ctx);
  }

  /**
   * Called after Claude responds. Fire-and-forget — don't block the UI.
   * Ingests assistant message for conversation continuity.
   *
   * @param {string} message - Assistant response text
   */
  onAssistantMessage(message) {
    if (!this.active || !this.zepLoop) return;

    this.zepLoop.ingestAssistant(message).catch((err) => {
      console.error("[ContextEngine] Failed to ingest assistant message:", err.message);
    });
  }

  /**
   * Format the raw context into the XML block for injection.
   * @private
   */
  _formatContextBlock(zepContext) {
    if (!zepContext) return null;

    return `<long_term_memory>\n${zepContext}\n</long_term_memory>`;
  }

  /** Get the last retrieved context (for preview panel) */
  getLastContext() {
    return this._lastContext;
  }

  /** Session stats for /memory-status */
  getStats() {
    return {
      active: this.active,
      zep: this.zepLoop ? this.zepLoop.getStats() : null,
    };
  }
}
