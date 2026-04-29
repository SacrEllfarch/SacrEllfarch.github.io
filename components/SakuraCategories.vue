<script lang="ts" setup>
import type { Categories, CategoryList } from 'valaxy'
import { isCategoryList } from 'valaxy'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  categories: Categories
}>()

const route = useRoute()
const router = useRouter()
const currentCategory = computed(() => (route.query.category || '') as string)

interface CategoryItem {
  name: string
  path: string
  total: number
  level: number
}

function collectCategories(categories: Categories, parent = '', level = 0): CategoryItem[] {
  const result: CategoryItem[] = []

  for (const category of categories.values()) {
    if (!isCategoryList(category))
      continue

    const path = parent ? `${parent}/${category.name}` : category.name
    result.push({
      name: category.name,
      path,
      total: category.total,
      level,
    })

    result.push(...collectCategories(category.children, path, level + 1))
  }

  return result
}

const categoryItems = computed(() => collectCategories(props.categories))
const maxTotal = computed(() => Math.max(...categoryItems.value.map(category => category.total), 1))

function displayName(category: CategoryItem | CategoryList) {
  return category.name === 'Uncategorized' ? '未分类' : category.name
}

function displayCategory(category: CategoryItem) {
  router.push({
    path: '/categories/',
    query: { category: category.path },
  })
}
</script>

<template>
  <div class="sakura-category-taxonomy">
    <div class="sakura-category-visual" aria-label="分类分布图">
      <button
        v-for="category in categoryItems"
        :key="`visual-${category.path}`"
        type="button"
        class="sakura-category-lane"
        :class="{ active: currentCategory === category.path }"
        :style="{
          '--category-level': category.level,
          '--category-ratio': category.total / maxTotal,
        }"
        @click="displayCategory(category)"
      >
        <span class="sakura-category-lane-label">
          <span class="i-ri-folder-chart-line" />
          {{ displayName(category) }}
        </span>
        <span class="sakura-category-lane-meter">
          <span />
        </span>
        <span class="sakura-category-lane-count">{{ category.total }}</span>
      </button>
    </div>

    <div class="sakura-category-grid">
      <button
        v-for="category in categoryItems"
        :key="category.path"
        type="button"
        class="sakura-category-pill"
        :class="{ active: currentCategory === category.path }"
        :style="{ '--category-level': category.level }"
        @click="displayCategory(category)"
      >
        <span class="i-ri-folder-2-line sakura-category-icon" />
        <span class="sakura-category-name">{{ displayName(category) }}</span>
        <span class="sakura-category-count">{{ category.total }}</span>
      </button>
    </div>
  </div>
</template>
