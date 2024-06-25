<template>
  <header
    v-if="route.name !== 'personal-kyc' && !(isFundPage && (isLaptop || isDesktop))"
    :class="['w-header', { 'w-header--no-indent': route.path.includes('analytics') || route.path.includes('wallet'), 'w-header--empty': route.name === 'personal-purchase', 'w-header--wallet' : route.path.includes('wallet')}]"
  >
    <div class='w-header__wrap'>
      <div class='w-header__head'>
        <div class='w-header__head__back' v-if='routeNames[route.name]?.urlToBack' @click='$router.back()'>
          <a-icon width='24' :name='Icon.MonoChevronLeft' />
        </div>
        <div v-if='isVisibleTitle' class='w-header__title' :class="{'w-header__title--left': route.name === 'personal-buy-shares' || route.name === 'personal-earnings'}">
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
            v-if='routeNames?.[route?.name]?.info && !(isLaptop || isDesktop)'
            class='w-header__img'
            :class="{'w-header__img--left': route.name === 'personal-buy-shares' || route.name === 'personal-earnings'}"
            :name='Icon.MonoInfo'
            @click='openModal'
          />
        </div>

        <e-breadcrumbs
          v-if='isVisibleBreadcrumbs'
          :key='route.name'
          :routes='routeNames'
          :breadcrumbs='routeNames?.[route.name]?.customBreadcrumbs'
          title='Fund'
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
        <div class="w-header__live">
          <a-live />
        </div>
        <w-stats-marquee />
      </div>

      <e-fund-tabs :tab-bars='tabs' />

      <m-slider
        id="assets"
        slides-per-view="auto"
        :space-between="16"
        v-if="route.name === 'personal-assets-symbol' || route.name === 'personal-assets'"
      >
        <template #slides>

          <swiper-slide
            class="w-header__slide"
            v-for="(asset, id) in navAssets"
            :key="id"
          >
            <nuxt-link
              class="w-header__slide-link"
              :class="{ active: activeAsset(asset.symbol) }"
              :to="{ name: 'personal-assets-symbol', params: { symbol: asset.symbol.toLowerCase() } }"
            >
              <div class="w-header__slide-content">
                <div :class="['w-header__type-symbol', `bg--${asset.symbol.toLowerCase()}`]"></div>
                <span class="w-header__type-name">
                  {{ asset.symbol }}
                </span>
              </div>
            </nuxt-link>
          </swiper-slide>

        </template>
      </m-slider>
    </div>
  </header>
  <e-page-info-modal v-if='routeNames?.[route?.name]?.info' v-model='isOpenModal'>
    <component :is='routeNames[route.name].info' />
  </e-page-info-modal>

</template>

<script setup lang='ts'>
import { useRoute } from 'vue-router'
import ALive from '~/src/shared/ui/atoms/a-live/a-live.vue';
import EHeaderLinks from '~/src/entities/e-header-links/e-header-links.vue'
import EBreadcrumbs from '~/src/entities/e-breadcrumbs/e-breadcrumbs.vue'
import useMediaDevice from '~/composables/useMediaDevice'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import { useNuxtApp } from '#app'
import WStatsMarquee from '~/src/widgets/w-stast-marquee/w-stats-marquee.vue';
import EPageInfoModal from '~/src/entities/e-page-info-modal/e-page-info-modal.vue'
import EPageInfoEarnings from '~/src/entities/e-page-info-modal/ui/e-page-info-earnings.vue'
import EPageInfoActivity from '~/src/entities/e-page-info-modal/ui/e-page-info-activity.vue'
import EPageInfoWallet from '~/src/entities/e-page-info-modal/ui/e-page-info-wallet.vue'
import EPageInfoBuyShares from '~/src/entities/e-page-info-modal/ui/e-page-info-buy-shares.vue'
import EPageInfoStatements from '~/src/entities/e-page-info-modal/ui/e-page-info-statements.vue'
import { nextTick, onMounted, computed } from 'vue'
import EFundTabs from '~/src/features/e-fund-tabs/e-fund-tabs.vue'
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'
import { auth } from '~/src/app/store/auth';
import { useAbility } from '@casl/vue';
// import { Centrifuge } from 'centrifuge'

