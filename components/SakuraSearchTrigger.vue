<script lang="ts" setup>
import { useSiteConfig } from 'valaxy'
import { computed } from 'vue'
import { useSakuraAppStore } from 'valaxy-theme-sakura/stores/app.ts'

const sakura = useSakuraAppStore()
const siteConfig = useSiteConfig()

// Sakura v0.10.2 判断 search.type，而 Valaxy 0.28.x 的正式字段是 search.provider。
const searchType = computed(() => siteConfig.value.search?.provider || siteConfig.value.search?.type)
const isFuse = computed(() => searchType.value === 'fuse')
</script>

<template>
  <div flex="center">
    <SakuraSearchBtn :open="sakura.search.isOpen" @open="sakura.search.open" @close="sakura.search.close" />

    <SakuraSearch v-if="isFuse" :open="sakura.search.isOpen" @close="sakura.search.close" />
  </div>
</template>
