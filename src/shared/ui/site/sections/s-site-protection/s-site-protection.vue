<template>
  <section class="s-site-protection" :data-name="data.name">
    <div class="s-site-protection__wrapper">
      <h2 class="s-site-protection__title title-site-h2">{{ data.title }}</h2>
      <div class="s-site-protection__content">
        <div class="s-site-protection__message">
          <div class="s-site-protection__message-text">{{ data.message }}</div>
          <div class="s-site-protection__message-arrow">
            <img src="/img/site-dark/s-site-protection/arrow.svg"/>
          </div>
        </div>
        <m-slider
          :modules="[]"
          :navigation="false"
          slides-per-view="auto"
        >
          <template #slides>
            <swiper-slide class="s-site-protection__info">
              <div class="s-site-protection__info-title">{{ data.info_1.title }}</div>
              <div class="s-site-protection__info-text" v-html="data.info_1.text"></div>
            </swiper-slide>
            <swiper-slide class="s-site-protection__info">
              <div class="s-site-protection__info-title">{{ data.info_2.title }}</div>
              <div class="s-site-protection__info-text" v-html="data.info_2.text"></div>
            </swiper-slide>
          </template>
        </m-slider>
      </div>
      <div class="s-site-protection__img">
        <img :src="data.img"/>
      </div>
    </div>
    <div class="l-site-dark">
      <div class="s-site-protection__points">
        <div class="s-site-protection__point" v-for="(point, id) in data.items" :key="id">
          <div class="s-site-protection__point-number">{{ id + 1 }}</div>
          <div class="s-site-protection__point-info">
            <div class="s-site-protection__point-title">{{ point.title }}</div>
            <div class="s-site-protection__point-text">{{ point.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import {SwiperSlide} from 'swiper/vue'

defineProps<{
  data: any
  files: any
}>()
</script>

<style src="./s-site-protection.scss" lang="scss"/>
