#!/bin/bash
#
# Launch Claudia2 with debug logging enabled
#
# Debug logs are written to the macOS per-user temp dir ($TMPDIR, not /tmp):
#   $TMPDIR/claude-rust-debug.log
#   $TMPDIR/claude-bridge-debug.log
#   $TMPDIR/claude-commands-debug.log
#
# Usage: ./scripts/run-claudia-debug.sh
#

set -euo pipefail

# Shared Cargo target used by scripts/run.sh builds
CARGO_TARGET_DIR="${CARGO_TARGET_DIR:-$HOME/.cargo/target/claude-terminal}"

# Find the Claudia2 app - prefer /Applications, fall back to the shared-target build
if [[ -x "/Applications/Claudia2.app/Contents/MacOS/claudia2" ]]; then
    APP_PATH="/Applications/Claudia2.app/Contents/MacOS/claudia2"
elif [[ -x "$HOME/Applications/Claudia2.app/Contents/MacOS/claudia2" ]]; then
    APP_PATH="$HOME/Applications/Claudia2.app/Contents/MacOS/claudia2"
elif [[ -x "$CARGO_TARGET_DIR/release/bundle/macos/Claudia2.app/Contents/MacOS/claudia2" ]]; then
    APP_PATH="$CARGO_TARGET_DIR/release/bundle/macos/Claudia2.app/Contents/MacOS/claudia2"
else
    echo "Error: Claudia2 not found at expected locations"
    echo "Build it first: ./scripts/run.sh --build (or --install)"
    exit 1
fi

echo "Starting Claudia2 with debug logging enabled..."
echo "App: $APP_PATH"
echo ""
echo "Debug logs will be written to:"
echo "  - \$TMPDIR/claude-rust-debug.log"
echo "  - \$TMPDIR/claude-bridge-debug.log"
echo "  - \$TMPDIR/claude-commands-debug.log"
echo ""
echo "When the issue occurs, run: ./scripts/bugtime.sh"
echo ""

# Check if Claudia2 is already running
if pgrep -f "Claudia2\.app" > /dev/null 2>&1; then
    echo "Warning: Claudia2 is already running. Kill existing process? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        pkill -f "Claudia2\.app" || true
        sleep 1
    else
        echo "Exiting. Stop existing Claudia2 first."
        exit 1
    fi
fi

# Launch with debug enabled - use env to explicitly pass the variable
# Pass current directory so Claudia2 opens in the right location
exec env CLAUDIA_DEBUG=1 "$APP_PATH" "$PWD"