const { $app } = useNuxtApp()
const authStore = auth()

const route = useRoute();
const { can, rules } = useAbility()

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
  'personal-assets': {
    title: 'Assets',
    titleCrumb: 'Assets',
    breadcrumbs: false,
  },
  'personal-assets-symbol': {
    title: 'Assets',
    titleCrumb: 'Assets',
    breadcrumbs: false,
  },
  'personal-more': {
    title: 'Profile',
    titleCrumb: 'Profile',
    breadcrumbs: false,
    // urlToBack: 'personal-protection',
  },
  'personal-buy-shares-payment': {
    title: 'Payment',
    titleCrumb: 'Payment',
    breadcrumbs: false,
    urlToBack: 'personal-buy-shares',
  },
  'personal-more-referrals': {
    title: 'Referrals',
    titleCrumb: 'Referrals',
    breadcrumbs: true,
    urlToBack: 'personal-more',
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
    urlToBack: 'personal-protection',
    info: EPageInfoBuyShares,
  },
  // FIX THIS
  'personal-fund': {
    title: 'Shareholders',
    titleCrumb: 'Fund',
    breadcrumbs: false,
  },
  'personal-protection': {
    title: 'Fund',
    titleCrumb: 'Protection',
    breadcrumbs: false,
  },
  'personal-portfolio': {
    title: 'Fund',
    titleCrumb: 'Portfolio',
    breadcrumbs: false,
  },
  'personal-shareholders': {
    title: 'Fund',
    titleCrumb: 'Shareholders',
    breadcrumbs: false,
  },
  'personal-wallet': {
    title: 'Wallet',
    titleCrumb: 'Wallet',
    breadcrumbs: false,
    info: EPageInfoWallet,
  },
  'personal-dividends': {
    title: 'Wallet',
    titleCrumb: 'Dividends',
    breadcrumbs: false,
    info: EPageInfoWallet,
  },
  'personal-etfs': {
    title: 'Wallet',
    titleCrumb: 'ETFs',
    breadcrumbs: false,
    info: EPageInfoWallet,
  },
  'personal-kyc': { title: 'Kyc', breadcrumbs: false },
  'personal-more-support': { title: 'Support',titleCrumb: 'Support',  breadcrumbs: true,  urlToBack: 'personal-more' },
  'personal-earnings': {
    title: 'Dividends',
    titleCrumb: 'Dividends',
    breadcrumbs: false,
    info: EPageInfoEarnings,
  },
  'personal-analytics-performance-latest-trades': {
    title: 'Last successful trades',
    titleCrumb: 'Last successful trades',
    breadcrumbs: true,
    urlToBack: 'personal-protection',
    customBreadcrumbs: [(!(isLaptop.value || isDesktop.value) ? 'personal-protection' : 'personal-fund'), 'Last successful trades'],
  },
  'personal-analytics-shareholders-latest-purchases': {
    title: 'Latest purchases',
    titleCrumb: 'Latest purchases',
    breadcrumbs: true,
    urlToBack: 'personal-shareholders',
    customBreadcrumbs: [(!(isLaptop.value || isDesktop.value) ? 'personal-shareholders' : 'personal-fund'), 'Latest Purchases'],
  },
  'personal-analytics-shareholders-top-shareholders': {
    title: 'Top 100 shareholders',
    titleCrumb: 'Top 100 shareholders',
    breadcrumbs: true,
    urlToBack: 'personal-shareholders',
    customBreadcrumbs: [(!(isLaptop.value || isDesktop.value) ? 'personal-shareholders' : 'personal-fund'), 'Top 100 Shareholders'],
  },
  'personal-analytics-portfolio-latest-activity': {
    title: 'Latest activity',
    titleCrumb: 'Latest activity',
    breadcrumbs: true,
    urlToBack: 'personal-portfolio',
    info: EPageInfoActivity,
    customBreadcrumbs: [(!(isLaptop.value || isDesktop.value) ? 'personal-protection' : 'personal-fund'), 'Latest Activity'],
  },
  'personal-more-statements': {
    title: 'Statements',
    titleCrumb: 'Statements',
    breadcrumbs: true,
    urlToBack: 'personal-more',
    info: EPageInfoStatements,
  },
  'personal-asset-id': {
    title: $app.store.asset?.name,
    titleCrumb: $app.store.asset?.name,
    breadcrumbs: true,
    urlToBack: 'personal-protection',
    customBreadcrumbs: ['personal-fund', $app.store.asset?.name || ''],
  },
}))

