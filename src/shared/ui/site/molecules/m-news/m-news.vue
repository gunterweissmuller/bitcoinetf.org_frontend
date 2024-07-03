<template>
  <div class="m-news">
    <div class="m-news__wrap">
      <m-slider
        v-show="news?.length"
        :id="id"
        :modules="[Scrollbar]"
        :navigation="false"
        :scrollbar="true"
        slides-per-view="auto"
        :space-between="24"
        :slides-length="news.length"
        class="m-news__slider"
      >
        <template #slides>
          <swiper-slide v-for="(event, idx) in news" :key="idx" class="m-news__slide">
            <nuxt-link :to="`${!isEducation ? `/blog/${event.slug}` : `/bitcoin-education/${event.slug}`} `" class="m-news__content">
              <div class="m-news__img">
                <img v-if="event.img" :src="event.img" alt="" />
              </div>
              <div class="m-news__info">
                <div v-if="event.category" class="m-news__category">{{ event.category }}</div>
                <div v-if="event.date" class="m-news__date">{{ event.date }}</div>
                <div class="m-news__title">{{ event.title }}</div>
                <div class="m-news__text">{{ event.text }}</div>
              </div>
            </nuxt-link>
          </swiper-slide>
        </template>
      </m-slider>
      <e-empty-data v-if="!news?.length" title="You don’t have any news yet." />
    </div>
  </div>
</template>

<script setup lang="ts">
import EEmptyData from '~/src/entities/e-empty-data/e-empty-data.vue'
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'
import { Scrollbar } from 'swiper/modules'

defineProps({
  news: {
    type: Array,
    default: () => {
      return [];
    },
  },
  id: {
    type: String,
    default: '',
  },
  isEducation: {
    type: Boolean,
    default: false,
  },
});
</script>

<style src="./m-news.scss" lang="scss" />
