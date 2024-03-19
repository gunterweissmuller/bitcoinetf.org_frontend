<template>
  <div class="w-buy-shares-payment-short-tether w-buy-shares-payment-short-tether--landing">
    <div class="w-buy-shares-payment-short-tether__wrap">
      <div class="w-buy-shares-payment-short-tether__tron" v-if="!isFiat">
        <div class="w-buy-shares-payment-short-tether__tron-wrapper">
          
          <div class="w-buy-shares-payment-short-tether__accordion-qr">
            <qrcode-vue :value="$app.store.user.info?.account?.tron_wallet" level="L" render-as="svg" foreground="#000" background="#fff"/>
          </div>
          <div class="w-buy-shares-payment-short-tether__tron-subtitle">
            Your order will automatically close in:
          </div>
          <div class="w-buy-shares-payment-short-tether__tron-timer">
            <vue-countdown :transform="transformSlotProps" @end="onCountdownEnd" :time="30 * 60 * 1000" v-slot="{ days, hours, minutes, seconds }">
              {{ minutes }} : {{ seconds }}
            </vue-countdown>
          </div>
        </div>

        <div class="w-buy-shares-payment-short-tether__tron-discount">
          {{ $app.store.user.statistic?.trc_bonus?.percent }}% Discount Applied!
        </div>

        <a-input
          bgColor="tetherspecial"
          class="w-buy-shares-payment-short-tether__accordion-stable-method"
          label="Deposit method"
          model-value="Tether USDT (Tron, TRC-20)"
          :icon="Icon.ColorfulTron"
          position-icon="left"
          disabled
          @on-input-click="copy($app.store.user?.info?.account.tron_wallet)"
        />

        <div class="w-buy-shares-payment-short-tether__double-input">
          <div class="w-buy-shares-payment-short-tether__accordion-stable-address">
            <a-input
              bgColor="tetherspecial"
              label="Deposit address on Tron chain:"
              :model-value="$app.store.user?.info?.account.tron_wallet"
              disabled
              :icon="Icon.ColorfulCopy"
              position-icon="right"
              :text-icon="addressCopied"
              text-icon-text="Copied!"
              @on-input-click="copyToClipboard(true)"
            />
          </div>
          <div class="w-buy-shares-payment-short-tether__accordion-stable-amount">
            <a-input
              bgColor="tetherspecial"
              label="Amount"
              :model-value="`${$app.filters.rounded(calcValue)} USDT`"
              disabled
              :text-icon="amountCopied"
              text-icon-text="Copied!"
              :icon="Icon.ColorfulCopy"
              position-icon="right"
              @on-input-click="copyToClipboard(false)"
            />
          </div>
        </div>
        
        <div class="w-buy-shares-payment-short-tether__tron-info">
          Deposit your funds and stay on this screen. Your Bitcoin ETF shares will arrive shortly.
        </div>
        <!-- <a-button :text="tronButtonCheckPayment"  isFullWidth @click="startTronTimer" :disabled="timerStarted"/> -->
      </div>
      <template v-if="isFiat">
        <div class="w-buy-shares-payment-short-tether__legacy" v-if="!merchant001Link && country === 'RU' ">
          <div class="w-buy-shares-payment-short-tether__accordion-title">Due to international and Russian regulations, there's a <span>2.5% foreign exchange commission and 2.5% card fee.</span> <nuxt-link to="/tetherspecial">Use USDT</nuxt-link> instead, and get a
            {{ $app.store.user.statistic?.trc_bonus?.percent }}% bonus.
          </div>
          <a-icon class="a-button__loading a-button__loading-methods a-button__icon" :name="Icon.MonoNavigationLoader" v-if="AVAILABLE_VARIANTS.length < 1"/>

          <div :class="['w-buy-shares-payment-short-tether__variant-bank', `w-buy-shares-payment-short-tether__variant-bank--${country}`]" v-else>
            <div
              v-for="item in AVAILABLE_VARIANTS"
              :class="[
              'w-buy-shares-payment-short-tether__variant-bank__item',
              { 'w-buy-shares-payment-short-tether__variant-bank__item--active': selectedLegacyMethod === item.value },
            ]"
              @click="selectVariantBank(item.value)"
            >
              <a-icon class="w-buy-shares-payment-short-tether__variant-bank__item-icon" :name="item.icon" />
              <div class="w-buy-shares-payment-short-tether__variant-bank__item-text">{{ item.text }}</div>
            </div>
          </div>
          <div class="w-buy-shares-payment-short-tether__legacy-agreeBlock">
            <a-checkbox
              v-model="exchangeCommissionAgreed"
              id="exchange_Commission_Agreed"
              :label="`<p>I agree to a <span>2.5% foreign exchange commission and 2.5% bank card fee</span> as per international and Russian regulations. I also understand that by not using USDT, <span>I forgo the special ${$app.store.user.statistic?.trc_bonus?.percent}% bonus exclusive to USDT payments.</span></p>`"
              @label-click="exchangeCommissionAgreedClick"
              single
            />
            <a-checkbox
              v-model="p2pLimitAgreed"
              id="p2p_Limit_Agreed"
              label="<p>I understand the <span>$1,000 limit</span> per transaction for legacy payment methods and agree to the terms and conditions of the third-party P2P service processing the payment.</p>"
              @label-click="p2pLimitAgreedClick"
              single
            />
          </div>
          <a-button text="Continue" class="w-buy-shares-payment-short-tether__legacy-button" is-full-width @click="createTransation" :loading="createButtonLoading" :disabled="!createButtonAccess"/>
        </div>
        <div class="w-buy-shares-payment-short-tether__merchant" v-if="merchant001Link">
          <img src="/img/waitmerchant.png" alt="">
          <span>Please wait</span>
          <span>We will redirect you automatically to the payment gateway.</span>
          <nuxt-link :to="merchant001Link" target="_blank">
            <a-button text="Proceed to pay" is-full-width/>
          </nuxt-link>
        </div>
      </template>

    </div>
  </div>
  <e-buy-shares-success-modal :values="infoPayment" v-model="isOpenSuccessModal" />
