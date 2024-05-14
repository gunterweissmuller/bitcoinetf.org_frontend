<template>
  <m-modal full-screen kyc v-model="isOpenModal" @close="closeModal">
    <div class="e-kyc-start-modal">
      <div class="e-kyc-start-modal__content">
        <div class="e-kyc-start-modal__title">Verify your identity!</div>
        <div class="e-kyc-start-modal__text">
          Your Safety is Our Priority - we need you to provide us with some personal information.
        </div>
        <div class="e-kyc-start-modal__text">
          This information will be used in order to verify payments and reclaim your account if you lost access.
        </div>
      </div>
      <div class="e-kyc-start-modal__pic">
        <img src="/img/modal-pic.png" alt="modal-pic" />
      </div>
      <div class="e-kyc-start-modal__controls">
        <a-button
          class="e-kyc-start-modal__button e-kyc-start-modal__button-accept"
          text="Let’s go!"
          variant="secondary"
          @click="onAccept"
        />
        <a-button
          class="e-kyc-start-modal__button e-kyc-start-modal__button-cancel"
          text="Go back"
          variant="tertiary"
          @click="onCancel"
        />
      </div>
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

const emit = defineEmits(['update:modelValue', 'close', 'accept', 'cancel'])

const isOpenModal = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const onAccept = () => {
  isOpenModal.value = false
  emit('accept')
}
const onCancel = () => {
  isOpenModal.value = false
  emit('cancel')
}

const closeModal = () => {
  emit('close')
}
</script>

<style src="./e-kyc-start-modal.scss" lang="scss" />
