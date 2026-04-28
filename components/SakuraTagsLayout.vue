<script lang="ts" setup>
import { useSiteStore, useTags } from 'valaxy'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const site = useSiteStore()
const tags = useTags()
const { t } = useI18n()

const curTag = computed(() => route.query.tag as string || '')
const tagEntries = computed(() => Array.from(tags.value).sort(([a], [b]) => a.localeCompare(b)))
const hotTags = computed(() => [...tagEntries.value].sort((a, b) => b[1].count - a[1].count).slice(0, 10))
const maxCount = computed(() => Math.max(...tagEntries.value.map(([, tag]) => tag.count), 1))

const posts = computed(() => {
  return site.postList.filter((post) => {
    if (post.tags) {
      if (typeof post.tags === 'string')
        return post.tags === curTag.value

      return post.tags.includes(curTag.value)
    }
    return false
  })
})

function displayTag(tag: string) {
  router.push({ query: { tag } })
}

function getTagStyle(index: number) {
  const colors = ['#ff4e6a', '#ff8a34', '#e0a800', '#2fbf71', '#13a8c8', '#459ad3', '#8b8cff']
  const color = colors[index % colors.length]

  return {
    '--sakura-tag-color': color,
    '--sakura-tag-bg': `${color}22`,
  }
}

function getOrbitStyle(index: number, count: number) {
  const total = Math.max(hotTags.value.length, 1)
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  const radiusX = 38
  const radiusY = 30
  const x = 50 + Math.cos(angle) * radiusX
  const y = 50 + Math.sin(angle) * radiusY

  return {
    ...getTagStyle(index),
    '--tag-x': `${x}%`,
    '--tag-y': `${y}%`,
    '--tag-scale': 0.9 + (count / maxCount.value) * 0.26,
  }
}
</script>

<template>
  <SakuraPage>
    <RouterView v-slot="{ Component }">
      <component :is="Component">
        <template #main-content>
          <slot name="content">
            <div>
              <div class="sakura-text-light" text="center" p="2">
                {{ t('counter.tags', tagEntries.length) }}
              </div>

              <div class="sakura-tag-orbit" aria-label="标签星轨图">
                <div class="sakura-tag-orbit-core">
                  <span class="i-ri-price-tag-3-line" />
                  <strong>{{ tagEntries.length }}</strong>
                </div>
                <button
                  v-for="([key, tag], index) in hotTags"
                  :key="`visual-${key}`"
                  type="button"
                  class="sakura-tag-node"
                  :class="{ active: curTag === key.toString() }"
                  :style="getOrbitStyle(index, tag.count)"
                  @click="displayTag(key.toString())"
                >
                  <span>#{{ key }}</span>
                  <small>{{ tag.count }}</small>
                </button>
              </div>

              <div class="items-end justify-center" flex="~ wrap" gap="1">
                <SakuraButton
                  v-for="([key, tag], index) in tagEntries"
                  :key="key"
                  class="sakura-tag-button"
                  :style="getTagStyle(index)"
                  :class="{ clicked: curTag === key.toString() }"
                  @click="displayTag(key.toString())"
                >
                  <span mx-1 inline-flex>{{ key }}</span>
                  <span inline-flex text="xs">[{{ tag.count }}]</span>
                </SakuraButton>
              </div>
            </div>
          </slot>
        </template>

        <template #main-nav-before>
          <slot name="post">
            <div v-if="curTag">
              <SakuraPostList :posts="posts" />
            </div>
          </slot>
        </template>
      </component>
    </RouterView>
  </SakuraPage>
</template>
