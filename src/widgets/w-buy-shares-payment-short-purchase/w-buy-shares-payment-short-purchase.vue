<template>

  <div class="w-buy-shares-payment-short-purchase__purchase--process flex flex-col">
    <div class="w-buy-shares-payment-short-purchase__accordion-qr mt-4">
      <qrcode-vue :value="computedAddr" level="L" render-as="svg" foreground="#000" background="#fff"/>
    </div>
    <!-- <div class="flex justify-center items-center self-center px-11 mt-4 w-full bg-white rounded-xl max-w-[261px]">
      <NuxtImg src="/img/qr-code-test.svg" alt="Payment QR Code" class="w-full aspect-[1.01]" loading="lazy" />
    </div> -->

    <a-input-img
      class="w-buy-shares-payment__accordion-stable-method w-buy-shares-payment-short-purchase__purchase--process-input rounded-lg mt-6"
      label="Deposit method"
      :model-value="computedText"
      :img="computedIcon"
      position-icon="left"
      disabled
      @on-input-click="copy($app.store.user?.info?.account.tron_wallet)"
    />
    <a-input
      class="flex justify-between mt-6 rounded-lg"
      :label="`Deposit address on ${payType} chain:`"
      :model-value="computedAddr"
      :disabled="true"
      :text-icon="addressCopied"
      text-icon-text="Copied!"
      :icon="$app.store.user.theme === 'dark' ? Icon.ColorfulCopyBlue : Icon.ColorfulCopy"
      position-icon="right"
      @on-input-click="() => copyToClipboardAddress()"
      isBoldInput
      isTextInputSmall
    />
    <a-input
      class="flex justify-between mt-6 rounded-lg"
      label="Amount"
      :model-value="$app.filters.rounded(Math.ceil(calcValue*100)/100,2) + ' USDT'"
      :disabled="true"
      :text-icon="amountCopied"
      text-icon-text="Copied!"
      :icon="$app.store.user.theme === 'dark' ? Icon.ColorfulCopyBlue : Icon.ColorfulCopy"
      position-icon="right"
      @on-input-click="() => copyToClipboardAmount()"
      isBoldInput
    /> <!-- $app.filters.roundedFixed(calcValue, 2)  -->

    <!-- <button :disabled="timerStarted" @click="startTronTimer" class="block	w-full justify-center items-center py-5 mt-4 text-base font-bold text-white whitespace-nowrap bg-blue-600 rounded-lg" tabindex="0">
      {{ tronButtonCheckPayment }}
    </button> -->
    <button @click="cancelOrder" class="w-buy-shares-payment-short-purchase__purchase--process-button-cancel block w-full justify-center items-center py-5 mt-4 whitespace-nowrap rounded-lg" tabindex="0">
      Cancel Order
    </button>
    <footer class="text-center py-6">

      <nuxt-link to="/personal/more/support" target="_blank" >
        <a-button text="Contact support" variant="tertiary" isFullWidth />
      </nuxt-link>


    </footer>
  </div>

</template>
<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { Icon } from '~/src/shared/constants/icons'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import AInputImg from '~/src/shared/ui/atoms/a-input-img/a-input-img.vue'
import { useNuxtApp, useRouter, useRoute } from '#app'
import { ref,onMounted, onUnmounted, watch } from 'vue'
import QrcodeVue from 'qrcode.vue'
import {Centrifuge} from "centrifuge";
import ACheckbox from "~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue";
import VueCountdown from '@chenfengyuan/vue-countdown';
import { PayTypes } from '~/src/shared/constants/payWith'
import { hostname } from '~/src/app/adapters/ethAdapter'

const props = withDefaults(
  defineProps<{
    justTron: boolean
    calcValue: number
    isFiat: boolean
    payType: PayTypes
    refCode: any
    switches: any
  }>(),
  {
    justTron: true,
    calcValue: 1000,
    isFiat: false,
    payType: PayTypes.Tron,
    refCode: '',
    switches: {}
  },
)
const router = useRouter()
const route = useRoute()
const { $app } = useNuxtApp()

const onCountdownEnd = () => {
  // window.history.pushState({}, document.title, window.location.pathname);
  // location.reload();
}

const computedAddr = computed(()=>{
  return props.payType == PayTypes.Tron ? $app.store.user.info?.account?.tron_wallet
        : props.payType == PayTypes.Ethereum ? $app.store.user.wallets.ethereum.address
        : props.payType == PayTypes.Polygon ? $app.store.user.wallets.polygon.address
        : $app.store.user.info?.account?.tron_wallet;
});

