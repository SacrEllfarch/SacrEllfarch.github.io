<script lang="ts" setup>
import { useFrontmatter } from 'valaxy'
import { useI18n } from 'vue-i18n'

defineProps<{
  viewScroll?: boolean
}>()

const frontmatter = useFrontmatter()
const { t } = useI18n()
</script>

<template>
  <section v-if="frontmatter.toc !== false" class="sakura-toc-panel">
    <header class="sakura-toc-heading">
      <span class="sakura-toc-heading-icon i-ri-list-check-2" />
      <span>{{ t('sidebar.toc') }}</span>
    </header>

    <SakuraOutline />
  </section>
</template>

<style lang="scss" scoped>
.sakura-toc-panel {
  position: sticky;
  top: calc(var(--sakura-navbar-height) + 24px);
  width: 100%;
  max-width: 250px;
  padding: 14px 12px 14px 14px;
  border: 1px solid color-mix(in srgb, var(--sakura-color-primary) 16%, transparent);
  border-radius: 8px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 78%), rgb(255 255 255 / 58%)),
    var(--sakura-color-card, var(--va-c-bg-soft));
  box-shadow: 0 12px 30px rgb(30 43 76 / 9%);
  backdrop-filter: blur(12px);
}

.dark .sakura-toc-panel {
  background:
    linear-gradient(180deg, rgb(24 28 36 / 78%), rgb(18 21 29 / 62%)),
    var(--sakura-color-card, var(--va-c-bg-soft));
  box-shadow: 0 12px 30px rgb(0 0 0 / 22%);
}

.sakura-toc-heading {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
  color: var(--sakura-color-text);
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.35;
}

.sakura-toc-heading-icon {
  width: 1rem;
  height: 1rem;
  color: var(--sakura-color-primary);
}
</style>
