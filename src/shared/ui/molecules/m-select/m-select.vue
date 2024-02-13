<template>
  <div ref="containerSelectRef" class="m-select" :class="[selectClasses, $attrs.class]">
    <label class="m-select__label-container">
      <!--      <span v-if="$attrs.label && !customInput" class="m-select__label font-caption-s">{{ $attrs.label }}</span>-->
      <div class="m-select__select-container">
        <a-icon v-if="selectIcon" :name="selectIcon" />
        <a-input
          :left-icon="leftInputIcon"
          v-model="select.selectedLabels"
          readonly
          :type="customInput ? 'checkbox' : 'text'"
          :placeholder="placeholder"
          :icon="Icon.MonoChevronBottom"
          position-icon="right"
          :open="select.opened"
          :label="$attrs.label"
          :hidden-button="true"
          :error-text="errorText"
          :custom="true"
          data-test-id="a-input"
          imgTrue
          @click="toggleOpenOptions()"
          @focus-input="onFocus"
          @key-down="onKeydown"
          @blur="$emit('blur')"
        />
        <select
          :value="modelVal"
          :autofocus="autofocus"
          tabindex="-1"
          v-bind="$attrs"
          class="m-select__select"
          :multiple="multiple"
          @change="changeOption(null, $event.target.value)"
          @focus="$emit('focus')"
          @blur="$emit('blur')"
        >
          <option
            v-for="(option, idx) in clonedOptions"
            :key="idx"
            :value="option.value"
            :checked="option.checked"
            :disabled="option.disabled"
            tabindex="-1"
          >
            {{ option.label }}
          </option>
        </select>
        <Transition name="m-select__fade">
          <div v-if="clonedOptions" v-show="select.opened" class="m-select__dropdown">
            <div :style="styleOptions" class="m-select__options-list font-control-m">
              <div v-if="head" class="m-select__head">
                <div class="m-select__head__close" @click="closeOption">
                  <a-icon :name="Icon.MonoChevronLeft" :width="24" :height="24" />
                </div>
                <div class="m-select__head__title">
                  {{ $attrs.label }}
                </div>
              </div>
              <div
                :class="['m-select__options-list__container', { 'm-select__options-list--rows': !!rows }]"
                data-qa-selector="burger_menu"
              >
                <template v-if="type === 'radio'">
                  <div
                    v-for="(option, idx) in clonedOptions"
                    ref="optionRef"
                    :key="idx"
                    tabindex="0"
                    class="m-select__option m-select__option__radio"
                    :class="{
                      'm-select__option--disabled': option.disabled,
                      'm-select__option--selected': option.checked,
                    }"
                    @click.prevent="changeOption(option)"
                    @focusin="onFocusInOption(idx)"
                    @focusout="onFocusOutOption(idx)"
                    @mouseleave="onFocusOutOption(idx)"
                    @keydown="changeOptionWithKey(option, idx, $event)"
                  >
                    <a-radio
                      :id="option.value"
                      tabindex="-1"
                      :model-value="modelVal"
                      :value="option.value"
                      :label="option.label"
                      :focused="option.focused"
                    />
                  </div>
                </template>
                <template v-else-if="type === 'checkbox'">
                  <div
                    v-for="(option, idx) in clonedOptions"
                    ref="optionRef"
                    :key="idx"
                    tabindex="0"
                    class="m-select__option m-select__option__radio"
                    :class="{
                      'm-select__option--disabled': option.disabled,
                      'm-select__option--selected': option.checked,
                    }"
                    @click.prevent="changeOption(option)"
                    @keydown="changeOptionWithKey(option, idx, $event)"
                    @focusin="onFocusInOption(idx)"
                    @focusout="onFocusOutOption(idx)"
                    @mouseleave="onFocusOutOption(idx)"
                  >
                    <a-checkbox
                      :id="option.value"
                      v-model="modelVal"
                      :value="option.value"
                      :label="option.label"
                      :focused="option.focused"
                    />
                  </div>
                </template>
                <template v-else-if="type === 'custom'">
                  <div
                    v-for="(option, idx) in clonedOptions"
                    ref="optionRef"
                    :key="idx"
                    tabindex="0"
                    class="m-select__option m-select__option__radio"
                    :class="{
                      'm-select__option--disabled': option.disabled,
                      'm-select__option--selected': option.checked,
                    }"
                    @click.prevent="changeOption(option)"
                    @keydown="changeOptionWithKey(option, idx, $event)"
                    @focusin="onFocusInOption(idx)"
                    @focusout="onFocusOutOption(idx)"
                    @mouseleave="onFocusOutOption(idx)"
                  >
                    <template v-if="option.type === 'radio'">
                      <a-radio
                        :id="option.value"
                        :model-value="modelVal[0]"
                        :value="option.value"
                        :label="option.label"
                        :focused="option.focused"
                      />
                    </template>
                    <template v-if="option.type === 'checkbox'">
                      <a-checkbox
                        :id="option.value"
                        v-model="modelVal"
                        :value="option.value"
                        :label="option.label"
                        :focused="option.focused"
                      />
                    </template>
                  </div>
                </template>
                <template v-else>
                  <div
                    v-for="(option, idx) in clonedOptions"
                    ref="optionRef"
                    :key="idx"
                    tabindex="0"
                    class="m-select__option"
                    :class="{
                      'm-select__option--disabled': option.disabled,
                      'm-select__option--checked': option.checked,
                    }"
                    @click.prevent="changeOption(option)"
                    @keydown="changeOptionWithKey(option, idx, $event)"
                    @focusin="onFocusInOption(idx)"
                    @focusout="onFocusOutOption(idx)"
                    @mouseleave="onFocusOutOption(idx)"
                  >
                    <a-icon
                      v-if="option.icon"
                      class="m-select__option-left-icon"
                      width="24"
                      height="24"
                      imgTrue
                      :name="option.icon"
                    />
                    <span>{{ option.label }}</span>
                    <a-icon
                      v-if="option.checked"
                      class="m-select__option-icon"
                      width="18"
                      height="18"
                      :name="Icon.MonoActionCheckMark"
                    />
                  </div>
                </template>
              </div>

              <div v-if="acceptButton" class="m-select__dropdown__access">
                <a-button class="m-select__dropdown__access__button" text="Apply" @click="acceptOptions" />
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </label>
    <template v-if="isStartValidation">
      <p v-show="!isValidSelect" class="m-select__error-text font-caption-l">
        {{ errorText }}
      </p>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useNuxtApp } from '#app'
