# Components

本目录下的组件会被 Valaxy 自动注册，既包含站点自定义组件，也包含 Sakura 主题的本地覆盖。

## 文章页相关覆盖

- `SakuraPost.vue`：文章详情页布局入口。
- `SakuraPostHeaderMeta.vue`：文章发布时间、更新时间、字数、预计阅读时长和浏览量。
- `SakuraPostAuthorAside.vue`：文章页作者卡和统计入口。
- `SakuraPostReadingProgress.vue`：顶部阅读进度条，使用 `ClientOnly + Teleport to="body"`。
- `SakuraToc.vue`、`SakuraOutline.vue`、`SakuraOutlineItem.vue`：右侧目录、滚动高亮和平滑滚动。
- `SakuraSidebarLink.vue`：侧边栏导航 marker 空值保护。

## 分类与标签

- `SakuraCategories.vue`
- `SakuraCategoriesLayout.vue`
- `SakuraTagsLayout.vue`
- `SakuraPostList.vue`

这些组件负责分类、标签可视化和文章列表展示。调整时注意保持移动端布局、封面兜底和当前查询状态。

## 图标

图标来自 Iconify，已使用的图标需要加入 `valaxy.config.ts` 的 `safelist`，避免构建后丢失。
