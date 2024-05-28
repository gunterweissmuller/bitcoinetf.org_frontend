<template>
  <div class="w-dividends">
    <div class="w-dividends__wrap">
      <div class="w-dividends__amount">
        <div class="w-dividends__amount-wrap">
          <div class="w-dividends__amount-title">Total Balance</div>
          <div class="w-dividends__amount-sum">${{ $app.filters.rounded(orderType !== 'usdt' ? walletDividends?.btc_amount * $app.store.user.btcValue : walletDividends?.usd_amount, 2) }}<span v-if="walletDividends?.difference" class="w-dividends__amount-plus">+{{ $app.filters.rounded(walletDividends?.difference, 2) }}%</span>
          </div>
          <div v-if="walletDividends?.btc_amount && $app.store.user?.info?.account?.order_type !== 'usdt'" class="w-dividends__btc" v-html="btcAmount"></div>
        </div>

        <div class="w-dividends__timer" :style="timerStyle">
          <div class="w-dividends__timer-name">NEXT PAYOUT</div>
          <div class="w-dividends__timer-time">{{ timerText }}</div>
        </div>

      </div>

      <div class="w-dividends__cards">

        <div v-if="!address" class="w-dividends__cards-item w-dividends__cards-item-withdraw" :class="{ disabled: !isNonEmptyDividendsBalance }" @click="openModal">
          <div class="w-dividends__cards-add">
            <div class="w-dividends__cards-add-img">
              <a-icon
                width="32"
                height="32"
                :name="Icon.MonoPlus"
              />
            </div>
            <div class="w-dividends__cards-add-text">
              Add Withdrawal Method
            </div>
          </div>

        </div>

        <div v-else class="w-dividends__cards-item w-dividends__cards-item-withdraw">
          <div class="w-dividends__cards-header" @click="openModal">
            <a-icon width="24" height="24" class="w-dividends__cards-icon-method" :name="typeMethodIcon" />
            <a-icon width="18" height="18" class="w-dividends__cards-icon-edit"  :name="Icon.MonoActionEdit" />
          </div>
          <div class="w-dividends__cards-body">
            <div class="w-dividends__cards-subtitle">
              WITHDRAW TO:
            </div>
            <div class="w-dividends__cards-title-second">
              {{ address }}
            </div>
          </div>
          <div class="w-dividends__cards-footer">
            <div class="w-dividends__cards-text">
              {{ subInfo }}
            </div>
          </div>
        </div>

        <div class="w-dividends__cards-item w-dividends__cards-item-dividends">
          <div class="w-dividends__cards-header">
            <div class="w-dividends__cards-icon-dollar">
              <a-icon width="14" height="14"  :name="Icon.MonoDollar" />
            </div>
            <a-live />
          </div>
          <div class="w-dividends__cards-body">
            <div class="w-dividends__cards-subtitle">
              TOTAL DIVIDENDS PAID
            </div>
            <div class="w-dividends__cards-title">
              ${{$app.filters.rounded(tempDividendsEarnedBtc, 2) }}
            </div>
          </div>
          <div class="w-dividends__cards-footer">
            <div class="w-dividends__cards-text w-dividends__cards-dropdown">
              <m-dropdown :options="timeOptions"/>
            </div>
          </div>
        </div>

      </div>

      <!-- OLD -->
      <!-- <button v-if="!selectedMethod" @click="openModal" class="w-dividends__withdrawal" type="button">
        <a-icon width="24" height="24" class="w-dividends__withdrawal-icon" :name=" orderType === 'usdt' ? Icon.ColorfulUsdt : Icon.ColorfulBitcoin" />
        <span class="w-dividends__withdrawal-text">Add withdrawal method</span>
        <a-icon width="18" height="18" class="w-dividends__withdrawal-chevron" :name="Icon.MonoChevronRight" />
      </button>

      <div v-else class="w-dividends__amount-method" @click="openModal">
        <div class="w-dividends__amount-method__wrap">
          <a-icon width="24" height="24" class="w-dividends__amount-method__icon" :name="typeMethodIcon" />
          <div class="w-dividends__amount-method-box">
            <div class="w-dividends__amount-method__method">
              <div class="w-dividends__amount-method__method-head">Withdrawal method</div>
              <div class="w-dividends__amount-method__sum-head">{{ selectedWithdrawalMethod }}</div>
            </div>
            <div class="w-dividends__amount-method__sum">
              <div class="w-dividends__amount-method__method-text">{{ address }}</div>
            </div>
          </div>

          <a-icon width="18" height="18" class="w-dividends__amount-method__chevron" :name="Icon.MonoChevronRight" />
        </div>
      </div> -->

      <div class="w-dividends__subtitle">Transactions</div>
      <div v-if="personalDividends.length" class="w-dividends__list">
        <transition-group name="fade" tag="div">
          <div v-for="item in personalDividends" :key="item?.uuid" class="w-dividends__item">
            <div
              :class="['w-dividends__item-pic', { 'w-dividends__item-pic--minus': item.type !== DIVIDENDS_TYPES.PLUS }]"
            >
              <a-icon
                width="14"
                height="14"
                :name="item.type === DIVIDENDS_TYPES.PLUS ? Icon.MonoPlus : Icon.MonoMinus"
              />
            </div>
            <div class="w-dividends__item_info">
              <div class="w-dividends__item_info-title">{{ getDividendsDesc(item) }}</div>
              <div class="w-dividends__item_info-date">
                {{ $app.filters.dayjs(item?.created_at)?.format('D MMM YY HH:mm') }}
              </div>
            </div>
            <div v-if="item.status === 'pending'" class="w-dividends__item_sums">Pending</div>
            <div v-else class="w-dividends__item_sums">
              <div class="w-dividends__item_info-usd">
                {{ item.type === DIVIDENDS_TYPES.PLUS ? '+' : '-' }} ${{ $app.filters.rounded(item?.usd_amount, 2) }} <!--8-->
              </div>
              <div v-if="$app.store.user?.info?.account?.order_type !== 'usdt'" class="w-dividends__item_info-btc">
                <span v-html="item.type === DIVIDENDS_TYPES.PLUS ? '+' : '-'"></span>
                <span v-html="$app.filters.convertValue($app.filters.rounded(item?.btc_amount, 6))"></span> <!--8-->
              </div>
            </div>
          </div>
        </transition-group>
      </div>
      <div v-if="personalDividends.length && hasNextPage" class="w-dividends__more">
        <div @click="loadMoreDividends" class="w-dividends__more-text">Load more</div>
      </div>
      <div v-if="!personalDividends.length" class="w-dividends__empty">
        <img class="w-dividends__empty-pic" :src="$app.store.user.theme === 'dark' ? '/img/cloud-dark.png' : '/img/cloud.png' " alt="empty" />
        <div class="w-dividends__empty-title">You don’t have any transactions yet.</div>
        <div class="w-dividends__empty-text">Buy your first ETF Shares and enjoy daily dividends!</div>
      </div>
    </div>
  </div>
  <f-withdrawal-modal :address="address" :method="method" v-model="isOpenModal" @accept="setMethod" />

  <!-- <w-onboarding :steps="renderedSteps" :next-route-name="nextRouteName" :is-purchase="nextRouteName == 'personal-buy-shares'"/> -->
