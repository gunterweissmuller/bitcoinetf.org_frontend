<template>
  <section class="s-site-blogs-education">
    <div class="l-site">
      <h1 class="s-site-blogs-education__title site-title-h3">{{ title }}</h1>
      <div class="s-site-blogs-education__description">{{ description }}</div>
      <m-site-tabs :tabs="categories" @get-active="getActive" />
      <div class="s-site-blogs-education__items">
        <template v-for="(blog, id) in newsList" :key="id">
          <m-site-blog v-if="activeTab === 'All' || blog.tags.includes(activeTab)" :blog="blog" :sectionSlug="sectionSlug"/>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import MSiteBlog from '~/src/shared/ui/site/molecules/m-site-blog/m-site-blog.vue';
import MSiteTabs from '~/src/shared/ui/site/molecules/m-site-tabs/m-site-tabs.vue';
import { ref } from 'vue';
const props = withDefaults(
  defineProps<{
    title: any
    description: any
    newsList: any
    sectionSlug: any
    categories: any
  }>(),
  {
    title: '',
    description: '',
    newsList: '',
    sectionSlug:'',
    categories:[]
  },
)


const activeTab = ref(props.categories?.[0] || 'All');

const getActive = (value) => {
  activeTab.value = value;
};
</script>

<style src="./s-site-blogs-education.scss" lang="scss" />
