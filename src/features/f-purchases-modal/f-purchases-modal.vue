<template>
  <m-modal @close="close" class="f-purchases-modal" :max-height="MAX_HEIGHT" v-model="isOpenModal">
    <div v-if="purchase" class="f-purchases-modal__wrap">
      <m-deal class="f-purchases-modal__wrap-purchase" type="purchase" :deal="purchase" />
      <div class="w-purchases__modal__list">
        <div class="w-purchases__modal__item">
          <div class="w-purchases__modal__item-title">Basis in USD</div>
          <div class="w-purchases__modal__item-number">${{ $app.filters.rounded(purchase?.amount) }}</div>
        </div>
        <div class="w-purchases__modal__item">
          <div class="w-purchases__modal__item-title">Basis in {{ actualValue }}</div>
          <div
            class="w-purchases__modal__item-number"
            v-html="$app.filters.convertValue($app.filters.rounded(purchase?.amount_in_btc, 6))"
          ></div>
        </div>
        <div class="w-purchases__modal__item">
          <div class="w-purchases__modal__item-title">Current value</div>
          <div class="w-purchases__modal__item-number">
            ${{ $app.filters.rounded(purchase?.amount) }}
          </div>
        </div>
        <div class="w-purchases__modal__item">
          <div class="w-purchases__modal__item-title">Ownership</div>
          <div class="w-purchases__modal__item-number">{{ $app.filters.rounded(purchase?.ownership, 2) }}%</div>
        </div>
        <div class="w-purchases__modal__item">
          <div class="w-purchases__modal__item-title">Ends:</div>
          <div class="w-purchases__modal__item-number">
            {{ $app.filters.dayjs(purchase?.created_at).add(3, 'year').add(1,'day').format('DD MMM YY') }}
          </div>
        </div>
        <div class="w-purchases__modal__item">
          <div class="w-purchases__modal__item-title">Status:</div>
          <div class="w-purchases__modal__item-number">{{ purchase?.status }}</div>
        </div>
      </div>
      <a :href="`${explorerHostname}/account/${purchase?.account?.blockchain_wallet_address}`" target="_blank">
        <a-button
          v-if="purchase?.account?.blockchain_wallet_address"
          :icon="Icon.MonoLink"
          class="f-purchases-modal__view f-purchases-modal__btn"
          text="View on Blockchain"
        />
      </a>
      <a :href="`${explorerHostname}/transaction/${purchase?.transaction_hash}`" target="_blank">
        <a-button
          v-if="purchase?.transaction_hash"
          :icon="Icon.MonoLink"
          class="f-purchases-modal__issuing f-purchases-modal__btn"
          text="Issuing Transaction"
          variant="secondary"
        />
      </a>
      <a-button
        class="f-purchases-modal__cancel f-purchases-modal__btn"
        text="Cancel"
        variant="tertiary"
        @click="close"
      />
    </div>
  </m-modal>
</template>

<script setup lang="ts">
import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import { computed } from 'vue'
import MDeal from '~/src/shared/ui/molecules/m-deal/m-deal.vue'
import { Icon } from '~/src/shared/constants/icons'
import { useNuxtApp } from '#app'
const config = useRuntimeConfig()
const explorerURL = config.public.EXPLORER_API
const explorerHostname = `https://${explorerURL}`
const MAX_HEIGHT = 520

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    purchase: object | undefined
  }>(),
  {
    modelValue: false,
    purchase: undefined,
  },
)
const { $app } = useNuxtApp()

const emit = defineEmits(['update:modelValue', 'close', 'view', 'issuing'])

const isOpenModal = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const actualValue = computed(() => {
  const value = localStorage.getItem('display-currency') || 'btc'
  if (value === 'btc') {
    return 'BTC'
  } else {
    return 'SATOSHI'
  }
})

const close = () => {
  isOpenModal.value = false
  emit('close')
}
</script>

<style src="./f-purchases-modal.scss" lang="scss" />