</template>

<script setup lang="ts">
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import FWithdrawalModal from '~/src/features/f-withdrawal-modal/f-withdrawal-modal.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import { Centrifuge } from 'centrifuge'
import { onUnmounted } from 'vue'
import WOnboarding from '~/src/widgets/w-onboarding/w-onboarding.vue'
import ALive from '~/src/shared/ui/atoms/a-live/a-live.vue'
import mDropdown from '~/src/shared/ui/molecules/m-dropdown/m-dropdown.vue'
import eNotEnoughBalanceModal from '~/src/entities/e-not-enough-balance-modal/e-not-enough-balance-modal.vue'
import axios from "axios";

const { $app } = useNuxtApp()

const isOpenModal = ref(false)
const transactionsKey = ref(0)
const orderType = computed(() => $app.store.user?.info?.account?.order_type || 'init_btc')

const enum DIVIDENDS_TYPES {
  PLUS = 'debit_to_client',
  MINUS = 'credit_from_client',
  ESCAPE = 'withdrawal',
}

const openModal = async () => {
  // const isKycFinished = await checkKyc()

  // if (isKycFinished) {
  //   isOpenModal.value = true
  // } else {
  //   navigateTo({ name: 'personal-kyc' })
  // }

  isOpenModal.value = true
}

const walletDividends = ref([])
const personalDividends = ref([])
const currentPage = ref(1)
const hasNextPage = ref(true)
const method = ref('')
const address = ref('')
const setMethodError = ref('')

