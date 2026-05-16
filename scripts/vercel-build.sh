#!/bin/bash
set -e

HUGO_VERSION="0.161.0"
HUGO_DIR="/tmp/hugo_bin"
HUGO_BIN="${HUGO_DIR}/hugo"

# Install Hugo (only if not already cached)
if [ ! -x "$HUGO_BIN" ]; then
  echo "==> Installing Hugo Extended v${HUGO_VERSION}..."
  mkdir -p "$HUGO_DIR"
  URL="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
  curl -sSL "$URL" -o /tmp/hugo.tar.gz
  tar -xzf /tmp/hugo.tar.gz -C "$HUGO_DIR"
  chmod +x "$HUGO_BIN"
fi

export PATH="${HUGO_DIR}:$PATH"
echo "Hugo: $($HUGO_BIN version)"

echo "==> Building Hugo site..."
$HUGO_BIN --minify --logLevel info

echo "==> Building Next.js..."
npx next build
