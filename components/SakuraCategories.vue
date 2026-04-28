<script lang="ts" setup>
import type { Categories, CategoryList } from 'valaxy'
import { isCategoryList } from 'valaxy'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  categories: Categories
}>()

const route = useRoute()
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
</script>

<template>
  <div class="sakura-category-taxonomy">
    <div class="sakura-category-visual" aria-label="分类分布图">
      <RouterLink
        v-for="category in categoryItems"
        :key="`visual-${category.path}`"
        class="sakura-category-lane"
        :class="{ active: currentCategory === category.path }"
        :style="{
          '--category-level': category.level,
          '--category-ratio': category.total / maxTotal,
        }"
        :to="{ path: '/categories/', query: { category: category.path } }"
      >
        <span class="sakura-category-lane-label">
          <span class="i-ri-folder-chart-line" />
          {{ displayName(category) }}
        </span>
        <span class="sakura-category-lane-meter">
          <span />
        </span>
        <span class="sakura-category-lane-count">{{ category.total }}</span>
      </RouterLink>
    </div>

    <div class="sakura-category-grid">
      <RouterLink
        v-for="category in categoryItems"
        :key="category.path"
        class="sakura-category-pill"
        :class="{ active: currentCategory === category.path }"
        :style="{ '--category-level': category.level }"
        :to="{ path: '/categories/', query: { category: category.path } }"
      >
        <span class="i-ri-folder-2-line sakura-category-icon" />
        <span class="sakura-category-name">{{ displayName(category) }}</span>
        <span class="sakura-category-count">{{ category.total }}</span>
      </RouterLink>
    </div>
  </div>
</template>
