<script setup lang="ts">
import type { Post } from 'valaxy'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
import { useConfig, usePostList as useValaxyPostList } from 'valaxy'

type ResponsiveBreakpoints = Partial<Record<keyof typeof breakpointsTailwind, number>>

const props = defineProps<{
  icon?: string
  text?: string
  posts?: Post[]
  responsive?: ResponsiveBreakpoints
}>()

const config = useConfig<any>()
const themeConfig = computed(() => config.value.themeConfig)
const rawPosts = useValaxyPostList({ type: '' })
const breakpoints = useBreakpoints(breakpointsTailwind)

const isImageReversed = computed(() => themeConfig.value.postList?.isImageReversed)

const icon = computed(() => props.icon ?? themeConfig.value.ui.postList?.icon)
const text = computed(() => props.text ?? themeConfig.value.postList?.text)
const postsList = computed(() => {
  return rawPosts.value.map((post) => {
    const item = { ...post }
    if (themeConfig.value.postList?.defaultImage)
      item.cover = item.cover || resolveImage(themeConfig.value.postList.defaultImage)

    if (item.tags && item.tags.length > 3)
      return { ...item, tags: item.tags.slice(0, 3) }

    return item
  })
})

const posts = computed(() => props.posts || postsList.value)
const responsive = computed(() => props.responsive || themeConfig.value.ui.postList?.responsive || {})

const cols = computed(() => {
  const keys: (keyof typeof breakpointsTailwind)[] = ['2xl', 'xl', 'lg', 'md', 'sm']
  for (const key of keys) {
    if (breakpoints[key].value && responsive.value[key])
      return responsive.value[key]
  }
  return 1
})

const parts = computed(() => {
  const result = Array.from({ length: cols.value }, () => [] as typeof posts.value)
  posts.value.forEach((item, i) => {
    result[i % cols.value].push(item)
  })
  return result
})

const breakpointsStyle = computed<CSSProperties>(() => {
  return { 'grid-template-columns': `repeat(${cols.value}, minmax(0, 1fr))` }
})

function getPostKey(post: Post, index: number, columnIndex: number) {
  const item = post as Post & { route?: string }
  const key = item.path || item.route || item.title || `${index}-${columnIndex}`
  return typeof key === 'string' ? key : JSON.stringify(key)
}

function resolveImage(data: string | string[]): string | undefined {
  if (typeof data === 'string')
    return data

  if (Array.isArray(data) && data.length > 0)
    return data[Math.floor(Math.random() * data.length)]
}
</script>

<template>
  <div class="sakura-post-list">
    <SakuraDivider :icon :text />
    <div :style="breakpointsStyle" class="post-list-container" grid="~ gap-4">
      <div v-for="items, idx of parts" :key="idx" class="post-list-section" flex="~ col" grid="gap-5 md:gap-7">
        <SakuraPostCard
          v-for="(post, index) of items"
          :id="`article-${index * parts.length + idx}`"
          :key="getPostKey(post, index, idx)"
          :cols
          class="article-list"
          :position="(index % 2 === (isImageReversed ? 1 : 0) ? 'left' : 'right')"
          :post
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post-list-container,
.post-list-section {
  transition-duration: 500ms;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