</template>
<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { Icon } from '~/src/shared/constants/icons'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import { useNuxtApp, useRouter, useRoute } from '#app'
import { ref,onMounted, onUnmounted, watch } from 'vue'
import QrcodeVue from 'qrcode.vue'
import EBuySharesSuccessModal from "~/src/entities/e-buy-shares-success-modal/e-buy-shares-success-modal.vue";
import {Centrifuge} from "centrifuge";
import ACheckbox from "~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue";
import VueCountdown from '@chenfengyuan/vue-countdown';

const props = withDefaults(
  defineProps<{
    justTron: boolean
    calcValue: number
    isFiat: boolean
    calcValueOriginal: number
  }>(),
  {
    justTron: true,
    calcValue: 1000,
    isFiat: false,
    calcValueOriginal: 950,
  },
)
const router = useRouter()
const route = useRoute()
const { $app } = useNuxtApp()

const onCountdownEnd = () => {
  window.history.pushState({}, document.title, window.location.pathname);
  location.reload();
}

const addressCopied = ref(false)
const amountCopied = ref(false)
const BANK_VARIANTS = [
  {
    text: 'SBP',
    value: 'sbp',
    icon: Icon.ColorfulSbp,
  },
  {
    text: 'Sberbank',
    value: 'sberbank',
    icon: Icon.ColorfulSber,
  },
  {
    text: 'Tinkoff',
    value: 'tinkoff',
    icon: Icon.ColorfulTinkoff,
  },
  {
    text: 'Raiffeisen',
    value: 'raiffeisen',
    icon: Icon.ColorfulRaiffeisen,
  },
  {
    text: 'Alfabank',
    value: 'alfabank',
    icon: Icon.ColorfulAlpha,
  },
  {
    text: 'VTB',
    value: 'vtb',
    icon: Icon.ColorfulVtb,
  },
]
const AVAILABLE_VARIANTS = computed(()=>{
  return BANK_VARIANTS.filter((item) => {
    return allPaymentsTypesMerchant.value.find((i)=>{
      return item.value === i.method
    })
  })
})

