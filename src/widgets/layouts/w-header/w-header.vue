<template>
  <header
    v-if="route.name !== 'personal-kyc'"
    :class="['w-header', { 'w-header--no-indent': route.path.includes('analytics') || route.path.includes('wallet'), 'w-header--empty': route.name === 'personal-purchase' }]"
  >
    <div class='w-header__wrap'>
      <div class='w-header__head'>
        <div class='w-header__head__back' v-if='routeNames[route.name]?.urlToBack' @click='$router.back()'>
          <a-icon width='24' :name='Icon.MonoChevronLeft' />
        </div>
        <p v-if='isVisibleTitle' class='w-header__title' :class="{'w-header__title--left': route.name === 'personal-buy-shares' || route.name === 'personal-earnings'}">
          <div class='w-header__title-container' v-if='routeNames?.[route.name]?.customTitle'>
            {{ routeNames?.[route.name]?.firstTitle }}
            <a-icon :name='Icon.ColorfulBitcoin' />
            {{ routeNames?.[route.name]?.secondTitle }}
          </div>
          <template v-else>
            {{ routeNames?.[route.name]?.title }}
          </template>
          <a-icon
            width='22'
            height='22'
            v-if='routeNames?.[route?.name]?.info'
            class='w-header__img'
            :class="{'w-header__img--left': route.name === 'personal-buy-shares' || route.name === 'personal-earnings'}"
            :name='Icon.MonoInfo'
            @click='openModal'
          />
        </p>

        <e-breadcrumbs
          v-if='isVisibleBreadcrumbs'
          :key='route.name'
          :routes='routeNames'
          :breadcrumbs='routeNames?.[route.name]?.customBreadcrumbs'
          title='Analytics'
        />
        <e-header-links
          v-if='isVisibleLinks'
          :routes-list='linksList?.[route?.name]?.links'
          :title='linksList?.[route?.name]?.title'
          :route-names="routeNames"
          @open-modal="openModal"
        />
      </div>
      <div v-if='isVisibleInfo' id='marquee'>
        <m-slider
          class="w-header__info"
          id="w-header__info-slider"
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
            <swiper-slide class='w-header__item' v-for='(item, id) in filteredMarqueList' :key='id'>
                <div class='w-header__item-title'>{{ item.text }}</div>
                <div class='w-header__item-text' v-html="item.modifyValue"></div>
            </swiper-slide>
          </template>

        </m-slider>
      </div>

      <e-analytics-tabs :tab-bars='tabs' />
    </div>
  </header>
  <e-page-info-modal v-if='routeNames?.[route?.name]?.info' v-model='isOpenModal'>
    <component :is='routeNames[route.name].info' />
  </e-page-info-modal>
</template>

<script setup lang='ts'>
import { useRoute } from 'vue-router'
import EHeaderLinks from '~/src/entities/e-header-links/e-header-links.vue'
import EBreadcrumbs from '~/src/entities/e-breadcrumbs/e-breadcrumbs.vue'
import useMediaDevice from '~/composables/useMediaDevice'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import { useNuxtApp } from '#app'
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import EPageInfoModal from '~/src/entities/e-page-info-modal/e-page-info-modal.vue'
import EPageInfoEarnings from '~/src/entities/e-page-info-modal/ui/e-page-info-earnings.vue'
import EPageInfoAnalytics from '~/src/entities/e-page-info-modal/ui/e-page-info-analytics.vue'
import EPageInfoActivity from '~/src/entities/e-page-info-modal/ui/e-page-info-activity.vue'
import EPageInfoWallet from '~/src/entities/e-page-info-modal/ui/e-page-info-wallet.vue'
import EPageInfoBuyShares from '~/src/entities/e-page-info-modal/ui/e-page-info-buy-shares.vue'
import EPageInfoStatements from '~/src/entities/e-page-info-modal/ui/e-page-info-statements.vue'
import MPopper from '~/src/shared/ui/molecules/m-popper/m-popper.vue'
import { nextTick, onUnmounted, onMounted, computed } from 'vue'
import EAnalyticsTabs from '~/src/features/e-analytics-tabs/e-analytics-tabs.vue'
import { Autoplay } from 'swiper'
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'
// import { Centrifuge } from 'centrifuge'

const { $app } = useNuxtApp()

const route = useRoute()

const { isLaptop, isDesktop, isMobile, isTablet } = useMediaDevice()

const props = withDefaults(
  defineProps<{
    listInfo: any
  }>(),
  {
    listInfo: [],
  },
)

const btcUsdt = ref(null)
const apyValue = ref(14)

const btnPopperText = computed(() => {
  const divSum = $app.store.user.dividends?.usd_amount
  const divSumIn3Years = divSum + divSum * (apyValue.value / 100) * 3
  return `Reinvest Dividends into ${$app.filters.rounded(
    divSum,
    2,
  )} Bitcoin ETF shares. Aim for a combined return of over $${$app.filters.rounded(
    divSumIn3Years,
    2,
  )} in just 1095 days!`
})

