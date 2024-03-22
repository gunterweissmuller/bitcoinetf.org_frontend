<template>
  <section class="s-site-blog-detail">
    <div class="l-site">
      <nuxt-link :to="`/${backTo}`" class="s-site-back">
        <a-icon :name="Icon.MonoChevronLeft" />
        <div class="s-site-back__text">Back to blog</div>
      </nuxt-link>
      <h1 class="s-site-blog-detail__title site-title-h3">{{ blog.title }}</h1>
      <div class="s-site-blog-detail__info">
        <div class="s-site-blog-detail__info-item s-site-blog-detail__info-date">{{ $app.filters.dayjs(blog?.created_at).format('MMMM D') }}</div>
        <div class="s-site-blog-detail__info-item s-site-blog-detail__info-read">{{ blog?.reading_time }} min read</div>
      </div>
      <div class="s-site-blog-detail__img">
        <img :src="blog.feature_image" :alt="blog.title">
      </div>
      <div v-html="blog.html" class="s-site-blog-detail__content"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AIcon from '~/src/shared/ui/atoms/a-icon/a-icon.vue'
import { Icon } from '~/src/shared/constants/icons'
import {useNuxtApp} from "#app";

const { $app } = useNuxtApp();
defineProps({
  blog: {
    type: Object,
    required: true
  },
  backTo: {
    type: String,
    default: '',
  },
});
</script>

<style src="./s-site-blog-detail.scss" lang="scss" />
