<template>
  <section class="s-site-transparency" :data-name="data.name">
    <div class="s-site-transparency__wrapper">
      <div class="s-site-transparency__wrapper-top">
        <h2 v-html="data.title" class="s-site-transparency__title title-site-h1" />
        <div class="s-site-transparency__info">
          <div v-html="data.text" class="s-site-transparency__info-text" />
          <nuxt-link :to="`/personal/registration`">
            <a-button variant="secondary" text="Become an investor" />
          </nuxt-link>
        </div>
      </div>
      <div class="s-site-transparency__img">
        <img :src="data.img" />
      </div>
      <m-slider
        :modules="[]"
        :navigation="false"
        slides-per-view="auto"
        :space-between="4"
        class="s-site-transparency__items"
      >
        <template #slides>
          <swiper-slide class="s-site-transparency__slide" v-for="(slide, id) in data.slides" :key="id">
            <div class="s-site-transparency__slide-title">{{ slide.title }}</div>
            <div class="s-site-transparency__slide-text">{{ slide.text }}</div>
          </swiper-slide>
        </template>
      </m-slider>
    </div>
  </section>
</template>

<script setup lang="ts">
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'

defineProps<{
  data: any
  files?: any
}>()
</script>

<style src="./s-site-transparency.scss" lang="scss" />
