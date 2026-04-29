<script setup lang="ts">
import { useOutline } from 'valaxy'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const { headers } = useOutline()

const container = ref<HTMLElement | null>(null)
const marker = ref<HTMLElement | null>(null)
const activeLink = ref('')
let frame = 0
let scrollFrame = 0
let outlineScrollFrame = 0
let lastFollowedLink = ''

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

  const activeElement = container.value.querySelector<HTMLButtonElement>(`button[data-link="${CSS.escape(activeLink.value)}"]`)

  if (!activeElement) {
    marker.value.style.opacity = '0'
    return
  }

  const containerRect = container.value.getBoundingClientRect()
  const activeRect = activeElement.getBoundingClientRect()
  const markerTop = activeRect.top - containerRect.top + container.value.scrollTop

  marker.value.style.opacity = '1'
  marker.value.style.transform = `translateY(${markerTop}px)`
  marker.value.style.height = `${activeRect.height}px`

  if (lastFollowedLink !== activeLink.value) {
    lastFollowedLink = activeLink.value
    followActiveElement(activeElement)
  }
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3
}

function easeOutQuint(value: number) {
  return 1 - (1 - value) ** 5
}

function animateOutlineScrollTo(targetTop: number) {
  const outline = container.value
  if (!outline)
    return

  if (outlineScrollFrame)
    window.cancelAnimationFrame(outlineScrollFrame)

  const startTop = outline.scrollTop
  const distance = targetTop - startTop
  if (Math.abs(distance) < 2)
    return

  const duration = Math.min(Math.max(Math.abs(distance) * 0.55, 220), 460)
  const startedAt = performance.now()

  function step(now: number) {
    const progress = Math.min((now - startedAt) / duration, 1)
    outline.scrollTop = startTop + distance * easeOutQuint(progress)

    if (progress < 1) {
      outlineScrollFrame = window.requestAnimationFrame(step)
    }
    else {
      outlineScrollFrame = 0
    }
  }

  outlineScrollFrame = window.requestAnimationFrame(step)
}

function followActiveElement(activeElement: HTMLElement) {
  const outline = container.value
  if (!outline)
    return

  const containerRect = outline.getBoundingClientRect()
  const activeRect = activeElement.getBoundingClientRect()
  const activeTop = activeRect.top - containerRect.top + outline.scrollTop
  const activeBottom = activeTop + activeRect.height
  const comfortTop = outline.scrollTop + 40
  const comfortBottom = outline.scrollTop + outline.clientHeight - 40

  if (activeTop >= comfortTop && activeBottom <= comfortBottom)
    return

  const maxScrollTop = outline.scrollHeight - outline.clientHeight
  const targetTop = Math.min(
    Math.max(activeTop - (outline.clientHeight - activeRect.height) * 0.42, 0),
    maxScrollTop,
  )
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion)
    outline.scrollTop = targetTop
  else
    animateOutlineScrollTo(targetTop)
}

function animateScrollTo(targetTop: number) {
  if (scrollFrame)
    window.cancelAnimationFrame(scrollFrame)

  const startTop = window.scrollY
  const distance = targetTop - startTop
  const duration = Math.min(Math.max(Math.abs(distance) * 0.42, 360), 680)
  const startedAt = performance.now()

  function step(now: number) {
    const elapsed = now - startedAt
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, startTop + distance * easeOutCubic(progress))

    if (progress < 1) {
      scrollFrame = window.requestAnimationFrame(step)
    }
    else {
      scrollFrame = 0
      requestUpdate()
    }
  }

  scrollFrame = window.requestAnimationFrame(step)
}

function onClick(event: MouseEvent) {
  event.preventDefault()

  const link = (event.currentTarget as HTMLAnchorElement | null)?.dataset.link
  if (!link)
    return

  const id = decodeURIComponent(link.replace(/^#/, ''))
  const heading = document.getElementById(id)
  if (!heading)
    return

  activeLink.value = link
  heading.focus({ preventScroll: true })

  const targetTop = heading.getBoundingClientRect().top + window.scrollY - 92
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  window.history.pushState(null, '', `${window.location.pathname}${window.location.search}${link}`)

  if (prefersReducedMotion) {
    window.scrollTo(0, Math.max(targetTop, 0))
    requestUpdate()
  }
  else {
    animateScrollTo(Math.max(targetTop, 0))
  }

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

  if (scrollFrame)
    window.cancelAnimationFrame(scrollFrame)

  if (outlineScrollFrame)
    window.cancelAnimationFrame(outlineScrollFrame)

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
  padding: 0 7px 0 12px;
  scrollbar-color:
    color-mix(in srgb, var(--sakura-color-primary) 42%, transparent)
    color-mix(in srgb, var(--sakura-color-primary) 9%, transparent);
  scrollbar-gutter: stable;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 999px;
    background: color-mix(in srgb, var(--sakura-color-primary) 8%, transparent);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: color-mix(in srgb, var(--sakura-color-primary) 38%, transparent);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: color-mix(in srgb, var(--sakura-color-primary) 58%, transparent);
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
    transform 0.34s cubic-bezier(0.2, 0.9, 0.24, 1.18),
    height 0.26s cubic-bezier(0.2, 0.9, 0.24, 1),
    opacity 0.18s ease,
    background-color 0.25s ease;
  will-change: transform, height;
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
