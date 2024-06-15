<template>
  <div class="m-guarantees-table__swiper__box">
    <div class="m-guarantees-table__swiper">
      <div class="m-guarantees-table__swiper--properties">
        <div class="m-guarantees-table__swiper__head--properties">BITCOINETF.ORG VS. VOLATILE CRYPTO INVESTMENTS</div>
        <div class="m-guarantees-table__swiper__body--properties">
          <div class="m-guarantees-table__swiper__item--properties">Original investment loss</div>
          <div class="m-guarantees-table__swiper__item--properties">Dividends</div>
          <div class="m-guarantees-table__swiper__item--properties">Accessible for non-U.S market</div>
          <div class="m-guarantees-table__swiper__item--properties">Legal No-Risk Guarantee</div>
          <div class="m-guarantees-table__swiper__item--properties">Smart-Contract Guarantee</div>
          <div class="m-guarantees-table__swiper__item--properties">Blockchain Transparency</div>
        </div>
      </div>
      <m-slider
        class="m-guarantees-table__swiper__items"
        :modules="[Scrollbar]"
        :navigation="false"
        :slides-length="5"
        slides-per-view="auto"
        :space-between="0"
      >
        <template #slides>
          <swiper-slide class="m-guarantees-table__swiper__column">
            <div class="m-guarantees-table__swiper__head">
              <NuxtImg src="/img/main-guarantees-table-title-1.svg" width="220" height="97" />
            </div>
            <div class="m-guarantees-table__swiper__body">
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/alert.svg" width="24" height="24" loading="lazy" />Mid to High Risk
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />0%
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />Limited
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />No
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />No
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />No
              </div>
            </div>
          </swiper-slide>
          <swiper-slide class="m-guarantees-table__swiper__column">
            <div class="m-guarantees-table__swiper__head">
              <NuxtImg src="/img/main-guarantees-table-title-2.svg" width="220" height="97" />
            </div>
            <div class="m-guarantees-table__swiper__body">
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />High Risk
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />0%
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />Limited
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />No
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />No
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />Yes
              </div>
            </div>
          </swiper-slide>
          <swiper-slide class="m-guarantees-table__swiper__column">
            <div class="m-guarantees-table__swiper__head">
              <NuxtImg src="/img/main-guarantees-table-title-3.svg" width="220" height="97" />
            </div>
            <div class="m-guarantees-table__swiper__body">
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />Mid Risk
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />0%
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />Yes
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />No
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/no.svg" width="24" height="24" loading="lazy" />No
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />Yes
              </div>
            </div>
          </swiper-slide>
          <swiper-slide class="m-guarantees-table__swiper__column">
            <div class="m-guarantees-table__swiper__head">
              <NuxtImg src="/img/main-guarantees-table-title-4.svg" width="220" />
            </div>
            <div class="m-guarantees-table__swiper__body">
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />No Risk (Triple
                Protection)
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />14-100%+ dividends
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />Worldwide 🌏
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />Yes
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />Yes
              </div>
              <div class="m-guarantees-table__swiper__item">
                <NuxtImg src="/img/icons/colorful/check.svg" width="24" height="24" loading="lazy" />Yes
              </div>
            </div>
          </swiper-slide>
        </template>
      </m-slider>
    </div>
  </div>
</template>

<script setup lang="ts">
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'
import { Scrollbar } from 'swiper/modules'
</script>

<style src="./m-guarantees-table-swiper.scss"></style>