const fundLinks = {
  title: 'Fund',
  links: [
    { text: 'Portfolio', name: 'personal-portfolio' },
    { text: 'Protection', name: 'personal-protection' },
    { text: 'Shareholders', name: 'personal-shareholders' },
  ],
}

const isFundPage = computed<boolean>(() => fundLinks.links.find(el => el.name === route.name || 'personal-fund' === route.name))

const walletLinks = {
  title: 'Wallet',
  links: [
    { text: 'Dividends', name: 'personal-dividends' },
    { text: 'ETFs', name: 'personal-etfs' },
    // { text: 'Bonus', name: 'personal-bonus' },
  ],
}
const assetsLinks = {
  title: 'Assets',
  links: [],
}

const linksList = {
  'personal-fund': fundLinks,
  'personal-protection': fundLinks,
  'personal-portfolio': fundLinks,
  'personal-shareholders': fundLinks,
  'personal-wallet': walletLinks,
  'personal-dividends': walletLinks,
  'personal-assets': assetsLinks,
  'personal-etfs': walletLinks,
}

const isVisibleInfo = computed(() => {
  return (
    route.name === 'personal-fund' ||
    route.name === 'personal-protection' ||
    route.name === 'personal-shareholders' ||
    route.name === 'personal-portfolio' ||
    route.name === 'personal-assets' ||
    route.name === 'personal-assets-symbol'

  )
})

const isVisibleLinks = computed<boolean>(
  () =>
    !routeNames.value?.[route?.name]?.breadcrumbs &&
    linksList?.[route?.name]?.links &&
    (isLaptop.value || isDesktop.value)
)

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
    (route.name === 'personal-dividends' || route.name === 'personal-referrals' )
  )
})

const isOpenModal = ref(false)

const dividendByYear = ref(null)

const closePopper = () => {
  showBuyPopper.value = false
}

const navAssets = computed(() => {
  return $app.store.assets.items.filter((item) => item?.symbol !== 'VAULT');
});

const activeAsset = (symbol : string) : boolean => {
  if (route.name === 'personal-assets-symbol') {
    return route.params.symbol === symbol.toLowerCase()
  }
  return false;
};

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
  if (route.path.includes('fund')) {
    return [
      { text: 'Portfolio', name: 'personal-portfolio' },
      { text: 'Protection', name: 'personal-protection' },
      { text: 'Shareholders', name: 'personal-shareholders' },
    ]
  }

  if (route.path.includes('wallet')) {
    return [
      { text: 'Dividends', name: 'personal-dividends' },
      { text: 'ETFs', name: 'personal-etfs' },
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
const fetchDemoUserToken = async () => {
  try {
    const {data} =  await $app.api.eth.auth.getDemoUserToken()
    authStore.setTokens(data)
  } catch (error) {
    console.error(error);
  }
}
onMounted(async () => {
  if (can('readonly', 'demo')){
    await fetchDemoUserToken()
  }
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
