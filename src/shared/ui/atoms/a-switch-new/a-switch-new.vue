<template>
  <div
    :class="[checkboxClasses, checkboxLabelPositionClass]"
    class="a-switch"
    :label-position="labelPosition"
    :data-qa-selector="disabled ? 'switcher_box-off' : 'switcher_box'"
  >
    <label class="a-switch__container">
      <input
        v-bind="$attrs"
        class="a-switch__input"
        type="checkbox"
        :name="$attrs.name"
        :checked="modelValue"
        :value="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.checked)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />
      <div class="a-switch__switch"><span class="a-switch__spinner"></span></div>
      <span v-if="$attrs.label" class="a-switch__label font-body">{{ $attrs.label }}</span>
    </label>
    <p v-show="errorText" class="a-switch__error-text font-caption-l">
      {{ errorText }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useNuxtApp } from '#app'
defineOptions({ inheritAttrs: false })

const { $app } = useNuxtApp()

const checkboxVariants = {
  labelPositions: ['right', 'left'],
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    loading?: boolean
    labelPosition?: 'right' | 'left'
    autofocus?: boolean
    errorText?: string
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    loading: false,
    labelPosition: 'right',
    errorText: '',
    disabled: false,
    autofocus: false,
  },
)


defineEmits(['update:modelValue', 'blur', 'focus'])

const checkboxLabelPositionClass = computed(() => {
  return $app.filters.setAtomClassByProp(props.labelPosition, checkboxVariants.labelPositions, 'a-switch')
})

const checkboxClasses = computed(() => {
  return {
    'a-switch--loading': props.loading,
    'a-switch--disabled': props.disabled,
  }
})
</script>

<style lang="scss" src="./a-switch-new.scss" />
