<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useThemeConfig } from 'valaxy-theme-sakura/composables/config.ts'
import { useSakuraAppStore } from 'valaxy-theme-sakura/stores/app.ts'
import { isVideoUrl } from 'valaxy-theme-sakura/utils/media.ts'

const props = withDefaults(defineProps<{
  urls?: string[] | string
}>(), {})

const visitedUrls = ref<number[]>([])
const playerVideo = ref<HTMLVideoElement>()

const sakura = useSakuraAppStore()
const themeConfig = useThemeConfig()

const urls = computed(() => props.urls || themeConfig.value.hero.urls || '')
const hero = computed(() => themeConfig.value.hero)

const currentWallpaperUrl = computed(() => {
  if (typeof urls.value === 'string')
    return urls.value

  if (hero.value.randomUrls) {
    let randomIndex: number | null = null

    do {
      const urlsLength = hero.value.urls.length
      randomIndex = Math.floor(Math.random() * urlsLength)
    } while (visitedUrls.value.includes(randomIndex))

    return urls.value[randomIndex]
  }
  return urls.value[sakura.wallpaperIndex]
})

const currentVideoUrl = computed(() => sakura.wallpaperIsPlaying ? hero.value.playerUrl : currentWallpaperUrl.value)
const isCurrentMediaVideo = computed(() => isVideoUrl(currentWallpaperUrl.value))

function playPlayerVideo() {
  if (!sakura.wallpaperIsPlaying)
    return

  nextTick(() => {
    const video = playerVideo.value
    if (!video)
      return

    const playPromise = video.play()
    if (playPromise)
      playPromise.catch(() => {})
  })
}

watch(() => sakura.wallpaperIndex, (newIndex, oldIndex) => {
  const urlsLength = hero.value.urls.length
  if (visitedUrls.value.length === urlsLength)
    visitedUrls.value = []
  visitedUrls.value.push(oldIndex)
})

watch(() => sakura.wallpaperIndex, () => {
  if (sakura.wallpaperIndex >= urls.value.length)
    sakura.wallpaperIndex = 0
}, { immediate: true })

watch(() => urls.value.length, (length) => {
  sakura.wallpaperLength = length
}, { immediate: true })

watch(() => sakura.wallpaperIsPlaying, playPlayerVideo, { flush: 'post' })
</script>

<template>
  <div class="sakura-hero-background">
    <Transition
      :name="sakura.wallpaperOperation === 'nextMedia' ? 'slide-right'
        : sakura.wallpaperOperation === 'prevMedia' ? 'slide-left'
          : 'fade'"
      mode="out-in"
    >
      <template v-if="sakura.wallpaperIsPlaying || isCurrentMediaVideo">
        <video
          :key="currentVideoUrl"
          ref="playerVideo"
          class="min-h-full min-w-full object-cover"
          preload="auto"
          autoplay
          playsinline
          :loop="!sakura.wallpaperIsPlaying"
          :muted="!sakura.wallpaperIsPlaying"
          :disablePictureInPicture="hero.disablePictureInPicture"
          @canplay="playPlayerVideo"
          @loadeddata="playPlayerVideo"
          @ended="sakura.wallpaperIsPlaying = false"
        >
          <source :src="currentVideoUrl" type="video/mp4">
          Your browser does not support video tags
        </video>
      </template>
      <template v-else>
        <div
          v-if="currentWallpaperUrl" :key="currentWallpaperUrl" class="sakura-hero-background-img"
          :style="{ backgroundImage: `url(${currentWallpaperUrl})`, backgroundAttachment: hero.fixedImg ? 'fixed' : 'scroll' }"
        />
        <div v-else class="sakura-hero-background-default h-full w-full" />
      </template>
    </Transition>
  </div>
</template>

<style lang="scss">
.sakura-hero-background {
  height: 100dvh;
  width: 100%;
  overflow: hidden;

  &-img {
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
    object-fit: cover;
  }

  &-default {
    background: linear-gradient(
      45deg,
      var(--sakura-color-primary),
      var(--sakura-color-primary)
    );
    background-size: 600% 600%;
    animation: gradient-background 10s ease infinite;
  }

  @keyframes gradient-background {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-right {
    &-enter-active,
    &-leave-active {
      transition: transform 1s ease;
    }

    &-enter-from,
    &-leave-to {
      transform: translateX(-100%);
    }

    &-enter-to,
    &-leave-from {
      transform: translateX(0);
    }
  }

  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: transform 1s ease;
  }

  .slide-left-enter,
  .slide-left-leave-to {
    transform: translateX(100%);
  }
}
</style>
