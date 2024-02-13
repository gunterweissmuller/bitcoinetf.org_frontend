<template>
  <section class="s-site-welcome" :data-name="data.name">
    <div class="l-site-dark">
      <h2 v-html="data.title" class="s-site-welcome__title title-site-h1"/>
      <div class="s-site-welcome__img">
        <img :src="data.img"/>
      </div>
      <div class="s-site-welcome__info">
        <div v-html="data.text" class="s-site-welcome__info-text"/>
        <nuxt-link :to="`/weloverussia`" v-if="!isLanding">
          <a-button text="Купить ETF за рубли"/>
        </nuxt-link>
        <a-button text="Купить ETF за рубли" @click="scrollToSection" v-else/>
      </div>
      <m-slider :modules="[]" :navigation="false" :slides-per-view="slidesCount">
        <template #slides>
          <swiper-slide class="s-site-welcome__slide" v-for="(slide, id) in data.slides" :key="id">
            <div class="s-site-welcome__slide-top">
              <div class="s-site-welcome__slide-title">{{ slide.title }}</div>
            </div>
            <div class="s-site-welcome__slide-img">
              <img :src="slide.img"/>
            </div>
            <div class="s-site-welcome__slide-bottom">
              <div class="s-site-welcome__slide-subtitle">{{ slide.subtitle }}</div>
              <div class="s-site-welcome__slide-text">{{ slide.text }}</div>
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
import {SwiperSlide} from 'swiper/vue'
import {useWindowSize} from '@vueuse/core'

defineProps<{
  data: any
  isLanding: boolean
}>()

const {width} = useWindowSize()

const slidesCount = computed(() => {
  return width.value < 1099 ? 'auto' : 3;
});

const scrollToSection = () =>{
  const element = document.querySelector(".langing-calculation__title");
  let headerOffset
  if (window.innerWidth < 768) {
    headerOffset = 145;
  } else {
    headerOffset = 155;

  }
  const elementPosition = element.offsetTop;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}
</script>

<style src="./s-site-welcome.scss" lang="scss"/>
