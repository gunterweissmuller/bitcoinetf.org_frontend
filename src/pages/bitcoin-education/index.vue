<template>
  <s-site-blogs-education
    :categories="getListNewsTags"
    :title="detailSectionInfo?.data?.title"
    :description="detailSectionInfo?.data?.description"
    :newsList="news"
    :sectionSlug="detailSectionInfo?.data?.slug"
    :current-page
    :news-length
    :disabled-pagination="isLoading"
    @change-page="changePage"
  />
</template>

<script setup lang="ts">
import SSiteBlogsEducation from '~/src/shared/ui/site/sections/s-site-blogs-education/s-site-blogs-education'
import { useNuxtApp } from '#app'

import { BITCOIN_EDUCATION_NEWS_UUID } from '~/src/shared/constants/global'

const { $app } = useNuxtApp()

definePageMeta({
  layout: 'site-texts',
})

const { data: detailSectionInfo } = await useLazyAsyncData('detailSectionInfo', () => {
  return $app.api.eth.news.getNewsSections({ uuid: BITCOIN_EDUCATION_NEWS_UUID })
})

useSeoMeta({
  title: () => detailSectionInfo.value?.data?.meta_title,
  description: () => detailSectionInfo.value?.data?.meta_description,
})

const isLoading = ref(false)
const blogNews = ref([])
const currentPage = ref<number>(1)
const newsLength = ref<number>(0)

const NEWS_PER_PAGE = 8

const getBlogNewsRequest = async (uuid, page = 1, per_page = 15) => {
  return await useNuxtApp()
    .$app.api.eth.news.getListNewsArticles({ uuid, page, per_page })
    .then((resp) => resp)
}

const getBlogNews = async (page = 1) => {
  try {
    isLoading.value = true
    const { data: response } = await getBlogNewsRequest(BITCOIN_EDUCATION_NEWS_UUID, page, NEWS_PER_PAGE)
    blogNews.value = response.data
    newsLength.value = response?.total
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

async function changePage(page) {
  if (isLoading.value) return

  currentPage.value = page
  await getBlogNews(page)
  currentPage.value = 1

  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, 0)
}

const news = computed(() =>
  blogNews.value.map((item) => ({
    feature_image: item.preview_file,
    title: item.title,
    excerpt: item.description,
    slug: item.slug,
    tags: item.tags,
    category: item.tags,
  })),
)

onBeforeMount(async () => {
  await getBlogNews()
})

const { data: getListNewsTags } = await useLazyAsyncData('getListNewsTags', async () => {
  const result = await $app.api.eth.news.getListNewsTags().then((resp) => {
    return resp?.data?.data || []
  })

  const clearNewsTagsList = result.map((item) => item.title)

  return ['All', ...clearNewsTagsList]
})
</script>
