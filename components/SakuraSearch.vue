<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import iloliImg from 'valaxy-theme-sakura/assets/iloli.gif'
import { useScrollLock } from 'valaxy-theme-sakura/composables/scroll.ts'
import { useSearch } from 'valaxy-theme-sakura/composables/search.ts'

const props = defineProps<{
  open: boolean
}>()

const isLocked = useScrollLock()
const search = useSearch()
const router = useRouter()
const { t } = useI18n()

const input = ref('')
const searchInputRef = ref<HTMLInputElement>()

watch(() => props.open, () => {
  if (!props.open)
    return

  setTimeout(() => {
    searchInputRef.value?.focus()
  }, 0)
})

function toSearch() {
  router.push({ path: '/search', query: { q: input.value } })
  search.close()
}
</script>

<template>
  <Transition name="search-overlay" @before-enter="isLocked = true" @after-leave="isLocked = false">
    <div v-if="open" class="mashiro-search" :style="{ '--sakura-search-bg-img': `url('${iloliImg}')` }">
      <div class="mashiro-search-container">
        <p>想要找点什么呢？</p>
        <div class="flex-center relative my-4" flex="~" rounded>
          <div class="i-fa-search absolute left-0 pl-12" />
          <input ref="searchInputRef" v-model="input" class="mashiro-search-input" :placeholder="t('search.placeholder')" @keyup.enter="toSearch">
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.mashiro-search {
  position: fixed;
  inset: 0;
  z-index: 150;
  display: flex;
  align-items: center;
  margin: 0;
  padding-top: 2.4rem;
  overflow-y: scroll;
  pointer-events: auto;
  background-color: var(--sakura-color-background);
  background-image: var(--sakura-search-bg-img);
  background-repeat: no-repeat;
  background-position: right bottom;
  backdrop-filter: blur(30px);
  transform-origin: top right;

  &-container {
    width: 90%;
    max-width: 600px;
    height: 285px;
    margin: 0 auto;
  }

  &-input {
    box-sizing: border-box;
    width: 100%;
    padding: 6px 24px 6px 50px;
    border: 1px solid var(--sakura-color-border);
    border-radius: 3rem;
    background: transparent;
    color: var(--sakura-color-text);
    font-size: 1.5rem;
    font-weight: 900;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: var(--sakura-color-primary);
    }
  }
}

.search-overlay-enter-active {
  animation: search-overlay-in 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.search-overlay-leave-active {
  animation: search-overlay-out 0.28s cubic-bezier(0.55, 0, 1, 0.45);
}

@keyframes search-overlay-in {
  0% {
    opacity: 0;
    filter: blur(8px);
    transform: scale(0.92);
  }

  65% {
    opacity: 1;
    filter: blur(0);
    transform: scale(1.01);
  }

  100% {
    opacity: 1;
    filter: blur(0);
    transform: scale(1);
  }
}

@keyframes search-overlay-out {
  0% {
    opacity: 1;
    filter: blur(0);
    transform: scale(1);
  }

  100% {
    opacity: 0;
    filter: blur(8px);
    transform: scale(0.96);
  }
}
</style>
