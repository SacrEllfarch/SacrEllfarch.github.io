# SDD 开发结构

SDD 指 Spec-Driven Development（规格驱动开发）。本项目后续功能和维护尽量先写清规格，再实现和验证，避免需求、代码和测试记录脱节。

## 目录结构

每个需求使用一个独立目录：

```text
docs/sdd/<feature-slug>/
├── requirements.md
├── design.md
├── tasks.md
└── verification.md
```

`<feature-slug>` 使用英文短横线命名，例如：

```text
docs/sdd/post-toc-scroll/
docs/sdd/rss-feed/
docs/sdd/category-tag-visualization/
```

## 四份文档

### requirements.md

记录“要做什么”和“做到什么程度算完成”。

建议包含：

- 背景
- 用户目标
- 功能范围
- 非目标
- 验收标准
- 约束条件

### design.md

记录“怎么做”和“为什么这样做”。

建议包含：

- 涉及文件
- 数据流或交互流程
- 组件设计
- 样式策略
- 兼容性和风险
- 替代方案及取舍

### tasks.md

把设计拆成可执行任务。

推荐状态：

- `[ ]` 未开始
- `[~]` 进行中
- `[x]` 已完成

### verification.md

记录验证过程和结果。

建议包含：

- 构建命令
- 本地预览路径
- 浏览器验证点
- 已知 warning
- 残余风险

## 小变更的精简流程

如果只是很小的修复，可以不创建完整目录，但提交或说明中必须保留闭环：

```text
问题：
原因：
修改：
验证：
```

## 和当前技术栈的关系

- Valaxy/Sakura 配置变化优先记录 `valaxy.config.ts`、`site.config.ts` 的影响。
- 主题覆盖组件变化记录在 `components/`。
- 视觉变化记录在 `styles/index.scss`。
- 文章内容变化记录在 `pages/posts/`。
- RSS、浏览量、目录、阅读进度条这类跨组件行为，需要在 `verification.md` 中写明浏览器验证过程。

## 与 BDD 的衔接

当一个需求包含用户可观察行为时，需要从 SDD 的 `requirements.md` 与 `verification.md` 派生 BDD 场景。

推荐映射：

- `requirements.md` 的用户目标 -> BDD 的 Feature/User Story
- `requirements.md` 的验收标准 -> BDD 的 Scenario
- `design.md` 的交互流程 -> BDD 的 Given/When/Then
- `verification.md` 的浏览器验证点 -> BDD 的 Traceability

BDD 文档模板位于 `docs/bdd/template/`。
