<template>
  <section class="s-site-bitcoin-education" data-name="Blog">
    <div class="l-site-dark" v-if="data?.length">
      <h2 class="s-site-bitcoin-education__title title-site-h1">BITCOIN EDUCATION</h2>
      <m-news id="bitcoin-education" :news="newsData" :is-education="isEducation" />
    </div>
  </section>
</template>

<script setup lang="ts">
import MNews from '~/src/shared/ui/site/molecules/m-news/m-news.vue'

const props = defineProps<{
  data: any
  files?: any
  isEducation: any
}>()
const newsData = computed(() =>
  props.data.map((element) => {
    return {
      img: element.preview_file,
      title: element.title,
      category: element.tags[0],
      text: element.description,
      slug: element.slug,
    }
  }),
)
</script>

<style src="./s-site-bitcoin-education.scss" lang="scss" />
