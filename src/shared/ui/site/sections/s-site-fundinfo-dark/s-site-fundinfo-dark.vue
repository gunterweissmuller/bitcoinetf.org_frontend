<template>
  <section class="s-site-fundinfo-dark" data-name="Perfomance">
    <div class="l-site-dark">
      <div class="s-site-fundinfo-dark__title title-site-h1">REAL TIME FINANCIALS</div>
      <div class="s-site-fundinfo-dark__items">
        <div class="s-site-fundinfo-dark__item">
          <div class="s-site-fundinfo-dark__item-title"><svg xmlns="http://www.w3.org/2000/svg" width="38" height="49" viewBox="0 0 38 49" fill="none">
            <path
              d="M34.1252 18.9278C33.7374 14.5601 29.9804 13.0694 25.2265 12.6179L25.2706 6.56362L21.5854 6.53709L21.5426 12.4318C20.5738 12.4248 19.5834 12.4367 18.5994 12.4492L18.6433 6.51547L14.9601 6.48846L14.9146 12.541C14.1166 12.5514 13.3329 12.5605 12.5689 12.5554L12.5686 12.5367L7.48586 12.4978L7.45809 16.4337C7.45809 16.4337 10.1798 16.4017 10.1342 16.4515C11.6269 16.4628 12.1064 17.333 12.2422 18.0818L12.1922 24.9788C12.2952 24.9801 12.4295 24.9854 12.5815 25.0074C12.4588 25.0066 12.3274 25.0048 12.1922 25.005L12.1207 34.6671C12.0518 35.1364 11.7702 35.8834 10.7273 35.8776C10.7742 35.9197 8.04848 35.8573 8.04848 35.8573L7.28413 40.253L12.0798 40.2878C12.9723 40.2954 13.8503 40.3169 14.7123 40.3287L14.6692 46.4519L18.3504 46.4794L18.3945 40.4209C19.4051 40.4492 20.3832 40.4644 21.3381 40.4705L21.2925 46.501L24.9777 46.5275L25.0235 40.4152C31.2216 40.105 35.5692 38.5758 36.1502 32.7618C36.6191 28.0802 34.4307 25.9737 30.9199 25.1035C33.0645 24.0311 34.4143 22.1239 34.1252 18.9278ZM28.8738 31.983C28.8424 36.5588 21.0111 35.9812 18.5136 35.9653L18.5738 27.8525C21.072 27.8713 28.909 27.2102 28.8738 31.983ZM27.2435 20.5243C27.2119 24.6875 20.6811 24.1539 18.6008 24.1389L18.6547 16.7809C20.735 16.796 27.2747 16.1821 27.2435 20.5243Z"
              fill="#F1F2F4"
            />
          </svg>{{ $app.filters.rounded($app.store.user.statistic?.dividends_earned_btc, 5) }}
          </div>
          <div class="s-site-fundinfo-dark__item-subtitle">Total Dividends Paid</div>
        </div>
        <div class="s-site-fundinfo-dark__item">
          <div class="s-site-fundinfo-dark__item-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="49" viewBox="0 0 38 49" fill="none"
                 data-v-inspector="src/shared/ui/site/sections/s-site-main/s-site-main.vue:28:19">
              <path
                d="M34.1252 18.9278C33.7374 14.5601 29.9804 13.0694 25.2265 12.6179L25.2706 6.56362L21.5854 6.53709L21.5426 12.4318C20.5738 12.4248 19.5834 12.4367 18.5994 12.4492L18.6433 6.51547L14.9601 6.48846L14.9146 12.541C14.1166 12.5514 13.3329 12.5605 12.5689 12.5554L12.5686 12.5367L7.48586 12.4978L7.45809 16.4337C7.45809 16.4337 10.1798 16.4017 10.1342 16.4515C11.6269 16.4628 12.1064 17.333 12.2422 18.0818L12.1922 24.9788C12.2952 24.9801 12.4295 24.9854 12.5815 25.0074C12.4588 25.0066 12.3274 25.0048 12.1922 25.005L12.1207 34.6671C12.0518 35.1364 11.7702 35.8834 10.7273 35.8776C10.7742 35.9197 8.04848 35.8573 8.04848 35.8573L7.28413 40.253L12.0798 40.2878C12.9723 40.2954 13.8503 40.3169 14.7123 40.3287L14.6692 46.4519L18.3504 46.4794L18.3945 40.4209C19.4051 40.4492 20.3832 40.4644 21.3381 40.4705L21.2925 46.501L24.9777 46.5275L25.0235 40.4152C31.2216 40.105 35.5692 38.5758 36.1502 32.7618C36.6191 28.0802 34.4307 25.9737 30.9199 25.1035C33.0645 24.0311 34.4143 22.1239 34.1252 18.9278ZM28.8738 31.983C28.8424 36.5588 21.0111 35.9812 18.5136 35.9653L18.5738 27.8525C21.072 27.8713 28.909 27.2102 28.8738 31.983ZM27.2435 20.5243C27.2119 24.6875 20.6811 24.1539 18.6008 24.1389L18.6547 16.7809C20.735 16.796 27.2747 16.1821 27.2435 20.5243Z"
                fill="#F1F2F4"
                data-v-inspector="src/shared/ui/site/sections/s-site-main/s-site-main.vue:29:21"></path>
            </svg>
            {{
              $app.filters.rounded(fundTotalBtc, 2)
            }}
          </div>
          <div class="s-site-fundinfo-dark__item-subtitle">BTC in Reserve Fund</div>
        </div>
        <div class="s-site-fundinfo-dark__item">
          <div class="s-site-fundinfo-dark__item-title">${{
              $app.filters.rounded(fundTotalUsd, 2)
            }}
          </div>
          <div class="s-site-fundinfo-dark__item-subtitle">Assets Under Management</div>
        </div>
      </div>
      <div class="s-site-fundinfo-dark__charts">
        <div class="s-site-fundinfo-dark__chart">
          <w-chart-protection
            v-if="assets?.length"
            title="Protection"
            :assets="assets"
          />
          <div class="caption">Portfolio</div>
          <e-assets v-if="assetsWithBRF?.length" :isExpand="true" :assets="assetsWithBRF"/>
        </div>
        <div class="s-site-fundinfo-dark__chart">
          <w-chart-fund title="Growth" is-total-assets :id="route.params.id"/>
          <w-trades :isExpand="true" :hideView="true"/>
        </div>
      </div>
      <div class="s-site-fundinfo-dark__bottom">
