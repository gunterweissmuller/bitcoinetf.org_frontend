<template>
  <div class="w-etfs">
    <div class="w-etfs__wrap">
      <div class="w-etfs__amount">
        <div class="w-etfs__amount-wrap">
          <div class="w-etfs__amount-title">Bitcoin ETF Shares</div>
          <div class="w-etfs__amount-sum">
            {{ $app.filters.rounded($app.store.user?.lastPayment?.total_balance_usd, 2)  }}
            <!-- {{ $app.filters.rounded(walletDividends?.btc_amount * $app.store.user.btcValue, 2) }} -->
          </div>
        </div>
        <div class="w-etfs__amount-buttons">
          <div class="w-etfs__amount-buttons-item w-etfs__amount-buttons-item-primary" @click="() => {$app.store.user.setIsInvestModalShow({show: true});}">
            <a-icon
                width="18"
                height="18"
                :name="Icon.MonoPlus"
              />
              Buy
          </div>

          <!-- <div class="w-etfs__amount-buttons-item w-etfs__amount-buttons-item-secondary" @click="() => isShowSureModal = true">
            <a-icon
                width="18"
                height="18"
                :name="Icon.MonoMinus"
              />
              Sell
          </div> -->

          <div class="w-etfs__amount-buttons-item w-etfs__amount-buttons-item-secondary" @click="handleVerify">
            <a-icon
                width="18"
                height="18"
                :name="Icon.MonoLinkToPage"
              />
              Verify
          </div>
        </div>
      </div>

      <div class="w-etfs__subtitle">Transactions</div>
      <div v-if="personalDividends.length" class="w-etfs__list">
        <transition-group name="fade" tag="div">
          <template v-for="item in personalDividends" :key="item?.uuid" class="w-etfs__item">
            <div class="w-etfs__item" v-if="item.referral_amount">
              <div
                :class="['w-etfs__item-pic', { 'w-etfs__item-pic--minus': item.type !== DIVIDENDS_TYPES.PLUS }]"
              >
                <a-icon
                  width="18"
                  height="18"
                  :name="item.type === DIVIDENDS_TYPES.PLUS ? Icon.MonoPlus : Icon.MonoMinus"
                />
              </div>
              <div class="w-etfs__item_info">
                <div class="w-etfs__item_info-title">Referal Bonus ETFs</div>
                <div class="w-etfs__item_info-date">
                  {{ $app.filters.dayjs(item?.created_at || `${item?.date_string} ${item?.time}`)?.format('D MMMM YY HH:mm') }}
                </div>
              </div>
              <div v-if="item.status === 'pending'" class="w-etfs__item_sums">Pending</div>
              <div v-else class="w-etfs__item_sums">
                <div class="w-etfs__item_info-usd">
                  {{ item.type === DIVIDENDS_TYPES.PLUS ? '+' : '-' }} {{ $app.filters.rounded(item.referral_amount, 0) }}
                </div>
              </div>
            </div>
            <div class="w-etfs__item">
              <div
                :class="['w-etfs__item-pic', { 'w-etfs__item-pic--minus': item.type !== DIVIDENDS_TYPES.PLUS }]"
              >
                <a-icon
                  width="18"
                  height="18"
                  :name="item.type === DIVIDENDS_TYPES.PLUS ? Icon.MonoPlus : Icon.MonoMinus"
                />
              </div>
              <div class="w-etfs__item_info">
                <div class="w-etfs__item_info-title">{{ getDividendsDesc(item) }}</div>
                <div class="w-etfs__item_info-date">
                  {{ $app.filters.dayjs(item?.created_at || `${item?.date_string} ${item?.time}`)?.format('D MMMM YY HH:mm') }}
                </div>
              </div>
              <div v-if="item.status === 'pending'" class="w-etfs__item_sums">Pending</div>
              <div v-else class="w-etfs__item_sums">
                <div class="w-etfs__item_info-usd">
                  {{ item.type === DIVIDENDS_TYPES.PLUS ? '+' : '-' }} {{ $app.filters.rounded(item?.usd_amount || item?.real_amount, 0) }}
                </div>
              </div>
            </div>
          </template>
        </transition-group>
      </div>
      <div v-if="personalDividends.length && hasNextPage" class="w-etfs__more">
        <div @click="loadMoreDividends" class="w-etfs__more-text">Load more</div>
      </div>
      <div v-if="!personalDividends.length" class="w-etfs__empty">
        <img class="w-etfs__empty-pic" src="/img/cloud.png" alt="empty" />
        <div class="w-etfs__empty-title">You don’t have any transactions yet.</div>
        <div class="w-etfs__empty-text">Buy your first ETF Shares and enjoy daily dividends!</div>
      </div>
    </div>
  </div>
  <e-sell-etf-modal :show="isShowSureModal" :close="closeSureModal"  />
  <f-withdrawal-modal :address="address" :method="method" v-model="isOpenModal" @accept="setMethod" />

  <!-- <w-onboarding :steps="renderedSteps" :next-route-name="nextRouteName" :is-purchase="nextRouteName == 'personal-buy-shares'"/> -->
