<script lang="ts" setup>
import { useCategories, useSiteStore } from 'valaxy'
import { computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const site = useSiteStore()
const { t } = useI18n()
const route = useRoute()
const categories = useCategories()

const curCategory = computed(() => (route.query.category || '') as string)
const posts = computed(() => {
  return site.postList.filter((post) => {
    if (post.categories && curCategory.value !== 'Uncategorized') {
      if (typeof post.categories === 'string')
        return post.categories === curCategory.value

      return post.categories.join('/').startsWith(curCategory.value) && post.categories[0] === curCategory.value.split('/')[0]
    }

    if (!post.categories && curCategory.value === 'Uncategorized')
      return post.categories === undefined

    return false
  })
})

watch(curCategory, async (category) => {
  if (!category)
    return

  await nextTick()
  document.querySelector('#category-posts')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
})
</script>

<template>
  <SakuraPage class="sakura-categories-page">
    <RouterView v-slot="{ Component }">
      <component :is="Component">
        <template #main-content>
          <slot name="content">
            <div>
              <div text="center" class="yun-text-light" p="2">
                {{ t('counter.categories', Array.from(categories.children).length) }}
              </div>

              <SakuraCategories :categories="categories.children" />

              <section v-if="curCategory" id="category-posts" class="sakura-taxonomy-posts">
                <div class="sakura-taxonomy-posts-header">
                  <span class="i-ri-folder-open-line" />
                  <strong>{{ curCategory }}</strong>
                  <small>{{ posts.length }} 篇文章</small>
                </div>

                <SakuraPostList w="full" :posts="posts" />
              </section>
            </div>
          </slot>
        </template>
      </component>
    </RouterView>
  </SakuraPage>
</template>

<style lang="scss">
.sakura-categories-page {
  .sakura-triple-columns {
    width: 100%;
  }
}
</style>