const centrifuge = ref(null)
const withdrawalMethods = {
  bitcoin_on_chain: 'On-chain',
  bitcoin_lightning: 'Lightning',
  polygon_usdt: 'Tether USDT (Polygon)',
}
const selectedWithdrawalMethod = computed(() => withdrawalMethods[method])
const setMethod = async (value) => {
  let methodType
  if (value.method !== 'none') {
    methodType = value.method
  } else {
    methodType = 'none'
  }
  await $app.api.info.billing
    .setWithdrawalMethod({
      address: value.address,
      method: methodType,
      walletType: 'dividends',
    })
    .then(async () => {
      await getWalletDividends()
    })
    .catch((e) => {
      if (e?.errors?.error?.message) {
        setMethodError.value = e.errors.error.message
      } else {
        setMethodError.value = 'Something went wrong'
      }
    })
}

const typeWorkMethod = computed(() => {
  return (method.value === 'bitcoin_lightning' || method.value === 'polygon_usdt') ? 'Automatic' : 'Manual'
})

const subInfo = computed(() => {
  return method.value === 'bitcoin_lightning' || method.value === 'polygon_usdt'
    ? 'Withdrawals will be made automatically daily'
    : ' Withdrawals will be made automatically once the cash balance reaches $250.'
})

const typeMethodIcon = computed(() => {
  if (method.value === 'bitcoin_lightning') {
    return Icon.ColorfulBtcLightning
  }

  if (method.value === 'polygon_usdt') {
    return Icon.ColorfulUsdtPolygon
  }

  return Icon.ColorfulBitcoin
})

const selectedAddressShort = computed(() => {
  if (!address.value) return ''
  if (address.value.length <= 5) return address.value
  return address.value.slice(0, 5) + '...' + address.value.slice(address.value.length - 4)
})