<!--        <Vue3Marquee :duration="50" class="s-site-fundinfo-dark__bottom-items" >-->
<!--          <template v-for="(item, id) in marqueList">-->
<!--            <div :key="id" v-if="item?.value" class="s-site-fundinfo-dark__bottom-elem">-->
<!--              <div class="s-site-fundinfo-dark__bottom-elem-title">{{ item.text }}</div>-->
<!--              <div class="s-site-fundinfo-dark__bottom-elem-text">{{ item.modifyValue }}</div>-->
<!--            </div>-->
<!--          </template>-->
<!--        </Vue3Marquee>-->
        <m-slider
          class="s-site-fundinfo-dark__bottom-items"
          id="s-site-fundinfo-dark__bottom-items"
          :modules="[Autoplay]"
          loop
          :speed="3000"
          :space-between="0"
          slides-per-view="auto"
          :mousewheel="false"
          :looped-slides="0"
          :autoplay="{
            delay: 0,
            disableOnInteraction: false,
          }"
          centeredSlides
          :allowTouchMove="false"
          disableOnInteraction

        >
          <template #slides>
            <swiper-slide class='s-site-fundinfo-dark__bottom-elem' v-for='(item, id) in filteredMarqueList' :key='id'>
              <div class='s-site-fundinfo-dark__bottom-elem-title'>{{ item.text }}</div>
              <div class='s-site-fundinfo-dark__bottom-elem-text' v-html="item.modifyValue"></div>
            </swiper-slide>
          </template>

        </m-slider>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import WChartProtection from '~/src/widgets/w-chart-protection/w-chart-protection.vue'
