<template>
  <div class="w-news">
    <div class="w-news__head">
      <div class="w-news__head-title">Latest news</div>
    </div>
    <div class="w-news__wrap">
      <m-slider
        v-show="news?.length"
        id="news-performance"
        :modules="[]"
        :navigation="false"
        slides-per-view="auto"
        :space-between="16"
        class="w-news__slider"
      >
        <template #slides>
          <swiper-slide v-for="(event, idx) in news" :key="idx" class="w-news__slide">
            <div class="w-news__content">
              <div class="w-news__content-pic">
                <img v-if="event.image_url" :src="event.image_url" alt="" />
              </div>
              <div class="w-news__info">
                <div class="w-news__info-date">{{ $app.filters.dayjs(event.timestamp).format('MMMM D') }}</div>
                <div class="w-news__info-title">{{ event.content }}</div>
                <!--  <div class="w-news__info-text"></div>-->
              </div>
            </div>
          </swiper-slide>
        </template>
      </m-slider>
      <e-empty-data v-if="!news?.length" title="You don’t have any news yet." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'
import EEmptyData from '~/src/entities/e-empty-data/e-empty-data.vue'

const { $app } = useNuxtApp()

const news = computed(() => {
  return $app.store.user.news
})
</script>

<style src="./w-news.scss" lang="scss" />
