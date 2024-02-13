<template>
  <component :is="componentTag" loading="lazy" data-test-id="image" @error="onImageError" />
</template>

<script lang="ts" setup>
const isValidImage = ref<boolean>(true)

const onImageError = () => {
  isValidImage.value = false
}

const componentTag = computed(() => {
  return isValidImage.value ? 'img' : 'span'
})
</script>
