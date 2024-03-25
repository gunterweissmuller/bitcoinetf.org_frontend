<template>
  <div class="w-news">
    <div class="w-news__head">
      <div class="w-news__head-title">Latest news</div>
      <nuxt-link to="/blog" class="w-news__head-link">
        View all
      </nuxt-link>
    </div>
    <div class="w-news__wrap">
      <m-slider
        v-show="blogPosts?.length"
        id="news-performance"
        :modules="[]"
        :navigation="false"
        slides-per-view="auto"
        :space-between="16"
        class="w-news__slider"
      >
        <template #slides>
          <swiper-slide v-for="(post, idx) in blogPosts" :key="idx" class="w-news__slide">
            <nuxt-link
              class="w-news__content"
              prefetch
              :to="`/blog/${post.slug}`"
            >
              <div class="w-news__content-pic">
                <NuxtImg v-if="post.feature_image" loading="lazy" :src="post.feature_image" :alt="post.title" />
              </div>
              <div class="w-news__info">
                <div class="w-news__info-date">
                  {{ $app.filters.dayjs(post.created_at).format('MMMM D') }}
                </div>
                <div class="w-news__info-title">
                  {{ post.title }}
                </div>
                <div class="w-news__info-text">
                  {{ post.excerpt }}
                </div>
              </div>
            </nuxt-link>
          </swiper-slide>
        </template>
      </m-slider>
      <e-empty-data v-if="!blogPosts?.length" title="You don’t have any news yet." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#app'
import MSlider from '~/src/shared/ui/molecules/m-slider/m-slider.vue'
import { SwiperSlide } from 'swiper/vue'
import EEmptyData from '~/src/entities/e-empty-data/e-empty-data.vue'

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  feature_image: string;
  created_at: string;
}

interface Blog {
  posts: Post[];
}

const blogPosts = ref<Post[]>([]);

const blogConfig = (page : number) => {
  return {
    limit: 11,
    fields: 'slug,title,excerpt,feature_image,created_at',
    page: page
  }
}

const getBlogNews = async (page : number = 1) => {
  return await useNuxtApp()
    .$app.api.eth.news.getGhostBlogs( blogConfig(page) )
    .then(({ data } : { data: Blog }) => {
      blogPosts.value = data.posts;
    });
}

onBeforeMount(async () => {
  await getBlogNews();
})
</script>

<style src="./w-news.scss" lang="scss" />
