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
          <!-- <div class="w-etfs__amount-buttons-item w-etfs__amount-buttons-item-primary" @click="() => {$app.store.user.setIsInvestModalShow({show: true});}">
            <a-icon
                width="18"
                height="18"
                :name="Icon.MonoPlus"
              />
              Buy
          </div>

          <div :disable="$app.store.user.sellShares?.amount > 0" class="w-etfs__amount-buttons-item w-etfs__amount-buttons-item-secondary" @click="() => isShowSureModal = true">
            <a-icon
                width="18"
                height="18"
                :name="Icon.MonoMinus"
              />
              Sell
          </div>

          <div class="w-etfs__amount-buttons-item w-etfs__amount-buttons-item-secondary" @click="handleVerify">
            <a-icon
                width="18"
                height="18"
                :name="Icon.MonoLinkToPage"
              />
              Verify
          </div> -->

          <a-button class="w-etfs__amount-buttons-item w-etfs__amount-buttons-item-primary" @click="() => {$app.store.user.setIsInvestModalShow({show: true});}"  text="Buy" variant="primary" :icon="Icon.MonoPlus" size="small"/>
          <a-button :disabled="$app.store.user.sellShares?.amount <= 0" class="w-etfs__amount-buttons-item w-etfs__amount-buttons-item-secondary" @click="() => isShowSureModal = true" text="Sell" variant="secondary" :icon="Icon.MonoMinus" size="small"/>
          <a-button class="w-etfs__amount-buttons-item w-etfs__amount-buttons-item-secondary" @click="handleVerify" text="Verify" variant="secondary" :icon="Icon.MonoLinkToPage" size="small"/>
        </div>
      </div>

      <div class="w-etfs__subtitle">Transactions</div>
      <div v-if="personalDividends.length" class="w-etfs__list">
        <transition-group name="fade" tag="div">
          <template v-for="item in personalDividends" :key="item?.uuid" class="w-etfs__item">
            <div class="w-etfs__item" v-if="item.dividend_amount">
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
                  {{ item.type === DIVIDENDS_TYPES.PLUS ? '+' : '-' }} {{ $app.filters.rounded(item.dividend_amount, 0) }}
                </div>
              </div>
            </div>
            <div class="w-etfs__item" v-if="item.bonus_amount">
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
                  {{ item.type === DIVIDENDS_TYPES.PLUS ? '+' : '-' }} {{ $app.filters.rounded(item.bonus_amount, 0) }}
                </div>
              </div>
            </div>
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
        <img class="w-etfs__empty-pic" :src="$app.store.user.theme === 'dark' ? '/img/cloud-dark.png' : '/img/cloud.png'" alt="empty" />
        <div class="w-etfs__empty-title">You don’t have any transactions yet.</div>
        <div class="w-etfs__empty-text">Buy your first ETF Shares and enjoy daily dividends!</div>
      </div>
    </div>
  </div>
  <e-sell-etf-modal :show="isShowSureModal" :close="closeSureModal"  />
  <!-- <w-onboarding :steps="renderedSteps" :next-route-name="nextRouteName" :is-purchase="nextRouteName == 'personal-buy-shares'"/> -->
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import eSellEtfModal from '~/src/entities/e-sell-etf-modal/e-sell-etf-modal.vue'
import { Centrifuge } from 'centrifuge'
import { onUnmounted } from 'vue'
import aButton from '~/src/shared/ui/atoms/a-button/a-button.vue'

const { $app } = useNuxtApp()

const transactionsKey = ref(0)

const enum DIVIDENDS_TYPES {
  PLUS = 'credit_from_client',
  // MINUS = 'credit_from_client',
  ESCAPE = 'withdrawal',
}

const walletDividends = ref([])
const personalDividends = ref([])
const currentPage = ref(1)
const hasNextPage = ref(true)
const method = ref('')
const address = ref('')
const centrifuge = ref(null)

const getSellEtfs = async () => {
  $app.api.eth.billingEth
  .initSellShares()
  .then((response: any) => {
    $app.store.user.sellShares = response.data
  })
  .catch(() => {
    // Todo: notify something went wrond
  })
}

const getValuate = async () => {
  $app.api.eth.billingEth
  .getValuate()
  .then((response: any) => {
    $app.store.user.sellShares = Object.assign($app.store.user.sellShares, response.data);
  })
  .catch(() => {
    // Todo: notify something went wrond
  })
}

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

const config = useRuntimeConfig()
const centrifugeURL = config.public.WS_URL
const centrifugeToken = config.public.WS_TOKEN

onMounted(async () => {
  await getWalletDividends()
  await getPersonalDividends()
  await getLastPayment()
  await getSellEtfs()
  await getValuate()

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
        await getSellEtfs()
        await getValuate()
      }, 1500)
    })
    .subscribe()
})

onUnmounted(() => {
  centrifuge.value?.disconnect()
})

// sure modal
const isShowSureModal = ref(false);

const closeSureModal = () => {
  isShowSureModal.value = false;
}

// verify
const explorerURL = config.public.EXPLORER_API;
const explorerHostname = `https://${explorerURL}`;

const handleVerify = async () => {
  window.open(`${explorerHostname}/account/${$app.store.user?.blockchainUserWallet}`, '_blank')
}

</script>

<style src="./w-etfs.scss" lang="scss" />

<style lang="scss"></style>