const btnPopper = {
  title: 'Boost Your Dividends! 🚀',
  text: btnPopperText.value,
}

const infoList = [
  { title: 'Purchase', text: '$3,475' },
  { title: 'Dividends earned', text: '$13.75' },
  { title: 'Purchase', text: '$3,475' },
  { title: 'Dividends earned', text: '$493.75' },
]

const routeNames = computed(() => ({
  'personal-more': {
    title: 'More',
    titleCrumb: 'More',
    breadcrumbs: false,
    urlToBack: 'personal-performance',
  },
  'personal-buy-shares-payment': {
    title: 'Payment',
    titleCrumb: 'Payment',
    breadcrumbs: false,
    urlToBack: 'personal-buy-shares',
  },
  'personal-more-personal-details': {
    title: 'Personal details',
    titleCrumb: 'Personal details',
    breadcrumbs: true,
    urlToBack: 'personal-more',
  },
  'personal-more-display-currency': {
    title: 'Display currency',
    titleCrumb: 'Display currency',
    breadcrumbs: true,
    urlToBack: 'personal-more',
  },
  'personal-more-change-pass': {
    title: 'Change password',
    titleCrumb: 'Change password',
    breadcrumbs: true,
    urlToBack: 'personal-more',
  },
  'personal-more-theme': {
    title: 'Theme',
    titleCrumb: 'Theme',
    breadcrumbs: true,
    urlToBack: 'personal-more',
  },
  'personal-buy-shares': {
    title: 'Buy ETF Shares',
    firstTitle: 'Buy',
    secondTitle: 'ETF Shares',
    customTitle: true,
    titleCrumb: 'Buy ETF Shares',
    breadcrumbs: false,
    urlToBack: 'personal-performance',
    info: EPageInfoBuyShares,
  },
  'personal-analytics': {
    title: 'Analytics',
    titleCrumb: 'Analytics',
    breadcrumbs: false,
    info: EPageInfoAnalytics,
  },
  'personal-performance': {
    title: 'Analytics',
    titleCrumb: 'Performance',
    breadcrumbs: false,
    info: EPageInfoAnalytics,
  },
  'personal-portfolio': {
    title: 'Analytics',
    titleCrumb: 'Portfolio',
    breadcrumbs: false,
    info: EPageInfoAnalytics,
  },
  'personal-fund': {
    title: 'Analytics',
    titleCrumb: 'Fund',
    breadcrumbs: false,
    info: EPageInfoAnalytics,
  },
  'personal-wallet': {
    title: 'Wallet',
    titleCrumb: 'Wallet',
    breadcrumbs: false,
    // info: EPageInfoWallet,
  },
  'personal-dividends': {
    title: 'Wallet',
    titleCrumb: 'Dividends',
    breadcrumbs: false,
    // info: EPageInfoWallet,
  },
  'personal-referrals': {
    title: 'Wallet',
    titleCrumb: 'Referrals',
    breadcrumbs: false,
    info: EPageInfoWallet,
  },
  'personal-bonus': {
    title: 'Wallet',
    titleCrumb: 'Bonus',
    breadcrumbs: false,
    info: EPageInfoWallet,
  },
  'personal-kyc': { title: 'Kyc', breadcrumbs: false },
  'personal-support': { title: 'Support', breadcrumbs: false },
  'personal-earnings': {
    title: 'Dividends',
    titleCrumb: 'Dividends',
    breadcrumbs: false,
    info: EPageInfoEarnings,
  },
  'personal-analytics-performance-latest-trades': {
    title: 'Latest trades',
    titleCrumb: 'Latest trades',
    breadcrumbs: true,
    urlToBack: 'personal-performance',
  },
  'personal-analytics-fund-latest-purchases': {
    title: 'Latest purchases',
    titleCrumb: 'Latest purchases',
    breadcrumbs: true,
    urlToBack: 'personal-fund',
  },
  'personal-analytics-fund-top-shareholders': {
    title: 'Top 100 shareholders',
    titleCrumb: 'Top 100 shareholders',
    breadcrumbs: true,
    urlToBack: 'personal-fund',
  },
  'personal-analytics-portfolio-latest-activity': {
    title: 'Latest activity',
    titleCrumb: 'Latest activity',
    breadcrumbs: true,
    urlToBack: 'personal-portfolio',
    info: EPageInfoActivity,
  },
  'personal-earnings-statements': {
    title: 'Statements',
    titleCrumb: 'Statements',
    breadcrumbs: true,
    urlToBack: 'personal-earnings',
    info: EPageInfoStatements,
  },
  'personal-asset-id': {
    title: $app.store.asset?.name,
    titleCrumb: $app.store.asset?.name,
    breadcrumbs: true,
    urlToBack: 'personal-performance',
    customBreadcrumbs: ['personal-analytics', $app.store.asset?.name || ''],
  },
}))

