#!/usr/bin/env node
/**
 * One-time setup script: apply custom extraction instructions to each
 * partitioned Zep user graph (jason-code, jason-personal, jason-subjectiv).
 *
 * Usage:
 *   node context/setup-zep-instructions.mjs
 *
 * Requires ZEP_API_KEY in environment or .env file.
 */

import { ZepClient } from "@getzep/zep-cloud";
import { readFileSync } from "fs";
import { resolve } from "path";

// Try to load ZEP_API_KEY from .env if not in environment
function loadApiKey() {
  if (process.env.ZEP_API_KEY) return process.env.ZEP_API_KEY;

  // Check home directory .env
  const home = process.env.HOME || process.env.USERPROFILE;
  for (const dir of [process.cwd(), home]) {
    try {
      const envFile = readFileSync(resolve(dir, ".env"), "utf-8");
      const match = envFile.match(/^ZEP_API_KEY=(.+)$/m);
      if (match) return match[1].trim();
    } catch { /* not found, try next */ }
  }
  return null;
}

const INSTRUCTIONS = {
  "jason-personal": {
    name: "personal-extraction",
    text: `USER_SUMMARY priorities:
- Current physical and emotional state (energy, mood, recovery)
- Active daily/weekly rhythm and planning patterns
- Relationships and social commitments
- Health goals and habits (exercise, nutrition, sleep)
- Pickleball development: current skill focus, technique changes, play schedule

Fact extraction rules:
- Prioritise State, Metric, Person, Todo entities
- Prefer short-lived facts for momentary states — meals, "feeling tired", "today's plan"
- Deduplicate: if a new fact is semantically identical to an existing one, update rather than create
- Pickleball technique observations and coaching insights should persist longer than daily state

Do NOT extract:
- Coding decisions, repo names, or technical architecture
- File paths, function names, or build commands
- Book writing progress or essay ideas

Examples:
+ "I played pickleball three days in a row and my knee is sore" -> EXTRACT: physical state + play frequency
+ "WHOOP shows 42% recovery today" -> EXTRACT: health metric
+ "I'm switching the Claudia build to use Tauri v2" -> DO NOT EXTRACT (coding decision)
+ "I had eggs and coffee for breakfast" -> EXTRACT as short-lived fact (expires within 24h)
+ "My new approach to third-shot drops is working" -> EXTRACT with longer persistence (technique insight)`,
  },

  "jason-code": {
    name: "code-extraction",
    text: `USER_SUMMARY priorities:
- Active projects and their current status/blockers
- Recent architectural decisions and their rationale
- Technical dependencies between projects
- Build/deploy state and known issues

Fact extraction rules:
- Prioritise Project, Decision, Dependency, Todo entities
- Decisions should include rationale — "chose X because Y", not just "chose X"
- Capture cross-project dependencies ("X requires Y to work")
- Deduplicate: merge near-identical observations about the same technical topic

Do NOT extract:
- Personal state, health metrics, meal data, or relationship info
- Daily planning or scheduling
- Book writing or essay ideas

Examples:
+ "Let's use separate Zep user IDs for each domain" -> EXTRACT: decision + rationale
+ "The signing key must NOT have a password for CI" -> EXTRACT: technical constraint
+ "I tried restarting the server but it didn't fix it" -> DO NOT EXTRACT (debugging step)
+ "Claudia depends on the claude-agent-sdk bridge" -> EXTRACT: dependency
+ "I'm feeling tired today" -> DO NOT EXTRACT (personal state)
+ "We need to update the Mem0 MCP server before Alix can use it" -> EXTRACT: cross-project dependency`,
  },

  "jason-subjectiv": {
    name: "subjectiv-extraction",
    text: `USER_SUMMARY priorities:
- Book progress: current chapter/section, word count trajectory, structural decisions
- Active essay ideas and intellectual threads
- Connections between concepts (ACT, coaching frameworks, philosophy)
- Research sources and their key takeaways

Fact extraction rules:
- Prioritise Insight, Decision, Connection entities
- Capture cross-concept connections ("X relates to Y because Z") — these are high-value
- Essay ideas and conceptual insights should have long persistence — they compound over time
- Track the evolution of ideas: when a position changes, note what it changed from

Do NOT extract:
- Daily planning, health metrics, or coding decisions
- File paths, build commands, or repo names
- Momentary personal state

Examples:
+ "The ACT concept of cognitive defusion maps to what coaches call 'stepping back'" -> EXTRACT: cross-concept connection
+ "I've decided to restructure Chapter 3 around the coaching framework" -> EXTRACT: structural decision
+ "I pushed the latest commit to the claudia2 repo" -> DO NOT EXTRACT (coding activity)
+ "After reading Harris, I think acceptance isn't passive — it's active engagement" -> EXTRACT: insight evolution
+ "I need to fix the MCP server timeout" -> DO NOT EXTRACT (coding task)`,
  },
};

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error("Error: ZEP_API_KEY not found in environment or .env file");
    process.exit(1);
  }

  const client = new ZepClient({ apiKey });
  let success = 0;
  let failed = 0;

  for (const [userId, instruction] of Object.entries(INSTRUCTIONS)) {
    try {
      // Ensure user exists
      try {
        await client.user.get(userId);
        console.log(`[${userId}] User exists`);
      } catch (e) {
        if (e.statusCode === 404) {
          await client.user.add({ userId });
          console.log(`[${userId}] User created`);
        } else {
          throw e;
        }
      }

      // Apply custom instruction scoped to this user
      await client.graph.addCustomInstructions({
        instructions: [instruction],
        userIds: [userId],
      });
      console.log(`[${userId}] Custom instructions applied: "${instruction.name}"`);
      success++;
    } catch (err) {
      console.error(`[${userId}] Failed:`, err.message);
      failed++;
    }
  }

  console.log(`\nDone: ${success} succeeded, ${failed} failed`);
}

main();
