<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const progress = ref(0)
let frame = 0

function updateProgress() {
  frame = 0

  const root = document.scrollingElement || document.documentElement
  const max = Math.max(root.scrollHeight - window.innerHeight, 1)
  progress.value = Math.min(Math.max(root.scrollTop / max, 0), 1)
}

function requestUpdate() {
  if (frame)
    return

  frame = window.requestAnimationFrame(updateProgress)
}

onMounted(() => {
  nextTick(() => {
    updateProgress()
    window.setTimeout(requestUpdate, 120)
    window.setTimeout(requestUpdate, 420)
  })

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
  <ClientOnly>
    <Teleport to="body">
      <div class="sakura-post-reading-progress" aria-hidden="true">
        <div class="sakura-post-reading-progress-bar" :style="{ transform: `scaleX(${progress})` }" />
      </div>
    </Teleport>
  </ClientOnly>
</template>
