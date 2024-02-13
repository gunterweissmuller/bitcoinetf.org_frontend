<template>
  <m-modal @close="accept" kyc full-screen v-model="isOpenModal">
    <div class="e-kyc-thanks-modal">
      <div class="e-kyc-thanks-modal__content">
        <div class="e-kyc-thanks-modal__title">Thank you!</div>
        <div class="e-kyc-thanks-modal__text">
          Thank you for verifying your identity. You can now complete your purchase!
        </div>
      </div>
      <div class="e-kyc-thanks-modal__pic">
        <img src="/img/modal-pic.png" alt="modal-pic" />
      </div>
      <a-button class="e-kyc-thanks-modal__button" text="Back to Wallet" variant="secondary" @click="accept" />
    </div>
  </m-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
  }>(),
  {
    modelValue: false,
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
</script>

<style src="./e-kyc-thanks-modal.scss" lang="scss" />
