<template>
  <m-modal @close="close" class="f-referrals-modal" :max-height="MAX_HEIGHT" v-model="isOpenModal">
    <div class="f-referrals-modal__wrap">
      <div class="f-referrals-modal__title">Withdraw Method</div>
      <div class="f-referrals-modal__subtitle">You will automatically withdraw your entire balance.</div>
      <m-select
        class="f-referrals-modal__methods"
        :left-input-icon="METHODS_OPTIONS?.[selectedMethod]?.icon"
        label="Withdrawal method"
        v-model="selectedMethod"
        :options="methods"
      />
      <nuxt-link to="/bitcoin-education" class="f-referrals-modal__method-text">Get started with USDT (Tron)</nuxt-link>
      <a-input
        v-if="selectedMethod"
        class="f-referrals-modal__address"
        :icon="Icon.MonoPaste"
        :text-icon="copiedLink"
        text-icon-text="Copied!"
        position-icon="right"
        iconWithAction
        @icon-click-handler="acceptCopy"
        v-model="selectedAddress"
        :label="inputLabel"
      />
      <a-button
        :disabled="!selectedAddress"
        class="f-referrals-modal__set f-referrals-modal__btn"
        text="Withdraw"
        @click="accept"
      />
      <a-button
        class="f-referrals-modal__cancel f-referrals-modal__btn"
        text="Cancel"
        variant="secondary"
        @click="close"
      />
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
import { useClipboard } from '@vueuse/core/index'

const MAX_HEIGHT = 555

const METHODS_OPTIONS = {
  usdant: {
    text: 'USDANT',
    icon: Icon.ColorfulUsdant,
  },
  tron: {
    text: 'Tron',
    icon: Icon.ColorfulTron,
  },
  polygon_usdt: {
    text: 'Tether USDT (Polygon)',
    icon: Icon.ColorfulUsdtPolygon,
  },
}

const methods = [
  {
    label: 'Tether USDT (Polygon)',
    value: 'polygon_usdt',
    icon: METHODS_OPTIONS.tron.icon,
  },
]

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

const { $app } = useNuxtApp()

const emit = defineEmits(['update:modelValue', 'close', 'accept'])

const selectedMethod = ref(methods[0]?.value)
const selectedAddress = ref(props.address)
const copiedLink = ref(false)

const inputLabel = computed(() => {
  return `${METHODS_OPTIONS?.[selectedMethod.value]?.text} destination address`
})

const isOpenModal = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

watch(selectedMethod, () => {
  selectedAddress.value = ''
})

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

const accept = async () => {
  isOpenModal.value = false
  await setMethod({ method: selectedMethod.value, address: selectedAddress.value })
  await withdrawalReferrals()
  emit('accept', { method: selectedMethod.value, address: selectedAddress.value })
}
const close = () => {
  isOpenModal.value = false
  emit('close')
}

const setMethod = async (value) => {
  await $app.api.info.billing
    .setWithdrawalMethod({
      address: value.address,
      method: value.method,
      walletType: 'referral',
    })
    .catch((e) => {
      console.error(e?.errors?.error?.message)
    })
}

const withdrawalReferrals = async () => {
  $app.api.eth.billingEth.withdrawalReferrals().catch((e) => {
    console.error(e.errors)
  })
}

const { copy } = useClipboard({ selectedAddress })

const acceptCopy = () => {
  copy(selectedAddress.value)
  copiedLink.value = true

  setTimeout(() => {
    copiedLink.value = false
  }, 1000)
}
</script>

<style src="./f-referrals-modal.scss" lang="scss" />
