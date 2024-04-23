<template>
  <div style="width: 100%" @click="onInputClick">
    <div class="a-input-with-button" :class="[inputClasses, $attrs.class]">
      <a-tooltip
        :text="validationErrors[0]"
        position="top,left"
        :enabled="errorInTooltip"
        :force-show-mode="errorInTooltip"
        :force-show="!validation.isValid"
      >
        <label :class="['a-input-with-button__label-container',{ 'a-input-with-button__label-container--tetherspecial': props?.bgColor == 'tetherspecial' }, { 'a-input-with-button__label-container--custom': custom }]">
          <div
            v-if="custom"
            :class="[
              'a-input-with-button__input-container',
              'a-input-with-button__input-container--custom',
              { 'a-input-with-button__input-container--focused': isFocused },
              { 'a-input-with-button__input-container--open': $attrs.open },
            ]"
          >
            <div
              v-bind="$attrs"
              ref="inputRef"
              :class="[
                'a-input-with-button__input',
                'a-input-with-button__input--custom',
                { 'a-input-with-button__input--focused': $attrs.open },
                { 'a-input-with-button__input-icon-left': leftIcon },
              ]"
            >
              <a-icon v-if="leftIcon" width="24" height="24" :class="[`a-input-with-button__left-icon`]" :name="leftIcon" :imgTrue="imgTrue"/>
              <div :class="['a-input-with-button__input-title', { 'a-input-with-button__input-title--small': isFocused || modelValue?.length }]">
                {{ label }}
              </div>
              <div class="a-input-with-button__input-text">{{ modelValue }}</div>
            </div>
            <a-icon
              v-if="icon"
              width="18"
              height="18"
              :class="[
                `a-input-with-button__icon`,
                `a-input-with-button__icon--${positionIcon}`,
                iconWithAction ? 'a-input-with-button__icon--clickable' : '',
              ]"
              :name="icon"
              @click="iconClickHandler()"
            />
          </div>
          <div v-else @click="focusOnInput" ref="inputContainerRef" :class="['a-input-with-button__input-container', { 'a-input-with-button__input-container--focused': isFocused }]">
            <div
              ref="inputRef"
              :class="['a-input-with-button__input', 'a-input-with-button__input--custom', { 'a-input-with-button__input--focused': isFocused }]"
            >
              <div
                tabindex="-1"
                :class="['a-input-with-button__input-title', { 'a-input-with-button__input-title--small': isFocused || modelValue?.length }]"
              >
                {{ label }}
              </div>
              <input
                :class="['a-input-with-button__input-text', { 'a-input-with-button__input-text--hidden': !isFocused && !modelValue?.length }]"
                ref="inputFormRef"
                :type="inputType"
                :value="modelValue"
                :disabled="props?.disabled ? true : false"
                @input="onInput"
                @focusin="onFocus(true)"
                @focusout="startValidate"
                @blur="$emit('blur')"
                @focus="$emit('focus')"
                @keydown="$emit('key-down', $event)"
              />



            </div>

            <button :disabled="!buttonClickEnable" @click="handleButtonClick" class="a-input-with-button__input-button">{{ buttonText }}</button>

            <template v-if="icon">
              <span
                v-if="textIcon && textIconText"
                :class="[
                  `a-input-with-button__icon`,
                  `a-input-with-button__icon--${positionIcon}`,
                  iconWithAction ? 'a-input-with-button__icon--clickable' : '',
                ]"
                >{{ textIconText }}</span
              >
              <a-icon
                v-else
                :class="[
                  `a-input-with-button__icon`,
                  `a-input-with-button__icon--${positionIcon}`,
                  iconWithAction ? 'a-input-with-button__icon--clickable' : '',
                ]"
                :name="icon"
                @click="iconClickHandler()"
              />

            </template>



            <!--          <div v-show="isNotEmptyInputValue && !hiddenButton" class="a-input-with-button__btn-clear" @click="buttonEvent">-->
            <!--            <a-icon :name="inputButtonIcon" :width="24" :height="24" />-->
            <!--          </div>-->
          </div>
        </label>
      </a-tooltip>
      <template v-if="isStartValidation && !validation.isValid && !errorText.length && !errorInTooltip">
        <template v-for="(errorMsg, index) in validationErrors" :key="index">
          <p
            v-show="errorMsg"
            :class="`a-input-with-button__error-text a-input-with-button__error-text--size-${props.errorSize}`"
            data-qa-selector="error"
          >
            {{ errorMsg }}
          </p>
        </template>
      </template>
      <p
        v-show="errorText.length"
        :class="`a-input-with-button__error-text a-input-with-button__error-text--size-${props.errorSize}`"
        v-html="errorText"
        data-qa-selector="error"
      ></p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, nextTick, watchEffect, onMounted, onBeforeMount, watch } from 'vue'
