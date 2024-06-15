<template>
  <div class="w-buy-shares-payment page-max-width--small">
    <div class="w-buy-shares-payment__wrap">
      <div class="w-buy-shares-payment__tron">
        <div class="w-buy-shares-payment__tron-wrapper">
          <div class="w-buy-shares-payment__tron-title">
            Pay with <a-icon :name="Icon.ColorfulUsdttron" />Tether, get a {{ $app.store.user.statistic?.trc_bonus?.percent }}% Bonus!
          </div>
          <div class="w-buy-shares-payment__tron-timer">
            <span>Instant Bonus Offer Valid For</span>
            <div class="w-buy-shares-payment__tron-timer-wrapper">
              <div class="w-buy-shares-payment__tron-timer-box">
                <span>{{ tronTimerDays[0] }}</span>
                <span>{{ tronTimerDays[1] }}</span>
                <span>Days</span>
              </div>
              <div class="w-buy-shares-payment__tron-timer-box">
                <span>{{tronTimerHours[0]}}</span>
                <span>{{tronTimerHours[1]}}</span>
                <span>Hours</span>
              </div>
              <div class="w-buy-shares-payment__tron-timer-box">
                <span>{{tronTimerMinutes[0]}}</span>
                <span>{{tronTimerMinutes[1]}}</span>
                <span>Minutes</span>
              </div>
            </div>
          </div>
          <div class="w-buy-shares-payment__tron-subtitle">
            Enjoy a {{ $app.store.user.statistic?.trc_bonus?.percent }}% instant bonus on your deposit when you choose Tether's USDT for payment!
          </div>
          <div class="w-buy-shares-payment__accordion-qr">
            <qrcode-vue :value="$app.store.user.info?.account?.tron_wallet" level="L" render-as="svg" foreground="#000" background="#fff"/>
          </div>
          <div class="w-buy-shares-payment__tron-subtitle">
            Deposit your funds and stay on this screen. Your Bitcoin ETF shares will arrive shortly.
          </div>
        </div>
        <a-input
          class="w-buy-shares-payment__accordion-stable-method"
          label="Deposit method"
          model-value="Tether USDT (Tron, TRC-20)"
          :icon="Icon.ColorfulTron"
          position-icon="left"
          disabled
          @on-input-click="copy(addressInputValue)"
        />
        <div class="w-buy-shares-payment__accordion-stable-address">
          <a-input
            label="Deposit address on Tron chain:"
            :model-value="$app.store.user.info.account.tron_wallet"
            disabled
            :icon="Icon.ColorfulCopy"
            position-icon="right"
            :text-icon="addressCopied"
            text-icon-text="Copied!"
            @on-input-click="copyToClipboard(true)"
          />
        </div>
        <div class="w-buy-shares-payment__accordion-stable-amount">
          <a-input
            label="Amount"
            :model-value="`${$app.filters.rounded(amountInputValue)} USDT`"
            disabled
            :text-icon="amountCopied"
            text-icon-text="Copied!"
            :icon="Icon.ColorfulCopy"
            position-icon="right"
            @on-input-click="copyToClipboard(false)"
          />
        </div>
        <a-button :text="tronButtonCheckPayment" variant="secondary" isFullWidth @click="startTronTimer" :disabled="timerStarted"/>
        <div data-id="eTMkMlXnt9I" class="livechat_button">
          <nuxt-link to="/personal/more/support" target="_blank">
            <a-button text="Contact support" variant="tertiary" isFullWidth />
          </nuxt-link>
        </div>
      </div>
      <div class="w-buy-shares-payment__divider">Or</div>
      <p class="w-buy-shares-payment__alternative" v-if="!merchant001Link">Alternative Legacy Payment Options</p>
      <m-select
        class="w-buy-shares-payment__country"
        label="Select country"
        v-model="country"
        :options="countryList"
        v-if="!merchant001Link"
      />
      <div class="w-buy-shares-payment__legacy" v-if="!merchant001Link && country === 'RU/dirty' ">
        <div class="w-buy-shares-payment__accordion-title">Due to international and Russian regulations, there's a <span>2.5% foreign exchange commission and 2.5% card fee.</span> Use USDT instead, and get a
          {{ $app.store.user.statistic?.trc_bonus?.percent }}% bonus.
        </div>
        <div :class="['w-buy-shares-payment__variant-bank', `w-buy-shares-payment__variant-bank--${country}`]">
          <div
            v-for="item in AVAILABLE_VARIANTS"
            :class="[
              'w-buy-shares-payment__variant-bank__item',
              { 'w-buy-shares-payment__variant-bank__item--active': selectedLegacyMethod === item.value },
            ]"
            @click="selectVariantBank(item.value)"
          >
            <a-icon class="w-buy-shares-payment__variant-bank__item-icon" :name="item.icon" />
            <div class="w-buy-shares-payment__variant-bank__item-text">{{ item.text }}</div>
          </div>
        </div>
        <div class="w-buy-shares-payment__legacy-agreeBlock">
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
        <a-button text="Continue" class="w-buy-shares-payment__legacy-button" is-full-width @click="createTransation" :loading="createButtonLoading" :disabled="!createButtonAccess"/>
      </div>
      <div class="w-buy-shares-payment__legacy" v-else-if="!merchant001Link && country === 'NG' ">
        <div class="w-buy-shares-payment__accordion-title"><span>Payment Notice for Nigerian Clients:</span><br>Currently, we only accept USDT for payments from Nigeria. <span style="color: var(--accent-primary); cursor:pointer;" @click="scrollToSection">Enjoy a {{ $app.store.user.statistic?.trc_bonus?.percent }}% bonus on your deposit!</span>
        </div>
      </div>

      <div class="w-buy-shares-payment__legacy" v-else-if="!merchant001Link && country === 'EU' ">
        <div class="w-buy-shares-payment__accordion-title"><span>Payment Notice for European Clients:</span><br>Currently, we only accept USDT for payments from Europe. <span style="color: var(--accent-primary);  cursor:pointer;" @click="scrollToSection">Enjoy a {{ $app.store.user.statistic?.trc_bonus?.percent }}% bonus on your deposit!</span>
        </div>
      </div>

      <div class="w-buy-shares-payment__legacy" v-else-if="!merchant001Link && country === 'RU' ">
        <div class="w-buy-shares-payment__accordion-title"><span>Payment Notice for European Clients:</span><br>Currently, we only accept USDT for payments from Russia. <span style="color: var(--accent-primary);  cursor:pointer;" @click="scrollToSection">Enjoy a {{ $app.store.user.statistic?.trc_bonus?.percent }}% bonus on your deposit!</span>
        </div>
      </div>

      <div class="w-buy-shares-payment__legacy" v-else-if="!merchant001Link && country">
        <div class="w-buy-shares-payment__accordion-title">Be aware that legacy payment methods incur a <span>3.5% commission</span>due to banking and manual handling fees.<span>Alternatively</span>, opt for<span>USDT</span>as a <span>cost-free funding option</span> and benefit from a <span>{{ $app.store.user.statistic?.trc_bonus?.percent }}% instant bonus</span> on your deposit.
        </div>
        <div class="w-buy-shares-payment__variant-bank">
          <div
            v-for="(item, idx) in UNAVAILABLE_BANK_VARIANTS"
            :key="idx"
            class="w-buy-shares-payment__variant-bank__item w-buy-shares-payment__variant-bank__item--unavailable"
            :class="[
              { 'w-buy-shares-payment__variant-bank__item--active': selectedLegacyMethod === item.value },
            ]"
            @click="selectVariantBank(item.value, true)"
          >
            <div class="w-buy-shares-payment__variant-bank__loading" :class="[
              { 'w-buy-shares-payment__variant-bank__loading--active': selectedLegacyMethod === item.value && animationFiat },
              { 'w-buy-shares-payment__variant-bank__loading--finished': selectedLegacyMethod === item.value && animationFiatText },
            ]">
              <a-icon class="a-button__loading a-button__icon" :name="Icon.MonoNavigationLoader"/>
              <span>Temporarily<br>unavailable</span>
            </div>
            <a-icon class="w-buy-shares-payment__variant-bank__item-icon" :name="item.icon" />
          </div>
        </div>
        <div class="w-buy-shares-payment__legacy-agreeBlock">
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
        <a-button text="Continue" class="w-buy-shares-payment__legacy-button" is-full-width @click="createTransation" :loading="createButtonLoading" :disabled="!createButtonAccess"/>
      </div>
      <div class="w-buy-shares-payment__merchant" v-if="merchant001Link">
        <img src="/img/waitmerchant.png" alt="">
        <span>Please wait</span>
        <span>We will redirect you automatically to the payment gateway.</span>
        <nuxt-link :to="merchant001Link" target="_blank">
          <a-button text="Proceed to pay" is-full-width/>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import MSelect from '~/src/shared/ui/molecules/m-select/m-select.vue'
