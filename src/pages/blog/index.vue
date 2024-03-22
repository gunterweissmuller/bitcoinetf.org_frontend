<template>
  <s-site-blogs
    :title="detailSectionInfo?.data?.title"
    :description="detailSectionInfo?.data?.description"
    :sectionSlug="detailSectionInfo?.data?.slug"
    :newsList="blogPosts"
    :totalItems="blogPagination.pages"
    @update:current-page="handlePagination"
  />
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'
import { useRoute } from 'vue-router'
import { BLOG_NEWS_UUID } from '~/src/shared/constants/global'

const { $app } = useNuxtApp()
const route = useRoute()
definePageMeta({
  layout: 'site-texts',
})

const { data: detailSectionInfo } = await useLazyAsyncData('detailSectionInfo', () => {
  return $app.api.eth.news.getNewsSections({ uuid: BLOG_NEWS_UUID })
})

useSeoMeta({
  title: () => detailSectionInfo.value?.data?.meta_title,
  description: () => detailSectionInfo.value?.data?.meta_description,
});

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  feature_image: string;
  created_at: string;
}

interface Pagination {
  page: number;
  limit: 'all' | number;
  pages: number;
  total: number;
  next: null | number;
  prev: null | number;
}

interface Meta {
  pagination: Pagination;
}

interface Blog {
  posts: Post[];
  meta: Meta;
}

const blogPosts = ref<Post[]>([]);
const blogPagination = ref<Pagination>({
  page: 1,
  limit: 11,
  pages: 1,
  total: 1,
  next: null,
  prev: null
});

const blogConfig = (page : number) => {
  return {
    limit: 11,
    fields: 'slug,title,excerpt,feature_image,created_at',
    page: page
  }
}

const getBlogNews = async (page : number = blogPagination.value.page) => {
  return await useNuxtApp()
    .$app.api.eth.news.getGhostBlogs( blogConfig(page) )
    .then(({ data } : { data: Blog }) => {
      blogPosts.value = data.posts;
      blogPagination.value = data.meta.pagination;

    });
}

const handlePagination = async (page : number) => {
  await getBlogNews(page);
  console.log(page);

  window.scrollTo(0,0);
}

onBeforeMount(async () => {
  await getBlogNews();
})
</script>
