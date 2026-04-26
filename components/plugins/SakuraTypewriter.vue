<script setup lang="ts">
import type { Options } from 'typeit'
import { watchOnce } from '@vueuse/core'
import TypeIt from 'typeit'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  [key: string]: any
} & Partial<TypewriterProps>>(), {
  delay: 75,
  typeString: '',
})

const emit = defineEmits(['typingFinished', 'deletionFinished', 'allTypingFinished'])

export interface TypewriterProps {
  delay: number
  deleteSpeed: number
  loop: boolean
  pauseFor: number | number[]
  typeString: string | string[]
  deleteAll: number | boolean | number[]
}

const typewriterElement = ref<HTMLElement | null>(null)
let refreshNeeded = false
let instance: TypeIt | null = null
let stopped = false

function normalizeTypeStrings() {
  return Array.isArray(props.typeString) ? props.typeString : [props.typeString]
}

function resetInstance() {
  if (instance) {
    instance.destroy()
    instance = null
  }
  if (typewriterElement.value)
    typewriterElement.value.textContent = ''
}

function createTypewriter(typeStrings: string[]) {
  if (!typewriterElement.value || stopped)
    return

  const options = {
    deleteSpeed: props.deleteSpeed,
    loop: false,
  } as Options

  if (instance === null)
    instance = new TypeIt(typewriterElement.value, options)

  typeStrings.forEach((str, index) => {
    instance!.type(str)

    if (typeof props.pauseFor === 'number')
      instance!.pause(props.pauseFor)
    else if (Array.isArray(props.pauseFor))
      instance!.pause(props.pauseFor[index] ?? props.pauseFor.at(-1) ?? 0)

    instance!.exec(() => emit('typingFinished'))

    if (index === typeStrings.length - 1)
      instance!.exec(() => emit('allTypingFinished'))

    if (props.deleteAll === true) {
      instance!.delete()
    }
    else if (typeof props.deleteAll === 'number') {
      for (let i = 0; i < str.length; i++)
        instance!.delete(1, { delay: props.deleteAll })
    }
    else if (Array.isArray(props.deleteAll)) {
      const deleteDelay = props.deleteAll[index] ?? props.deleteAll.at(-1) ?? 0
      for (let i = 0; i < str.length; i++)
        instance!.delete(1, { delay: deleteDelay })
    }
  })

  instance.flush(() => {
    emit('deletionFinished')

    if (stopped)
      return

    if (refreshNeeded || props.loop) {
      refreshNeeded = false
      resetInstance()
      createTypewriter(normalizeTypeStrings())
    }
  })
}

watch(() => props.typeString, () => {
  refreshNeeded = true
})

onMounted(() => {
  if (props.typeString) {
    createTypewriter(normalizeTypeStrings())
  }
  else {
    watchOnce(() => props.typeString, () => {
      createTypewriter(normalizeTypeStrings())
    })
  }
})

onUnmounted(() => {
  stopped = true
  resetInstance()
})
</script>

<template>
  <span ref="typewriterElement" />
</template>
