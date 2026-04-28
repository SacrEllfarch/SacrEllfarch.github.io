<script setup lang="ts">
import type { MenuItem } from '@valaxyjs/utils'
import { useI18n } from 'vue-i18n'

defineProps<{
  headers: MenuItem[]
  activeLink: string
  onClick: (event: MouseEvent) => void
  root?: boolean
}>()

const { locale } = useI18n()
</script>

<template>
  <ul :class="root ? 'root' : 'nested'" class="sakura-outline-list">
    <li
      v-for="{ children, link, title, lang, level } in headers"
      :key="link"
      class="sakura-outline-item"
      :class="`level-${level}`"
      :lang="lang || locale"
    >
      <a
        :href="link"
        :data-link="link"
        class="sakura-outline-link"
        :class="{ active: activeLink === link }"
        @click="onClick"
      >
        <span class="sakura-outline-dot" />
        <span class="sakura-outline-text">{{ title }}</span>
      </a>

      <SakuraOutlineItem
        v-if="children?.length"
        :headers="children"
        :active-link="activeLink"
        :on-click="onClick"
      />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.sakura-outline-list {
  position: relative;
  z-index: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: left;
}

.nested {
  padding-left: 12px;
}

.sakura-outline-item {
  margin: 1px 0;
}

.sakura-outline-link {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr);
  align-items: center;
  gap: 6px;
  width: 100%;
  min-width: 0;
  padding: 5px 7px 5px 3px;
  border-radius: 7px;
  color: color-mix(in srgb, var(--sakura-color-text) 72%, transparent);
  font-size: 0.82rem;
  line-height: 1.35;
  text-decoration: none;
  transition:
    color 0.18s ease,
    background-color 0.18s ease,
    transform 0.18s ease;

  &:hover {
    color: var(--sakura-color-primary);
    background: color-mix(in srgb, var(--sakura-color-primary) 8%, transparent);
  }

  &.active {
    color: var(--sakura-color-primary);
    background: color-mix(in srgb, var(--sakura-color-primary) 13%, transparent);
    font-weight: 700;
    transform: translateX(2px);
  }
}

.sakura-outline-dot {
  width: 5px;
  height: 5px;
  margin-inline: auto;
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 42%, transparent);
  transition:
    transform 0.18s ease,
    background-color 0.18s ease;
}

.sakura-outline-link.active .sakura-outline-dot {
  background: var(--sakura-color-primary);
  transform: scale(1.25);
}

.sakura-outline-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.level-3 .sakura-outline-link {
  font-size: 0.78rem;
}

.level-4 .sakura-outline-link,
.level-5 .sakura-outline-link,
.level-6 .sakura-outline-link {
  font-size: 0.75rem;
  opacity: 0.9;
}
</style>
