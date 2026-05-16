# GUkirito 个人博客 — 部署文档

## 项目概述

基于 **Hugo** 静态站点生成器 + **Next.js** 管理后台的个人技术博客。前端博客部分使用 Hugo 生成静态页面，管理后台使用 Next.js 14 + NextAuth.js 实现 GitHub OAuth 登录和文章 CRUD。

- **博客地址**: https://g-ukirito-github-io.vercel.app
- **GitHub Pages (备份)**: https://gukirito.github.io
- **仓库**: https://github.com/GUkirito/GUkirito.github.io

---

## 项目架构

```
请求流程:

 用户浏览器
    │
    ├── /                    → Hugo 静态首页 (public/index.html)
    ├── /posts/*             → Hugo 生成的文章页 (public/posts/*/index.html)
    ├── /login               → Next.js 登录页 (GitHub OAuth)
    ├── /admin/*             → Next.js 管理后台 (需登录)
    └── /api/*               → Next.js API 路由 (服务端)
                                  │
                                  ├── /api/auth/[...nextauth]  → NextAuth.js (GitHub OAuth)
                                  └── /api/posts/*             → GitHub API (CRUD content/posts/*.md)
```

### 技术栈

| 层 | 技术 | 说明 |
|----|------|------|
| 博客前端 | Hugo 0.161 + 自定义 `ruan` 主题 | 生成 13 个静态页面，支持暗色模式 |
| 管理后台 | Next.js 14 (App Router) + Tailwind CSS | 文章列表、Markdown 编辑器 |
| 身份认证 | NextAuth.js v4 + GitHub OAuth | 仅允许指定 GitHub 用户登录 |
| 内容存储 | GitHub API (content/posts/*.md) | Markdown + YAML frontmatter |
| 部署 | Vercel (主) + GitHub Pages (备份) | 推送 main 分支自动部署 |
| CI/CD | GitHub Actions (ci.yml) | Hugo + Next.js 构建检查 |

### 目录结构

```
project-root/
│
├── hugo.toml                     # Hugo 站点配置
├── content/posts/                # Markdown 博客文章
│   ├── 2026-05-13-embedding.md
│   ├── 2026-05-14-prompt.md
│   └── 2026-05-15-llm.md
│
├── themes/ruan/                  # Hugo 自定义主题
│   ├── layouts/                  # HTML 模板 (header, footer, index, single, list)
│   └── static/css/style.css      # 博客样式 (CSS Variables + 暗色模式)
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # 根布局 (SessionProvider)
│   ├── globals.css               # Tailwind CSS 入口
│   ├── login/page.tsx            # GitHub OAuth 登录页
│   ├── admin/
│   │   ├── layout.tsx            # 管理后台布局 (侧边栏)
│   │   ├── page.tsx              # 文章列表仪表盘
│   │   ├── new/page.tsx          # 新建文章
│   │   └── edit/[slug]/page.tsx  # 编辑/删除文章
│   └── api/
│       ├── auth/[...nextauth]/route.ts  # NextAuth 鉴权端点
│       └── posts/
│           ├── route.ts          # GET 列表 / POST 创建
│           └── [slug]/route.ts   # GET/PUT/DELETE 单篇文章
│
├── lib/                          # 服务端工具库
│   ├── auth.ts                   # NextAuth 配置 (GitHub OAuth + 用户白名单)
│   ├── github.ts                 # GitHub API 封装
│   └── posts.ts                  # Markdown frontmatter 解析、slug 生成
│
├── components/                   # React 组件
│   ├── SessionProvider.tsx        # NextAuth Session 包装器
│   ├── AdminNav.tsx              # 侧边栏导航
│   ├── PostList.tsx              # 文章列表表格
│   └── PostEditor.tsx            # Markdown 编辑器 (@uiw/react-md-editor)
│
├── middleware.ts                 # NextAuth 中间件 (保护 /admin/*)
│
├── scripts/
│   └── vercel-build.sh          # Vercel 构建脚本 (安装 Hugo + 构建)
│
├── .github/workflows/ci.yml     # GitHub Actions CI
├── vercel.json                  # Vercel 部署配置
├── deploy.sh                    # 一键 git add/commit/push
├── package.json                 # Node 依赖
├── tsconfig.json                # TypeScript 配置
└── tailwind.config.ts           # Tailwind CSS 配置
```

---

## 本地开发

### 前置条件

- Node.js 18+
- Hugo Extended 0.161.0
- Git

### 1. 克隆并安装依赖

```bash
git clone https://github.com/GUkirito/GUkirito.github.io.git
cd GUkirito.github.io
npm install
```

### 2. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入真实值：

| 变量 | 说明 | 如何获取 |
|------|------|---------|
| `GITHUB_TOKEN` | 带 `repo` 权限的 Personal Access Token | GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens |
| `GITHUB_ID` | GitHub OAuth App Client ID | GitHub → Settings → Developer settings → OAuth Apps |
| `GITHUB_SECRET` | GitHub OAuth App Client Secret | 同上 |
| `NEXTAUTH_SECRET` | JWT 签名密钥 | `openssl rand -base64 32` |
| `GITHUB_REPO` | 仓库路径 | `GUkirito/GUkirito.github.io` |
| `ALLOWED_USER` | 允许登录的 GitHub 用户名 | `gukirito` |

> 本地开发时 OAuth App 的 Callback URL 需要设为 `http://localhost:3000/api/auth/callback/github`

### 3. 启动开发

```bash
# 终端 1: 启动 Hugo 开发服务器 (博客预览)
hugo server -D --port 1313

# 终端 2: 启动 Next.js 开发服务器 (管理后台)
npm run dev
```

- 博客: http://localhost:1313
- 管理后台: http://localhost:3000/admin
- 登录: http://localhost:3000/login

### 4. 一键部署

```bash
bash deploy.sh "你的提交信息"
```

该脚本自动执行 `git add -A && git commit -m "..." && git push origin main`。

---

## Vercel 部署

### 初次部署

1. 访问 [vercel.com/new](https://vercel.com/new)，导入 `GUkirito/GUkirito.github.io`
2. Framework 自动识别为 **Next.js**
3. 展开 **Environment Variables**，填入以下变量：

| Key | Value |
|-----|-------|
| `GITHUB_TOKEN` | `ghp_xxxxxxxx` (Personal Access Token) |
| `GITHUB_ID` | OAuth App Client ID |
| `GITHUB_SECRET` | OAuth App Client Secret |
| `NEXTAUTH_SECRET` | 随机字符串 (见上文) |
| `GITHUB_REPO` | `GUkirito/GUkirito.github.io` |
| `ALLOWED_USER` | `gukirito` |

4. 点击 **Deploy**

### 构建流程

Vercel 构建由 `scripts/vercel-build.sh` 驱动：

```
1. 下载 Hugo Extended 0.161.0 到 /tmp/hugo_bin/
2. hugo --minify → 输出到 public/ (13 个页面 + RSS)
3. next build  → 编译 Next.js App Router + 打包 public/
4. Vercel 部署 → 静态文件优先，/admin/* /api/* /login 走 Next.js
```

### 更新 OAuth Callback

部署完成后，去 GitHub OAuth App 设置，将 **Authorization callback URL** 更新为：

```
https://g-ukirito-github-io.vercel.app/api/auth/callback/github
```

---

## GitHub OAuth App 配置

1. 打开 [github.com/settings/developers](https://github.com/settings/developers)
2. 点击 **New OAuth App**
3. 填写：

| 字段 | 值 |
|------|-----|
| Application name | `AI 学习笔记` |
| Homepage URL | `https://g-ukirito-github-io.vercel.app` |
| Authorization callback URL | `https://g-ukirito-github-io.vercel.app/api/auth/callback/github` |

4. 创建后生成 **Client Secret**，复制保存

---

## 身份认证流程

```
1. 用户访问 /admin → middleware 检测未登录 → 重定向到 /login
2. 用户点击 "Sign in with GitHub" → NextAuth 跳转 GitHub 授权页
3. 用户授权 → GitHub 回调 /api/auth/callback/github
4. NextAuth signIn callback:
   - 提取 profile.login (GitHub 用户名)
   - 与 ALLOWED_USER 比对 (大小写不敏感)
   - 匹配 → 创建 JWT session → 重定向到 /admin
   - 不匹配 → 重定向到 /login?error=unauthorized&user=XXX
5. Admin 页面通过 getServerSession() 验证 session
6. API 路由同样验证 session，然后使用 GITHUB_TOKEN 调用 GitHub API
```

### 安全特性

- GitHub Token 仅存储在 Vercel 服务端环境变量中，前端不可见
- 所有 API 调用在服务端完成，浏览器不暴露任何凭据
- Session 使用 JWT 加密，密钥 `NEXTAUTH_SECRET` 仅存在于服务端
- 即使他人通过 GitHub OAuth 登录，也会被 `signIn` callback 拒绝

---

## API 接口文档

所有接口需要有效的 NextAuth session cookie。

### GET /api/posts — 文章列表

```json
// Response 200
{
  "posts": [
    {
      "slug": "2026-05-15-llm",
      "filename": "2026-05-15-llm.md",
      "title": "什么是大语言模型？",
      "date": "2026-05-15",
      "description": "很多人听到大语言模型..."
    }
  ]
}
```

### GET /api/posts/[slug] — 文章详情

```json
// Response 200
{
  "slug": "2026-05-15-llm",
  "filename": "2026-05-15-llm.md",
  "title": "什么是大语言模型？",
  "date": "2026-05-15",
  "description": "...",
  "content": "## 一句话解释\n\nMarkdown 正文...",
  "sha": "abc123..."
}
```

### POST /api/posts — 新建文章

```json
// Request
{
  "title": "新文章标题",
  "description": "文章摘要",
  "content": "## 正文\n\nMarkdown 内容..."
}

// Response 201
{
  "slug": "2026-05-16-新文章标题",
  "filename": "2026-05-16-新文章标题.md"
}
```

### PUT /api/posts/[slug] — 更新文章

```json
// Request (与 POST 相同格式)
{ "title": "...", "description": "...", "content": "..." }

// Response 200
{ "slug": "2026-05-15-llm" }
```

### DELETE /api/posts/[slug] — 删除文章

```json
// Response 200
{ "success": true }
```

---

## CI/CD (GitHub Actions)

推送到 `main` 分支自动触发 `.github/workflows/ci.yml`：

```
Hugo Build  → 验证 Hugo 静态页面生成 (13 pages)
Next.js Build → 验证 TypeScript 编译 + Next.js 构建
GitHub Pages → 部署到 gukirito.github.io (备份)
```

Vercel 侧同时自动触发部署（检测到 main 分支变更）。

---

## 常见问题

### Q: 登录页显示 "GitHub 账号 XXX 不在白名单中"

说明 `ALLOWED_USER` 环境变量与实际 GitHub 用户名不匹配。去 Vercel → Settings → Environment Variables 修改 `ALLOWED_USER` 值，注意 GitHub 用户名是大小写敏感的（虽然比对代码已做不敏感处理）。

### Q: Vercel 构建失败 "hugo: command not found"

检查 `scripts/vercel-build.sh` 是否在最新 commit 中。构建脚本已修复为单 shell 执行。

### Q: 本地 `next dev` 看不到博客页面

这是正常现象——Next.js dev 模式不提供 Hugo 生成的静态文件。本地开发时请用 `hugo server` 预览博客，`npm run dev` 仅用于管理后台。

### Q: 发布文章后没立刻显示

GitHub API 提交需要约 30-60 秒后触发 Vercel 重新部署。Vercel 构建完成后文章才会出现在首页。
