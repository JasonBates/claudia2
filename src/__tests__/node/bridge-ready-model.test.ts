/**
 * Integration tests for the model reported on bridge `ready` events.
 *
 * The frontend derives its context-window limit (getContextLimit) and cost
 * estimate (estimateCost) from `sessionInfo().model`, which comes straight off
 * the ready event. Two of the three ready paths used to hardcode "opus", so a
 * session running any other model reported the wrong one — most visibly, a
 * `[1m]` session's context gauge collapsed from 1M to 250k after /clear.
 *
 * These tests spawn the real bridge against a stub Claude CLI (via the
 * CLAUDIA_CLAUDE_BIN override) and assert on the events it actually emits.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { spawn, type ChildProcess } from 'child_process';
import { mkdtempSync, writeFileSync, chmodSync, rmSync } from 'fs';
import { join, resolve } from 'path';
import { tmpdir } from 'os';
import * as readline from 'readline';
import { CONTEXT_LIMIT_1M, CONTEXT_LIMIT_DEFAULT } from '../../lib/context-utils';

const BRIDGE_PATH = resolve(process.cwd(), 'sdk-bridge-v2.mjs');

/**
 * How the bridge labels a context limit in its status line. Derived from the
 * frontend constants on purpose: the bridge hardcodes these strings (it can't
 * import frontend TypeScript), so this is what keeps the two honest. Change a
 * limit in context-utils.ts and the assertions below fail, pointing at the
 * matching literal in handle1mToggle.
 */
function limitLabel(limit: number): string {
  return limit >= 1_000_000 ? `${limit / 1_000_000}M` : `${limit / 1_000}K`;
}
const STUB_SESSION_ID = '11111111-2222-3333-4444-555555555555';

/**
 * Stand-in for the Claude CLI. Emits the SessionStart hook_response that a
 * resumed session produces (the path that carried no model info), then idles so
 * the bridge keeps treating it as a live process.
 */
const STUB_CLI = `#!/usr/bin/env node
process.stdin.resume();
process.stdin.on('data', () => {});
process.stdout.write(JSON.stringify({
  type: 'system',
  subtype: 'hook_response',
  hook_event: 'SessionStart',
  outcome: 'success',
  session_id: '${STUB_SESSION_ID}',
}) + '\\n');
setInterval(() => {}, 1 << 30);
`;

interface BridgeEvent {
  type: string;
  sessionId?: string;
  model?: string;
  message?: string;
}

class BridgeHarness {
  proc: ChildProcess;
  events: BridgeEvent[] = [];
  private tmpDir: string;
  private waiters: Array<{ type: string; count: number; resolve: () => void }> = [];

  private of(type: string): BridgeEvent[] {
    return this.events.filter((e) => e.type === type);
  }

  /** How many events of `type` have arrived so far. */
  count(type: string): number {
    return this.of(type).length;
  }

  constructor(claudiaModel: string) {
    this.tmpDir = mkdtempSync(join(tmpdir(), 'claudia-bridge-test-'));
    const stubPath = join(this.tmpDir, 'claude-stub.mjs');
    writeFileSync(stubPath, STUB_CLI);
    chmodSync(stubPath, 0o755);

    this.proc = spawn(process.execPath, [BRIDGE_PATH], {
      env: {
        ...process.env,
        CLAUDIA_CLAUDE_BIN: stubPath,
        CLAUDIA_MODEL: claudiaModel,
        CLAUDIA_DEBUG: '',
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    readline.createInterface({ input: this.proc.stdout! }).on('line', (line) => {
      let event: BridgeEvent;
      try {
        event = JSON.parse(line);
      } catch {
        return; // non-JSON noise
      }
      this.events.push(event);
      for (const w of [...this.waiters]) {
        if (this.of(w.type).length >= w.count) {
          this.waiters.splice(this.waiters.indexOf(w), 1);
          w.resolve();
        }
      }
    });
  }

  send(line: string): void {
    this.proc.stdin!.write(line + '\n');
  }

  /** Resolve once at least `count` events of `type` have arrived, with the last one. */
  waitFor(type: string, count: number, timeoutMs = 10_000): Promise<BridgeEvent> {
    const seen = () => this.of(type);
    if (seen().length >= count) {
      return Promise.resolve(seen()[count - 1]);
    }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(
          new Error(
            `Timed out waiting for ${type} #${count}; saw ${seen().length}: ` +
              JSON.stringify(this.events)
          )
        );
      }, timeoutMs);
      this.waiters.push({
        type,
        count,
        resolve: () => {
          clearTimeout(timer);
          resolve(seen()[count - 1]);
        },
      });
    });
  }

  waitForReady(count: number, timeoutMs = 10_000): Promise<BridgeEvent> {
    return this.waitFor('ready', count, timeoutMs);
  }

  dispose(): void {
    this.proc.kill('SIGKILL');
    rmSync(this.tmpDir, { recursive: true, force: true });
  }
}

