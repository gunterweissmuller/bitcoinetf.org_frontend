<template>
  <m-modal @close="close" class="e-apply-credit-success-modal" :max-height="MAX_HEIGHT" v-model="isOpenModal">
    <div class="e-apply-credit-success-modal__wrap">
      <img src="/img/mini-credit.png" alt="bonus" class="e-apply-credit-success-modal__wrap-pic" />
      <div class="e-apply-credit-success-modal__wrap-title">Thank you!</div>
      <div class="e-apply-credit-success-modal__wrap-text">
        There's {{ count - 1 }} ahead of you, we will notify you when the card is ready to be shipped. Thank you!
      </div>
      <a-button class="e-apply-credit-success-modal__wrap-btn" @click="close" text="Close" variant="primary" />
    </div>
  </m-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'

const MAX_HEIGHT = 400

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    count: number
  }>(),
  {
    modelValue: false,
    count: 0,
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

<style src="./e-apply-credit-success-modal.scss" lang="scss" />
