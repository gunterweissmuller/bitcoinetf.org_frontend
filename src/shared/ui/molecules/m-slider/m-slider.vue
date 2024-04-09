<template>
  <div class="m-slider" :class="`m-slider--${id}`" :data-qa-selector="qaLocatorSection">
    <template v-if="navigation">
      <a-carousel-control
        options="left"
        :clickable-button-area="clickableButtonsArea"
        :class="`prev-button-${id} m-slider__button m-slider__button-prev`"
        :variant="variantNavigationButton"
        data-qa-selector="left-arrow"
      />
      <a-carousel-control
        :clickable-button-area="clickableButtonsArea"
        options="right"
        :class="`next-button-${id} m-slider__button m-slider__button-next`"
        :variant="variantNavigationButton"
        data-qa-selector="right-arrow"
      />
    </template>

    <div class="m-slider__wrap">
      <div class="m-slider__container swiper-container">
        <swiper
          :id="id"
          ref="swiperRef"
          :loop="loop"
          :grid="grid"
          :modules="modules"
          :space-between="spaceBetween"
          :slides-per-view="slidesPerView"
          :slides-per-group="slidesPerGroup"
          :grab-cursor="true"
          :speed="speed"
          :autoplay="autoplay"
          :pagination="isPagination"
          :scrollbar="isScrollbar"
          :navigation="isNavigation"
          :breakpoints="breakpoints"
          :resistance="resistance"
          :resistance-ratio="resistanceRatio"
          :looped-slides="loopedSlides"
          :centered-slides="centeredSlides"
          :free-mode="freeMode"
          :active-index="activeIndex"
          class="m-slider__swiper"
          :observer="true"
          @reachEnd="onReachLastSlideEventHandler"
          @init="onSwiperInit"
          @resize="onSwiperResize"
          @update="onSwiperUpdate"
          @slide-change="onSlideChange"
        >
          <slot name="slides" />
        </swiper>

        <template v-if="pagination">
          <div class="m-slider__pagination swiper-pagination" :class="`pagination-${id}`" />
        </template>

        <template v-if="scrollbar">
          <div class="m-slider__scrollbar">
            <div class="m-slider__scrollbar-start">1</div>
            <div class="swiper-scrollbar" :class="`scrollbar-${id}`" />
            <div class="m-slider__scrollbar-end">{{ slidesLength }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Swiper } from 'swiper/vue'
import { computed, ref } from 'vue'
import ACarouselControl from '~/src/shared/ui/atoms/a-carousel-control/a-carousel-control.vue'

import 'swiper/scss'
import 'swiper/scss/navigation'
import 'swiper/scss/pagination'
import 'swiper/scss/autoplay'
import 'swiper/css/free-mode'
import 'swiper/scss/grid'
import 'swiper/css/scrollbar'

const emit = defineEmits(['reach-last-slide', 'swiper-init', 'slide-change'])

const props = withDefaults(
  defineProps<{
    spaceBetween?: number
    pagination?: boolean
    navigation?: boolean
    scrollbar?: boolean
    slidesPerGroup?: number
    slidesPerView?: number | string
    loop?: boolean
    loopedSlides?: number
    resistance?: boolean
    resistanceRatio?: number
    autoplay?: object
    speed?: number
    breakpoints?: object
    grid?: object
    id?: string | number
    modules: Array<any>
    centeredSlides?: boolean
    freeMode?: boolean
    activeIndex?: number
    slidesLength?: number
    qaLocatorSection?: string | number
    variantNavigationButton?: 'default' | 'ghost'
  }>(),
  {
    spaceBetween: 16,
    pagination: false,
    navigation: false,
    scrollbar: false,
    slidesPerGroup: 1,
    slidesPerView: 6,
    loop: false,
    loopedSlides: 3,
    resistance: true,
    resistanceRatio: 0,
    autoplay: () => {},
    speed: 1000,
    breakpoints: null,
    grid: null,
    modules: null,
    centeredSlides: false,
    freeMode: true,
    activeIndex: 0,
    slidesLength: 0,
    qaLocatorSection: '',
    variantNavigationButton: 'default',
  },
)

const swiperRef = ref<HTMLElement | null>(null)

const clickableButtonsArea = ref<string>('')

const paginationConfig = {
  el: `.pagination-${props.id}`,
  type: 'bullets',
  dynamicBullets: true,
  dynamicMainBullets: 3,
  clickable: true,
}

const navigationConfig = {
  nextEl: `.next-button-${props.id}`,
  prevEl: `.prev-button-${props.id}`,
  disabledClass: 'm-slider__button--disabled',
}

const scrollbarConfig = {
  el: `.scrollbar-${props.id}`,
  draggable: true,
  hide: false,
}

const isPagination = computed<boolean>(() => {
  return props.pagination ? paginationConfig : false
})

const isNavigation = computed<boolean>(() => {
  return props.navigation ? navigationConfig : false
})

const isScrollbar = computed<boolean>(() => {
  return props.scrollbar ? scrollbarConfig : false
})

const onReachLastSlideEventHandler = () => {
  emit('reach-last-slide')
}

const onSwiperInit = (swiper) => {
  emit('swiper-init', swiper)
  swiper.activeIndex = props.activeIndex
}

const onSwiperResize = () => {
  getNavigationClickableButtonsArea()
}

const onSwiperUpdate = () => {
  getNavigationClickableButtonsArea()
}

function getNavigationClickableButtonsArea() {
  setTimeout(() => {
    const htmlNodeSlideHeight = swiperRef.value?.$el?.querySelector('[data-slide-clickable-area]')

    if (htmlNodeSlideHeight) {
      clickableButtonsArea.value = `${htmlNodeSlideHeight.clientHeight}px`
    }
  }, 0)
}

onMounted(() => {
  const swiperSlides: NodeListOf<Element> = document.querySelectorAll('.swiper-slide')

  swiperSlides.forEach((slide) => {
    if (slide.classList.contains('swiper-slide-active')) {
      slide.setAttribute('data-qa-selector', 'slide-active')
    }

    if (slide.classList.contains('swiper-slide-prev')) {
      slide.setAttribute('data-qa-selector', 'slide-prev')
    }

    if (slide.classList.contains('swiper-slide-next')) {
      slide.setAttribute('data-qa-selector', 'slide-next')
    }

    if (
      !slide.classList.contains('swiper-slide-active') &&
      !slide.classList.contains('swiper-slide-prev') &&
      !slide.classList.contains('swiper-slide-next')
    ) {
      slide.setAttribute('data-qa-selector', 'section-slide')
    }
  })
})

const onSlideChange = (swiper) => {
  emit('slide-change', swiper.activeIndex)
}
</script>

<style lang="scss" src="./m-slider.scss" />
