<template>
  <m-modal class="e-page-info-modal" :max-height="MAX_HEIGHT" kyc v-model="isOpenModal" @close="close">
    <div class="e-page-info-modal__wrap">
      <div class="e-page-info-modal__head">
        <div class="e-page-info-modal__head-title">{{ title }}</div>
        <a-icon
          class="e-page-info-modal__head-icon"
          width="24"
          height="24"
          :name="Icon.MonoActionClose"
          @click="close"
        />
      </div>
      <div class="e-page-info-modal__content">
        <slot />
      </div>
      <a-button class="e-page-info-modal__wrap-btn" @click="accept" text="Got it!"></a-button>
    </div>
  </m-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import { Icon } from '~/src/shared/constants/icons'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'

const MAX_HEIGHT = 780

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
  }>(),
  {
    modelValue: false,
    title: 'Information',
  },
)

const emit = defineEmits(['update:modelValue', 'close', 'accept'])

const isOpenModal = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const accept = () => {
  isOpenModal.value = false
  emit('accept')
}
const close = () => {
  isOpenModal.value = false
  emit('close')
}
</script>

<style src="./e-page-info-modal.scss" lang="scss" />
