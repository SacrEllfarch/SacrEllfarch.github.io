<script setup lang="ts">
import { useOutline } from 'valaxy'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const { headers, handleClick } = useOutline()

const container = ref<HTMLElement | null>(null)
const marker = ref<HTMLElement | null>(null)
const activeLink = ref('')
let frame = 0

const hasHeaders = computed(() => headers.value.length > 0)

function flattenHeaders(items = headers.value) {
  return items.flatMap(item => [
    item,
    ...flattenHeaders(item.children || []),
  ])
}

function requestUpdate() {
  if (frame)
    return

  frame = window.requestAnimationFrame(updateActiveLink)
}

function updateActiveLink() {
  frame = 0

  const entries = flattenHeaders()
    .map((item) => {
      const id = decodeURIComponent(item.link.replace(/^#/, ''))
      const element = document.getElementById(id)

      return element
        ? {
            link: item.link,
            top: element.getBoundingClientRect().top,
          }
        : null
    })
    .filter(Boolean) as Array<{ link: string, top: number }>

  if (!entries.length) {
    activeLink.value = ''
    updateMarker()
    return
  }

  const viewportLine = Math.min(window.innerHeight * 0.35, 180)
  let current = entries[0].link

  for (const entry of entries) {
    if (entry.top <= viewportLine)
      current = entry.link
    else
      break
  }

  const pageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
  activeLink.value = pageBottom ? entries.at(-1)!.link : current
  updateMarker()
}

function updateMarker() {
  if (!container.value || !marker.value || !activeLink.value) {
    if (marker.value)
      marker.value.style.opacity = '0'

    return
  }

  const activeElement = container.value.querySelector<HTMLAnchorElement>(`a[data-link="${CSS.escape(activeLink.value)}"]`)

  if (!activeElement) {
    marker.value.style.opacity = '0'
    return
  }

  marker.value.style.opacity = '1'
  marker.value.style.transform = `translateY(${activeElement.offsetTop}px)`
  marker.value.style.height = `${activeElement.offsetHeight}px`
  activeElement.scrollIntoView({ block: 'nearest' })
}

function onClick(event: MouseEvent) {
  handleClick(event)

  const link = (event.currentTarget as HTMLAnchorElement | null)?.dataset.link
  if (link)
    activeLink.value = link

  nextTick(updateMarker)
}

watch(headers, () => {
  nextTick(requestUpdate)
})

onMounted(() => {
  nextTick(requestUpdate)
  window.setTimeout(requestUpdate, 160)
  window.setTimeout(requestUpdate, 520)
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
})

onBeforeUnmount(() => {
  if (frame)
    window.cancelAnimationFrame(frame)

  window.removeEventListener('scroll', requestUpdate)
  window.removeEventListener('resize', requestUpdate)
})
</script>

<template>
  <div v-show="hasHeaders" ref="container" class="sakura-outline">
    <div ref="marker" class="sakura-outline-marker" />

    <nav aria-labelledby="doc-outline-aria-label">
      <span id="doc-outline-aria-label" class="visually-hidden">
        Table of Contents for current page
      </span>

      <SakuraOutlineItem
        :headers="headers"
        :active-link="activeLink"
        :on-click="onClick"
        root
      />
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.sakura-outline {
  position: relative;
  max-height: min(62vh, 520px);
  overflow-x: hidden;
  overflow-y: auto;
  padding-left: 12px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 2px;
    bottom: 2px;
    left: 2px;
    width: 2px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--sakura-color-primary) 18%, transparent);
  }
}

.sakura-outline-marker {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 28px;
  border-radius: 999px;
  background: var(--sakura-color-primary);
  box-shadow: 0 0 12px color-mix(in srgb, var(--sakura-color-primary) 56%, transparent);
  opacity: 0;
  transition:
    transform 0.22s ease,
    height 0.22s ease,
    opacity 0.18s ease,
    background-color 0.25s ease;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