const analyticsLinks = {
  title: 'Analytics',
  links: [
    { text: 'Performance', name: 'personal-performance' },
    { text: 'Portfolio', name: 'personal-portfolio' },
    { text: 'Fund', name: 'personal-fund' },
  ],
}

const walletLinks = {
  title: 'Assets',
  links: [
    { text: 'Dividends', name: 'personal-dividends' },
    { text: 'ETFs', name: 'personal-etfs' },
    // { text: 'Referrals', name: 'personal-referrals' },
    // { text: 'Bonus', name: 'personal-bonus' },
  ],
}

const linksList = {
  'personal-analytics': analyticsLinks,
  'personal-performance': analyticsLinks,
  'personal-portfolio': analyticsLinks,
  'personal-fund': analyticsLinks,
  'personal-wallet': walletLinks,
  'personal-dividends': walletLinks,
  'personal-referrals': walletLinks,
  'personal-bonus': walletLinks,
  'personal-etfs': walletLinks,
}

const isVisibleInfo = computed(() => {
  return (
    route.name === 'personal-analytics' ||
    route.name === 'personal-performance' ||
    route.name === 'personal-fund' ||
    route.name === 'personal-portfolio'
  )
})

const isVisibleLinks = computed<boolean>(
  () =>
    !routeNames.value?.[route?.name]?.breadcrumbs &&
    linksList?.[route?.name]?.links &&
    (isLaptop.value || isDesktop.value),
)
console.log(linksList?.[route?.name]?.links, route?.name, linksList?.[route?.name])

const isVisibleBreadcrumbs = computed<boolean>(
  () => routeNames.value?.[route?.name]?.breadcrumbs && (isLaptop.value || isDesktop.value),
)

const isVisibleTitle = computed<boolean>(
  () => isMobile.value || isTablet.value || (!isVisibleLinks.value && !isVisibleBreadcrumbs.value),
)

const showBuyPopper = ref(false)

const isShowBuyPopper = computed<boolean>(() => {
  return (
    (isDesktop.value || isLaptop.value) &&
    $app.store.user.dividends?.usd_amount &&
    (route.name === 'personal-dividends' || route.name === 'personal-referrals' || route.name === 'personal-bonus')
  )
})

const isOpenModal = ref(false)
// const purchases = ref(null)
const purchases = computed(() => {
  return $app.store.user.lastPurchases || []
})
const dividendByYear = ref(null)

const closePopper = () => {
  showBuyPopper.value = false
}

const assets = computed(() => {
  return $app.store.assets.items
})

const totalSum = computed(() => {
  if (!assets.value?.length) return 0
  return assets.value.reduce((sum, item) => {
    sum += item.full_balance
    return sum
  }, 0)
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

const fundTotalBtc = computed(() => {
  return $app.store.assets.fundTotalBtc
})

const marqueList = computed(() => [
  {
    text: 'Bitcoin ETF Dividends Paid in 2023',
    value: $app.filters.rounded($app.store.user?.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2),
    modifyValue: `$${$app.filters.rounded($app.store.user?.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2)}`,
  },
  {
    text: 'Total Bitcoin ETF Dividends Paid',
    value: $app.filters.rounded($app.store.user?.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2),
    modifyValue: `$${$app.filters.rounded($app.store.user?.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2)}`,
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
  return marqueList.value.filter((el) => el?.value)
})

const fundTotalUsd = computed(() => {
  return $app.store.user.fundTotalUsd
})

const getDividendsByYear = async () => {
  await $app.api.eth.statisticEth
    .getDividendsByYear({
      year: 2023,
    })
    .then((dealsResponse) => {
      dividendByYear.value = dealsResponse?.data?.sum_dividends
    })
}

const tabs = computed(() => {
  if (route.path.includes('analytics') || route.path.includes('asset')) {
    return [
      { text: 'Performance', name: 'personal-performance' },
      { text: 'Portfolio', name: 'personal-portfolio' },
      { text: 'Fund', name: 'personal-fund' },
    ]
  }

  if (route.path.includes('wallet')) {
    return [
      { text: 'Dividends', name: 'personal-dividends' },
      { text: 'Referrals', name: 'personal-referrals' },
      { text: 'Bonus', name: 'personal-bonus' },
    ]
  }

  return []
})

const getWalletDividends = async () => {
  $app.api.eth.billingEth
    .getWallet({ type: 'dividends' })
    .then((response: any) => {
      $app.store.user.dividends = response.data
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

onMounted(async () => {
  await getWalletDividends()
  await getDividendsByYear()
  await getLastPayment()
  await useFetch(`https://api3.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT`).then((resp) => {
    btcUsdt.value = resp?.data?._value?.lastPrice
  })

  nextTick(() => {
    showBuyPopper.value = isShowBuyPopper.value
  })
})

watch(
  () => route.path,
  () => {
    showBuyPopper.value = isShowBuyPopper.value
  },
)

const openModal = () => {
  isOpenModal.value = !isOpenModal.value
}
</script>

<style src='./w-header.scss' lang='scss' />
