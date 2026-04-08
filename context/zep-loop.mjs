/**
 * ZepLoop — Zep conversation pipeline (per-turn middleware)
 *
 * Manages a Zep thread for each Claudia session. Ingests user and assistant
 * messages, retrieves context blocks shaped by the current conversation.
 *
 * This is Layer 1 — automatic, toggle-controlled, invisible to the user.
 */

import { ZepClient } from "@getzep/zep-cloud";

const MAX_CONTENT_LENGTH = 4096;

export class ZepLoop {
  constructor({ apiKey, userId, defaultTemplate = "general" }) {
    this.client = new ZepClient({ apiKey });
    this.userId = userId;
    this.defaultTemplate = defaultTemplate;
    this.threadId = null;
    this.sessionType = null;
    this.episodeCount = 0;
    this._ready = false;
  }

  /**
   * Start a new Zep thread for this conversation session.
   * Warms the user graph and creates a thread.
   *
   * @param {string} sessionId - Claudia session ID (used as thread ID)
   * @param {string} [sessionType] - Session type maps to template: "general", "book-work", "coaching"
   * @returns {Promise<string|null>} Initial context block (may be null on first turn)
   */
  async start(sessionId, sessionType = "general") {
    this.threadId = `claudia-${sessionId}`;
    this.sessionType = sessionType;
    this.episodeCount = 0;

    try {
      // Warm the user graph (preloads for faster first retrieval)
      await this.client.user.warm(this.userId);

      // Create the thread
      await this.client.thread.create({
        threadId: this.threadId,
        userId: this.userId,
        metadata: {
          source: "claudia",
          sessionType,
          machine: process.env.HOSTNAME || "unknown",
          startedAt: new Date().toISOString(),
        },
      });

      this._ready = true;
      return null; // No context on first turn (nothing to retrieve yet)
    } catch (err) {
      // Thread might already exist (session resume) — that's fine
      if (err.statusCode === 409 || err.message?.includes("already exists")) {
        this._ready = true;
        // Try to get existing context
        return await this._getContext();
      }
      console.error("[ZepLoop] Failed to start:", err.message);
      this._ready = false;
      return null;
    }
  }

  /**
   * Ingest a user message and retrieve updated context in one call.
   * This is the main per-turn hook — called before the message reaches Claude.
   *
   * @param {string} message - User message text
   * @param {string} [templateId] - Override the default template for this retrieval
   * @returns {Promise<string|null>} Context block for system prompt injection
   */
  async ingestAndRetrieve(message, templateId) {
    if (!this._ready || !this.threadId) return null;

    try {
      // Step 1: Ingest the message (no returnContext — it ignores templates)
      // Step 2: Get template-shaped context via getUserContext
      // These run in parallel — ingestion doesn't need to complete before retrieval
      // since getUserContext uses the graph (not just this thread's messages)
      const [, context] = await Promise.all([
        this.client.thread.addMessages(this.threadId, {
          messages: [
            {
              content: message.slice(0, MAX_CONTENT_LENGTH),
              role: "user",
              name: "Jason",
            },
          ],
        }),
        this._getContext(templateId),
      ]);

      this.episodeCount++;
      return context;
    } catch (err) {
      console.error("[ZepLoop] ingestAndRetrieve failed:", err.message);
      return null;
    }
  }

  /**
   * Ingest an assistant message. Fire-and-forget — don't block the UI.
   * Uses ignoreRoles to prevent Claude's outputs from becoming graph facts.
   *
   * @param {string} message - Assistant response text
   */
  async ingestAssistant(message) {
    if (!this._ready || !this.threadId) return;

    try {
      await this.client.thread.addMessages(this.threadId, {
        messages: [
          {
            content: message.slice(0, MAX_CONTENT_LENGTH),
            role: "assistant",
            name: "Claude",
          },
        ],
        ignoreRoles: ["assistant"],
      });
      this.episodeCount++;
    } catch (err) {
      console.error("[ZepLoop] ingestAssistant failed:", err.message);
    }
  }

  /**
   * Search the knowledge graph. Used by Layer 2 (model tools), not the pipeline.
   *
   * @param {object} params - Search parameters
   * @param {string} params.query - Search query
   * @param {string} [params.scope="edges"] - "edges" or "nodes"
   * @param {number} [params.limit=10] - Max results
   * @param {string} [params.entityType] - Filter by entity type
   * @param {string} [params.reranker="rrf"] - Reranker strategy
   * @returns {Promise<Array>} Search results
   */
  async search({ query, scope = "edges", limit = 10, entityType, reranker = "rrf" }) {
    try {
      const searchParams = {
        query,
        userId: this.userId,
        scope,
        limit,
        reranker,
      };

      if (entityType) {
        searchParams.entityType = entityType;
      }

      const results = await this.client.graph.search(searchParams);
      return results.edges || results.nodes || [];
    } catch (err) {
      console.error("[ZepLoop] search failed:", err.message);
      return [];
    }
  }

  /**
   * Store a fact/decision/insight as a synthetic message.
   * Zep's entity extraction picks up the type from the content annotation.
   *
   * @param {string} content - What to store
   * @param {string} entityType - Type annotation: "Decision", "Insight", "Fact", etc.
   */
  async store(content, entityType) {
    if (!this._ready || !this.threadId) return;

    try {
      await this.client.thread.addMessages(this.threadId, {
        messages: [
          {
            content: `[${entityType}]: ${content}`,
            role: "user",
            name: "Jason",
          },
        ],
      });
      this.episodeCount++;
    } catch (err) {
      console.error("[ZepLoop] store failed:", err.message);
    }
  }

  /**
   * Get context from the thread using getUserContext (template-based).
   * @private
   */
  async _getContext(templateId) {
    try {
      const template = templateId || this.defaultTemplate;
      const response = await this.client.thread.getUserContext(this.threadId, {
        templateId: template,
      });
      return response.context || null;
    } catch (err) {
      console.error("[ZepLoop] _getContext failed:", err.message);
      return null;
    }
  }

  /** Session stats for /memory-status */
  getStats() {
    return {
      ready: this._ready,
      threadId: this.threadId,
      sessionType: this.sessionType,
      episodeCount: this.episodeCount,
    };
  }
}