const computedText = computed(()=>{
  return props.payType == PayTypes.Tron ? "Tether USDT (Tron, TRC-20)"
  : props.payType == PayTypes.Ethereum ? "Tether USDT (Ethereum, ERC-20)"
  : props.payType == PayTypes.Polygon ? "Tether USDT (Polygon, MATIC)"
  : "Tether USDT (Tron, TRC-20)";
});

const computedIcon = computed(()=>{
  return props.payType == PayTypes.Tron ? '/img/icons/colorful/usdt-trc20.svg'
  : props.payType == PayTypes.Ethereum ? '/img/icons/colorful/usdt-erc20.svg'
  : props.payType == PayTypes.Polygon ? '/img/icons/colorful/usdt-matic.svg'
  : '/img/icons/colorful/usdt-trc20.svg';
});

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

    const response = await fetch(`https://${hostname}/v3/public/billing/shares/buy/init`, {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'Bearer ' + $app.store.auth.accessToken,
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        dividends: props.switches?.dividends ? true : false,
        referral: props.switches?.referral ? true : false,
        check_discount: props.switches?.discount ? true : false,
        bonus: false,
        amount: props.calcValue,
        order_type: $app.store.purchase.type === 'USDT' ? 'init_usdt' : 'init_btc'
      })
    });

    const res = await response.json();


    if (res) {
      router.replace({
        query: { replenishment: res.uuid }
      })
      $app.store.user.buyShares = res
    }

    // await $app.api.eth.billingEth
    //   .buyShares({
    //     amount: props.calcValue,
    //     dividends: false,
    //     referral: props.refCode && props.refCode !== '' ? true : false,
    //     bonus: false,
    //     refCode: props.refCode
    //   })
    //   .then(({ data }) => {
    //     if (data) {
    //       router.replace({
    //         query: { replenishment: data.uuid }
    //       })
    //       $app.store.user.buyShares = data
    //     }
    //   })
  }

  if ($app.store.persiste.latestTronCheckDate) {
    initializeClock();
    // timerStarted.value = true
  }
  initializeTronClock();

  // startTronTimer();
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

let timeintervalPaid = null;
function initializeClock() {
  function updateClock() {
    const t = getTimeRemaining();

    remainingMinutes.value = ('0' + t.minutes).slice(-2);
    remainingSeconds.value = ('0' + t.seconds).slice(-2);
    tronButtonCheckPayment.value = `Checking payment status ${remainingMinutes.value}:${remainingSeconds.value}`

    if (t.total <= 0) {
      // router.push({name: 'personal-buy-shares'})
      if (timeintervalPaid) {
        clearInterval(timeintervalPaid);
        tronButtonCheckPayment.value = 'Check payment status'
        timerStarted.value = false
        $app.store.persiste.latestTronCheckDate = null
      }
    }
  }
  timeintervalPaid = setInterval(updateClock, 1000);
  updateClock();
}
const tronButtonCheckPayment = ref('I have paid');
const timerStarted = ref(false)
const startTronTimer = async () =>{
  // $app.store.user.setSuccessModalUsdt({show: true});

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
let timeinterval = null
function initializeTronClock() {

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
    $app.api.eth.auth.getUser().then((resp) => {
      $app.store.user.info = resp?.data
    });
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

// copy

const copiedAddressValue = ref(computedAddr.value);
const addressCopied = ref(false);
const copiedAmountValue = ref(Math.ceil(props.calcValue*100)/100); //  $app.filters.roundedFixed(props.calcValue, 2)
const amountCopied = ref(false);

const { copy } = useClipboard({ copiedAddressValue });

const copyToClipboardAddress = () => {
  copy(copiedAddressValue.value);
  addressCopied.value = true;
}

const copyToClipboardAmount = () => {
  copy(String(copiedAmountValue.value));
  amountCopied.value = true;
}

const cancelOrder = async () => {

  const response = await fetch(`https://${hostname}/v3/public/billing/shares/payment/cancel-order`, { //  /v3/public/billing/shares/buy/apollopayment/cancel-order
    method: 'POST',
    headers: new Headers({
      'Authorization': 'Bearer ' + $app.store.auth.accessToken,
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      replenishment_uuid: $app.store.user.buyShares.data.uuid
    })
  });

    const res = await response.json();

  tronButtonCheckPayment.value = 'I have paid';
  clearInterval(timeinterval);
  clearInterval(timeintervalPaid);
  timerStarted.value = false;

  router.push('/personal/fund');
}

</script>
<style src="./w-buy-shares-payment-short-purchase.scss" lang="scss" />
