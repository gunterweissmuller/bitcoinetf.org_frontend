<template>
  <div class="m-banner">
    <div
      class="m-banner__wrapper"
      :class="{ 'm-banner__wrapper--no-bg': background === '' }"
      :style="`background: url(${background}); background-repeat: no-repeat;background-size:cover;`"
      @click="bannerClickHandler(url)"
    >
      <div class="m-banner__info">
        <h2 class="m-banner__title site-title-h2">{{ title }}</h2>
        <div class="m-banner__description">{{ description }}</div>
        <nuxt-link :to="button_link">
          <a-button :text="button_text" />
        </nuxt-link>
      </div>
      <div class="m-banner__img">
        <img :src="img" alt="">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AButton from '~/src/shared/ui/atoms/a-button/a-button.vue'

defineProps({
  title: {
    type: String,
    default: '',
  },

  description: {
    type: String,
    default: '',
  },

  img: {
    type: String,
    default: '',
  },

  background: {
    type: String,
    default: '',
  },
  button_link: {
    type: String,
    default: '',
  },
  button_text: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    default: '',
  },
  btn: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const bannerClickHandler = (url:string) =>{
  if (url){
    navigateTo(url)
  }
}
</script>

<style src="./m-banner.scss" lang="scss" />
