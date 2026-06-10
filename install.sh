#!/bin/bash
# Claudia2 CLI Installer
# Installs the 'claudia2' command to launch Claudia2.app from any directory

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="$HOME/.local/bin"
LAUNCHER="$SCRIPT_DIR/claudia2"

echo "🔧 Installing Claudia2 CLI..."

# Check if Claudia2.app exists
APP_PATH=""
if [ -d "/Applications/Claudia2.app" ]; then
    APP_PATH="/Applications/Claudia2.app"
elif [ -d "$HOME/Applications/Claudia2.app" ]; then
    APP_PATH="$HOME/Applications/Claudia2.app"
fi

if [ -z "$APP_PATH" ]; then
    echo ""
    echo "⚠️  Claudia2.app not found in /Applications or ~/Applications"
    echo ""
    echo "Build and install it first:"
    echo "  ./scripts/run.sh --install"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✓ Found $APP_PATH"

# Create bin directory if needed
if [ ! -d "$BIN_DIR" ]; then
    echo "Creating $BIN_DIR..."
    mkdir -p "$BIN_DIR"
fi

# Copy launcher script
echo "Installing claudia2 to $BIN_DIR..."
cp "$LAUNCHER" "$BIN_DIR/claudia2"
chmod +x "$BIN_DIR/claudia2"

echo "✓ Installed $BIN_DIR/claudia2"

# Check if ~/.local/bin is in PATH
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
    echo ""
    echo "⚠️  $BIN_DIR is not in your PATH"
    echo ""
    echo "Add this to your ~/.zshrc (or ~/.bashrc):"
    echo ""
    echo '  export PATH="$HOME/.local/bin:$PATH"'
    echo ""
    echo "Then run: source ~/.zshrc"
else
    echo "✓ $BIN_DIR is in PATH"
fi

echo ""
echo "✅ Done! Run 'claudia2' from any project directory to launch Claudia2."