import WChartFund from '~/src/widgets/w-chart-fund/w-chart-fund.vue'
import WTrades from '~/src/widgets/w-trades/w-trades.vue'
import EAssets from '~/src/entities/e-assets/e-assets.vue'
import {useNuxtApp} from '#app'
import {Centrifuge} from 'centrifuge'
import { onUnmounted, onMounted, computed } from 'vue'
import { Autoplay } from 'swiper'
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'

defineProps({
  items: {
    type: Array,
    default: () => {
      return []
    },
  },
})

const {$app} = useNuxtApp()
const route = useRoute()

const fundTotalBtc = computed(() => {
  return $app.store.assets.fundTotalBtc
})

const centrifuge = ref(null)

const bottomInfo = ref(null)

const priceChange = ref('low')

const assets = computed(() => {
  return $app.store.assets?.items?.filter((item) => item?.symbol !== 'VAULT' && item?.symbol !== 'BRF') || []
})

const assetsWithBRF = computed(() => {
  return $app.store.assets?.items?.filter((item) => item?.symbol !== 'VAULT') || []
})

const fundTotalUsd = computed(() => {
  return $app.store.user.fundTotalUsd
})

const assetsByKey = computed(() => {
  if (!assets.value) return {}
  return assets.value.reduce((acc, item) => {
    acc[item?.symbol] = {
      ...item,
    }
    return acc
  }, {})
})

const dividendByYear = ref(null)
const purchases = computed(() => {
  return $app.store.user.lastPurchases || []
})
const btcUsdt = ref(null)

const getDividendsByYear = async () => {
  await $app.api.eth.statisticEth
    .getDividendsByYear({
      year: 2023,
    })
    .then((dealsResponse) => {
      dividendByYear.value = dealsResponse?.data?.sum_dividends
    })
}

const enableMarquee = ref(false)
const marqueList = computed(() => [
  {
    text: 'Bitcoin ETF Dividends Paid in 2023',
    value: $app.filters.rounded($app.store.user.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2),
    modifyValue: `$${$app.filters.rounded($app.store.user.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2)}`,
  },
  {
    text: 'Total Bitcoin ETF Dividends Paid',
    value: $app.filters.rounded($app.store.user.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2),
    modifyValue: `$${$app.filters.rounded($app.store.user.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2)}`,
  },
  {
    text: 'USDT APY',
    value: $app.filters.rounded(assetsByKey.value?.USDT?.apy, 2),
    modifyValue: `${$app.filters.rounded(assetsByKey.value?.USDT?.apy, 2)}%`,
  },
  {
    text: 'BTC AI APY',
    value: $app.filters.rounded(assetsByKey.value?.BAA?.apy, 2),
    modifyValue: `${$app.filters.rounded(assetsByKey.value?.BAA?.apy, 2)}%`,
  },
  {
    text: 'BTC Options APY',
    value: $app.filters.rounded(assetsByKey.value?.BOA?.apy, 2),
    modifyValue: `${$app.filters.rounded(assetsByKey.value?.BOA?.apy, 2)}%`,
  },
  {
    text: 'BTC Futures APY',
    value: $app.filters.rounded(assetsByKey.value?.FBA?.apy, 2),
    modifyValue: `${$app.filters.rounded(assetsByKey.value?.FBA?.apy, 2)}%`,
  },
  {
    text: 'Spot BTC TD APY',
    value: $app.filters.rounded(assetsByKey.value?.SBA?.apy, 2),
    modifyValue: `${$app.filters.rounded(assetsByKey.value?.SBA?.apy, 2)}%`,
  },
  {
    text: 'Latest trade',
    value: $app.store.user.latestTrade || $app.filters.rounded($app.store.user.lastTrades?.find((item) => item.type === 'close')?.result_amount, 2),
    modifyValue: `$${$app.filters.rounded(
      $app.store.user.latestTrade || $app.store.user.lastTrades?.find((item) => item.type === 'close')?.result_amount,
      2,
    )}`,
  },
  {
    text: 'BTC/USDT',
    value: $app.filters.rounded(btcUsdt.value, 2),
    modifyValue: `$${$app.filters.rounded(btcUsdt.value, 2)}`,
  },
  {
    text: 'Bitcoin ETF Share / USDT',
    value: 1,
    modifyValue: 1,
  },
  {
    text: 'High Yield USDT Staking Balance',
    value: $app.filters.rounded(assetsByKey.value?.USDT?.full_balance, 2),
    modifyValue: `$${$app.filters.rounded(assetsByKey.value?.USDT?.full_balance, 2)}`,
  },
  {
    text: 'BTC AI Arbitrage Balance',
    value: $app.filters.rounded(assetsByKey.value?.BAA?.full_balance, 2),
    modifyValue: `$${$app.filters.rounded(assetsByKey.value?.BAA?.full_balance, 2)}`,
  },
  {
    text: 'Bitcoin Reserve Fund Balance',
    value: fundTotalBtc.value,
    modifyValue: `${$app.filters.convertValue($app.filters.rounded(fundTotalBtc.value, 5)) }`,
  },
  {
    text: 'BTC Options TD Balance',
    value: $app.filters.rounded(assetsByKey.value?.BOA?.full_balance, 2),
    modifyValue: `$${$app.filters.rounded(assetsByKey.value?.BOA?.full_balance, 2)}`,
  },
  {
    text: 'BTC Futures TD Balance',
    value: $app.filters.rounded(assetsByKey.value?.BFT?.full_balance, 2),
    modifyValue: `$${$app.filters.rounded(assetsByKey.value?.BFT?.full_balance, 2)}`,
  },
  {
    text: 'BTC Spot TD Balance',
    value: $app.filters.rounded(assetsByKey.value?.BST?.full_balance, 2),
    modifyValue: `$${$app.filters.rounded(assetsByKey.value?.BST?.full_balance, 2)}`,
  },
  {
    text: 'Total AUM',
    value: $app.filters.rounded(fundTotalUsd.value, 2),
    modifyValue: `$${$app.filters.rounded(fundTotalUsd.value, 2)}`,
  },
  {
    text: 'Latest Bitcoin ETF Share Issuance',
    value: $app.filters.rounded(purchases.value?.[0]?.amount, 2),
    modifyValue: `$${$app.filters.rounded(purchases.value?.[0]?.amount, 2)}`,
  },
])


