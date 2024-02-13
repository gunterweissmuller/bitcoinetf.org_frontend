<template>
  <s-site-blogs :title="detailSectionInfo?.data?.title" :description="detailSectionInfo?.data?.description"
                :newsList="blogNews" :sectionSlug="detailSectionInfo?.data?.slug" />
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
})

const blogNews = ref([])
const blogNewsPage = ref(1)

const getBlogNewsRequest = async (uuid, page = 1) => {
  return await useNuxtApp().$app.api.eth.news.getListNewsArticles({uuid, page}).then(resp => resp)
}

const getBlogNews = async (uuid = BLOG_NEWS_UUID, page = 1) => {
  const response = await getBlogNewsRequest(BLOG_NEWS_UUID, page)
  blogNews.value = [...blogNews.value, ...response.data.data]

  if (response.data.total > blogNews.value.length) {
    blogNewsPage.value += 1

    await getBlogNews(uuid, blogNewsPage.value)
  }
}

onBeforeMount(async () => {
  await getBlogNews()
})
</script>
