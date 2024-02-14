<template>
  <section class="s-site-offer-detail">
    <div class="l-site">
      <nuxt-link to="/offers" class="s-site-back">
        <a-icon :name="Icon.MonoChevronLeft" />
        <div class="s-site-back__text">Back to Offers</div>
      </nuxt-link>
      <h1 class="s-site-offer-detail__title site-title-h3">{{ data.title }}</h1>
      <div class="s-site-offer-detail__subtitle">{{ data.subtitle }}</div>
    </div>
    <div class="s-site-offer-detail__banner">
      <div class="l-site">
        <m-banner
          :title="data.title"
          :description="data.description"
          :img="data.img"
          :background="data.background"
          :button_link="data.button_link"
          :button_text="data.button_text"
        />
      </div>
    </div>
    <div class="l-site">
      <div class="s-site-offer-detail__texts">
        <div class="s-site-offer-detail__item">
          <div v-html="data.html_text" class="s-site-offer-detail__item-text" />
        </div>
      </div>
      <div class="s-site-offer-detail__steps">
        <div class="s-site-offer-detail__steps-title">{{ steps.title }}</div>
        <div class="s-site-offer-detail__steps-img" v-for="(img, id) in steps.imgs" :key="id">
          <img :src="img" alt="" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import MBanner from '~/src/shared/ui/site/molecules/m-banner/m-banner.vue'
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'

const props = defineProps({
  data: {
    type: Object,
    default: '',
  },
});

const steps = computed(() => {
  if (!props.data?.steps) return []
  return eval('(' + props.data?.steps + ')')
})
</script>

<style src="./s-site-offer-detail.scss" lang="scss" />