const filteredMarqueList = computed(() => {
  const arr = marqueList.value.filter((el) => el?.value)
  return [...arr, ...arr]
})

setTimeout(()=>[
  enableMarquee.value = true
], 4000)
const centrifugeURL = process.dev ? 'wss://wss.stage.techetf.org/connection/websocket' : 'wss://wss.bitcoinetf.org/connection/websocket'

onMounted(async () => {
  await getDividendsByYear()

  await useFetch(`https://api3.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT`).then((resp) => {
    btcUsdt.value = resp?.data?._value?.lastPrice
  })

  bottomInfo.value = await useFetch(
    `https://api3.binance.com/api/v3/ticker/24hr?symbols=["ETHBTC","ETHUSDT","BTCUSDT","USDTRON","DOGEBTC"]`,
  )

  const config = useRuntimeConfig()
  const centrifugeURL = config.public.WS_URL
  const centrifugeToken = config.public.WS_TOKEN

  priceChange.value = centrifuge.value = new Centrifuge(centrifugeURL, {
    token: $app.store.auth.websocketToken ? $app.store.auth.websocketToken : centrifugeToken
  })

  centrifuge.value.connect()

  const sub = centrifuge.value.newSubscription('event_asset')

  sub
    .on('publication', function (ctx) {
      if (assets.value?.length) {
        const updatedAssetIndex = assets.value.findIndex((asset) => asset.uuid === ctx.data.message.uuid)
        if (~updatedAssetIndex) {
          assets.value[updatedAssetIndex].full_balance = ctx.data.message.full_balance
          assets.value[updatedAssetIndex].apy = ctx.data.message.apy
        }
      }
    })
    .subscribe()
})

const getPriceChange = (value) => {
  return value?.lastPrice < value?.prevClosePrice ? 'low' : 'high'
}

onUnmounted(() => {
  centrifuge.value?.disconnect()
})
</script>

<style src="./s-site-fundinfo-dark.scss" lang="scss"/>