import { FormSelectValue } from '~/src/shared/types'
import { AdditionalSelectOption } from '~/src/shared/types/catalog'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import ARadio from '~/src/shared/ui/atoms/a-radio/a-radio.vue'
import ACheckbox from '~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'

interface Option {
  label: string
  value: string | number
  type?: string
  checked?: boolean
  focused?: boolean
  disabled?: boolean
}

const { $app } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    modelValue?: Array<string> | string
    type?: string
    toggle?: boolean
    options?: Array<AdditionalSelectOption>
    placeholder?: string
    multiple?: boolean
    autofocus?: boolean
    icon?: Icon | null
    inputIconPosition?: 'left' | 'right'
    selectIcon?: Icon | null
    required?: boolean
    singleErrorText?: string
    disabled?: boolean
    customInput?: boolean
    rows?: number | null
    acceptButton?: boolean
    head?: boolean
    leftInputIcon?: Icon | undefined
    errorText?: string
    leftImageInOption?:any
  }>(),
  {
    modelValue: () => [],
    type: '',
    toggle: false,
    options: () => [],
    placeholder: '',
    icon: null,
    selectIcon: null,
    inputIconPosition: undefined,
    singleErrorText: '',
    customInput: false,
    rows: null,
    acceptButton: false,
    leftInputIcon: undefined,
    errorText: '',
  },
)

const emit = defineEmits(['update:modelValue', 'update:isValid', 'update:need-update', 'open-option', 'focus', 'blur'])

const isNotEmptySelectValue = computed(() => props.modelValue?.length > 0)

const styleOptions = computed(() => `--rows-amount: ${props.rows};`)

/** VALIDATION START */
const validation = reactive({
  isStart: false,
  errorText: '',
  singleErrorText: props.singleErrorText,
})

const errorText = computed(() => {
  return validation.singleErrorText ? validation.singleErrorText : props.errorText
})

const startValidate = () => (validation.isStart = true)

const isStartValidation = computed(() => {
  return props.required ? validation.isStart : false
})

