<template>
  <section class="s-site-referrals-id" :data-name="data.name">
    <div class="s-site-referrals-id__img">
      <img :src="data.img" alt="" />
    </div>
    <div class="l-site-dark">
      <div class="s-site-referrals-id__wrapper">
        <div class="s-site-referrals-id__left">
          <h1 v-html="data.title" class="s-site-referrals-id__title title-site-h1" />
          <nuxt-link :to="isUserAuthenticated ? '/personal/wallet/referrals' : '/personal/registration'">
            <a-button :text="data.btn.text" />
          </nuxt-link>
        </div>
        <div class="s-site-referrals-id__info">
          <div class="s-site-referrals-id__info-title">{{ data.info.title }}</div>
          <div v-html="data.info.text" class="s-site-referrals-id__info-text" />
          <nuxt-link :to="isUserAuthenticated ? '/personal/wallet/referrals' : '/personal/registration'">
            <a-button :text="data.btn.text" />
          </nuxt-link>
        </div>
      </div>
      <m-slider :modules="[]" :navigation="false" :slides-per-view="slidesCount" :space-between="4">
        <template #slides>
          <swiper-slide class="s-site-referrals-id__slide" v-for="(slide, id) in data.slides" :key="id">
            <div class="s-site-referrals-id__slide-top">
              <div class="s-site-referrals-id__slide-title">{{ slide.title }}</div>
            </div>
            <div class="s-site-referrals-id__slide-img">
              <img :src="slide.img" />
            </div>
            <div class="s-site-referrals-id__slide-bottom">
              <div class="s-site-referrals-id__slide-subtitle" v-if="slide.subtitle">{{ slide.subtitle }}</div>
              <div class="s-site-referrals-id__slide-text">{{ slide.text }}</div>
            </div>
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
import { useWindowSize } from '@vueuse/core'
import { useNuxtApp } from '#app'
const { $app } = useNuxtApp()

defineProps<{
  data: any
  files: any
}>()
const isUserAuthenticated = computed(() => {
  return $app.store.auth.isUserAuthenticated
})
const { width } = useWindowSize()

const slidesCount = computed(() => {
  return width.value < 1099 ? 'auto' : 3
})
</script>

<style src="./s-site-referrals-id.scss" lang="scss" />
