# AGENTS.md

本仓库是 SacrEllfarch Blog 的源码，技术栈为 Valaxy 静态博客框架 + Sakura 主题。后续开发以中文沟通和中文文档为准，优先遵循本文件约定。

## 项目概览

- 框架：`valaxy@0.28.5`
- 主题：`valaxy-theme-sakura@0.10.2`
- 包管理：`pnpm`
- 主要语言：Vue SFC、TypeScript、SCSS、Markdown
- 部署目标：GitHub Pages，站点地址为 `https://sacrellfarch.github.io/`
- RSS：构建时生成 `/feed.xml`、`/atom.xml`、`/feed.json`
- 访问统计：`valaxy-addon-vercount@0.0.7`，在 `valaxy.config.ts` 中显式配置 `api: 'cn'` 和 `baseUrl`

## 目录职责

- `valaxy.config.ts`：Valaxy、Sakura 主题、首页 hero、导航栏、插件、RSS、UnoCSS safelist 等全局行为。
- `site.config.ts`：站点元数据、作者信息、社交链接、搜索、统计、赞助等站点级配置。
- `pages/`：Markdown 页面和文章。
- `pages/posts/`：博客文章，文章 frontmatter 中的 `date`、`updated`、`tags`、`categories` 会影响文章列表、RSS、分类和标签页。
- `components/`：本地覆盖 Sakura 主题组件和站点自定义组件。
- `styles/index.scss`：站点级视觉修正、Sakura 主题覆盖、响应式布局、文章页标题和目录视觉规则。
- `public/`：静态资源，如图片、头像、favicon、视频等。
- `patches/`：pnpm patch 文件。
- `docs/sdd/`：后续开发和维护使用的 SDD 文档结构与模板。
- `docs/bdd/`：面向验收行为的 BDD 文档结构、场景模板和追踪矩阵。

## 常用命令

从 WSL 项目目录运行：

```bash
cd /home/terchdox/git/Valaxy/thx
```

使用 pnpm：

```bash
pnpm dev
pnpm build
pnpm serve
pnpm rss
```

说明：

- `pnpm build` 实际执行 `valaxy build --ssg`。
- 构建时可能出现 Sakura 主题已有的 optional addon warning，例如 `useAddonWaline`、`useAddonAlgolia`、`useTwikooWithOptions` 未定义；只要退出码为 0，这些 warning 不视为构建失败。
- 视觉或交互改动应尽量用 `pnpm serve` 预览，并通过浏览器验证目标页面。

## Git 工作流

- 修改前先运行 `git status --short --branch`。
- 每个有意义的变更单独提交，提交后立即 `git push origin main`，除非用户明确要求不推送。
- 不要回滚用户已有改动；若工作树有无关改动，只提交本次任务相关文件。
- 不提交生成物、环境文件或本地临时文件。

常用命令：

```bash
git status --short --branch
git diff
git add <paths>
git commit -m "<message>"
git push origin main
```

## 避免提交的文件

- `node_modules/`
- `dist/`
- `.valaxy/`
- `public/feed.xml`
- `public/atom.xml`
- `public/feed.json`
- `public/valaxy-fuse-list.json`
- `*.Zone.Identifier`
- `.env`、`.env.*`
- `public/videos/*.mp4` 等本地大体积视频

## 已有本地覆盖组件

这些组件是当前站点行为的重要组成，不要在未确认需求的情况下删除或恢复为主题默认实现：

- `components/SakuraPost.vue`：文章详情页总布局，挂载作者卡、文章内容、目录和阅读进度条。
- `components/SakuraPostHeaderMeta.vue`：文章头部元信息，显示发布时间、更新时间、字数、预计阅读时长、浏览量。
- `components/SakuraPostAuthorAside.vue`：文章左侧作者卡，包含文章、标签、分类统计入口和社交链接。
- `components/SakuraPostReadingProgress.vue`：文章顶部阅读进度条。当前通过 `ClientOnly + Teleport to="body"` 挂到 body，避免 SSR 水合问题，同时保证 fixed 层级可见。
- `components/SakuraToc.vue`：文章目录外层卡片。
- `components/SakuraOutline.vue`：文章目录滚动高亮与平滑滚动逻辑。注意它使用按钮触发滚动，绕开 Valaxy/Sakura 对同页 hash 链接的全局捕获。
- `components/SakuraOutlineItem.vue`：目录列表项，负责层级、active 样式和按钮交互。
- `components/SakuraSidebarLink.vue`：侧栏导航覆盖，修复主题 marker 空引用导致详情页刷新白屏的问题。
- `components/SakuraCategories.vue`、`components/SakuraCategoriesLayout.vue`、`components/SakuraTagsLayout.vue`：分类、标签页展示和可视化。
- `components/SakuraPostList.vue`：文章列表展示，包含封面兜底和布局修正。

