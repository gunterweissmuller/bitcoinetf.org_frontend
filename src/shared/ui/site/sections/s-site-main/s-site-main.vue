<template>
  <section class="s-site-main">
    <div class="l-site-dark">
      <div class="s-site-main__wrapper-title">
        <h1 class="s-site-main__title s-site-main__title--h1-lowercase">WE MAKE BITCOIN ETFs ACCESSIBLE FOR ALL</h1>
        <p class="s-site-main__title_info">
          Buy Bitcoin ETF that pays dividends: choose to earn
          <NuxtImg
            class="s-site-main__title_icon aspect-square w-[18px]"
            src="/img/icons/colorful/usdt.svg"
            width="18"
            height="18"
            loading="lazy"
          />
          USDT or
          <NuxtImg
            class="s-site-main__title_icon aspect-square w-[18px]"
            src="/img/icons/colorful/bitcoin.svg"
            width="18"
            height="18"
            loading="lazy"
          />
          BTC. Dividends Distributed Daily & Contractually Guaranteed, with 42%-100%+ Earnings on Your Investment.
        </p>
        <div class="s-site-main__title_buttons_wrap">
          <button @click="scrollToSection" class="s-site-main__learn_more_button">Learn more</button>
          <button @click="clickLaunch()" class="s-site-main__launch_app_button">
            <NuxtImg
              class="s-site-main__title_icon aspect-square w-[18px]"
              src="/img/icons/colorful/external-link.svg"
              width="18"
              height="18"
              loading="lazy"
              @click.stop="clickLaunch('_blank')"
            />
            <span>Launch App</span>
          </button>
        </div>
        <m-slider
          :modules="[]"
          :navigation="false"
          slides-per-view="auto"
          :space-between="0"
          class="s-site-main__title-details"
        >
          <template #slides>
            <swiper-slide class="s-site-main__title-detail">
              <div class="s-site-main__title-detail-balance">${{ statistic }}</div>
              <div class="s-site-main__title-detail-name">Total dividends paid</div>
            </swiper-slide>
            <swiper-slide class="s-site-main__title-detail">
              <div class="s-site-main__title-detail-balance">${{ fundTotalUsd }}</div>
              <div class="s-site-main__title-detail-name">Assets Under Management</div>
            </swiper-slide>
          </template>
        </m-slider>
      </div>
    </div>

    <NuxtImg
      style="position: absolute; bottom: 0px; height: 470px"
      class="s-site-main__title_icon section-left-img aspect-square w-[584px]"
      src="img/site-dark/s-site-main/1.png"
      loading="lazy"
    />
    <!-- <div class="s-site-main__line-gradient" style="position: absolute; bottom: -118px"></div> -->

    <NuxtImg
      style="position: absolute; bottom: 0; height: 470px; right: 0"
      class="s-site-main__title_icon right-icon aspect-square w-[413px]"
      src="/img/main-section-right.png"
      loading="lazy"
    />
    <div class="s-site-main__line-gradient" style="position: absolute; bottom: -88px; right: 0"></div>
    <div class="s-site-main__slider-wrapper">
      <!-- <s-site-marquee :data="marqueeData" /> -->
      <s-site-marquee-new :data="marqueeData" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'
import { computed, ref, nextTick } from 'vue'
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'
import MProfitCalculator from '~/src/shared/ui/molecules/m-profit-calculator/m-profit-calculator.vue'
import SSiteMarquee from '../s-site-marquee/s-site-marquee.vue'
import SSiteMarqueeNew from '../s-site-marquee-new/s-site-marquee-new.vue'
import { auth } from '~/src/app/store/auth'

defineProps<{
  data: any
  files?: any
}>()

const { $app } = useNuxtApp()
const router = useRouter()

const authStore = auth()

const btcValue = ref(0)

const fundTotalBtc = computed(() => {
  return $app.store.assets.fundTotalBtc
})

const getBtcValue = async () => {
  $app.api.eth.billingEth.getBtcValue().then((resp) => {
    btcValue.value = resp?.data?.find((item) => item.symbol === 'bitcoin')?.amount
  })
}

const statistic = computed(() => {
  return $app.filters.rounded($app.store.user.statistic?.dividends_earned_btc * $app.store.user.btcValue, 2)
})

const fundTotalUsd = computed(() => {
  return $app.filters.rounded($app.store.user.fundTotalUsd, 0)
})

const scrollToSection = () => {
  const element = document.querySelector('.s-site-how-work')
  let headerOffset
  if (window.innerWidth < 768) {
    headerOffset = 145
  } else {
    headerOffset = 155
  }
  const elementPosition = element.offsetTop
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset

  nextTick(() => {
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  })
}

function clickLaunch(target: string = '_self') {
  const routeData = router.resolve({ name: 'personal-fund' })
  ;(window.open(routeData.href, target) as Window).focus()
}

onMounted(async () => {
  await getBtcValue()
})

const marqueeData = {
  low_cards: [
    {
      link: 'https://www.digitaljournal.com/pr/news/globe-pr-wire/bitcoinetf-org-surpasses-50m-in-assets-under-management-in-its-inaugural-year-exclusively-serving-select-international-markets',
      img: '/marquee/digitaljournal.svg'
    },
    {
      link: 'https://www.benzinga.com/content/36408488/bitcoinetf-org-surpasses-50m-in-assets-under-management-in-its-inaugural-year-exclusively-serving-se',
      img: '/marquee/benzinga.png'
    },
    {
      link: 'https://apnews.com/press-release/marketersmedia/bitcoinetf-org-surpasses-50m-in-assets-under-management-in-its-inaugural-year-exclusively-serving-select-international-markets-ed41cc9cde1250d6767d3972cc0a46cd',
      img: '/marquee/ap.svg'
    },
    {
      link: 'https://markets.businessinsider.com/news/stocks/bitcoinetf-org-surpasses-50m-in-assets-under-management-in-its-inaugural-year-exclusively-serving-select-international-markets-1032931262',
      img: '/marquee/bi.svg'
    },
    {
      link: 'https://pr.newsmax.com/article/BitcoinETForg-Surpasses-dollar50M-in-Assets-Under-Management-in-Its-Inaugural-Year-Exclusively-Serving-Select-International-Markets?storyId=658e58f2f29dad0008f55450',
      img: '/marquee/nm.svg'
    },
    {
      link: 'https://www.streetinsider.com/The+Financial+Capital/BitcoinETF.org+Surpasses+%2450M+in+Assets+Under+Management+in+Its+Inaugural+Year%2C+Exclusively+Serving+Select+International+Markets/22574048.html',
      img: '/marquee/StreetInsider.com.svg'
    },
  ],
}
</script>

<style src="./s-site-main.scss" lang="scss" />
