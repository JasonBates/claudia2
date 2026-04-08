/**
 * ZepLoop — Zep conversation pipeline (per-turn middleware)
 *
 * Manages a Zep thread for each Claudia session. Ingests user and assistant
 * messages, retrieves context blocks shaped by the current conversation.
 *
 * This is Layer 1 — automatic, toggle-controlled, invisible to the user.
 */

// ESM import resolution walks up from the file's directory, which fails in
// production bundles where node_modules isn't adjacent. Use createRequire
// with NODE_PATH (set by Rust) so CJS resolution can find the package.
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { ZepClient } = require("@getzep/zep-cloud");

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
   * @param {string} [sessionType] - Session type: "general", "book-work", "coaching"
   * @returns {Promise<void>}
   */
  async start(sessionId, sessionType = "general") {
    this.threadId = `claudia-${sessionId}`;
    this.sessionType = sessionType;
    this.episodeCount = 0;

    try {
      // Warm and create in parallel — they're independent calls
      const warmPromise = this.client.user.warm(this.userId);
      const createPromise = this.client.thread.create({
        threadId: this.threadId,
        userId: this.userId,
        metadata: {
          source: "claudia",
          sessionType,
          machine: process.env.HOSTNAME || "unknown",
          startedAt: new Date().toISOString(),
        },
      });

      await Promise.all([warmPromise, createPromise]);
      this._ready = true;
    } catch (err) {
      // Thread might already exist (session resume) — that's fine
      if (err.statusCode === 409 || err.message?.includes("already exists")) {
        this._ready = true;
        return;
      }
      console.error("[ZepLoop] Failed to start:", err.message);
      this._ready = false;
    }
  }

  /**
   * Ingest a user message and retrieve context in a single API call.
   * This is the Zep-recommended pattern: addMessages with returnContext.
   *
   * @param {string} message - User message text
   * @returns {Promise<string|null>} Context block for system prompt injection
   */
  async ingestAndRetrieve(message) {
    if (!this._ready || !this.threadId) return null;

    try {
      const response = await this.client.thread.addMessages(this.threadId, {
        messages: [
          {
            content: message.slice(0, MAX_CONTENT_LENGTH),
            role: "user",
            name: "Jason",
          },
        ],
        returnContext: true,
      });
      this.episodeCount++;
      return response.context || null;
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
