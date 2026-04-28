<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useThemeConfig } from 'valaxy'

interface NavItem {
  text?: string
  locale?: string | number
  link: string
  icon?: string
  animated?: string
  target?: '_blank' | '_self' | '_parent' | '_top' | ''
  items?: NavItem[]
}

const props = defineProps<{
  sidebar?: NavItem[]
}>()

const themeConfig = useThemeConfig()
const route = useRoute()
const marker = ref<HTMLElement | null>(null)

const sidebar = computed(() =>
  props.sidebar
  || (Array.isArray(themeConfig.value.sidebar) && themeConfig.value.sidebar.length > 0 ? themeConfig.value.sidebar : themeConfig.value.navbar),
) as unknown as NavItem[]

function updateMarker() {
  if (!marker.value)
    return

  const routeActive = document.querySelector('.sakura-sidebar-link .router-link-active') as HTMLElement | null
  marker.value.style.top = `${routeActive?.offsetTop || 0}px`
  marker.value.style.height = `${routeActive?.offsetHeight || 0}px`
  marker.value.style.opacity = routeActive ? '1' : '0'
}

watch(() => route.path, () => nextTick(updateMarker))

onMounted(() => {
  nextTick(updateMarker)
})
</script>

<template>
  <nav class="sakura-sidebar-link">
    <SakuraSidebarLinkItem :items="sidebar" class="mx-auto" />
    <div ref="marker" id="marker" />
  </nav>
</template>

<style lang="scss" scoped>
.sakura-sidebar-link {
  display: flex;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
}
</style>