import { Icon } from '~/src/shared/constants/icons'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import AInput from '~/src/shared/ui/atoms/a-input/a-input.vue'
import { useNuxtApp, useRouter, useRoute } from '#app'
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import ACheckbox from '~/src/shared/ui/atoms/a-checkbox/a-checkbox.vue'
import * as countryListJson from '~/assets/countrylist.json'

const countryList = ref(countryListJson.default)
const router = useRouter()
const route = useRoute()
const { $app } = useNuxtApp()
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
const UNAVAILABLE_BANK_VARIANTS = [
  {
    text: 'Visa',
    value: 'Visa',
    icon: Icon.ColorfulVisa,
  },
  {
    text: 'Mastercard',
    value: 'Mastercard',
    icon: Icon.ColorfulMastercard,
  },
]

const copiedValue = ref('')
const { copy } = useClipboard({ copiedValue })

const copyToClipboard = (address = false) => {
  if (address) {
    copy(addressInputValue.value)
    addressCopied.value = true
    setTimeout(() => {
      addressCopied.value = false
    }, 1000)
  } else {
    copy(amountInputValue.value)
    amountCopied.value = true
    setTimeout(() => {
      amountCopied.value = false
    }, 1000)
  }
}


const country = ref('')
const selectedLegacyMethod = ref('')
const animationFiat = ref(false)
const animationFiatText = ref(false)
const selectVariantBank = (variant, animation = false) => {
  selectedLegacyMethod.value = variant
  if (animation) {
    setTimeout(()=>{
      animationFiat.value = true
    },500)
    setTimeout(()=>{
      animationFiat.value = false
      animationFiatText.value = true
    },2500)
    setTimeout(()=>{
      animationFiat.value = false
      animationFiatText.value = false
      selectedLegacyMethod.value = ''
    },5000)
  }
}

