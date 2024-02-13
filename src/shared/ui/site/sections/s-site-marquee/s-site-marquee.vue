<template>
  <section class="s-site-marquee">
    <div class="l-site-dark">
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
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Autoplay } from 'swiper'
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'


const props = defineProps<{
  data: any
  files: any
}>()


const marqueList = computed(() => {
  return [...props.data.low_cards, ...props.data.low_cards, ...props.data.low_cards]
})
</script>

<style src="./s-site-marquee.scss" lang="scss" />