const isValidSelect = computed(() => {
  if (!props.required && !isStartValidation.value) return
  const isValid = isNotEmptySelectValue.value === true
  emit('update:isValid', isValid)
  return isValid
})

/** VALIDATION END */
const clonedOptions = ref<Array<AdditionalSelectOption>>([])
watch(
  () => props.options,
  (val) => {
    if (val) {
      clonedOptions.value = $app.filters.cloneDeep(toRaw(val))
    }
  },
  { immediate: true, deep: true },
)

const modelVal = ref($app.filters.cloneDeep(props.modelValue))

const select = reactive<{
  selected: Array<AdditionalSelectOption>
  selectedLabels: string | number
  opened: boolean
}>({
  selected: [],
  selectedLabels: '',
  opened: false,
})

const rawSelected = reactive<{
  selected: Array<AdditionalSelectOption>
  selectedLabels: string | number
  opened: boolean
}>({
  selected: [],
  selectedLabels: '',
  opened: false,
})

onMounted(() => {
  if (props.required) {
    emit('update:isValid', !!isNotEmptySelectValue.value)
  }

  if (modelVal.value.length && clonedOptions.value) {
    if (typeof modelVal.value === 'string') {
      changeOption(null, modelVal.value)
    } else {
      modelVal.value.forEach((optionValue) => changeOption(null, optionValue))
    }
  }
  Object.assign(rawSelected, $app.filters.cloneDeep(select))
})

function changeOption(option: AdditionalSelectOption | null, onlyOptionValue: FormSelectValue | null) {
  if (option?.disabled) return
  const indexOption = clonedOptions.value.findIndex((item) =>
    onlyOptionValue ? item.value === onlyOptionValue : item.value === option?.value,
  )
  if (indexOption === -1) return
  if (props.type === 'custom' && option?.type) {
    changeOptionCustom(indexOption, option.type)
  } else if (props.multiple) {
    changeOptionMultiple(indexOption)
  } else {
    changeOptionSingle(indexOption)
  }
}

function changeOptionMultiple(indexOption: number) {
  clonedOptions.value[indexOption].checked = !clonedOptions.value[indexOption].checked
  if (clonedOptions.value[indexOption].checked) {
    addCheckedOptionValue(clonedOptions.value[indexOption])
  } else {
    const removeValueIndex = select.selected.findIndex((item) => item.value === clonedOptions.value[indexOption].value)
    if (removeValueIndex !== -1) {
      removeCheckedOptionValue(removeValueIndex)
    }
  }
}

function changeOptionSingle(indexOption: number) {
  if (!props.acceptButton) toggleOpenOptions(false)
  clonedOptions.value.forEach((item) => (item.checked = false))
  clonedOptions.value[indexOption].checked = true
  select.selectedLabels = clonedOptions.value[indexOption].label || ''
  modelVal.value = clonedOptions.value[indexOption].value
  if (!props.acceptButton) updateValue(clonedOptions.value[indexOption].value)
  if (!validation.isStart) {
    startValidate()
  }
}

const changeOptionCustom = (indexOption: number, type: string) => {
  if (type === 'radio') {
    select.selected = []
    clonedOptions.value.forEach((option) => (option.checked = false))
  } else {
    clonedOptions.value.forEach((option) => (option.checked = option.type === 'radio' ? false : option.checked))
    select.selected = select.selected.filter((item) => item.type !== 'radio')
  }
  changeOptionMultiple(indexOption)
  if (!select.selected.length) {
    changeOption(clonedOptions.value[0], null)
  }
}

const addCheckedOptionValue = (option: AdditionalSelectOption) => select.selected.push(option)
const removeCheckedOptionValue = (index: number) => select.selected.splice(index, 1)

watch(
  () => select.selected,
  (options) => {
    selectedMultiOptions(options)
  },
  { deep: true },
)

watch(
  () => props.modelValue,
  () => {
    if (props.type) {
      doUpdateValues()
    }
  },
  {
    deep: true,
  },
)

