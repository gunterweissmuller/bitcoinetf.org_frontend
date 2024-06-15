<template>
  <section class="s-site-fund" data-name="Portfolio">
    <div class="l-site-dark">
      <h2 class="s-site-fund__title title-site-h1">FUND’S PORTFOLIO</h2>
      <m-slider
        id="fund"
        :modules="[Scrollbar]"
        :navigation="false"
        :scrollbar="true"
        slides-per-view="auto"
        :space-between="4"
        :slides-length="assets.length"
      >
        <template #slides>
          <swiper-slide class="s-site-fund__slide" v-for="(asset, id) in assets" :key="id">
            <div class="s-site-fund__top">
              <div class="s-site-fund__top-title">{{ asset.name }}</div>
              <!-- <div class="s-site-fund__apy" v-if="asset.symbol !== 'BRF'">
                <div class="s-site-fund__apy-percents">{{ $app.filters.rounded(asset?.apy, 2) }}%</div>
                <div class="s-site-fund__apy-text">APY</div>
              </div> -->
            </div>
            <div class="s-site-fund__content">
              <div class="s-site-fund__ticker">
                <div class="s-site-fund__label">Ticker</div>
                <div class="s-site-fund__ticker-content">
                  <div :class="['s-site-fund__ticker-icon', `bg--${asset.symbol.toLowerCase()}`]"/>
                  <div
                    :class="[
                      's-site-fund__ticker-abbr',
                      `bg--${asset.symbol.toLowerCase()}-color`,
                      `bg--${asset.symbol.toLowerCase()}-bg`,
                    ]"
                  >
                    {{ asset.symbol }}
                  </div>
                </div>
              </div>

              <div class="s-site-fund__img">
                <img :src="`/img/site-dark/s-site-fund/${asset.symbol.toLowerCase()}.png`"/>
              </div>
            </div>
            <div class="s-site-fund__about">
              <div class="s-site-fund__about-title">About asset</div>
              <div v-if="asset.description" v-html="asset.description" class="s-site-fund__about-text"/>
            </div>

            <div :class="[{'s-site-fund__drag-hide': !isDrag}]" v-if="id === 0" class="s-site-fund__drag">
              <div class="s-site-fund__drag-wrapper">
                <NuxtImg src="/img/icons/mono/arrow.svg" class="s-site-fund__drag-arrow" alt="arrow" />
                drag
                <NuxtImg src="/img/icons/mono/arrow.svg" class="s-site-fund__drag-arrow s-site-fund__drag-arrow-reverse" alt="arrow" />
              </div>
            </div>
          </swiper-slide>
        </template>
      </m-slider>
    </div>
  </section>
</template>

<script setup lang="ts">
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import {SwiperSlide} from 'swiper/vue'
import {Scrollbar} from 'swiper/modules'
import {computed, ref} from 'vue'
import {useNuxtApp} from '#app'

defineProps<{
  data: any
  files: any
}>()

const {$app} = useNuxtApp()

const assets = computed(() => {
  return $app.store.assets.items.filter((item) => item?.symbol !== 'VAULT' && item?.symbol !== 'BRF' )
});

const isDrag = ref(true);

const handleScroll = (event) => {
  const element = document.querySelector(".s-site-fund");
  const elementPosition = element.offsetTop - (element.offsetHeight * 0.35);
  const toTop = window.pageYOffset ? window.pageYOffset : document.body.scrollTop;

  //

  if(toTop >= elementPosition) {
    setTimeout(() => {
      isDrag.value = false;
    },5000);
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll',handleScroll);
})

</script>

<style src="./s-site-fund.scss" lang="scss"/>
