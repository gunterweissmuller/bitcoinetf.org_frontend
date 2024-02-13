<template>
  <div v-if="type === 'radio'" class="m-accordion-radio">
    <div class="m-accordion-radio__top" @click="updateValue">
      <a-radio
        class="m-accordion-radio__top-radio"
        :label="title"
        v-model="radioValue"
        :value="value"
        :id="value"
        :name="radioGroup"
      />
      <a-icon
        class="m-accordion-radio__top-icon"
        :name="radioValue === value ? Icon.MonoChevronTop : Icon.MonoChevronBottom"
        width="24"
        height="24"
      />
    </div>
    <div v-if="radioValue === value" class="m-accordion-radio__content">
      <slot />
    </div>
  </div>
  <div v-else class="m-accordion" ref="accordionRef">
    <div
      :class="[
        'm-accordion__top',
        { 'm-accordion__top-link': topLink },
        { 'm-accordion__top-link--active': activeLink },
      ]"
      @click="toggleAccordion"
    >
      <a-icon class="m-accordion__pic" :name="icon" width="24" height="24" />
      <nuxt-link v-if="topLink" :to="{ name: topLink }" class="m-accordion__title">{{ title }}</nuxt-link>
      <h6 v-else class="m-accordion__title">{{ title }}</h6>
      <a-icon
        class="m-accordion__icon"
        :name="isOpen ? Icon.MonoChevronTop : Icon.MonoChevronBottom"
        width="24"
        height="24"
      />
    </div>

    <div v-if="isOpen" class="m-accordion__content">
      <slot name="default" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import ARadio from '~/src/shared/ui/atoms/a-radio/a-radio.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    value: string
    title?: string
    type?: 'radio' | 'default'
    activeLink?: boolean | undefined
    topLink?: string
    icon?: string
    radioGroup?: string
    scroll?: boolean
  }>(),
  {
    activeLink: undefined,
    topLink: '',
    icon: '',
    modelValue: '',
    value: '',
    type: 'default',
    radioGroup: '',
    title: '',
    scroll: false,
  },
)

const accordionRef = ref(null)
const isOpen = ref(false)

const emit = defineEmits(['update:modelValue'])

const radioValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const toggleAccordion = () => {
  isOpen.value = !isOpen.value
}

const openAccordion = () => {
  isOpen.value = true
}

defineExpose({ open: openAccordion, toggle: toggleAccordion })

const updateValue = () => {
  radioValue.value = props.value
}

watch(
  () => props.activeLink,
  (boolean) => {
    if (typeof props.activeLink === 'boolean') {
      isOpen.value = boolean
    }
  },
  {
    immediate: true,
  },
)

watch(isOpen, (boolean) => {
  if (!props.scroll) return
  if (boolean) {
    const yPosition = document.body.scrollHeight

    setTimeout(() => {
      window.scrollTo({ top: yPosition, behavior: 'smooth' })
    }, 0)
  }
})
</script>

<style src="./m-accordion.scss" lang="scss" />
