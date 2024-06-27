<template>
    <section class="s-site-fund-main-info-dark" data-name="Perfomance">
      <div class="l-site-dark">
        <div class="s-site-fund-main-info-dark__title title-site-h1">REAL TIME FINANCIALS</div>

        <div class="s-site-fund-main-info-dark__bottom-wrapper">
          <a-live />
          <div class="s-site-fund-main-info-dark__bottom">
            <m-slider
              class="s-site-fund-main-info-dark__bottom-items"
              id="s-site-fund-main-info-dark__bottom-items"
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
                <swiper-slide class='s-site-fund-main-info-dark__bottom-elem' v-for='(item, id) in filteredMarqueList' :key='id'>
                  <div class='s-site-fund-main-info-dark__bottom-elem-title'>{{ item.text }}</div>
                  <div class='s-site-fund-main-info-dark__bottom-elem-text' v-html="item.modifyValue"></div>
                </swiper-slide>
              </template>

            </m-slider>
          </div>
        </div>



        <div class="s-site-fund-main-info-dark__items">

          <div class="s-site-fund-main-info-dark__item">
            <div class="s-site-fund-main-info-dark__item-title">${{
                $app.filters.rounded(fundTotalUsd, 0)
              }}
            </div>
            <div class="s-site-fund-main-info-dark__item-subtitle">Assets Under Management</div>
          </div>

        </div>
        <div class="s-site-fund-main-info-dark__charts">
          <div class="s-site-fund-main-info-dark__chart s-site-fund-main-info-dark__chart-gap">
            <w-chart-protection-fund
              v-if="assets?.length"
              title="Earnings per Asset"
              :assets="assets"
            />

          </div>
          <div class="s-site-fund-main-info-dark__chart">
            <w-chart-fund-main title="AUM Growth" is-total-assets :id="route.params.id" type="asset" />
          </div>
        </div>

        <w-trades :isMain="true" :gridTemplate="3" :per-page="6" :hideView="true"/> <!--:isExpand="true"-->
      </div>
    </section>
  </template>

  <script setup lang="ts">
  import WChartProtectionFund from '~/src/widgets/w-chart-protection-fund/w-chart-protection-fund.vue'
  import WChartFund from '~/src/widgets/w-chart-fund/w-chart-fund.vue'
  import WChartFundMain from '~/src/widgets/w-chart-fund-main/w-chart-fund-main.vue'
  import WTrades from '~/src/widgets/w-trades/w-trades.vue'
  import {useNuxtApp} from '#app'
  import {Centrifuge} from 'centrifuge'
  import { onUnmounted, onMounted, computed } from 'vue'
  import { Autoplay } from 'swiper/modules'
  import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
  import { SwiperSlide } from 'swiper/vue'
  import ALive from '~/src/shared/ui/atoms/a-live/a-live.vue'

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

  <style src="./s-site-fund-main-info-dark.scss" lang="scss"/>