const getWalletDividends = async () => {
  await $app.api.eth.billingEth
    .getWallet({ type: 'dividends' })
    .then((response: any) => {
      walletDividends.value = response.data
      $app.store.user.walletDividends = response.data
      address.value = response.data?.withdrawal_address || ''
      method.value = response.data?.withdrawal_method || ''
      $app.store.user.dividends = response.data
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const selectedMethod = computed(() => {
  return method.value === 'bitcoin_on_chain' || method.value === 'bitcoin_lightning' || method.value === 'polygon_usdt'
})

const getDividendsDesc = (item) => {
  if (item.type === DIVIDENDS_TYPES.ESCAPE) {
    return 'Dividends Withdrawal (External Wallet)'
  }

  switch (item?.withdrawal_method) {
    case 'bitcoin_lightning': {
      return 'Lightning withdrawal'
    }
    case 'bitcoin_on_chain': {
      return 'Bitcoin Withdrawal'
    }
    case 'polygon_usdt': {
      return 'Tether USDT (Polygon) Withdrawal'
    }
    default:
      return 'Dividends'
  }
}

const getPersonalDividends = async (initial = false) => {
  if (initial) {
    currentPage.value = 1
  }
  await $app.api.eth.billingEth
    .getTransactions({
      page: currentPage.value,
      per_page: 4,
      type: 'dividends',
    })
    .then((response: any) => {
      if (initial) {
        personalDividends.value = []
      }
      hasNextPage.value = !!response.data.next_page_url
      personalDividends.value = [...personalDividends.value, ...response.data.data]

      transactionsKey.value += 1
    })
    .catch(() => {
      // Todo: notify something went wrond
    })
}

const loadMoreDividends = async () => {
  currentPage.value += 1
  await getPersonalDividends()
}

const usdAmount = computed(() => {
  if (!walletDividends.value?.usd_amount) return 0

  return $app.filters.rounded(walletDividends.value?.usd_amount, 2)
})

const btcAmount = computed(() => {
  if (!walletDividends.value?.btc_amount) return 0

  return $app.filters.convertValue($app.filters.rounded(walletDividends.value?.btc_amount, 8))
})

const isMore200Usd = computed(() => {
  return walletDividends.value?.usd_amount > 100
})

const checkKyc = async () => {
  return await $app.api.eth.kyc.getForms().then((formsResponse: any) => {
    return formsResponse.data[0].status === 'passed'
  })
}

const withdrawalDividends = async () => {
  $app.api.eth.billingEth
    .withdrawalDividends()
    .then(() => {
      getWalletDividends()
    })
    .catch((e) => {
      console.error(e.errors)
    })
}
const config = useRuntimeConfig()
const centrifugeURL = config.public.WS_URL
const centrifugeToken = config.public.WS_TOKEN

onMounted(async () => {
  await getWalletDividends()
  await getPersonalDividends()

  centrifuge.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
  })

  centrifuge.value.connect()

  const sub = centrifuge.value.newSubscription(`wallet.${$app.store.user.info?.account?.uuid}`)

  sub
    .on('publication', async function (ctx) {
      setTimeout(async () => {
        await getPersonalDividends(true)
        await getWalletDividends()
      }, 1500)
    })
    .subscribe()
})

onUnmounted(() => {
  centrifuge.value?.disconnect()
})

// Onboarding
const { width } = useWindowSize()

const journeySteps = computed(() => {
  return [
    {
      attachTo: { element: width.value < 1024 ? '#menu-personal-dividends-bottom' : '#menu-personal-dividends' },
      content: { title: 'Wallet', description: 'With BitcoinETF, manage three distinct digital wallets.' },
      options: {
        overlay: {
          padding: 10,
          borderRadius: 40,
        },
        popper: {
          placement: width.value < 1024 ? 'top' : 'bottom',
        },
      },
      on: {
        beforeStep: async function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.add('onboarding-index')
        },
        afterStep: async function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.remove('onboarding-index')
        },
      },
    },
  ]
})

const steps = computed(() => {
  return [
    {
      attachTo: { element: width.value < 1024 ? '#personal-dividends-tab-mobile' : '#personal-dividends-tab' },
      content: {
        title: 'Dividends Wallet',
        description:
          "This is your daily dividend destination, paid in Bitcoin. Convert to cash or retain as Bitcoin – we'll guide you through either choice.",
      },
      options: {
        overlay: {
          padding: 16,
          borderRadius: 16,
        },
      },
      on: {
        beforeStep: async function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.add('onboarding-index')
        },
        afterStep: function (options) {
          const elem = document.querySelector(options.step.attachTo.element)
          elem?.classList.remove('onboarding-index')
        },
      },
    },
  ]
})

const renderedSteps = computed(() => {
  const journey = localStorage.getItem('journey')

  if (!journey) {
    return journeySteps.value.filter((step) => step.isRender !== false)
  }

  return steps.value.filter((step) => step.isRender !== false)
})

const nextRouteName = computed(() => {
  return localStorage?.getItem('journey') ? 'personal-referrals' : 'personal-buy-shares'
})

//timer style

const timerPercent = ref(0);
const timerText = ref("");

