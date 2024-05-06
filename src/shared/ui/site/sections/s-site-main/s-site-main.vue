<template>
  <section class="s-site-main">
    <div class="l-site-dark">
      <div class="s-site-main__wrapper-title">
        <h1 class="s-site-main__title s-site-main__title--h1-lowercase">WE MAKE BITCOIN ETFs ACCESSIBLE FOR ALL</h1>
        <p class="s-site-main__title_info">
          Buy Bitcoin ETFs that pay dividends:<br />
          choose to earn
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
          BTC.<br />
          Dividends Distributed Daily.<br />
          42%-100%+ Earnings on Your Investment.<br />
          Contractually Guaranteed.
        </p>
        <div class="s-site-main__title_buttons_wrap">
          <button @click="scrollToSection" class="s-site-main__learn_more_button">Learn more</button>
          <button @click="clickLaunch" class="s-site-main__launch_app_button">
            <NuxtImg
              class="s-site-main__title_icon aspect-square w-[18px]"
              src="/img/icons/colorful/external-link.svg"
              width="18"
              height="18"
              loading="lazy"
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
      <s-site-marquee :data="marqueeData" />
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

defineProps<{
  data: any
  files?: any
}>()

const { $app } = useNuxtApp()
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

function clickLaunch() {
  window.open('/personal/registration', '_blank').focus()
}

onMounted(async () => {
  await getBtcValue()
})

const marqueeData = {
  low_cards: [
    {
      link: '/#',
      img: '/img/icons/colorful/yahoo.svg',
    },
    {
      link: '/#',
      img: '/img/icons/colorful/bloomberg.svg',
    },
    {
      link: '/#',
      img: '/img/icons/colorful/coindesk.svg',
    },
    {
      link: '/#',
      img: '/img/icons/colorful/cointelegraph.svg',
    },
  ],
}
</script>

<style src="./s-site-main.scss" lang="scss" />
