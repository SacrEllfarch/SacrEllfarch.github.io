<script lang="ts" setup>
import type { MenuItem } from 'valaxy'
import { useI18n } from 'vue-i18n'

defineProps<{
  headers: MenuItem[]
  activeHash: string
}>()

defineEmits<{
  navigate: [event: MouseEvent]
}>()

const { locale } = useI18n()

function isActiveLink(link: string) {
  return decodeURIComponent(link) === decodeURIComponent(activeHash)
}
</script>

<template>
  <ul class="sakura-local-toc-list">
    <li
      v-for="{ children, link, title, lang } in headers"
      :key="link"
      class="sakura-local-toc-item"
      :lang="lang || locale"
    >
      <RouterLink
        :to="link"
        :href="link"
        class="sakura-local-toc-link"
        :class="{ active: isActiveLink(link) }"
        @click="$emit('navigate', $event)"
      >
        {{ title }}
      </RouterLink>

      <SakuraTocItems
        v-if="children?.length"
        :headers="children"
        :active-hash="activeHash"
        @navigate="$emit('navigate', $event)"
      />
    </li>
  </ul>
</template>