import { parsePhoneNumberFromString } from 'libphonenumber-js/mobile'
import { validatePhoneNumberLength } from 'libphonenumber-js'
import { ValidatePhoneNumberLengthResult } from 'libphonenumber-js/types'
import { useNuxtApp } from '#app'
import ATooltip from '~/src/shared/ui/atoms/a-tooltip/a-tooltip.vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { findCountryByParams } from '~/src/shared/constants/phoneCountryCodes'
import phoneNumberSettings from '~/src/shared/constants/phoneNumberSettings'
import { Icon } from '~/src/shared/constants/icons'

const { $app } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    modelValue?: string
    autofocus?: boolean
    type?: string
    icon?: Icon | null
    iconWithAction?: boolean
    positionIcon?: 'left' | 'right'
    hiddenButton?: boolean
    buttonIcon?: Icon | null
    validationRegExpKey?: string | null | symbol | any
    sanitizer?: ((input: string) => string) | null
    instantValidation?: boolean
    errorInTooltip?: boolean
    errorText?: string
    errorSize?: 'default' | 'small'
    disabled?: boolean
    custom?: boolean
    label?: string
    mask?: string | null
    leftIcon?: Icon | undefined
    isNativeInput?: boolean
    textIcon?: boolean
    textIconText?: string
    maxLength?: number | null
    imgTrue?:boolean
    buttonText: string
    buttonTextClicked?: string
    buttonClick?: any
    buttonClickEnable?: boolean
    bgColor: 'default' | 'tetherspecial'
  }>(),
  {
    modelValue: '',
    autofocus: false,
    type: 'text',
    icon: null,
    iconWithAction: false,
    positionIcon: 'left',
    hiddenButton: false,
    iconButton: '',
    buttonIcon: null,
    validationRegExpKey: null,
    sanitizer: null,
    instantValidation: false,
    errorInTooltip: false,
    errorText: '',
    errorSize: 'default',
    disabled: false,
    custom: false,
    mask: null,
    isNativeInput: true,
    leftIcon: undefined,
    textIcon: false,
    textIconText: '',
    maxLength: null,
    imgTrue:false,
    buttonTextClicked: '',
    buttonText: '',
    buttonClick: () => {},
    buttonClickEnable: true,
    bgColor: 'default'
  },
)

enum InputTypes {
  PHONE = 'tel',
  TEXT = 'text',
  PASSWORD = 'password',
}

const emit = defineEmits([
  'update:modelValue',
  'update:isValid',
  'button-event',
  'blur',
  'focus-input',
  'focus',
  'key-down',
  'icon-click-handler',
  'on-input-click',
])

const onInputClick = () => {
  emit('on-input-click')
}


const handleButtonClick = () => {
    props.buttonClick();

}

watch(
  () => props.modelValue,
  () => {
    let changedValue = props.modelValue
    if (props.sanitizer) {
      changedValue = props.sanitizer(changedValue)
    }
    if (props.mask) {
      changedValue = applyMask(props.mask, changedValue)
    }
    emit('update:modelValue', changedValue)
  },
)

const isNotEmptyInputValue = computed(() => {
  if (props.type === InputTypes.PHONE) {
    return props.modelValue?.length > 1
  }

  return props.modelValue?.length > 0
})

