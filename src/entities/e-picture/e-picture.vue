<template>
  <picture v-if="isValidImage">
    <slot :onError="onImageError" />
  </picture>
  <span :class="className" v-else />
</template>

<script lang="ts" setup>
const TAG_NAME = 'img'

const { default: defaultSlot } = useSlots()

const className = computed<string>(() => {
  return defaultSlot().find((el) => el.type === TAG_NAME)?.props?.class || ''
})

const isValidImage = ref<boolean>(true)

const onImageError = () => {
  isValidImage.value = false
}
</script>
