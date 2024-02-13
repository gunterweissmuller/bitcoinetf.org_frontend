<template>
  <div class="w-asset" v-if="assetData && assetStatistic">
    <div class="w-asset__container">
      <div v-if="!isDesktop" class="w-asset__head">
        <div class="w-asset__head-ticker">Ticker:</div>
        <div class="w-asset__type">
          <div :class="['w-asset__type-pic', `bg--${assetData.symbol.toLowerCase()}`]" />
          <div class="w-asset__type-text">{{ assetData.symbol }}</div>
        </div>
        <div class="w-asset__title">{{ assetData.name }}</div>
        <!--        <div v-if="assetData.symbol !== 'BRF' && assetData.symbol !== 'USDT'" class="w-asset__subtitle">-->
        <!--          Trading Desk-->
        <!--        </div>-->
        <!--        <div class="w-asset__amount">-->
        <!--          <div class="w-asset__amount-title">Total AUM:</div>-->
        <!--          <div class="w-asset__amount-sum">${{ sumText }}</div>-->
        <!--        </div>-->
      </div>
      <a-button
        v-if="!isDesktop && (assetData.symbol === 'BRF' || assetData.symbol === 'USDT')"
        class="w-asset__button"
        size="small"
        :icon="Icon.MonoLink"
        text="View on blockchain"
        @click="viewOnBlockchain(assetData.symbol)"
      />
<!--      <w-chart-fund v-if="assetData.symbol !== 'BRF'" is-top-tabs :id="route.params.id" />-->
      <e-asset-stats :statistic="assetStatistic" :data="assetData" :btc-value="btcValue"
                     :allocation="allocationAsset" />
      <div v-if="!isDesktop" :class="['w-asset__info', 'w-asset__info--full']">
        <div
          ref="blockMoreMobile"
          v-html="assetData.description"
          :class="['w-asset__info-text', { 'w-asset__info-text--full': isShowFullInfo }]"
        />
      </div>
      <w-trades />
      <w-activity />
      <w-news />
    </div>
    <div v-if="isDesktop" class="w-asset__desktop-info">
      <div class="w-asset__head">
        <div class="w-asset__type">
          <div :class="['w-asset__type-pic', `bg--${assetData?.symbol?.toLowerCase()}`]"></div>
          <div class="w-asset__type-text">{{ assetData.symbol }}</div>
        </div>
        <div class="w-asset__title">{{ assetData.name }}</div>
        <!--        <div v-if="assetData.symbol !== 'BRF' && assetData.symbol !== 'USDT'" class="w-asset__subtitle">-->
        <!--          Trading Desk-->
        <!--        </div>-->
        <!--        <div class="w-asset__amount">-->
        <!--          <div class="w-asset__amount-title">Total AUM:</div>-->
        <!--          <div class="w-asset__amount-sum">${{ sumText }}</div>-->
        <!--        </div>-->
      </div>
      <a-button
        v-if="assetData.symbol === 'BRF' || assetData.symbol === 'USDT'"
        class="w-asset__button"
        size="small"
        :icon="Icon.MonoLink"
        text="View on blockchain"
        @click="viewOnBlockchain(assetData.symbol)"
      />
      <div :class="['w-asset__info', 'w-asset__info--full']">
        <div ref="blockMore" v-html="assetData.description" class="w-asset__info-text" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WChartFund from '~/src/widgets/w-chart-fund/w-chart-fund.vue'
import EAssetStats from '~/src/entities/e-asset-stats/e-asset-stats.vue'
import WTrades from '~/src/widgets/w-trades/w-trades.vue'
import WActivity from '~/src/widgets/w-activity/w-activity.vue'
import WNews from '~/src/widgets/w-news/w-news.vue'
import { useNuxtApp, useRoute } from '#app'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import { Icon } from '~/src/shared/constants/icons'
import useMediaDevice from '~/composables/useMediaDevice'
import { useElementSize } from '@vueuse/core'
import { Centrifuge } from 'centrifuge'
import { onUnmounted, ref } from 'vue'

const { $app } = useNuxtApp()

const route = useRoute()

const assetData = ref(null)
const btcValue = ref(0)
const assetStatistic = ref(null)
const isShowFullInfo = ref<boolean>(false)
const showMoreInfo = () => {
  isShowFullInfo.value = !isShowFullInfo.value
}

const getBtcValue = async () => {
  $app.api.eth.billingEth.getBtcValue().then((resp) => {
    btcValue.value = resp?.data?.find((item) => item.symbol === 'bitcoin')?.amount
  })
}

const { isDesktop } = useMediaDevice()

const blockMore = ref(null)
const blockMoreMobile = ref(null)
const { height: HeightDesktop } = useElementSize(blockMore)
const { height: HeightMobile } = useElementSize(blockMoreMobile)

watch(HeightDesktop, (value) => {
  if (value <= 168) {
    isShowFullInfo.value = true
  }
})

watch(HeightMobile, (value) => {
  if (value <= 168) {
    isShowFullInfo.value = true
  }
})

const sumText = computed(() => {
  if (assetData.value?.symbol === 'BRF') {
    return $app.filters.rounded(assetData.value?.incoming_amount_btc * $app.store.user.btcValue, 2)
  }

  return $app.filters.rounded(assetData.value?.full_balance, 2)
})

const assets = computed(() => {
  return $app.store.assets.items
})


const fullBalanceFund = computed(() => {
  return $app.store.assets.fullBalanceFund
})


const allocationAsset = computed(() => {
  updateKey.value++
  if (assetData.value.symbol === 'BRF') {
    return $app.filters.rounded((assetData.value?.incoming_amount_btc * $app.store.user.btcValue / fullBalanceFund.value * 100), 2)
  }


  if (assetData.value.symbol !== 'VAULT' && assetData.value.symbol !== 'BRF') {
    return $app.filters.rounded((assetData.value?.full_balance / fullBalanceFund.value * 100), 2)
  }

  return 0
})



const updateKey = ref(0)
const centrifuge = ref(null)

const config = useRuntimeConfig()
const centrifugeURL = config.public.WS_URL
const centrifugeToken = config.public.WS_TOKEN
const explorerURL = config.public.EXPLORER_API
onMounted(async () => {
  await getBtcValue()
  await $app.api.info.fund
    .getAsset({ uuid: route.params.id })
    .then((assetResponse: any) => {
      assetData.value = assetResponse.data
      assetStatistic.value = assetResponse.statistic
    })
    .catch(() => {
      // Todo: notify something went wrond
    })

  if (assetData.value.symbol !== 'BRF' && assetData.value.symbol !== 'USDT') {
    $app.store.asset.name = `${assetData.value.name}`
  } else {
    $app.store.asset.name = assetData.value.name
  }

  assetStatistic.value.assetActualApy = assets.value.find((el) => el.symbol === assetData.value?.symbol)?.apy || 0



  centrifuge.value = new Centrifuge(centrifugeURL, {
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
          updateKey.value++
          assetStatistic.value.assetActualApy = assets.value.find((el) => el.symbol === assetData.value?.symbol)?.apy || 0
        }
      }
    })
    .subscribe()
})

onUnmounted(() => {
  centrifuge.value?.disconnect()
})

const explorerHostname = `https://${explorerURL}`
const viewOnBlockchain = () => {
  window.open(`${explorerHostname}/account/PccUG4tvCYT8RaaCozjCzRXyxpryAgowJ4`, '_blank')
}
</script>

<style src="./w-asset.scss" lang="scss" />
