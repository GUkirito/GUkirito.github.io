#!/bin/bash
# 一键部署脚本：commit + push
# 用法: bash deploy.sh "提交信息"
# 示例: bash deploy.sh "修复了文章样式问题"

set -e

MESSAGE="${1:-更新博客}"

echo ""
echo "  📝 Stage all changes..."
git add -A

echo "  ✅ Changes staged"
echo "  📦 Commit: $MESSAGE"
git commit -m "$MESSAGE"

echo "  🚀 Push to origin main..."
git push origin main

echo ""
echo "  ✨ 推送完成！"
echo "  Vercel dashboard: https://vercel.com/dashboard"
echo "  GitHub Pages:     https://gukirito.github.io"