const copiedValue = ref('')
const { copy } = useClipboard({ copiedValue })

const copyToClipboard = (address = false) => {
  if (address) {
    copy($app.store.user.info.account.tron_wallet)
    addressCopied.value = true
    setTimeout(() => {
      addressCopied.value = false
    }, 1000)
  } else {
    copy(props.calcValue)
    amountCopied.value = true
    setTimeout(() => {
      amountCopied.value = false
    }, 1000)
  }
}


const country = ref('RU')
const selectedLegacyMethod = ref('')
const animationFiat = ref(false)
const animationFiatText = ref(false)
const selectVariantBank = (variant) => {
  selectedLegacyMethod.value = variant
}
const isUserAuthenticated = computed(() => {
  return $app.store.auth.isUserAuthenticated
})
const transationByUUID = ref('')
const allPaymentsTypesMerchant = ref([])
const initPayment = async () =>{
  transationByUUID.value = await $app.api.eth.billingEth
    .getTransactionByUuid($app.store.user?.buyShares?.uuid || route.query.replenishment)
  merchant001Link.value = transationByUUID.value?.data?.redirect_uri
  const merchantMethods = await useAsyncData('getMerchantMethods', () => {
    return $app.api.eth.billingEth.getMerchantMethods(transationByUUID.value.data.uuid)
  })
  allPaymentsTypesMerchant.value = merchantMethods.data?.value?.data?.methods
}
onMounted(async () => {
  if (true && $app.store.user?.buyShares?.uuid) { //props.isFiat
    await initPayment()
  }
  if (true && !$app.store.user?.buyShares?.uuid && isUserAuthenticated) { //props.isFiat
    await $app.api.eth.billingEth
      .buyShares({
        amount: props.calcValueOriginal, // props.calcValueOriginal < 100 ? 100 : props.calcValueOriginal
        dividends: false,
        referral: false,
        bonus: false,
      })
      .then(({ data }) => {
        if (data) {
          router.replace({
            query: { replenishment: data.uuid }
          })
          $app.store.user.buyShares = data
        }
      })
  }

  if ($app.store.persiste.latestTronCheckDate) {
    initializeClock()
    // timerStarted.value = true
  }
  initializeTronClock()
  startTronTimer();
})

watch(
  () => route.query,
  async () => {
    if (true){ //props.isFiat
      await initPayment()
    }
  },
)

const remainingMinutes = ref(0)
const remainingSeconds = ref(0)

function getTimeRemaining() {
  if (!$app.store.persiste.latestTronCheckDate) {
    $app.store.persiste.latestTronCheckDate = $app.filters.dayjs()
  }
  const createdDate = $app.filters.dayjs($app.store.persiste.latestTronCheckDate)
  const b = createdDate.add(30, 'minute')
  const nowDate = $app.filters.dayjs()

  const total = b.diff(nowDate)
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);


  return {
    total,
    hours,
    minutes,
    seconds
  };
}

