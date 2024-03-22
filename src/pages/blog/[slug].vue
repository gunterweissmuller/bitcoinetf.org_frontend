<template>
  <s-site-blog-detail :backTo="'blog'" :blog="blogPost" />
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'
import { useRoute } from 'vue-router'

const { $app } = useNuxtApp()
const route = useRoute()

definePageMeta({
  layout: 'site-texts',
})

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  html: string;
  feature_image: string;
  created_at: string;
  reading_time: string;
}

interface Blog {
  posts: Post[];
}

const blogPost = ref<Post>({
  slug: '',
  title: '',
  excerpt: '',
  feature_image: '',
  created_at: '',
  html: '',
  reading_time: ''
});

const blogConfig = {
  fields: 'slug,title,html,excerpt,feature_image,created_at,reading_time',
}

const getBlogNews = async () => {
  return await useNuxtApp()
    .$app.api.eth.news.getGhostBlog( route.params.slug, blogConfig )
    .then(({ data } : { data: Blog }) => {
      blogPost.value = data.posts[0];
    });
}

useSeoMeta({
  title: () => blogPost.value.title,
  description: () => blogPost.value.excerpt,
})


onMounted(async () => {
  await getBlogNews();
  window.scrollTo(0,0);
})
</script>
