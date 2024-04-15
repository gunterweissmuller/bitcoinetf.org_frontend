<template>
  <section class="s-site-news" data-name="Blog" v-if="newsData.length">
    <div class="l-site-dark">
      <h2 class="s-site-news__title title-site-h1">LATEST NEWS</h2>
      <m-news id="news" :news="newsData" />
    </div>
  </section>
</template>

<script setup lang="ts">
import MNews from '~/src/shared/ui/site/molecules/m-news/m-news.vue'
import { useNuxtApp } from '#app'

const props = defineProps<{
  data: any
  files?: any
}>()
const newsData = computed(() =>
  props.data.map((element) => {
    return {
      img: element.feature_image,
      title: element.title,
      date: useNuxtApp().$app.filters.dayjs(element.created_at).format('MMMM D'),
      text: element.excerpt,
      slug: element.slug,
    }
  }),
)
</script>

<style src="./s-site-news.scss" lang="scss" />
