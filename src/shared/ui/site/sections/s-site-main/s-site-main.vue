<template>
  <section class="s-site-main">
    <div class="l-site-dark">
      <div class="s-site-main__wrapper-title">
        <h1 class="s-site-main__title title-site-h1">WE MAKE BITCOIN ETFS ACCESSIBLE FOR ALL</h1>
        <p class="s-site-main__title_info">
          Buy Bitcoin ETFs that pays dividends: choose to earn
          <NuxtImg
            class="s-site-main__title_icon aspect-square w-[18px]"
            src="/img/icons/colorful/usdt.svg"
            width="18"
            height="18"
            loading="lazy"
          />
          USDT <br />
          or
          <NuxtImg
            class="s-site-main__title_icon aspect-square w-[18px]"
            src="/img/icons/colorful/bitcoin.svg"
            width="18"
            height="18"
            loading="lazy"
          />
          BTC. Dividends Distributed Daily & Contractually Guaranteed,<br />
          with 42%-100%+ Earnings on Your Investment.
        </p>
        <div class="s-site-main__title_buttons_wrap">
          <button @click="scrollToSection" class="s-site-main__learn_more_button">Learn more</button>
          <button @click="$router.push('/personal/registration')" class="s-site-main__launch_app_button">
            <NuxtImg
              class="s-site-main__title_icon aspect-square w-[18px]"
              src="/img/icons/colorful/external-link.svg"
              width="18"
              height="18"
              loading="lazy"
            />
            Launch App
          </button>
        </div>
      </div>
    </div>

    <NuxtImg
      style="position: absolute; bottom: -118px; height: 500px"
      class="s-site-main__title_icon section-left-img aspect-square w-[584px]"
      src="img/site-dark/s-site-main/1.png"
      loading="lazy"
    />
    <div class="s-site-main__line-gradient" style="position: absolute; bottom: -118px"></div>

    <NuxtImg
      style="position: absolute; bottom: -88px; height: 500px; right: 0"
      class="s-site-main__title_icon right-icon aspect-square w-[413px]"
      src="/img/main-section-right.png"
      loading="lazy"
    />
    <div class="s-site-main__line-gradient" style="position: absolute; bottom: -88px; right: 0"></div>
  </section>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'
import { computed, ref } from 'vue'
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'
import MProfitCalculator from '~/src/shared/ui/molecules/m-profit-calculator/m-profit-calculator.vue'

defineProps<{
  data: any
  files: any
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
  return $app.store.user.statistic
})

const fundTotalUsd = computed(() => {
  return $app.store.user.fundTotalUsd
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

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  })
}

onMounted(async () => {
  await getBtcValue()
})
</script>

<style src="./s-site-main.scss" lang="scss" />
