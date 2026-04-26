<script lang="ts" setup>
import { useSiteConfig } from 'valaxy'
import { computed } from 'vue'
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
</script>

<template>
  <div class="sakura-copyright copyright flex items-center justify-center" p="1">
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
</template>
