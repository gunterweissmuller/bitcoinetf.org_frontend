<template>
  <nuxt-link :to="`/${sectionSlug}/${blog.slug}`" class="m-site-blog">
    <div class="m-site-blog__img">
      <img :src="blog.preview_file" alt="">
    </div>
    <div class="m-site-blog__info">
      <div v-if="blog.created_at" class="m-site-blog__info-date">{{ $app.filters.dayjs(blog.created_at).format('MMMM D') }}</div>
      <div v-if="blog.category" class="m-site-blog__info-category">{{ blog.category }}</div>
      <div class="m-site-blog__info-title">{{ blog.title }}</div>
      <div class="m-site-blog__info-description">{{ blog.description }}</div>
      <div class="m-site-blog__info-more">Read more</div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
import {useNuxtApp} from "#app";
const {$app} = useNuxtApp()
defineProps({
  sectionSlug:{
    type: String,
    default: '/blog'
  },
  blog: {
    type: [String , Object],
    default: '',
  },

  index: {
    type: Number,
    default: 0,
  },
});
</script>

<style src="./m-site-blog.scss" lang="scss" />