/** VALIDATION START */
const validation = reactive({
  isStart: false,
  isValid: false,
  info: {},
})
const startValidate = () => {
  if (props.modelValue?.length !== 0) {
    onFocus(false)
    validation.isStart = true
  } else {
    onFocus(false)
  }
}

const isStartValidation = computed(() => {
  if (!props.validationRegExpKey) return
  return validation.isStart
})

const validationInput = (value: any) => {
  const validateRegExpObject = {
    [props.validationRegExpKey]: value,
  }
  const customValidateParams = {
    ...(props?.type === InputTypes.PHONE ? { isValid: isValidPhoneNumber(value) } : {}),
  }
  validation.info = $app.filters.validateRegExp(validateRegExpObject, customValidateParams)
  return isValidInput(validation.info)
}

const validationErrors = computed(() => {
  return Object.values(validation.info?.inner?.[props.validationRegExpKey]?.errors ?? {})
})

const isValidInput = (valid: object) => {
  validation.isValid = valid && valid?.isValidAll
  emit('update:isValid', validation.isValid)
  return validation.isValid
}

const isValidPhoneNumber = (phoneNumber: string) => {
  const phoneInfo = parsePhoneNumberFromString(phoneNumber)
  if (phoneInfo) {
    if (phoneInfo.isValid() || phoneNumber.startsWith(phoneNumberSettings.TEST_PHONE_CODE)) {
      return true
    }
  }

  return false
}

if (props.validationRegExpKey || props.type === InputTypes.PHONE) {
  watchEffect(() => {
    validationInput(props.modelValue)
  })
}

watch(
  () => props.modelValue,
  (val) => {
    if (val.length === 0) {
      validation.isStart = false
    }
  },
)

/** VALIDATION END */
const password = reactive({
  show: false,
})

function showPassword(show: boolean) {
  return (password.show = show)
}

function applyMask(mask: string, value: string): string {
  const maskedValue = value.replace(/\s/g, '')

  let result = ''
  let valueIndex = 0

  for (let i = 0; i < mask.length; i++) {
    if (valueIndex >= maskedValue.length) {
      break
    }

    if (mask[i] === 'x') {
      result += maskedValue[valueIndex]
      valueIndex++
    } else {
      result += mask[i]
    }
  }

  return result
}

function buttonEvent() {
  if (props.type === InputTypes.PASSWORD) {
    return showPassword(!password.show)
  }
  if (props.type === InputTypes.PHONE) {
    return emit('update:modelValue', '+')
  }
  if (props.buttonIcon) {
    return emit('button-event')
  }
  startValidate()
  emit('update:modelValue', '')
  return focusInput()
}

const inputRef = ref<HTMLInputElement | null>(null)
const focusInput = () => inputRef?.value?.focus()
defineExpose({
  focusInput,
})

onBeforeMount(() => {
  if (props.autofocus) {
    nextTick(() => {
      focusInput()
    })
  }
})

const inputButtonIcon = computed<Icon>(() => {
  if (props.type === InputTypes.PASSWORD) {
    return password.show ? Icon.MonoEyeCrossed : Icon.MonoEye
  }

  if (props.buttonIcon) {
    return props.buttonIcon
  }

  return Icon.MonoActionClose
})

const inputType = computed(() => {
  if (props.type === InputTypes.PASSWORD) {
    return password.show ? InputTypes.TEXT : InputTypes.PASSWORD
  }
  return props.type
})

const onInput = async (event: InputEvent) => {
  if (!props.isNativeInput) return
  await emit('update:modelValue', (event.target as HTMLInputElement)?.value)

  if (props.type === InputTypes.PHONE) {
    if (!(event.target as HTMLInputElement)?.value.startsWith('+')) {
      await emit('update:modelValue', '+' + (event.target as HTMLInputElement)?.value)
    }

    const validatedPhoneNumberLength = validatePhoneNumberLength(props.modelValue)

    const isPhoneNumberValid: ValidatePhoneNumberLengthResult =
      validation.isValid && !props.modelValue.startsWith(phoneNumberSettings.TEST_PHONE_CODE)
    if (
      isPhoneNumberValid ||
      validatedPhoneNumberLength === 'TOO_LONG' ||
      validatedPhoneNumberLength === 'INVALID_LENGTH'
    ) {
      inputRef.value?.setAttribute('maxlength', String(props.modelValue?.length))
    } else {
      inputRef.value?.removeAttribute('maxlength')
    }

    updateCountryISO()
  }

  if (props.instantValidation && isNotEmptyInputValue.value && !validation.isStart && props.validationRegExpKey) {
    startValidate()
  }
}

