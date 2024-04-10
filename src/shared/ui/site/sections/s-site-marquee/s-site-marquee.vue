<template>
  <div class="s-site-marquee">
    <div :class="[{ 's-site-marquee-bg': isBackground }]"></div>

    <div class="s-site-marquee__wrapper">
      <m-slider
        id="s-site-marquee-slider"
        :modules="[Autoplay]"
        loop
        :speed="5000"
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
          <swiper-slide class="s-site-marquee__item" v-for="(item, id) in marqueList" :key="id">
            <a :href="item.link" target="_blank">
              <img :src="item.img" />
            </a>
          </swiper-slide>
        </template>
      </m-slider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Autoplay } from 'swiper'
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'

const props = withDefaults(
  defineProps<{
    data: any
    files: any
    isBackground: boolean
  }>(),
  {
    data: [],
    files: [],
    isBackground: true,
  },
)

const marqueList = computed(() => {
  return [...props.data.low_cards, ...props.data.low_cards, ...props.data.low_cards]
})
</script>

<style src="./s-site-marquee.scss" lang="scss" />
