<template>
  <m-modal class="e-registration-bonus-modal" :max-height="MAX_HEIGHT" v-model="isOpenModal" @close="closeModal">
    <div class="e-registration-bonus-modal__wrap">
      <img src="/img/bonus.png" alt="bonus" class="e-registration-bonus-modal__wrap-pic" />
      <div class="e-registration-bonus-modal__wrap-title">{{ titleModal }}</div>
      <div class="e-registration-bonus-modal__wrap-text">
        You just earned a ${{ confirmData?.bonus?.bonus_amount ?? 0 }} bonus for signing up! Your bonus can be accessed
        in your bonus wallet, and can be applied to your ETF purchases.
      </div>
      <a-button class="e-registration-bonus-modal__wrap-btn" @click="acceptModal" text="Got it!"></a-button>
    </div>
  </m-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'

const MAX_HEIGHT = 500

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    confirmData: any
    onComplete?: any
  }>(),
  {
    confirmData: null,
    modelValue: false,
    onComplete: () => {}
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

const openModal = () => {
  isOpenModal.value = true
}

const titleModal = computed(() => {
  if (!props.confirmData) return ''

  const sum = props.confirmData?.bonus?.bonus_amount ?? 0
  const isInvite = props.confirmData?.bonus?.is_invite

  if (isInvite) {
    return `$${sum} Welcome and referral bonus!`
  } else {
    return `$${sum} Welcome bonus!`
  }
})

const closeModal = () => {
  isOpenModal.value = false
  emit('close')
}

const acceptModal = () => {
  isOpenModal.value = false

  if(props.onComplete) {
    props.onComplete();
  }

  emit('accept')
}
</script>

<style src="./e-registration-bonus-modal.scss" lang="scss"></style>