function initializeClock() {
  function updateClock() {
    const t = getTimeRemaining();

    remainingMinutes.value = ('0' + t.minutes).slice(-2);
    remainingSeconds.value = ('0' + t.seconds).slice(-2);
    tronButtonCheckPayment.value = `Checking payment status ${remainingMinutes.value}:${remainingSeconds.value}`

    if (t.total <= 0) {
      // router.push({name: 'personal-buy-shares'})
      if (timeinterval) {
        clearInterval(timeinterval);
        tronButtonCheckPayment.value = 'Check payment status'
        timerStarted.value = false
        $app.store.persiste.latestTronCheckDate = null
      }
    }
  }
  const timeinterval = setInterval(updateClock, 1000);
  updateClock();
}
const tronButtonCheckPayment = ref('I have paid')
const timerStarted = ref(false)
const startTronTimer = async () =>{
  if (!timerStarted.value) {
    await $app.api.eth.billingEth.startCheckingTronPayment({account_uuid:$app.store.user.info.account.uuid})
    initializeClock()
    timerStarted.value = true
  }

}
// ОПЛАТА И МЕРЧАНТ
const createButtonLoading = ref(false)
const exchangeCommissionAgreed = ref(false)
const p2pLimitAgreed = ref(false)
const exchangeCommissionAgreedClick = () =>{
  exchangeCommissionAgreed.value = !exchangeCommissionAgreed.value
}
const p2pLimitAgreedClick = () =>{
  p2pLimitAgreed.value = !p2pLimitAgreed.value
}
const createButtonAccess = computed(()=>{
  return exchangeCommissionAgreed.value && p2pLimitAgreed.value && selectedLegacyMethod.value && country.value === 'RU'
})
const merchant001Link = ref('')
const createTransation = async () => {
  createButtonLoading.value = true

  $app.api.eth.billingEth.createPayment({
    replenishment_uuid: transationByUUID.value.data.uuid,
    method: selectedLegacyMethod.value
  }).then((response) => {
    createButtonLoading.value = false
    merchant001Link.value = response.data.redirect_uri
    window.open(response.data.redirect_uri, '_blank');
  })
}

// ОБРАТНЫЙ ОТСЧЕТ TRON'A
function getTimeTron() {
  let createdDate = $app.filters.dayjs($app.store.user.statistic?.trc_bonus?.decrease)
  const nowDate = $app.filters.dayjs()
  let total = createdDate.diff(nowDate, 'minutes') - new Date().getTimezoneOffset()
  const minutes = Math.floor((total) % 60);
  const hours = Math.floor((total / 60) % 24);
  const days = Math.floor(total / (60 * 24));

  return {
    total,
    days,
    hours,
    minutes
  };
}
const tronTimerDays = ref(0)
const tronTimerHours = ref(0)
const tronTimerMinutes = ref(0)
function initializeTronClock() {
  let timeinterval = null
  function updateClockTron() {
    const t = getTimeTron();

    tronTimerDays.value = ('0' + t.days).slice(-2);
    tronTimerHours.value = ('0' + t.hours).slice(-2);
    tronTimerMinutes.value = ('0' + t.minutes).slice(-2);

    if (t.total <= 0) {
      if (timeinterval) {
        clearInterval(timeinterval);
      }
    }
  }

  updateClockTron();
  timeinterval = setInterval(updateClockTron, 30000);
}
const infoPayment = ref(null)
const isOpenSuccessModal = ref(false)

watch(infoPayment, (value) => {
  if (value) {
    isOpenSuccessModal.value = true
  }
})
const accountUuid = computed(() => {
  return $app.store.user.info?.account?.uuid
})
const centrifuge = ref(null)
const config = useRuntimeConfig()
const centrifugeURL = config.public.WS_URL
const centrifugeToken = config.public.WS_TOKEN

onMounted(async () => {

  centrifuge.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
  })

  centrifuge.value.connect()

  const sub = centrifuge.value.newSubscription(`replenishment.${accountUuid.value}`)

  sub
    .on('publication', async function (ctx) {
      if (ctx.data.message?.data?.status === 'success') {
        infoPayment.value = ctx.data.message?.data
      }
    })
    .subscribe()
})

onUnmounted(() => {
  centrifuge.value?.disconnect()
})

//countdown

const transformSlotProps = (props) => {
  const formattedProps = {};
  Object.entries(props).forEach(([key, value]) => {
    formattedProps[key] = value < 10 ? `0${value}` : String(value);
  });
  return formattedProps;
}

</script>
<style src="./w-buy-shares-payment-short-tether.scss" lang="scss" />