function selectedMultiOptions(options: Array<AdditionalSelectOption>) {
  const selectedValues = options.map((option) => option.value)
  let selectedLabels = []
  if (props.type === 'custom') {
    selectedLabels = options.filter((e) => e.value !== props.options[0]?.value).map((option) => option.label)
  } else {
    selectedLabels = options.map((option) => option.label)
  }
  if (selectedValues && selectedLabels) {
    select.selectedLabels = selectedLabels.join(', ')
    modelVal.value = selectedValues
    if (!props.acceptButton) {
      updateValue(selectedValues)
    }
    if (!validation.isStart) {
      startValidate()
    }
  }
}

const updateValue = (value: FormSelectValue) => emit('update:modelValue', value)

const toggleOpenOptions = (open: boolean) => {
  open || open === false ? (select.opened = open) : (select.opened = !select.opened)
  emit('open-option', select.opened)
}

const closeOnLeave = () => {
  if (props.toggle) return
  toggleOpenOptions(false)
}

const selectClasses = computed(() => {
  return {
    'm-select--error': isStartValidation.value && !isValidSelect.value,
    'm-select--multiple': props.multiple,
    'm-select--opened': select.opened,
    'm-select--disabled': props.disabled,
  }
})

const acceptOptions = () => {
  updateValue(modelVal.value)
  rawSelected.selected = select.selected
  rawSelected.selectedLabels = select.selectedLabels
  toggleOpenOptions(false)
}

const doUpdateValues = () => {
  if ($app.filters.isEqual(modelVal.value, props.modelValue)) return
  if (props.multiple) {
    modelVal.value = toRaw(props.modelValue)
    select.selected = []
    select.selectedLabels = ''
    modelVal.value.forEach((optionValue) => changeOption(null, optionValue))
    rawSelected.selected = select.selected
    rawSelected.selectedLabels = select.selectedLabels
    clonedOptions.value.forEach((option) => (option.checked = !!props.modelValue.find((elem) => elem === option.value)))
  } else {
    changeOption(null, props.modelValue)
  }
}

const closeOption = () => {
  if (props.multiple) {
    selectedMultiOptions(rawSelected.selected)
    select.selected = rawSelected.selected
    select.selectedLabels = rawSelected.selectedLabels
    clonedOptions.value.forEach((option) => (option.checked = !!props.modelValue.find((elem) => elem === option.value)))
  } else {
    changeOption(null, props.modelValue)
  }
  toggleOpenOptions(false)
}

const optionRef = ref<HTMLDivElement | null>(null)
const containerSelectRef = ref<HTMLDivElement | null>(null)
const isFocused = ref<boolean>(false)

const onFocus = (focused: boolean) => {
  isFocused.value = focused
}

const iconChevron = computed(() => {
  return select.opened ? Icon.MonoChevronTop : Icon.MonoChevronBottom
})

onClickOutside(containerSelectRef, () => {
  select.opened = false
})

const onKeydown = (event: Event) => {
  if (['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
  }
  switch (event.key) {
    case ' ':
    case 'Spacebar':
    case 'Enter':
    case 'ArrowDown':
      select.opened = true
      queueMicrotask(() => optionRef.value[0].focus())

      break
    case 'Escape':
      select.opened = false
      break
  }
}

function changeOptionWithKey(option: Option, key: number, e: Event) {
  if (['Enter', ' ', 'ArrowDown', 'ArrowUp', 'Home', 'End', 'Tab'].includes(e.key)) {
    e.preventDefault()
  }
  switch (e.key) {
    case ' ':
    case 'Spacebar':
    case 'Enter':
      changeOption(option, e.target.value)
      break
    case 'Tab':
    case 'ArrowDown':
      if (optionRef.value[key + 1]) {
        optionRef.value[key + 1].focus()
      }
      break
    case 'ArrowUp':
      if (optionRef.value[key - 1]) {
        optionRef.value[key - 1].focus()
      }
      break
    case 'ArrowRight':
      if (optionRef.value[key + props.rows]) {
        optionRef.value[key + props.rows].focus()
      }
      break
    case 'ArrowLeft':
      if (optionRef.value[key - props.rows]) {
        optionRef.value[key - props.rows].focus()
      }
      break
    case 'Escape':
      select.opened = false
      break
  }
}

const onFocusInOption = (index: number) => {
  clonedOptions.value[index].focused = true
}
const onFocusOutOption = (index: number) => {
  clonedOptions.value[index].focused = false
}
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<style lang="scss" src="./m-select.scss" />
