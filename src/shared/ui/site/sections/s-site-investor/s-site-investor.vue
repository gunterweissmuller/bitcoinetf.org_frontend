<template>
  <section class="s-site-investor" :data-name="data.name">
    <div class="l-site-dark">
      <h2 v-html="data.title" class="s-site-investor__title title-site-h1" />
      <div v-if="width < 600" class="s-site-investor__slider">
        <div class="s-site-investor__steps">
          <div
            class="s-site-investor__step"
            :class="{ 's-site-investor__step-active' : activeIndex === id }"
            v-for="(step, id) in data.steps"
            :key="id"
            @click="slideTo(id)"
          >
            <div class="s-site-investor__step-title">Step</div>
            <div class="s-site-investor__step-number">{{ id + 1 }}</div>
          </div>
        </div>
        <m-slider
          id="slider-investor"
          :modules="[]"
          slides-per-view="1.2"
          :space-between="0"
          @slide-change="slideChange"
          @swiper-init="getSlider"
          :centered-slides="true"
        >
          <template #slides>
            <swiper-slide class="s-site-investor__slide" v-for="(step, id) in data.steps" :key="id">
                <div class="s-site-investor__item-img">
                  <img :src="step.img" />
                </div>
              </swiper-slide>
          </template>
        </m-slider>
      </div>
      <div class="s-site-investor__items">
        <div class="s-site-investor__item" v-for="(step, id) in data.steps" :key="id">
          <div class="s-site-investor__item-top">
            <div class="s-site-investor__item-step">Step</div>
            <div class="s-site-investor__item-number">{{ id + 1 }}</div>
          </div>
          <div v-if="width >= 600" class="s-site-investor__item-img">
            <img :src="step.img" />
          </div>
          <div class="s-site-investor__item-title">{{ step.title }}</div>
          <div class="s-site-investor__item-text">{{ step.text }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'

defineProps<{
  data: any
  files: any
}>()

const activeIndex = ref(0);
const { width } = useWindowSize();

const slider = ref(null);

const slideChange = (index: number) => {
  activeIndex.value = index;
};

const slideTo = (index: number) => {
  if (slider.value) {
    slider.value.slideTo(index)
  }
}

const getSlider = (swiper) => {
  slider.value = swiper;
}
</script>

<style src="./s-site-investor.scss" lang="scss" />
