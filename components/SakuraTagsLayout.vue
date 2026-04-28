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

              <div class="sakura-tag-visual" aria-label="标签热度图">
                <button
                  v-for="([key, tag], index) in hotTags"
                  :key="`visual-${key}`"
                  type="button"
                  class="sakura-tag-tile"
                  :class="{ active: curTag === key.toString() }"
                  :style="{
                    ...getTagStyle(index),
                    '--tag-ratio': tag.count / maxCount,
                  }"
                  @click="displayTag(key.toString())"
                >
                  <span class="sakura-tag-tile-name">#{{ key }}</span>
                  <span class="sakura-tag-tile-meter">
                    <span />
                  </span>
                  <span class="sakura-tag-tile-count">{{ tag.count }}</span>
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
