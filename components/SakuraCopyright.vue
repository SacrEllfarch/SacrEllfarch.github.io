<script lang="ts" setup>
import { useSiteConfig } from 'valaxy'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useThemeConfig } from 'valaxy-theme-sakura/composables/config.ts'

const props = defineProps<{
  footer?: any
}>()

const siteConfig = useSiteConfig()
const themeConfig = useThemeConfig()

const footer = computed(() => props.footer || themeConfig.value.footer)
const year = new Date().getFullYear()

const isThisYear = computed(() => year === footer.value.since)
const footerIcon = computed(() => footer.value.icon!)
const runningTime = ref('正在计算运行时间...')

let runningTimer: ReturnType<typeof window.setInterval> | undefined

function formatRunningTime() {
  const since = Number(footer.value.since) || year
  const startTime = new Date(`${since}-01-01T00:00:00+08:00`).getTime()
  const diffSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000))
  const days = Math.floor(diffSeconds / 86400)
  const hours = Math.floor((diffSeconds % 86400) / 3600)
  const minutes = Math.floor((diffSeconds % 3600) / 60)
  const seconds = diffSeconds % 60

  runningTime.value = `本站已运行 ${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`
}

onMounted(() => {
  formatRunningTime()
  runningTimer = window.setInterval(formatRunningTime, 1000)
})

onBeforeUnmount(() => {
  if (runningTimer)
    window.clearInterval(runningTimer)
})
</script>

<template>
  <div class="sakura-copyright copyright flex flex-col items-center justify-center" p="1">
    <div class="sakura-running-time">
      {{ runningTime }}
    </div>

    <div class="sakura-copyright-main flex items-center justify-center">
      <span>
        Copyright &copy;
        <span itemprop="copyrightYear">
          <template v-if="!isThisYear">
            {{ footer.since }} -
          </template>
          {{ year }}
        </span>
        <span itemprop="copyrightHolder">&nbsp;&nbsp;By {{ siteConfig.author.name }}</span>
      </span>

      <a v-if="footer.icon?.enable" m="x-2" class="inline-flex animate-pulse" :href="footerIcon.url" target="_blank" :title="footerIcon.title">
        <div :class="footerIcon.name" />
      </a>
      <img v-if="!footer.icon?.enable && footerIcon.img" class="h-6 w-6 inline-flex animate-pulse" :src="footerIcon.img" title="Footer Icon Description">
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sakura-running-time {
  line-height: 1.8;
}
</style>
