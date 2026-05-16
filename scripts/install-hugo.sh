#!/bin/bash
set -e

HUGO_VERSION="0.161.0"
echo "Installing Hugo Extended v${HUGO_VERSION}..."

URL="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
curl -sSL "$URL" -o /tmp/hugo.tar.gz
tar -xzf /tmp/hugo.tar.gz -C /tmp
chmod +x /tmp/hugo
export PATH="/tmp:$PATH"

echo "Hugo installed: $(hugo version)"
