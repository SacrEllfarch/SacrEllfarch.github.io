<script lang="ts" setup>
import { useFrontmatter, useOutline } from 'valaxy'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  viewScroll?: boolean
}>()

const frontmatter = useFrontmatter()
const { headers, handleClick } = useOutline()
const { t } = useI18n()

const activeHash = ref('')
let frame = 0

function getHeaderElements() {
  return Array.from(document.querySelectorAll('.sakura-post .markdown-body :is(h2, h3, h4, h5, h6)[id]')) as HTMLElement[]
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
  handleClick(event)
  window.setTimeout(requestUpdate, 180)
}

watch(headers, () => {
  nextTick(requestUpdate)
})

onMounted(() => {
  nextTick(updateActiveHash)
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
  <section v-if="frontmatter.toc !== false && headers.length" class="sakura-local-toc">
    <h2 class="sakura-local-toc-title">
      {{ t('sidebar.toc') }}
    </h2>

    <nav class="sakura-local-toc-body" aria-label="文章目录">
      <SakuraTocItems :headers="headers" :active-hash="activeHash" @navigate="onTocClick" />
    </nav>
  </section>
</template>
