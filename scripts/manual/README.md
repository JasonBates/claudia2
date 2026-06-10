# Manual test harnesses

These scripts spawn a live `claude` CLI and are NOT wired into vitest or CI —
run them by hand when poking at bridge behavior:

- `test-bridge-interrupt.mjs` — drives sdk-bridge-v2.mjs over stdin/stdout and
  exercises the interrupt → respawn → resume flow.
- `test-respawn.mjs` — exploratory harness used to find the respawn recipe
  (kill mid-generation, respawn with `--resume`). The findings now live in
  sdk-bridge-v2.mjs's close handler; kept for future protocol archaeology.
