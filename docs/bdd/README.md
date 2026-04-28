# BDD 文档结构

BDD 指 Behavior-Driven Development（行为驱动开发）。本项目用 BDD 把 PRD/SDD 中的目标和验收标准转成可执行、可复查的用户行为场景。

当前仓库暂未引入 Cucumber 或 Playwright BDD runner，因此 BDD 先作为验收文档和手动浏览器验证依据。后续如果引入自动化测试，`scenarios.feature` 可以直接迁移为测试输入。

## 与 PRD/SDD 的关系

推荐链路：

```text
PRD 用户目标 / 验收标准
        ↓
SDD requirements.md / design.md / verification.md
        ↓
BDD feature.md / scenarios.feature / traceability.md
        ↓
人工验证或自动化测试
```

如果某个需求没有单独 PRD 文件，可以从 SDD 的 `requirements.md` 视作最小 PRD 来源。

## 目录结构

每个功能一个目录：

```text
docs/bdd/<feature-slug>/
├── feature.md
├── scenarios.feature
└── traceability.md
```

`<feature-slug>` 应与 SDD 目录保持一致，例如：

```text
docs/sdd/post-toc-scroll/
docs/bdd/post-toc-scroll/
```

## 文档职责

### feature.md

用于描述行为背景和用户故事，重点回答：

- 谁在使用？
- 想完成什么？
- 为什么重要？
- 哪些行为属于验收范围？
- 哪些行为不属于本次范围？

### scenarios.feature

使用 Gherkin 风格描述场景：

```gherkin
Feature: 文章目录随阅读进度高亮

  Scenario: 读者滚动到某个段落时目录同步高亮
    Given 读者打开一篇包含多个标题的文章
    When 读者滚动到 "Github Page" 段落附近
    Then 右侧目录应高亮 "Github Page"
```

写场景时优先描述用户能观察到的结果，不写组件内部实现细节。

### traceability.md

用于建立追踪关系：

- PRD 条目
- SDD 文件和章节
- BDD 场景
- 验证命令或浏览器验证记录
- 结果和残余风险

## 编写原则

- 一个场景只验证一个核心行为。
- `Given` 描述前置状态，`When` 描述用户动作，`Then` 描述可观察结果。
- 不把实现细节写进 `Then`，例如不要写“Vue ref 应更新”，应写“目录项应高亮”。
- 对视觉行为要写清视口、路径和可见结果。
- 对 GitHub Pages、SSG、水合、RSS、浏览量这类线上相关行为，要记录线上路径或本地预览路径。

## 本项目常见场景类型

- 文章详情页：目录高亮、目录点击滚动、顶部阅读进度条、浏览量显示、作者卡链接。
- 首页：hero 媒体、社交图标、文章卡片。
- 分类/标签页：可视化图、文章筛选、路由查询参数。
- RSS：订阅文件生成和链接可访问。
- 构建部署：`pnpm build` 成功，GitHub Pages 路径可访问。