onMounted(() => {

  const time = new Date();
  const senondsDay = 24*60*60*1000; //24hr in miliseconds
  const secondsEnd = 6*60*60*1000 + 30*60*1000; //6:30 hours in miliseconds;
  const secondsNow = time.getHours()*60*60*1000 + time.getMinutes()*60*1000 + time.getSeconds()*1000;

  const timeZone = -(time.getTimezoneOffset()+180)*60*1000; // timezone for moscow in miliseconds

  // console.log(time.getTimezoneOffset(), time, timeZone, $app.filters.dayjs(time.getTime()).format('D MMM YY HH:mm:ss'), $app.filters.dayjs(time.getTime()-secondsNow+secondsEnd+senondsDay).format('D MMM YY HH:mm:ss')  );

  // Set the date we're counting down to
  let countDownDate = time.getTime()-secondsNow+secondsEnd+senondsDay+timeZone;

  // if end time > 24hr -> get this day time
  if(countDownDate - time.getTime() > senondsDay) {
    countDownDate = time.getTime()-secondsNow+secondsEnd+timeZone;
  }


  // Update the count down every 1 second
  const x = setInterval(function() {

    const now = new Date().getTime();
    // Find the distance between now and the count down date
    const distance = countDownDate - now;

    timerPercent.value = distance / (senondsDay/100);

    // Time calculations for days, hours, minutes and seconds
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    const displayHours = String(hours).length < 2 ? "0" + hours : hours ;
    const displayMinutes = String(minutes).length < 2 ? "0" + minutes : minutes;
    const displaySeconds = String(seconds).length < 2 ? "0" + seconds : seconds;
    timerText.value = displayHours+":"+ displayMinutes+":"+displaySeconds;

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      timerText.value = "Finished";
    }
  }, 1000);

//  setTimeout(()=>{
//   setInterval(() => {
//     timerPercent.value += 1;
//   },10);
//  }, 5000)
})

const timerStyle = computed(() => {
  return `background: radial-gradient(var(--surfaces-surface-1) 63%, transparent 64%), conic-gradient(var(--accent-primary) 0% ${timerPercent.value}%, var(--surfaces-selection) ${timerPercent.value}% 50%);`
  return `background: radial-gradient(black 60%, transparent 61%), conic-gradient(#D53738 0% ${timerPercent.value}%, transparent ${timerPercent.value}% 100%)`;
})

// time dropdown

const tempDividendsEarnedBtc = ref(0);

onMounted(() => {
  $app.api.eth.statisticEth.getPersonalStats().then((res) => {
    tempDividendsEarnedBtc.value = res.data.sum_dividends;
  })
})

const getTotalDividendsPaid = (time : any) => {
  const filterObj : Record<string, any> = {}

  if (time !== 'all') {
    filterObj.dividends_earned_btc_daily_filter = time;
  }

  $app.api.eth.statisticEth.getGlobalStats({ filters: filterObj }).then((res) => {
    tempDividendsEarnedBtc.value = res.data.dividends_earned_btc;
  })
}

const getTotalDividendsPaidPersonal = (time : any) => {
  const filterObj : Record<string, any> = {}

  if (time !== 'all') {
    filterObj.days = time;
  }

  $app.api.eth.statisticEth.getPersonalStats({ filters: filterObj }).then((res) => {
    tempDividendsEarnedBtc.value = res.data.sum_dividends;
  })
}

const timeOptions = [
  {value : "All time", callback: () => getTotalDividendsPaidPersonal('all')},
  {value : "1 year", callback: () => getTotalDividendsPaidPersonal(365)},
  {value : "6 months", callback: () => getTotalDividendsPaidPersonal(180)},
  {value : "3 months", callback: () => getTotalDividendsPaidPersonal(90)},
  {value : "1 month", callback: () => getTotalDividendsPaidPersonal(30)},
  {value : "1 week", callback: () => getTotalDividendsPaidPersonal(7)},
  {value : "7 days", callback: () => getTotalDividendsPaidPersonal(7)},
  {value : "24 hours", callback: () => getTotalDividendsPaidPersonal(1)},
]

const methods = [
  {
    label: 'Tether USDT (Polygon)',
    value: 'polygon_usdt',
    icon: Icon.ColorfulTron,
  },
]

const timeValue = ref(methods[0]?.value);

const isNonEmptyDividendsBalance = computed(() => walletDividends.value?.usd_amount > 0)
</script>

<style src="./w-dividends.scss" lang="scss" />

<style lang="scss"></style>
