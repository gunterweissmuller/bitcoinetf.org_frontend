<template>
  <button
    tabindex="0"
    :class="carouselControlClasses"
    :style="carouselControlStyles"
    :disabled="disabled"
    :aria-label="carouselControlAriaLabel"
    type="button"
  >
    <a-icon class="a-carousel-control__icon" :name="carouselControlIcon" :width="32" :height="32" />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'

const props = withDefaults(
  defineProps<{
    options: 'left' | 'right'
    disabled?: boolean
    variant?: 'default' | 'ghost'
    clickableButtonArea?: string
  }>(),
  {
    disabled: false,
    variant: 'default',
    clickableButtonArea: '',
  },
)

const carouselControlIcon = computed<string>(() => {
  return props.options === 'left' ? Icon.MonoNavigationChevronLeft : Icon.MonoNavigationChevronRight
})

const carouselControlAriaLabel = computed<string>(() => {
  return props.options === 'left' ? 'Previous' : 'Next'
})

const carouselControlClasses = computed<Record<string, boolean | string>>(() => ({
  'a-carousel-control': true,
  [`a-carousel-control--${props.variant}`]: props.variant,
}))

const carouselControlStyles = computed<Record<string, string>>(() => {
  const stylesObject = {}
  if (props.clickableButtonArea) {
    stylesObject.height = props.clickableButtonArea
  }
  return stylesObject
})
</script>

<style lang="scss" src="./a-carousel-control.scss" />