## 文章页交互注意事项

- 目录点击不能使用普通 `<a href="#id">` 作为主要交互，因为 Sakura 的 `ValaxyMain` 会在捕获阶段处理同页 hash 链接，导致瞬时跳转。
- 目录滚动应保留 `SakuraOutline.vue` 中的自定义 `requestAnimationFrame` 动画，除非明确改为浏览器原生平滑滚动。
- 进度条不要直接 SSR Teleport 到 body；需要使用 `ClientOnly` 包裹，否则可能重新引入水合白屏。
- 文章标题的竖向指示线样式位于 `styles/index.scss` 的 `.sakura-post .markdown-body` 下，与目录指示线保持同一视觉语言。
- 目录和文章标题不要出现横向滚动条；长标题应省略或换行，而不是撑开布局。

## RSS 与统计

- RSS 配置在 `valaxy.config.ts` 的 `modules.rss` 中。
- 生成文件为构建产物，不应手动提交。
- 浏览量由 `valaxy-addon-vercount` 提供。显示层读取的是 `page.value.pv`，不是 `page.pv`。
- 如果 GitHub Pages 上浏览量异常，先检查浏览器控制台、Vercount 接口响应、`baseUrl` 与线上路径是否一致。

## SDD 开发结构

后续需求按 SDD（Spec-Driven Development，规格驱动开发）推进，文档放在 `docs/sdd/<feature-slug>/`。

推荐结构：

```text
docs/sdd/<feature-slug>/
├── requirements.md
├── design.md
├── tasks.md
└── verification.md
```

执行顺序：

1. `requirements.md`：写清用户目标、范围、验收标准和非目标。
2. `design.md`：说明涉及文件、技术方案、取舍、兼容性和风险。
3. `tasks.md`：拆成可执行任务，完成后更新状态。
4. `verification.md`：记录构建、预览、浏览器验证、已知 warning 和残余风险。

对于小修复可以使用精简 SDD：在 `verification.md` 或提交信息中保留“问题 -> 原因 -> 修改 -> 验证”的闭环。

## BDD 验收结构

复杂功能或用户可感知行为需要补充 BDD（Behavior-Driven Development，行为驱动开发）文档，文档放在 `docs/bdd/<feature-slug>/`。

推荐结构：

```text
docs/bdd/<feature-slug>/
├── feature.md
├── scenarios.feature
└── traceability.md
```

使用规则：

1. BDD 必须从 PRD 的用户目标/验收标准，或 SDD 的 `requirements.md` 中派生。
2. `feature.md` 用中文说明用户故事、业务规则和验收范围。
3. `scenarios.feature` 使用 Gherkin 风格，优先写用户能观察到的行为。
4. `traceability.md` 建立 PRD/SDD/BBD 场景/验证记录之间的追踪关系。
5. 本项目目前没有自动化 BDD 测试框架，BDD 先作为验收文档和手动浏览器验证依据；后续如引入 Playwright，可直接复用场景。

## 编辑原则

- 优先使用现有 Valaxy/Sakura 配置和本地覆盖组件，不轻易引入新框架。
- 视觉变更优先写在 `styles/index.scss`，组件私有结构样式可写在对应 SFC scoped style 中。
- Markdown 文档和中文内容保持 UTF-8。
- 终端可能出现 PowerShell/WSL 乱码，涉及中文时以实际文件内容为准。
- 对用户已有文章内容保持谨慎，只在明确要求时修改。
