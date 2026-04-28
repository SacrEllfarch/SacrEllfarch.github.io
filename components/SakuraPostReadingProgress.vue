<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const progress = ref(0)
let frame = 0

function getArticleRange() {
  const article = document.querySelector('.sakura-post .sakura-page-content') as HTMLElement | null
  if (!article)
    return { start: 0, end: Math.max(document.documentElement.scrollHeight - window.innerHeight, 1) }

  const rect = article.getBoundingClientRect()
  const start = rect.top + window.scrollY - Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sakura-navbar-height') || '0', 10)
  const end = start + article.offsetHeight - window.innerHeight

  return {
    start: Math.max(start, 0),
    end: Math.max(end, start + 1),
  }
}

function updateProgress() {
  frame = 0
  const { start, end } = getArticleRange()
  const current = window.scrollY - start
  progress.value = Math.min(Math.max(current / (end - start), 0), 1)
}

function requestUpdate() {
  if (frame)
    return

  frame = window.requestAnimationFrame(updateProgress)
}

onMounted(() => {
  updateProgress()
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
  <div class="sakura-post-reading-progress" aria-hidden="true">
    <div class="sakura-post-reading-progress-bar" :style="{ transform: `scaleX(${progress})` }" />
  </div>
</template>
