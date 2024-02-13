<template>
  <div :class="[radioClasses, radioLabelPositionClass, $attrs.class]" :label-position="labelPosition">
    <div class="a-radio__container">
      <input
        :id="id"
        v-model="model"
        type="radio"
        :value="value"
        :name="$attrs.name"
        :disabled="disabled"
        :autofocus="autofocus"
        class="a-radio__input"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />
      <label :for="id" class="a-radio__label font-body">
        <span class="a-radio__box"></span>
        <span class="a-radio__label-span" v-html="$attrs.label"></span>
      </label>
    </div>
    <template v-if="isStartValidation">
      <p v-show="!isValidRadio" class="a-radio__error-text font-caption-l">
        {{ errorText }}
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, watch, onMounted } from 'vue'
import { useNuxtApp } from '#app'

const { $app } = useNuxtApp()

const radioVariants = {
  labelPositions: ['right', 'left'],
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | boolean | number
    value?: string | boolean | number
    id?: string
    autofocus?: boolean
    disabled?: boolean
    required?: boolean
    labelPosition?: 'right' | 'left'
    focused?: boolean
  }>(),
  {
    modelValue: false,
    value: '',
    id: Math.random().toFixed(10).slice(2),
    autofocus: false,
    disabled: false,
    required: false,
    labelPosition: 'right',
    focused: false,
  },
)

const radio = reactive({
  checked: false,
})

const validation = reactive({
  isStart: false,
  errorText: 'Choose one of the options',
})

const emit = defineEmits(['update:modelValue', 'update:isValid', 'blur', 'focus'])

const errorText = computed(() => {
  return validation.errorText
})

const isStartValidation = computed(() => {
  return props.required ? validation.isStart : false
})

const isNotEmptyRadioValue = computed(() => !!props.modelValue)

const isValidRadio = computed(() => {
  if (!props.required && !isStartValidation.value) return
  const isValid = isNotEmptyRadioValue.value === true
  emit('update:isValid', isValid)
  return isValid
})

const radioLabelPositionClass = computed(() => {
  return $app.filters.setAtomClassByProp(props.labelPosition, radioVariants.labelPositions, 'a-radio')
})

const radioClasses = computed<Record<string, boolean | string>>(() => {
  return {
    'a-radio': true,
    'a-radio--checked': radio.checked,
    'a-radio--disabled': props.disabled,
    'a-radio--error': isStartValidation.value && !isValidRadio.value,
    'a-radio--focused': props.focused,
  }
})

const startValidate = () => (validation.isStart = true)

const toggleValue = () => {
  radio.checked = !radio.checked
}

watch(
  () => props.modelValue,
  () => {
    radio.checked = props.modelValue === props.value
  },
)

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    toggleValue()
    emit('update:modelValue', value)
    if (!validation.isStart) {
      startValidate()
    }
  },
})

onMounted(() => {
  if (!!props.modelValue && props.modelValue === props.value) {
    toggleValue()
  }
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<style lang="scss" src="./a-radio.scss" />
