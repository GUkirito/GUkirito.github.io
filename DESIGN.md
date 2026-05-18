<!-- SEED: re-run /impeccable document once there's code to capture the actual tokens and components. -->

---

name: AI 学习笔记
description: 每天学一点 AI，记录思考与成长

---

# Design System: AI 学习笔记

## 1. Overview

**Creative North Star: "The Engineer's Logbook"**

一个技术人员的私人日志——安静、精准、以阅读为核心。设计的存在是为了让内容更清晰，而不是证明"做过设计"。排版是主要的视觉语言，色彩极少但有意为之，界面元素退到背景中不影响阅读。

这是一个**品牌型**博客：博客本身即是品牌。每一位读者打开页面时，排版、间距、字体选择都在无声地传递作者的技术品味——精确、克制、不自恋。

**Key Characteristics:**
- 高信息密度，但保有呼吸感
- 色彩极度克制，像技术文档的严谨审美
- 排版驱动层级，不是盒子、卡片和分隔线
- 安静的自信：不需要"设计感"来证明自己

## 2. Colors

### Primary
- **[待定]** ([to be resolved during implementation]): 唯一强调色，占比不超过任何屏幕的 10%。用于链接、选中态、关键交互元素。预计为冷调中性蓝或深板岩蓝，匹配技术博客的克制个性。

### Neutral
- **[待定]** ([to be resolved during implementation]): 带色调的中性灰系统。不是纯黑或纯白，每一处中性色都向品牌色调轻微偏移（chroma 0.005–0.01）。构建从深底到浅底的完整阅读层级。

**The 10% Rule.** 强调色在任一屏幕上的占比不超过 10%。它的稀缺性本身即是意义——当一切都安静时，少数带颜色的元素自然成为焦点。

## 3. Typography

**Body Font:** 单一无衬线体（[font pairing to be chosen at implementation]）

**Character:** 冷静、中性、有技术感。不选择 Inter（已被过度使用），倾向于几何感或技术感更强的无衬线替代方案，如 SF Mono 的文本变体、或类似 Vercel 使用的那种精确但温和的无衬线体。

### Hierarchy
- **Display** (bold, clamp(2rem, 5vw, 3.5rem), line-height 1.1): 首页标题和文章主标题
- **Headline** (semibold, 1.5rem, line-height 1.3): 页面级标题
- **Title** (semibold, 1.125rem, line-height 1.4): 列表项标题、卡片标题
- **Body** (regular, 1rem, line-height 1.7, max-width 65ch): 正文，行宽不超过 65-75 字符。中文正文字号需 ≥16px 确保可读性
- **Label** (medium, 0.8125rem, letter-spacing 0.02em): 标签、元信息、时间戳

**The Ratio Rule.** 相邻层级间的字号比率不低于 1.25。扁平的字号尺度和扁平的设计一样单调。

## 4. Elevation

系统默认是**平面**的。层级通过色彩深度（深浅表面之间的色调差异）区分，而非阴影。阴影仅在交互状态时出现（hover 时轻微浮起，focus 时有光晕），作为对用户动作的响应而非静态装饰。

## 5. Components

*种子阶段省略。待设计实现时通过重新运行 `/impeccable document` 捕获实际组件。*

## 6. Do's and Don'ts

### Do:
- **Do** 让内容决定自己需要多少空间——不是每个元素都需要容器
- **Do** 用字体层级区分信息，不是用卡片和分隔线
- **Do** 保持一行正文 65-75 个字符（英文）或 35-45 个汉字
- **Do** 用少量微妙的过渡传达状态变化（150-250ms ease-out）

### Don't:
- **Don't** 使用杂志式排版：大图轮播、华丽引言、大幅留白
- **Don't** 使用文艺长文风格：过度留白、诗意节奏、Medium 式的缓慢叙事感
- **Don't** 套用 SaaS 模板：紫色渐变、Inter 全家桶、卡片嵌套卡片
- **Don't** 使用 border-left/right > 1px 做彩色侧边条纹强调（用背景色调或前置图标代替）
- **Don't** 使用渐变文字（background-clip: text + gradient）
- **Don't** 在一句话能完成的地方用两句话
- **Don't** 使用玻璃态效果（glassmorphism）作为默认卡片样式
