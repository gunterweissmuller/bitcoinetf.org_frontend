<template>
  <div :class="[checkboxClasses, checkboxLabelPositionClass, $attrs.class]" :label-position="labelPosition">
    <div class="a-checkbox__container">
      <input
        :id="id"
        v-model="model"
        type="checkbox"
        :value="value"
        :name="$attrs.name"
        :disabled="disabled"
        :autofocus="autofocus"
        class="a-checkbox__input"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />
      <label v-if="$attrs.label" :for="id" class="a-checkbox__label font-body">
        <span class="a-checkbox__box"></span>
        <span @click.prevent.stop="$emit('label-click', !model)" class="a-checkbox__title" v-html="$attrs.label" />
      </label>
    </div>
    <template v-if="isStartValidation">
      <p v-show="!isValidCheckbox" class="a-checkbox__error-text font-caption-l">
        {{ errorText }}
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue'
import { useNuxtApp } from '#app'

interface Checkbox {
  checked: boolean
}

const { $app } = useNuxtApp()

const checkboxVariants = {
  labelPositions: ['right', 'left'],
}

const props = withDefaults(
  defineProps<{
    id?: string | number
    modelValue?: Array<any> | boolean | string
    value?: string | number
    single?: boolean
    autofocus?: boolean
    labelPosition?: 'right' | 'left'
    required?: boolean
    singleErrorText?: string
    disabled?: boolean
    focused?: boolean
  }>(),
  {
    id: '',
    modelValue: false,
    value: '',
    single: false,
    autofocus: false,
    labelPosition: 'right',
    required: false,
    singleErrorText: '',
    disabled: false,
    focused: false,
  },
)

const emit = defineEmits(['update:modelValue', 'update:isValid', 'blur', 'focus', 'label-click'])

const isNotEmptyCheckboxValue = computed(() => {
  if (typeof props.modelValue === 'boolean') {
    return props.modelValue
  }

  return !!props.modelValue.length
})

// VALIDATION START

const validation = reactive({
  isStart: false,
  errorText: 'Choose one of the options',
  singleErrorText: props.singleErrorText,
})

const errorText = computed(() => {
  return validation.singleErrorText ? validation.singleErrorText : validation.errorText
})

const startValidate = () => (validation.isStart = true)

const isStartValidation = computed(() => {
  return props.required ? validation.isStart : false
})

const isValidCheckbox = computed(() => {
  if (!props.required && !isStartValidation.value) return
  const isValid = isNotEmptyCheckboxValue.value === true
  emit('update:isValid', isValid)
  return isValid
})

// VALIDATION END
const checkbox = computed<Checkbox>(() => ({
  checked: props.modelValue
    ? typeof props.modelValue === 'boolean'
      ? props.modelValue
      : props.modelValue.includes(String(props.value))
    : false,
}))

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
    if (!validation.isStart) {
      startValidate()
    }
  },
})

onMounted(() => {
  if (props.required) {
    emit('update:isValid', !!isNotEmptyCheckboxValue.value)
  }
})

const checkboxLabelPositionClass = computed(() => {
  return $app.filters.setAtomClassByProp(props.labelPosition, checkboxVariants.labelPositions, 'a-checkbox')
})

const checkboxClasses = computed<Record<string, boolean | string>>(() => ({
  'a-checkbox': true,
  'a-checkbox--checked': checkbox.value.checked,
  'a-checkbox--disabled': props.disabled,
  'a-checkbox--error': isStartValidation.value && !isValidCheckbox.value,
  'a-checkbox--focused': props.focused,
}))
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<style lang="scss" src="./a-checkbox.scss" />
