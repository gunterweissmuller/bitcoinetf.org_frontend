<template>
  <m-modal @close="close" class="f-withdrawal-modal" :max-height="MAX_HEIGHT" v-model="isOpenModal">
    <div class="f-withdrawal-modal__wrap">
      <div class="f-withdrawal-modal__title">Withdraw Method</div>
      <div class="f-withdrawal-modal__subtitle">
        Choose how you want to withdraw. Please note that by setting up a withdrawal method you will lose your ability
        to reinvest earnings.
      </div>
      <m-select
        class="f-withdrawal-modal__methods"
        :left-input-icon="METHODS_OPTIONS?.[selectedMethod]?.icon"
        label="Withdrawal method"
        v-model="selectedMethod"
        :options="methods"
      />

      <nuxt-link
        v-if="selectedMethod === 'bitcoin_lightning'"
        to="/bitcoin-education"
        class="f-withdrawal-modal__method-text"
        >Learn about Lightning
      </nuxt-link>
      <nuxt-link v-else to="/bitcoin-education" class="f-withdrawal-modal__method-text"
        >Learn about self-custody
      </nuxt-link>
      <a-input
        v-if="selectedMethodType"
        class="f-withdrawal-modal__address"
        :icon="Icon.MonoPaste"
        :text-icon="copiedLink"
        text-icon-text="Copied!"
        position-icon="right"
        v-model="selectedAddress"
        :validation-reg-exp-key="selectedMethodRegexp"
        @update:is-valid="isEmailValid = $event"
        iconWithAction
        @icon-click-handler="acceptCopy"
        :label="inputLabel"
      />
      <div v-if="selectedMethodType" class="f-withdrawal-modal__address-text">
        {{ subInfo }}
      </div>
      <a-button
        :disabled="buttonDisabled"
        class="f-withdrawal-modal__set f-withdrawal-modal__btn"
        text="Set withdrawal method"
        @click="accept"
      />
      <a-button
        class="f-withdrawal-modal__cancel f-withdrawal-modal__btn"
        text="Cancel"
        variant="secondary"
        @click="close"
      />
      <span
        class="f-withdrawal-modal__remove"
        text="Remove withdrawal method"
        variant="tertiary"
        @click="removeWallet"
        v-if="address"
      >Remove withdrawal method</span>
    </div>
  </m-modal>
</template>

<script setup lang="ts">
import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue'
import { computed, ref } from 'vue'
import { Icon } from '~/src/shared/constants/icons'
import MSelect from '~/src/shared/ui/molecules/m-select/m-select.vue'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import { useClipboard } from '@vueuse/core'
import { validate } from 'bitcoin-address-validation';
import { useNuxtApp } from '#app'
const { $app } = useNuxtApp()




const MAX_HEIGHT = 555

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    method: string
    address: string
  }>(),
  {
    method: '',
    address: '',
    modelValue: false,
  },
)

const emit = defineEmits(['update:modelValue', 'close', 'accept'])

const selectedMethod = ref(props.method)
const selectedAddress = ref(props.address)
const copiedLink = ref(false)

const isEmailValid = ref(false)

const METHODS_OPTIONS = {
  bitcoin_on_chain: {
    text: 'Bitcoin',
    icon: Icon.ColorfulBitcoin,
  },
  bitcoin_lightning: {
    text: 'Lightning',
    icon: Icon.ColorfulBtcLightning,
  },
}

const inputLabel = computed(() => {
  return `${METHODS_OPTIONS?.[selectedMethod.value]?.text || ''} destination address`
})

const selectedMethodType = computed(() => {
  return selectedMethod.value === 'bitcoin_on_chain' || selectedMethod.value === 'bitcoin_lightning'
})

const selectedMethodRegexp = computed(() => {
  return selectedMethod.value === 'bitcoin_on_chain' ? '' : 'email'
})

const buttonDisabled = computed(() => {
  if (selectedMethod.value === 'bitcoin_on_chain') {
    return !validBlockChain.value
  } else if (selectedMethod.value === 'bitcoin_lightning') {
    return !isEmailValid.value
  }

  return true
})

const subInfo = computed(() => {
  return selectedMethod.value === 'bitcoin_lightning'
    ? 'Withdrawals will be made automatically daily'
    : ' Withdrawals will be made automatically once the cash balance reaches $250.'
})

const methods = [
  {
    label: 'Bitcoin on-chain',
    value: 'bitcoin_on_chain',
    icon: METHODS_OPTIONS.bitcoin_on_chain.icon,
  },
  {
    label: 'Bitcoin Lightning',
    value: 'bitcoin_lightning',
    icon: METHODS_OPTIONS.bitcoin_lightning.icon,
  },
]

const isOpenModal = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const { copy } = useClipboard({ selectedAddress })

const acceptCopy = () => {
  copy(selectedAddress.value)
  copiedLink.value = true

  setTimeout(() => {
    copiedLink.value = false
  }, 1000)
}

watch(
  () => props.method,
  (value) => {
    selectedMethod.value = value
  },
)

watch(
  () => props.address,
  (value) => {
    selectedAddress.value = value
  },
)
const validBlockChain = ref(false)
watch(()=> selectedAddress.value, (value) => {
  if (selectedMethod.value === 'bitcoin_on_chain') {
    validBlockChain.value = validate(value)
  }
  if (selectedAddress.value.includes('mailto:')) {
    selectedAddress.value = selectedAddress.value.replace('mailto:','')
  }
})

const accept = () => {
  isOpenModal.value = false
  emit('accept', { method: selectedMethod.value, address: selectedAddress.value })
}
const removeWallet = () =>{
  isOpenModal.value = false
  emit('accept', { method: 'none', address: 'none' })
}
const close = () => {
  isOpenModal.value = false
  emit('close')
}
onUnmounted(()=>{
  document.body.classList.remove('no-scroll')
})

</script>

<style src="./f-withdrawal-modal.scss" lang="scss" />
