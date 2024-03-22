<template>
  <nuxt-link
    :to="`/${sectionSlug}/${props.blog.slug}`"
    class="m-site-blog"
    prefetch
    :class="{
      'm-site-blog--main': props.index === 0,
      'm-site-blog--submain': props.index <= 2,
      'm-site-blog--wide': isWide(props.index),
      'm-site-blog--mb': isMarginBottom(props.index)
    }"
  >
    <div class="m-site-blog__img">
      <NuxtImg v-if="props.blog.feature_image" loading="lazy" :src="props.blog.feature_image" :alt="blog.title" />
    </div>
    <div class="m-site-blog__info">
      <div v-if="props.blog.created_at" class="m-site-blog__info-date">{{ $app.filters.dayjs(props.blog.created_at).format('MMMM D') }}</div>
      <div v-if="props.blog.category" class="m-site-blog__info-category">{{ props.blog.category }}</div>
      <div class="m-site-blog__info-title">{{ props.blog.title }}</div>
      <div class="m-site-blog__info-description">{{ props.blog.excerpt }}</div>
      <div class="m-site-blog__info-more">Read more</div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
import {useNuxtApp} from "#app";
const {$app} = useNuxtApp()
const props = defineProps({
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

const isWide = (index: number) => {
  if (index <= 2) {
    return false;
  }
  return ((index - 2) % 5) % 4 === 0 || ((index - 2) % 5) % 5 === 0;
};

const isMarginBottom = (index: number) => {
  return [0, 2, 3, 4, 5, 6, 7].includes(index);
}
</script>

<style src="./m-site-blog.scss" lang="scss" />