</template>

<script setup lang="ts">
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import FWithdrawalModal from '~/src/features/f-withdrawal-modal/f-withdrawal-modal.vue'
import eSellEtfModal from '~/src/entities/e-sell-etf-modal/e-sell-etf-modal.vue'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import { Centrifuge } from 'centrifuge'
import { onUnmounted } from 'vue'
import WOnboarding from '~/src/widgets/w-onboarding/w-onboarding.vue'
import ALive from '~/src/shared/ui/atoms/a-live/a-live.vue'

const { $app } = useNuxtApp()

const isOpenModal = ref(false)
const transactionsKey = ref(0)
const orderType = computed(() => $app.store.user?.info?.account?.order_type || 'init_btc')

const enum DIVIDENDS_TYPES {
  PLUS = 'credit_from_client',
  // MINUS = 'credit_from_client',
  ESCAPE = 'withdrawal',
}

const openModal = async () => {
  const isKycFinished = await checkKyc()

  if (isKycFinished) {
    isOpenModal.value = true
  } else {
    navigateTo({ name: 'personal-kyc' })
  }
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

const getLastPayment = async () => {
  $app.api.eth.billingEth
  .getLastPayment()
  .then((response: any) => {
    $app.store.user.lastPayment = response.data
  })
  .catch(() => {
    // Todo: notify something went wrond
  })
}

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

  // if (item.hasOwnProperty('referral_amount') && item.referral_amount) {
  //   return 'Referal Bonus ETFs'
  // }

  if (item.hasOwnProperty('referral_amount')) {
    return 'Buy ETFs'
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
    .getSharesTransactions({
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
  await getLastPayment()

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
        await getLastPayment()
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

// sure modal
const isShowSureModal = ref(false);

const closeSureModal = () => {
  isShowSureModal.value = false;
}

// verify

const checkKyc = async () => {
  return await $app.api.eth.kyc.getForms().then((formsResponse: any) => {
    return formsResponse.data[0].status === 'passed'
  })
}

const explorerURL = config.public.EXPLORER_API;
const explorerHostname = `https://${explorerURL}`;

const handleVerify = async () => {
  window.open(`${explorerHostname}/account/${$app.store.user?.blockchainUserWallet}`, '_blank')
  // const isKycFinished = await checkKyc();

  // window.open(window.location.origin + "/personal/kyc");

  // navigateTo({ name: 'personal-kyc' }, {
  //   open : {
  //     target : "_blank"
  //   }
  // });

  // if (isKycFinished) {
  //   //todo ?
  //   navigateTo({ name: 'personal-kyc' })
  // } else {
  //   navigateTo({ name: 'personal-kyc' })
  // }
}

</script>

<style src="./w-etfs.scss" lang="scss" />

<style lang="scss"></style>
