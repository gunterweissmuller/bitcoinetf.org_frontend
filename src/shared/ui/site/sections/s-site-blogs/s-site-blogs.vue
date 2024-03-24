<template>
  <section class="s-site-blogs">
    <div class="l-site">
      <h1 class="s-site-blogs__title site-title-h3">{{ title }}</h1>
      <div class="s-site-blogs__description">{{ description }}</div>
      <div class="s-site-blogs__items">
        <m-site-blog v-for="(blog, id) in newsList" :key="id" :index="id" :blog="blog" :sectionSlug="sectionSlug"/>
      </div>
      <a-pagination :totalItems="totalItems" :current-page="page" :click-callback="paginationHandler" />
    </div>
  </section>
</template>

<script setup lang="ts">
import MSiteBlog from '~/src/shared/ui/site/molecules/m-site-blog/m-site-blog.vue';
import APagination from '~/src/shared/ui/atoms/a-pagination/a-pagination.vue';
withDefaults(
  defineProps<{
    title: any;
    description: any;
    newsList: any;
    sectionSlug: any;
    totalItems: number;
    page: number;
  }>(),
  {
    title: '',
    description: '',
    newsList: '',
    sectionSlug:'',
    totalItems: 1,
    page: 1
  },
);

const emit = defineEmits(['update:current-page']);

const paginationHandler = (page : number) => {
  emit('update:current-page', page);
}

</script>

<style src="./s-site-blogs.scss" lang="scss" />
