<template>
  <button
    class="a-button"
    :class="[buttonTypeClass, buttonSizeClass, buttonIconPositionClass, buttonFontSizeClass, buttonClasses]"
    :variant="variant"
    :size="size"
    :iconPosition="iconPosition"
    :disabled="loading || disabled"
    :title="title || text"
    :aria-label="text"
    v-bind="$attrs"
    :type="props.type"
  >
    <template v-if="!loading">
      <a-icon v-if="icon" class="a-button__icon" :name="icon"/>
      <span v-if="text" class="a-button__label">{{ text }}</span>
    </template>
    <template v-if="loading">
      <a-icon class="a-button__loading a-button__icon" :name="Icon.MonoNavigationLoader"/>
    </template>
  </button>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useNuxtApp} from '#app'
import {Icon} from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'

const {$app} = useNuxtApp()
const buttonVariants = {
  types: ['primary', 'secondary', 'tertiary', 'primary2'],
  sizes: ['default', 'small', 'no-padding'],
  iconPositions: ['left', 'right'],
  fontSize: ['default-size', 'big-size'],
}

const props = withDefaults(
  defineProps<{
    text?: string
    title?: string
    disabled?: boolean
    icon?: Icon | null
    iconPosition?: 'left' | 'right'
    variant?: 'primary' | 'secondary' | 'tertiary' | 'primary2'
    size?: 'default' | 'small' | 'no-padding'
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    isFullWidth?: boolean
    fontSize?: 'default-size' | 'big-size'
  }>(),
  {
    text: '',
    title: '',
    disabled: false,
    icon: null,
    iconPosition: 'left',
    variant: 'primary',
    size: 'default',
    loading: false,
    type: 'button',
    isFullWidth: false,
    fontSize: 'default-size'
  },
)

const buttonTypeClass = computed<string>(() => {
  return $app.filters.setAtomClassByProp(props.variant, buttonVariants.types, 'a-button')
})

const buttonSizeClass = computed<string>(() => {
  return $app.filters.setAtomClassByProp(props.size, buttonVariants.sizes, 'a-button')
})

const buttonIconPositionClass = computed<string>(() => {
  return $app.filters.setAtomClassByProp(props.iconPosition, buttonVariants.iconPositions, 'a-button')
})

const buttonFontSizeClass = computed<string>(() => {
  return $app.filters.setAtomClassByProp(props.fontSize, buttonVariants.fontSize, 'a-button')
})

const buttonClasses = computed<Record<string, boolean>>(() => ({
  'a-button': true,
  'a-button--only-icon': !props.text,
  'a-button--disabled': props.disabled,
  'a-button--full-width': props.isFullWidth,
}))
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<style lang="scss" src="./a-button.scss"/>
