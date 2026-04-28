<script lang="ts" setup>
import type { MenuItem } from 'valaxy'
import { onContentUpdated, useFrontmatter } from 'valaxy'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

defineProps<{
  viewScroll?: boolean
}>()

const frontmatter = useFrontmatter()
const route = useRoute()
const { t } = useI18n()

const headers = ref<MenuItem[]>([])
const activeHash = ref('')
let frame = 0
let scanTimer = 0
let retryTimer = 0
let retryCount = 0
let observer: MutationObserver | undefined

function onResize() {
  scanHeaders()
  requestUpdate()
}

function getPostContent() {
  return document.querySelector('.sakura-post .sakura-page-content')
    || document.querySelector('.sakura-post .markdown-body')
}

function getHeaderElements() {
  const content = getPostContent()
  if (!content)
    return []

  return Array.from(content.querySelectorAll(':is(h2, h3, h4, h5, h6)[id]'))
    .filter(element => !element.closest('.sakura-local-toc, .not-prose')) as HTMLElement[]
}

function getHeaderTitle(element: HTMLElement) {
  return Array.from(element.childNodes)
    .filter(node => !(node instanceof HTMLElement && node.classList.contains('header-anchor')))
    .map(node => node.textContent || '')
    .join('')
    .replace(/\u200B/g, '')
    .trim()
}

function scanHeaders() {
  const elements = getHeaderElements()
  const root: MenuItem[] = []
  const stack: Array<{ level: number, item: MenuItem }> = []

  elements.forEach((element) => {
    const level = Number(element.tagName.slice(1))
    const item: MenuItem = {
      title: getHeaderTitle(element),
      link: `#${element.id}`,
      children: [],
    }

    while (stack.length && stack[stack.length - 1].level >= level)
      stack.pop()

    const parent = stack[stack.length - 1]?.item
    if (parent)
      parent.children ||= []

    if (parent)
      parent.children!.push(item)
    else
      root.push(item)

    stack.push({ level, item })
  })

  headers.value = root
  updateActiveHash()
}

function scheduleScan(delay = 0) {
  window.clearTimeout(scanTimer)
  scanTimer = window.setTimeout(scanHeaders, delay)
}

function retryScan() {
  window.clearTimeout(retryTimer)

  if (headers.value.length || retryCount >= 20)
    return

  retryCount += 1
  retryTimer = window.setTimeout(() => {
    scanHeaders()
    retryScan()
  }, 160)
}

function scanAfterContentUpdated() {
  nextTick(() => {
    retryCount = 0
    scanHeaders()
    retryScan()
  })
}

function updateActiveHash() {
  frame = 0

  const elements = getHeaderElements()
  if (!elements.length) {
    activeHash.value = ''
    return
  }

  const offset = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sakura-navbar-height') || '0', 10) + 72
  const scrollLine = window.scrollY + offset
  const pageBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2

  if (pageBottom) {
    activeHash.value = `#${elements[elements.length - 1].id}`
    return
  }

  let current = elements[0]
  for (const element of elements) {
    const top = element.getBoundingClientRect().top + window.scrollY
    if (top <= scrollLine)
      current = element
    else
      break
  }

  activeHash.value = window.scrollY <= 2 ? '' : `#${current.id}`
}

function requestUpdate() {
  if (frame)
    return

  frame = window.requestAnimationFrame(updateActiveHash)
}

function onTocClick(event: MouseEvent) {
  const target = event.currentTarget as HTMLAnchorElement | null
  const hash = target?.hash
  if (hash) {
    const heading = document.getElementById(decodeURIComponent(hash.slice(1)))
    heading?.focus({ preventScroll: true })
  }

  window.setTimeout(requestUpdate, 180)
}

watch(() => route.fullPath, () => {
  nextTick(() => {
    retryCount = 0
    scheduleScan(80)
    window.setTimeout(scanHeaders, 360)
    window.setTimeout(retryScan, 520)
  })
})

onContentUpdated(scanAfterContentUpdated)

onMounted(() => {
  nextTick(() => {
    scanHeaders()
    retryScan()
    window.setTimeout(scanHeaders, 100)
    window.setTimeout(scanHeaders, 420)
    window.setTimeout(scanHeaders, 1000)

    const content = getPostContent()
    if (content) {
      observer = new MutationObserver(() => scheduleScan(60))
      observer.observe(content, {
        childList: true,
        subtree: true,
      })
    }
  })

  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  if (frame)
    window.cancelAnimationFrame(frame)

  window.clearTimeout(scanTimer)
  window.clearTimeout(retryTimer)
  observer?.disconnect()
  window.removeEventListener('scroll', requestUpdate)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section v-if="frontmatter.toc !== false" class="sakura-local-toc">
    <h2 class="sakura-local-toc-title">
      {{ t('sidebar.toc') }}
    </h2>

    <nav v-if="headers.length" class="sakura-local-toc-body" aria-label="文章目录">
      <SakuraTocItems :headers="headers" :active-hash="activeHash" @navigate="onTocClick" />
    </nav>

    <p v-else class="sakura-local-toc-empty">
      正在生成目录...
    </p>
  </section>
</template>
