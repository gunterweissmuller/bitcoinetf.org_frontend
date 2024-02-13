<template>
  <m-modal @close="accept" class="e-buy-shares-processing-modal" :max-height="MAX_HEIGHT" v-model="isOpenModal">
    <div class="e-buy-shares-processing-modal__wrap">
      <img src="/img/processing.png" class="e-buy-shares-processing-modal__wrap-pic" />
      <div class="e-buy-shares-processing-modal__wrap-title">We are processing your payment!</div>
      <div class="e-buy-shares-processing-modal__wrap-text">
        We will notify you as soon as the payment has gone through.
      </div>
      <a-button class="e-buy-shares-processing-modal__wrap-btn" @click="accept" text="Got it!"></a-button>
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

const emit = defineEmits(['update:modelValue', 'close-modal', 'accept'])

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

<style src="./e-buy-shares-processing-modal.scss" lang="scss" />
