<template>
  <m-modal @close="close" full-screen v-model="isOpenModal">
    <div class="e-apply-credit-card-modal">
      <div class="e-apply-credit-card-modal__content">
        <div class="e-apply-credit-card-modal__title">Get early access to our credit card! 💳 💸</div>
        <div class="e-apply-credit-card-modal__text">
          Join the waiting list and get early access to our credit card once its launched!
        </div>
      </div>
      <div class="e-apply-credit-card-modal__pic">
        <img src="/img/card.png" alt="modal-pic" />
      </div>
      <div class="e-apply-credit-card-modal__controls">
        <a-button
          class="e-apply-credit-card-modal__button e-apply-credit-card-modal__button-accept"
          text="Sign up"
          variant="secondary"
          @click="accept"
        />
        <a-button
          class="e-apply-credit-card-modal__button e-apply-credit-card-modal__button-cancel"
          text="Go back"
          variant="tertiary"
          @click="close"
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
  emit('accept')
  isOpenModal.value = false
}
const close = () => {
  emit('close')
  isOpenModal.value = false
}
</script>

<style src="./e-apply-credit-card-modal.scss" lang="scss" />
