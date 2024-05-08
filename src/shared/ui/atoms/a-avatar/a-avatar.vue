<template>
  <div class="a-avatar" :class="`a-avatar--${type} a-avatar--${variant}`">
    <div v-if="leftLabel" class="a-avatar--text-left-label">{{ leftLabel }}</div>
    <img :style="{ width: size, height: size, flex: `0 0 ${size}` }" v-if="photoSrc" :src="image" class="a-avatar--image" />
    <div v-if="text" class="a-avatar--text">{{ text }}</div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary'
    type?: string //small or default
    text?: string
    size?: string
    leftLabel?: string
    photoSrc?: string | boolean
    robotData?: string
  }>(),
  {
    type: 'default',
    text: '',
    size: '32px',
    leftLabel: '',
    photoSrc: false,
    robotData: '',
    variant: 'primary'
  },
)
const config = useRuntimeConfig()

const iconsURL = config.public.ICON_API
const iconsHostname = `https://${iconsURL}/`

const image = computed(() => {
  return props.robotData ? iconsHostname + props.robotData : props.photoSrc
})
</script>

<style lang="scss" src="./a-avatar.scss" />