const addressInputValue = ref('')
const amountInputValue = ref('')

const transationByUUID = ref('')

const allPaymentsTypesMerchant = ref([])

onMounted(async () => {
  amountInputValue.value = $app.store.user?.buyShares?.real_amount
  addressInputValue.value = $app.store.user?.buyShares?.tron_wallet
  transationByUUID.value = await $app.api.eth.billingEth
    .getTransactionByUuid(route.query.replenishment)
  merchant001Link.value = transationByUUID.value?.data?.redirect_uri
  const merchantMethods = await useAsyncData('getMerchantMethods', () => {
    return $app.api.eth.billingEth.getMerchantMethods(transationByUUID.value.data.uuid)
  })
  allPaymentsTypesMerchant.value = merchantMethods.data?.value?.data?.methods
  if (!transationByUUID.value) {
    await router.push('/personal/buy-shares')
  }

  if ($app.store.persiste.latestTronCheckDate) {
    initializeClock()
    timerStarted.value = true
  }
  initializeTronClock()
})

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

  updateClock();
  const timeinterval = setInterval(updateClock, 1000);
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

const scrollToSection = () =>{
  const element = document.querySelector(".w-buy-shares-payment__tron-wrapper");
  let headerOffset
  headerOffset = -100;
  const elementPosition = element.offsetTop;
  const offsetPosition = elementPosition + headerOffset;
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}
</script>
<style src="./w-buy-shares-payment.scss" lang="scss" />
