<template>
  <m-modal @close="close" class="e-buy-shares-success-modal" :max-height="MAX_HEIGHT" v-model="isOpenModal">
    <div class="e-buy-shares-success-modal__wrap">
      <div class="e-buy-shares-success-modal__wrap-pic">
        <div class="e-buy-shares-success-modal__info">
          <div v-if="$app.store.user?.info?.profile?.full_name" class="e-buy-shares-success-modal__info-name">
            {{ $app.store.user?.info?.profile?.full_name }}
          </div>
          <div class="e-buy-shares-success-modal__info-sum">{{ $app.filters.rounded(values?.amount, 2) }}</div>
          <div class="e-buy-shares-success-modal__info-text">Bitcoin ETF Shares</div>
          <div class="e-buy-shares-success-modal__info-date">
            Maturity:
            {{ $app.filters.dayjs(values?.updated_at)?.format('D MM YYYY') }}
          </div>
        </div>
      </div>
      <div class="e-buy-shares-success-modal__wrap-title">Congratulations on your investment!</div>
      <div class="e-buy-shares-success-modal__wrap-text">
        Your shares have been automatically issued as crypto tokens. From day one, your investment will start generating
        profits, paid out in Bitcoin every day.
      </div>
      <div class="e-buy-shares-success-modal__wrap-subtitle">Share your referral link</div>
      <div class="e-buy-shares-success-modal__links">
        <client-only>
          <a-social-sharing
            v-for="(link, idx) in LIST_LINKS"
            :key="idx"
            class="e-buy-shares-success-modal__link"
            :network="link.social"
            :url="referralLink"
            :title="locationOrigin"
            description="Don’t buy #Bitcoin. Earn it."
            hashtags="bitcoin"
          >
            <a-icon width="24" height="24" :name="link.icon" />
          </a-social-sharing>
        </client-only>

      </div>
      <a
        target="_blank"
        :href="`${explorerHostname}/account/${$app.store.user?.blockchainUserWallet}`"
        class="e-buy-shares-success-modal__wrap-btn e-buy-shares-success-modal__wrap-link"
        text="View on Blockchain Explorer"
        v-if="$app.store.user?.blockchainUserWallet"
      />
      <a-button class="e-buy-shares-success-modal__wrap-btn" @click="close" text="Close" variant="secondary" />
    </div>
  </m-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MModal from '~/src/shared/ui/molecules/m-modal/m-modal.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import { useNuxtApp, useRouter } from '#app'
import { useClipboard } from '@vueuse/core'
import ASocialSharing from '~/src/shared/ui/atoms/a-social-sharing/a-social-sharing.vue'
const config = useRuntimeConfig()
const explorerURL = config.public.EXPLORER_API
const explorerHostname = `https://${explorerURL}`

const router = useRouter()
const { $app } = useNuxtApp()
const MAX_HEIGHT = 739

const locationOrigin = ref('')
const referralLink = ref('')
const copiedLink = ref(false)

const { copy } = useClipboard({ referralLink })

const LIST_LINKS = [
  {
    icon: Icon.MonoTelegram,
    href: '/',
    social: 'telegram',
  },
  {
    icon: Icon.MonoX,
    href: '/',
    social: 'twitter',
  },
  {
    icon: Icon.MonoFacebook,
    href: '/',
    social: 'facebook',
  },
  {
    icon: Icon.MonoMail,
    href: '/',
    social: 'email',
  },
  {
    icon: Icon.MonoMessage,
    href: '/',
    social: 'messenger',
  },
]
const props = withDefaults(
  defineProps<{
    values: any
    modelValue: boolean
  }>(),
  {
    values: null,
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

const close = () => {
  isOpenModal.value = false
  $app.api.eth.billingEth
    .getLastPayment()
    .then((response: any) => {
      $app.store.user.lastPayment = response.data
      router.push('/personal/fund/portfolio')
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
  $app.api.eth.statisticEth
    .getGlobalStats()
    .then((resp) => {
      $app.store.user.statistic = resp?.data
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
  $app.api.info.event
    .getPurchases({
      per_page: 4,
      page: 1,
    })
    .then((dealsResponse) => {
      $app.store.user.lastPurchases = dealsResponse.data.data
    })
    .catch(() => {
      // Todo: notify something went wrond
    });

    $app.api.eth.auth.getUser().then((resp) => {
      $app.store.user.info = resp?.data
    }).catch(() => {
      // Todo: notify something went wrond
    });

  emit('close')
}

onMounted(() => {
  const code = $app.store.user.info?.referrals?.code

  if (code) {
    referralLink.value = window.location.origin + '/personal/registration' + `?referral=${code}`
  } else {
    referralLink.value = window.location.origin + '/personal/registration'
  }

  locationOrigin.value = window.location.origin
})
</script>

<style src="./e-buy-shares-success-modal.scss" lang="scss" />