const onPaste = (event: any) => {
  if (props.type === InputTypes.PHONE) {
    replacePhoneNumberOnPaste(event.clipboardData.getData('text'))
  }
}

const replacePhoneNumberOnPaste = (phoneNumberClipboard: string) => {
  let phoneNumber = phoneNumberClipboard.replace(/(?:\r\n|\r|\n)/g, ' ')

  setTimeout(() => {
    const trimmedPhoneNumber = phoneNumber.replace(/[^0-9+]/gi, '')

    if (phoneNumber.startsWith('+')) {
      phoneNumber = phoneNumber.slice(1)
    }

    phoneNumber = props.modelValue

    if (phoneNumber !== trimmedPhoneNumber) {
      emit('update:modelValue', props.modelValue.replace(phoneNumber, trimmedPhoneNumber))
      nextTick(() => {
        inputRef.value?.dispatchEvent(new Event('input'))
      })
    }
  })

  return true
}

const countryISO = ref(null)

const country = computed(() => {
  if (props.type !== InputTypes.PHONE) return
  return findCountryByParams({ iso: countryISO?.value })
})

onMounted(() => {
  if (props.type === InputTypes.PHONE && isNotEmptyInputValue.value) {
    updateCountryISO()
  }
})

watch(
  () => country.value,
  (country) => {
    if (country && props.type === InputTypes.PHONE) {
      let phoneNumber = props.modelValue

      if (phoneNumber.includes(`${country.code} `)) {
        phoneNumber = phoneNumber.replace(`${country.code} `, `${country.code} `)
      } else {
        phoneNumber = phoneNumber.replace(country.code, `${country.code} `)
      }

      emit('update:modelValue', phoneNumber)
    }
  },
)

const updateCountryISO = () => {
  const phoneInfo = parsePhoneNumberFromString(props.modelValue)
  let newCountryISO
  if (phoneInfo && phoneInfo.country) {
    newCountryISO = phoneInfo.country
  } else {
    const countryNew = findCountryByParams({ code: props.modelValue.trim(), priority: 0 })
    if (!country.value || country.value?.code !== $app.filters.get(countryNew, 'code', null)) {
      newCountryISO = $app.filters.get(countryNew, 'iso', null)
    }
  }
  if (!newCountryISO && country && props.modelValue.indexOf(country.value?.code) === 0) {
    return
  }
  if (countryISO.value !== newCountryISO) {
    countryISO.value = newCountryISO
  }
}

/** PHONE NUMBER END */

const inputClasses = computed<{
  [key: string]: boolean
}>(() => ({
  'a-input-with-button--icon': Boolean(props.icon),
  [`a-input-with-button--icon-${props.positionIcon}`]: Boolean(props.positionIcon && props.icon),
  'a-input-with-button--error': Boolean((isStartValidation.value && !validation.isValid) || props.errorText?.length),
  'a-input-with-button--disabled': props.disabled,
  'a-input-with-button--valid': validation.isValid,
}))

const isFocused = ref<boolean>(false)
const onFocus = (focused: boolean) => {
  isFocused.value = focused
  emit('focus-input', focused)
}
const iconClickHandler = () => {
  emit('icon-click-handler')
}
const inputFormRef = ref(null)
const inputContainerRef = ref(null)
const focusOnInput = () => {
  inputFormRef.value.focus()
}
//
// watch(
//   () => props.modelValue,
//   (value, oldValue) => {
//     if (props.maxLength) {
//
//
//       if (value.length > props.maxLength) {
//         emit('update:modelValue', oldValue)
//       }
//     }
//   },
// )
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<style lang="scss" src="./a-input-with-button.scss" />
