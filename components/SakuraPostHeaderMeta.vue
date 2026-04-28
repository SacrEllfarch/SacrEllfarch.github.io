<script lang="ts" setup>
import type { PostFrontMatter } from 'valaxy'
import { useSiteConfig } from 'valaxy'
import { useAddonVercount } from 'valaxy-addon-vercount'
import { computed } from 'vue'

const props = defineProps<{
  fm: PostFrontMatter
}>()

const { page } = useAddonVercount()
const siteConfig = useSiteConfig()

function formatDateTime(value: unknown) {
  if (!value)
    return ''

  const date = new Date(value as string | number | Date)
  if (Number.isNaN(date.getTime()))
    return ''

  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Hong_Kong',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const map = Object.fromEntries(parts.map(part => [part.type, part.value]))
  return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}`
}

const publishedAt = computed(() => formatDateTime(props.fm.date))
const updatedAt = computed(() => formatDateTime(props.fm.updated))
const wordCount = computed(() => props.fm.wordCount ? String(props.fm.wordCount) : '')
const readingTime = computed(() => {
  const value = Number(props.fm.readingTime)
  if (!Number.isFinite(value) || value <= 0)
    return ''

  return `${Math.ceil(value)} 分钟`
})

const metaItems = computed(() => {
  const items = []

  if (publishedAt.value) {
    items.push({
      key: 'posted',
      icon: 'i-ri-calendar-line',
      label: '发表于',
      value: publishedAt.value,
    })
  }

  if (updatedAt.value && updatedAt.value !== publishedAt.value) {
    items.push({
      key: 'updated',
      icon: 'i-ri-refresh-line',
      label: '更新于',
      value: updatedAt.value,
    })
  }

  if (siteConfig.value.statistics.enable && wordCount.value) {
    items.push({
      key: 'word-count',
      icon: 'i-ri-file-word-line',
      label: '字数',
      value: wordCount.value,
    })
  }

  if (siteConfig.value.statistics.enable && readingTime.value) {
    items.push({
      key: 'reading-time',
      icon: 'i-ri-timer-line',
      label: '预计阅读',
      value: readingTime.value,
    })
  }

  items.push({
    key: 'views',
    icon: 'i-ri-eye-line',
    label: '浏览量',
    value: page.pv ?? 0,
  })

  return items
})
</script>

<template>
  <div class="sakura-post-header-meta" :class="{ 'text-$sakura-color-text': !fm.cover }">
    <span
      v-for="item in metaItems"
      :key="item.key"
      class="sakura-post-header-meta-item"
      :title="`${item.label}: ${item.value}`"
    >
      <span class="sakura-post-header-meta-icon" :class="item.icon" />
      <span class="sakura-post-header-meta-label">{{ item.label }}</span>
      <span class="sakura-post-header-meta-value">{{ item.value }}</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.sakura-post-header-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px 0;
  padding-block: 0.25rem;
  color: inherit;
  font-size: 0.86rem;
  line-height: 1.5;
}

.sakura-post-header-meta-item {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  color: inherit;
  opacity: 0.86;
  white-space: nowrap;

  &:not(:last-child)::after {
    content: '|';
    margin-inline: 0.72rem;
    color: color-mix(in srgb, currentColor 46%, transparent);
  }
}

.sakura-post-header-meta-icon {
  width: 0.95rem;
  height: 0.95rem;
  margin-right: 0.28rem;
  color: var(--sakura-color-primary);
}

.sakura-post-header-meta-label {
  margin-right: 0.24rem;
}

.sakura-post-header-meta-value {
  font-variant-numeric: tabular-nums;
  font-weight: 650;
}
</style>
