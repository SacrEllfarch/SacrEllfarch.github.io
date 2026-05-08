<script lang="ts" setup>
import { isClient } from '@vueuse/core'
import { ref, watch } from 'vue'
import type { LinkItem } from 'valaxy-theme-sakura/types'

const props = defineProps<{
  links: string | LinkItem[]
  random: boolean
  errorImg?: string
}>()

const data = ref<LinkItem[]>([])

watch(() => [props.links, props.random] as const, async () => {
  if (!isClient)
    return

  const rawData = typeof props.links === 'string'
    ? await fetch(props.links).then(res => res.json()) as LinkItem[]
    : props.links

  data.value = props.random
    ? Array.from(rawData || []).sort(() => Math.random() - 0.5)
    : rawData || []
}, { immediate: true })

function handleAvatarError(event: Event) {
  const image = event.target as HTMLImageElement
  if (props.errorImg && image.src !== props.errorImg)
    image.src = props.errorImg
}
</script>

<template>
  <div class="links">
    <ul class="link-items">
      <li
        v-for="link, i in data"
        :key="i"
        class="link-item"
        :style="`--primary-color: ${link.color || '#8b5cf6'}`"
      >
        <a class="link-url" p="x-4 y-2" :href="link.url" :title="link.name" rel="friend" target="_blank">
          <div class="link-left">
            <span class="link-avatar">
              <img :src="link.avatar" :alt="link.name" loading="lazy" @error="handleAvatarError">
            </span>
          </div>
          <div class="link-info" m="l-2">
            <div class="link-blog" font="serif black">{{ link.blog }}</div>
            <div class="link-desc">{{ link.desc }}</div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.link-item {
  display: inline-flex;
}

.links {
  .link-items {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-left: 0;
    text-align: center;
  }

  .link-url {
    --smc-link-color: var(--primary-color);

    display: inline-flex;
    justify-self: center;
    margin: 0.5rem;
    border: 1px solid var(--primary-color, gray);
    border-radius: var(--sakura-radius);
    color: var(--primary-color, black);
    line-height: 1.5;
    text-align: center;
    transition: 0.2s;

    &:hover {
      background-color: var(--primary-color, gray);
      box-shadow: 0 2px 20px var(--primary-color, gray);
      color: white;
    }
  }

  .link-left {
    line-height: 0;
  }

  .link-avatar {
    display: inline-flex;
    flex: 0 0 64px;
    width: 64px;
    height: 64px;
    overflow: hidden;
    border: 1px solid var(--primary-color, gray);
    border-radius: 50%;
    background-color: #fff;
    transition: 0.5s;

    &:hover {
      box-shadow: 0 0 20px oklch(0% 0 0 / 10%);
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  .link-info {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
  }

  .link-desc {
    width: 10rem;
    overflow: hidden;
    font-size: 0.8rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
