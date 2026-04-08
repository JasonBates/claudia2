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
    this._cachedContextBlock = null; // Pre-fetched context for next turn
    this._sessionStartPromise = null; // Tracks in-flight session start
    this._prefetchPromise = null; // Tracks in-flight prefetch

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
   * Initializes Zep thread.
   *
   * @param {string} sessionId - Claude session ID
   * @param {string} [sessionType="general"] - "general", "book-work", "coaching"
   * @returns {Promise<string|null>} Initial context block (if any)
   */
  async onSessionStart(sessionId, sessionType = "general") {
    if (!this.active || !this.zepLoop) return null;

    // Start session and prefetch initial context in background.
    // Don't block — first turn uses cached context (null initially, that's fine).
    this._sessionStartPromise = this.zepLoop.start(sessionId, sessionType)
      .then(() => {
        // Session ready — prefetch context so turn 1 has something
        this._prefetch();
      })
      .catch((err) => {
        console.error("[ContextEngine] Session start failed:", err.message);
      });

    return null;
  }

  /**
   * Called before a user message is sent to Claude.
   * Returns cached context immediately (zero latency), then kicks off
   * ingestion + prefetch for the next turn in the background.
   *
   * @param {string} message - User message text
   * @param {string} [templateId] - Override template for this turn
   * @returns {Promise<string|null>} Context block to prepend to user message
   */
  async onUserMessage(message, templateId) {
    if (!this.active || !this.zepLoop) {
      return null;
    }

    // If session start is still in flight, wait for it (only affects turn 1)
    if (this._sessionStartPromise) {
      await this._sessionStartPromise;
      this._sessionStartPromise = null;
    }

    // If a prefetch is in flight, await it to get the latest
    if (this._prefetchPromise) {
      await this._prefetchPromise;
      this._prefetchPromise = null;
    }

    // Grab the cached context (from previous prefetch)
    const contextBlock = this._cachedContextBlock;

    // Fire-and-forget: ingest this message + prefetch updated context for next turn
    this._ingestAndPrefetch(message, templateId);

    return contextBlock;
  }

  /**
   * Called after Claude responds. Fire-and-forget — don't block the UI.
   * Ingests assistant message and prefetches updated context.
   *
   * @param {string} message - Assistant response text
   */
  onAssistantMessage(message) {
    if (!this.active || !this.zepLoop) return;

    // Fire and forget — ingest then prefetch
    this.zepLoop.ingestAssistant(message)
      .then(() => this._prefetch())
      .catch((err) => {
        console.error("[ContextEngine] Failed to ingest assistant message:", err.message);
      });
  }

  /**
   * Ingest user message and prefetch context for next turn. Background.
   * @private
   */
  _ingestAndPrefetch(message, templateId) {
    // Ingest the user message (fire-and-forget)
    this.zepLoop.ingestUserMessage(message).catch((err) => {
      console.error("[ContextEngine] Ingest failed:", err.message);
    });

    // Prefetch updated context for the next turn
    this._prefetch(templateId);
  }

  /**
   * Prefetch context from Zep and cache it. Background, non-blocking.
   * @private
   */
  _prefetch(templateId) {
    this._prefetchPromise = this.zepLoop.getContext(templateId)
      .then((ctx) => {
        this._cachedContextBlock = this._formatContextBlock(ctx);
        this._lastContext = ctx;
      })
      .catch((err) => {
        console.error("[ContextEngine] Prefetch failed:", err.message);
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
