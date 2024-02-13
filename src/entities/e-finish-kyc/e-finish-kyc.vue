<template>
  <m-modal @close="accept" class="e-registration-bonus-modal" :max-height="MAX_HEIGHT" v-model="isOpenModal">
    <div class="e-registration-bonus-modal__wrap">
      <img src="/img/bonus.png" alt="bonus" class="e-registration-bonus-modal__wrap-pic" />
      <div class="e-registration-bonus-modal__wrap-title">$50 Welcome and referral bonus!</div>
      <div class="e-registration-bonus-modal__wrap-text">
        You just earned a $50 bonus for signing up! Your bonus can be accessed in your bonus wallet, and can be applied
        to your ETF purchases.
      </div>
      <a-button class="e-registration-bonus-modal__wrap-btn" @click="accept" text="Got it!"></a-button>
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
const close = () => {
  isOpenModal.value = false
  emit('close')
}
</script>

<style src="e-finish-kyc.scss" lang="scss"></style>
