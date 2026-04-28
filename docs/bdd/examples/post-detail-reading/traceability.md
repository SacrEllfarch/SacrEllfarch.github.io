# Traceability

## 追踪矩阵

| ID | PRD/需求来源 | SDD 章节 | BDD 场景 | 验证方式 | 结果 |
| --- | --- | --- | --- | --- | --- |
| BDD-001 | 文章详情页刷新不能卡死 | `components/SakuraSidebarLink.vue`、`components/SakuraPostReadingProgress.vue` 相关实现 | 文章详情页刷新后保持可读 | `pnpm build` + 本地预览刷新 `/posts/ask_first` | 待执行 |
| BDD-002 | 目录随阅读位置高亮 | `components/SakuraOutline.vue` | 滚动阅读时目录同步高亮 | 浏览器滚动验证 active 项 | 待执行 |
| BDD-003 | 点击目录平滑跳转 | `components/SakuraOutline.vue`、`components/SakuraOutlineItem.vue` | 点击目录项时平滑滚动到段落 | 点击目录并观察滚动中间过程 | 待执行 |
| BDD-004 | 顶部显示阅读进度 | `components/SakuraPostReadingProgress.vue`、`styles/index.scss` | 阅读进度条随滚动更新 | 观察 progress bar transform/视觉宽度 | 待执行 |
| BDD-005 | 标题强调样式统一 | `styles/index.scss` | 文章标题展示竖向指示线 | 检查标题左侧视觉样式 | 待执行 |

## 验证记录

### 推荐命令

```bash
pnpm build
pnpm serve
```

### 推荐页面

- `http://localhost:<port>/posts/ask_first`
- `https://sacrellfarch.github.io/posts/ask_first`

## 残余风险

- GitHub Pages 部署存在延迟，本地验证通过后线上仍需等待 Actions/Pages 刷新。
- 第三方浏览量接口可能受网络环境影响，不作为本文档核心验收项。