describe('bridge ready-event model', () => {
  let harness: BridgeHarness | null = null;

  afterEach(() => {
    harness?.dispose();
    harness = null;
  });

  it('reports the launched model on hook-resume, not a hardcoded default', async () => {
    harness = new BridgeHarness('claude-opus-5');

    const ready = await harness.waitForReady(1);

    expect(ready.sessionId).toBe(STUB_SESSION_ID);
    expect(ready.model).toBe('claude-opus-5');
    // The specific regression: this path used to emit "opus" unconditionally.
    expect(ready.model).not.toBe('opus');
  }, 20_000);

  it('keeps the model across /clear', async () => {
    harness = new BridgeHarness('claude-opus-5');
    await harness.waitForReady(1);

    harness.send('/clear');
    const afterClear = await harness.waitForReady(2);

    // /clear only mints a new session id — the CLI process and model are unchanged,
    // so the frontend's context limit and cost basis must not be reset.
    expect(afterClear.model).toBe('claude-opus-5');
    expect(afterClear.sessionId).not.toBe(STUB_SESSION_ID);
  }, 20_000);

  it('seeds the 1M state from a [1m] model so /clear preserves the wide window', async () => {
    harness = new BridgeHarness('claude-opus-5[1m]');

    const initial = await harness.waitForReady(1);
    expect(initial.model).toBe('claude-opus-5[1m]');

    harness.send('/clear');
    const afterClear = await harness.waitForReady(2);
    expect(afterClear.model).toBe('claude-opus-5[1m]');
  }, 20_000);

  it('reflects the /1m toggle in the reported model', async () => {
    harness = new BridgeHarness('claude-opus-5');
    await harness.waitForReady(1);

    harness.send('/1m on');
    expect((await harness.waitForReady(2)).model).toBe('claude-opus-5[1m]');

    harness.send('/1m off');
    expect((await harness.waitForReady(3)).model).toBe('claude-opus-5');
  }, 20_000);

  it('labels the context window with the same limits the gauge uses', async () => {
    harness = new BridgeHarness('claude-opus-5');
    await harness.waitForReady(1);

    const beforeOn = harness.count('status');
    harness.send('/1m on');
    const onStatus = await harness.waitFor('status', beforeOn + 1);
    expect(onStatus.message).toBe(`Context window: ${limitLabel(CONTEXT_LIMIT_1M)}`);

    const beforeOff = harness.count('status');
    harness.send('/1m off');
    const offStatus = await harness.waitFor('status', beforeOff + 1);
    expect(offStatus.message).toBe(`Context window: ${limitLabel(CONTEXT_LIMIT_DEFAULT)}`);

    // The regression: this read "200K" while the gauge beside it showed 250k.
    expect(offStatus.message).not.toContain('200K');
  }, 20_000);

  it('falls back to the default model when CLAUDIA_MODEL is unset', async () => {
    harness = new BridgeHarness('');

    expect((await harness.waitForReady(1)).model).toBe('opus');
  }, 20_000);
});
