<template>
  <div class="a-icon">
    <figure v-if="isColorful" :class="iconClasses">
      <img :src="src" :alt="props.name" :style="iconStyles" aria-hidden="true" class="a-icon__image"/>
      <figcaption class="visually-hidden">{{ props.name }}</figcaption>
    </figure>
    <figure v-else-if="imgTrue" :class="iconClasses">
      <img :src="props.name" :style="iconStyles" style="width: 24px;" aria-hidden="true" class="a-icon__image"/>
      <figcaption class="visually-hidden">{{ props.name }}</figcaption>
    </figure>
    <i v-else :class="[`a-icons`, `icon-${props.name}`]" :style="iconStyles" aria-hidden="true"/>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {Icon, files} from '~/src/shared/constants/icons'

interface Props {
  name: Icon
  width?: number | string
  height?: number | string
  imgTrue?: boolean
}

const src = ref<string>('')
const props = withDefaults(defineProps<Props>(), {
  width: undefined,
  height: undefined,
  imgTrue: false
})

const isColorful = ref<boolean>(props.name.includes('colorful'))

const iconStyles = computed<Record<string, boolean | string>>(() => {
  const width = props.width
  const height = props.height ?? width

  if (isColorful.value) {
    return {
      width: width ? `${width}px` : 'auto',
      height: height ? `${height}px` : 'auto',
      maxWidth: '100%',
      maxHeight: '100%',
    }
  }

  return {
    fontSize: width ? `${width}px` : 'inherit',
  }
})

const iconClasses = computed<string[]>(() => ['a-icons-com', `a-icons-com-${props.name}`])

try {
  src.value = files[props.name]
} catch (e) {
  console.error(e)
}

watch(
  () => props.name,
  () => {
    try {
      src.value = files[props.name]
    } catch (e) {
      console.error(e)
    }
  },
)
</script>

<style src="./a-icon.scss"/>
