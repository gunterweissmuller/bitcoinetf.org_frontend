<template>
  <m-modal @close="close" class="e-apply-credit-success-modal" full-screen v-model="isOpenModal">
    <div class="e-apply-credit-success-modal__wrap">
      <div class="e-apply-credit-success-modal__wrap-title">Thank you!</div>
      <div class="e-apply-credit-success-modal__wrap-text">
        You're added to our credit card waiting list, your number in the queue is #{{ count - 1 }}
      </div>
      <div>
        <a-button class="e-apply-credit-success-modal__wrap-btn" @click="close" text="Got it!" variant="primary" is-full-width />
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
