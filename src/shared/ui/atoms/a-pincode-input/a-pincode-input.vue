<template>
  <div class="a-pincode-input" :class="[inputClasses, $attrs.class]">
    <div class="a-pincode-input__container">
      <div class="a-pincode-input__numbers">
        <div
          v-for="number in numberDigits"
          :key="number"
          :ref="setNumbersRef"
          class="a-pincode-input__numbers__item"
          @click="focus"
        >
          {{ modelValue[number - 1] }}
        </div>
      </div>
      <input
        :id="id"
        ref="pinCodeInputRef"
        :value="modelValue"
        :autofocus="autofocus"
        :autocomplete="autocomplete"
        :maxlength="numberDigits"
        :disabled="disabled"
        type="number"
        pattern="[0-9]*"
        class="a-pincode-input__input font-control-m"
        @input="onInput"
        @keydown="preventArrowMove"
        @keypress="passOnlyNumbers"
        @focus="setCellsClass(), emit('focus')"
        @blur="removeCurrentCellClass(), emit('blur')"
        @paste="onPaste"
        @wheel="$event.preventDefault()"
        data-qa-selector="code_input"
      />
    </div>
    <input :value="modelValue" :name="name" class="a-pincode-input__hidden-input" />
    <p v-show="isErrorStatus" class="a-pincode-input__error-text font-caption-s">
      {{ errorText }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, onBeforeUpdate, watch, nextTick } from 'vue'
import { useNuxtApp } from '#app'
import KEY_CODES from '~/src/shared/constants/keyCodes'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    numberDigits?: number
    autofocus?: boolean
    type?: string
    name?: string
    id?: string
    autocomplete?: boolean
    errorText?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    numberDigits: 6,
    autofocus: false,
    type: 'text',
    name: '',
    id: Math.random().toFixed(10).slice(2),
    autocomplete: false,
    errorText: '',
    disabled: false,
  },
)

const emit = defineEmits(['update:modelValue', 'update:completed', 'blur', 'focus'])

const pinCodeInputRef = ref()

const focusInput = () => pinCodeInputRef?.value?.focus()
defineExpose({
  focusInput,
})

onBeforeMount(() => {
  if (props.autofocus) {
    focus()
  }
})

const isFilledClass = 'a-pincode-input__numbers__item--is-filled'
const isCurrentClass = 'a-pincode-input__numbers__item--is-current'
const isCurrentLastCellClass = 'a-pincode-input__numbers__item--is-current-last-cell'

let numberRefs: Array<HTMLElement> = []
const setNumbersRef = (el: any) => {
  if (el) {
    numberRefs.push(el)
  }
}

onBeforeUpdate(() => {
  numberRefs = []
})

const focus = () => {
  setTimeout(() => {
    focusInput()
  })
}

const preventArrowMove = (e: any) => {
  const arrowsKeysCode = [37, 38, 39, 40]
  if (arrowsKeysCode.includes(e.keyCode)) {
    e.preventDefault()
  }
  return true
}

const passOnlyNumbers = (e: any) => {
  if (props.modelValue?.length >= props.numberDigits) {
    e.preventDefault()
    return
  }
  if (isNotKeyNumber(e.keyCode)) {
    e.preventDefault()
    return false
  }
  return true
}

const isNotKeyNumber = (keyCode: number) => {
  return !KEY_CODES.ONLY_NUMBERS.includes(keyCode)
}

const removeCurrentCellClass = () => {
  for (let i = 0; i < props.numberDigits; i++) {
    const ref = numberRefs[i]
    if (ref) {
      ref.classList.remove(isCurrentClass, isCurrentLastCellClass)
    }
  }
}

const setCellsClass = () => {
  removeCurrentCellClass()
  for (let i = 0; i < props.numberDigits; i++) {
    const ref = numberRefs[i]
    if (props.modelValue[i]) {
      ref.classList.add(isFilledClass)
    } else {
      ref.classList.remove(isFilledClass)
    }
  }
  let currentCellIndex
  let isLastCellFocused = false
  if (!props.numberDigits) {
    currentCellIndex = 0
  } else if (props.numberDigits === props.modelValue?.length) {
    currentCellIndex = props.modelValue?.length - 1
    isLastCellFocused = true
  } else {
    currentCellIndex = props.modelValue?.length
  }
  const currentCell = numberRefs[currentCellIndex]
  if (!currentCell) return
  currentCell.classList.add(isCurrentClass)
  if (isLastCellFocused) {
    currentCell.classList.add(isCurrentLastCellClass)
  }
}

const onPaste = (e: any) => {
  e.preventDefault()
  const newValue = e.clipboardData.getData('text').replace(/(?:\r\n|\r|\n)/g, ' ')
  const firstNonNumberCharIndex = newValue.search(/[^\d]/)
  let filteredValue = null
  if (firstNonNumberCharIndex >= 0) {
    filteredValue = newValue.slice(0, firstNonNumberCharIndex)
  } else {
    filteredValue = newValue
  }
  if (newValue.length === props.numberDigits) {
    emit('update:modelValue', filteredValue)
    return
  }
  const trimmedValue = filteredValue.trim().slice(0, props.numberDigits - props.modelValue?.length)
  emit('update:modelValue', trimmedValue)
}

const onInput = (e: any) => {
  if (pinCodeInputRef?.value?.length > props.numberDigits) {
    pinCodeInputRef.value = e.target.value.slice(0, props.numberDigits)
  } else {
    emit('update:modelValue', e.target.value)
  }
}

const completed = () => {
  nextTick(() => {
    emit('update:completed', {
      isCompleted: props.modelValue.length === props.numberDigits,
      value: props.modelValue,
    })
  })
}

watch(
  () => props.modelValue,
  (value) => {
    setCellsClass()
    completed()

    if (!value) focus()
  },
)

const isErrorStatus = computed<boolean>(() => !!props.errorText?.length)

const inputClasses = computed(() => {
  return {
    'a-pincode-input--error': isErrorStatus.value,
    'a-pincode-input--disabled': props.disabled,
  }
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<style lang="scss" src="./a-pincode-input.scss" />
