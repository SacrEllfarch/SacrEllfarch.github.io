Feature: 文章详情页阅读体验

  Background:
    Given 站点已经通过 SSG 构建
    And 读者打开文章 "/posts/ask_first"

  Scenario: 文章详情页刷新后保持可读
    Given 读者已经位于文章详情页
    When 读者刷新页面
    Then 页面应显示文章标题和正文
    And 页面不应白屏
    And 右侧目录应正常显示

  Scenario: 滚动阅读时目录同步高亮
    Given 文章包含多个二级标题
    When 读者滚动到 "Github Page" 段落附近
    Then 右侧目录应高亮 "Github Page"

  Scenario: 点击目录项时平滑滚动到段落
    Given 读者位于文章顶部
    When 读者点击目录中的 "Github Page"
    Then 页面应通过滚动动画移动到 "Github Page" 段落
    And URL hash 应更新为 "#github-page"
    And 目录应高亮 "Github Page"

  Scenario: 阅读进度条随滚动更新
    Given 读者位于文章顶部
    When 读者向下滚动文章
    Then 顶部阅读进度条应向右增长

  Scenario: 文章标题展示竖向指示线
    Given 读者打开文章详情页
    When 文章正文标题进入视口
    Then 标题左侧应显示与目录一致的竖向指示线
