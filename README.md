# SacrEllfarch Blog

这是 SacrEllfarch Blog 的源码仓库，基于 Valaxy + Sakura 主题构建，并部署到 GitHub Pages。

## Usage

```bash
# 安装依赖
pnpm i

# 本地开发
pnpm dev

# SSG 构建
pnpm build

# 预览构建产物
pnpm serve
```

`pnpm build` 会执行 `valaxy build --ssg`。构建中出现 Sakura 主题 optional addon 的 warning 时，若退出码为 0，一般不视为失败。

### Config

- `valaxy.config.ts`：主题、插件、RSS、首页 hero、导航和 UnoCSS safelist。
- `site.config.ts`：站点元数据、作者、社交链接、统计和搜索。
- `styles/index.scss`：站点级样式覆盖。
- `components/`：本地覆盖 Sakura 主题组件。

### RSS

构建时会自动生成订阅文件：

- RSS: `/feed.xml`
- Atom: `/atom.xml`
- JSON Feed: `/feed.json`

这些文件属于生成物，不应手动提交。

### SDD

后续功能开发使用 SDD（Spec-Driven Development，规格驱动开发）结构。新需求建议在 `docs/sdd/<feature-slug>/` 下维护：

```text
requirements.md
design.md
tasks.md
verification.md
```

模板和说明见 [docs/sdd/README.md](docs/sdd/README.md)。

## Structure

日常写作主要在 `pages/posts` 中完成。视觉和交互维护主要集中在 `components` 与 `styles/index.scss`。

### Main folders

- `pages`: 页面和文章
  - `posts`: 博客文章
- `styles`: 主题样式覆盖
- `components`: 自动注册的 Vue 组件和 Sakura 本地覆盖
- `layouts`: 自定义布局
- `locales`: 自定义 i18n

### Other

- `AGENTS.md`: 后续维护代理和协作者的项目规则。
- `docs/sdd`: SDD 流程和模板。
- `public`: 静态资源。
- `patches`: pnpm patch。
